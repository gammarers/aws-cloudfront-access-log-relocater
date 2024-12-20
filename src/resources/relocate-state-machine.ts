// import { Stack } from 'aws-cdk-lib';
// import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export interface AccessLogSource {
  readonly bucket: s3.IBucket;
  readonly objectPrefix: string;
}

export interface AccessLogDestination {
  readonly bucket: s3.IBucket;
  readonly objectPrefix: string;
  // readonly partitioningFormatType: PartitioningFormatType;
}

export interface RelocatorStateMachineProps extends sfn.StateMachineProps {
  readonly accessLogSource: AccessLogSource;
  readonly accessLogDestination: AccessLogDestination;
}

export class RelocatorStateMachine extends sfn.StateMachine {
  constructor(scope: Construct, id: string, props: RelocatorStateMachineProps) {
    super(scope, id, {
      ...props,
      role: new iam.Role(scope, 'StateMachineRole', {
        // roleName: `StepFunctionsExecutionRoleForS3Copy-${props.envName}`,
        // description: "An IAM role for Step Functions to access AWS services",
        assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
        inlinePolicies: {
          'copy-object-policy': new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                  's3:GetObject',
                  's3:ListBucket',
                ],
                resources: [
                  `${props.accessLogSource.bucket.bucketArn}/*`,
                ],
              }),
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                  's3:PutObject',
                  's3:ListBucket',
                ],
                resources: [
                  `${props.accessLogDestination.bucket.bucketArn}/*`,
                ],
              }),
            ],
          }),
          'delete-object-policy': new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                  's3:DeleteObject',
                  's3:ListBucket',
                ],
                resources: [
                  `${props.accessLogSource.bucket.bucketArn}/*`,
                ],
              }),
            ],
          }),
        },
      }),
      definitionBody: (() => {

        // Get Source Bucket & objectKey
        const getSourceBucketObject = new sfn.Pass(scope, 'GetSourceBucketObject', {
          comment: 'Get Source Bucket Object Key with Split Object Key',
          resultPath: '$.Result.Source',
          parameters: {
            BucketName: sfn.JsonPath.stringAt('$.event.detail.bucket.name'),
            ObjectKey: sfn.JsonPath.stringAt('$.event.detail.object.key'),
            SplitObjectLayers: sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.event.detail.object.key'), '/'),
          },
        });
        const getSourceSplitObjectsLength = new sfn.Pass(scope, 'GetSourceSplitObjectsLength', {
          resultPath: '$.Result.Source.SplitObjectLayer',
          parameters: {
            Length: sfn.JsonPath.arrayLength(sfn.JsonPath.stringAt('$.Result.Source.SplitObjectLayers')),
          },
        });
        getSourceBucketObject.next(getSourceSplitObjectsLength);

        const getSplitObjectFilenameIndex = new sfn.Pass(scope, 'GetSplitObjectFilenameIndex', {
          resultPath: '$.Result.Source.Target.SplitObjectLayer',
          parameters: {
            Index: sfn.JsonPath.mathAdd(sfn.JsonPath.numberAt('$.Result.Source.SplitObjectLayer.Length'), -1),
          },
        });
        getSourceSplitObjectsLength.next(getSplitObjectFilenameIndex);

        const getSourceFilename = new sfn.Pass(scope, 'GetSourceFilename', {
          resultPath: '$.Result.Source.Target.File',
          parameters: {
            Filename: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringAt('$.Result.Source.SplitObjectLayers'), sfn.JsonPath.numberAt('$.Result.Source.Target.SplitObjectLayer.Index')),
          },
        });
        getSplitObjectFilenameIndex.next(getSourceFilename);

        const getLogFilenameAttribute = new sfn.Pass(scope, 'GetLogFilenameAttribute', {
          resultPath: '$.Result.Source.Target.File.Attribute',
          parameters: {
            DateHour: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.Result.Source.Target.File.Filename'), '.'), 1),
            DistributionId: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.Result.Source.Target.File.Filename'), '.'), 0),
          },
        });
        getSourceFilename.next(getLogFilenameAttribute);

        const getDateFromFilenameAttribute = new sfn.Pass(scope, 'GetDateFromFilenameAttribute', {
          resultPath: '$.Result.Date',
          parameters: {
            Year: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.Result.Source.Target.File.Attribute.DateHour'), '-'), 0),
            Month: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.Result.Source.Target.File.Attribute.DateHour'), '-'), 1),
            Day: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.Result.Source.Target.File.Attribute.DateHour'), '-'), 2),
          },
        });
        getLogFilenameAttribute.next(getDateFromFilenameAttribute);

        // object cooy
        const copyObjectTask = new tasks.CallAwsService(scope, 'CopyObjectTask', {
          iamResources: [`${props.accessLogSource.bucket.bucketArn}/*`],
          service: 's3',
          action: 'copyObject',
          parameters: {
            CopySource: sfn.JsonPath.format('{}/{}',
              sfn.JsonPath.stringAt('$.Result.Source.BucketName'),
              sfn.JsonPath.stringAt('$.Result.Source.ObjectKey'),
            ),
            Bucket: props.accessLogDestination.bucket.bucketName,
            Key: sfn.JsonPath.format(`${props.accessLogDestination.objectPrefix}/{}/{}/{}/{}/{}`,
              sfn.JsonPath.stringAt('$.Result.Source.Target.File.Attribute.DistributionId'),
              sfn.JsonPath.stringAt('$.Result.Date.Year'),
              sfn.JsonPath.stringAt('$.Result.Date.Month'),
              sfn.JsonPath.stringAt('$.Result.Date.Day'),
              sfn.JsonPath.stringAt('$.Result.Source.Target.File.Filename'),
            ),
          },
          resultPath: '$.Result.CopyObject',
        });
        getDateFromFilenameAttribute.next(copyObjectTask);

        // object delete
        const deleteObjectTask = new tasks.CallAwsService(scope, 'DeleteObjectTask', {
          iamResources: [`${props.accessLogSource.bucket.bucketArn}/*`],
          service: 's3',
          action: 'deleteObject',
          parameters: {
            Bucket: sfn.JsonPath.stringAt('$.Result.Source.BucketName'),
            Key: sfn.JsonPath.stringAt('$.Result.Source.ObjectKey'),
          },
          resultPath: '$.Result.CopyObject',
        });
        copyObjectTask.next(deleteObjectTask);

        const succeed: sfn.Succeed = new sfn.Succeed(scope, 'Succeed');

        deleteObjectTask.next(succeed);

        return sfn.DefinitionBody.fromChainable(getSourceBucketObject);
      })(),
    });
  }
}