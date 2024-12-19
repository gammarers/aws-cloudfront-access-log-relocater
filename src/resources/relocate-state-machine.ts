// import { Stack } from 'aws-cdk-lib';
// import * as sns from 'aws-cdk-lib/aws-sns';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
// import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export interface RelocatorStateMachineProps extends sfn.StateMachineProps {
}

export class RelocatorStateMachine extends sfn.StateMachine {
  constructor(scope: Construct, id: string, props?: RelocatorStateMachineProps) {
    super(scope, id, {
      ...props,
      definitionBody: (() => {
        //        const bucketName = event.detail.bucket.name;
        //        const objectKey = event.detail.object.key;
        //
        //        const logFilename = objectKey.split('/').pop();
        //
        //        const date = logFilename?.split('.').at(1);
        //        const [year, month, day] = date?.split('-') as string[];
        //
        //        const copySource = `${bucketName}/${objectKey}`;
        //        const copyDestinationObjectKey = `${partitioningObjectPrefix}/${year}/${month}/${day}/${logFilename}`;
        //        console.info({ CopySource: copySource, CopyDestination: `${bucketName}/${copyDestinationObjectKey}` });

        // Get Source Bucket & objectKey
        const getSourceBucketObject = new sfn.Pass(scope, 'GetSourceBucketObject', {
          resultPath: '$.Result.Source',
          parameters: {
            BucketName: sfn.JsonPath.stringAt('$.event.detail.bucket.name'),
            ObjectKey: sfn.JsonPath.stringAt('$.event.detail.object.key'),
            SplitObjects: sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.event.detail.object.key'), '/'),
          },
        });
        const getSourceSplitObjectsLength = new sfn.Pass(scope, 'GetSourceSplitObjectsLength', {
          resultPath: '$.Result.Object',
          parameters: {
            SplitLength: sfn.JsonPath.arrayLength(sfn.JsonPath.stringAt('$.Result.Source.SplitObjects')),
          },
        });
        getSourceBucketObject.next(getSourceSplitObjectsLength);

        const getSplitObjectFilenameIndex = new sfn.Pass(scope, 'GetSplitObjectFilenameIndex', {
          resultPath: '$.Result.Target',
          parameters: {
            Index: sfn.JsonPath.mathAdd(sfn.JsonPath.numberAt('$.Result.Object.SplitLength'), -1),
          },
        });
        getSourceSplitObjectsLength.next(getSplitObjectFilenameIndex);

        const getSourceFilename = new sfn.Pass(scope, 'GetSourceFilename', {
          resultPath: '$.Result.File',
          parameters: {
            Filename: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringAt('$.Result.Source.SplitObjects'), sfn.JsonPath.numberAt('$.Result.Target.Index')),
          },
        });
        getSplitObjectFilenameIndex.next(getSourceFilename);

        const getLogFilenameDate = new sfn.Pass(scope, 'GetLogFilenameDate', {
          resultPath: '$.Result.DateHour',
          parameters: {
            FileDateHour: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.Result.File.Filename'), '.'), 1),
          },
        });
        getSourceFilename.next(getLogFilenameDate);

        const getDate = new sfn.Pass(scope, 'GetDate', {
          resultPath: '$.Result.Date',
          parameters: {
            Year: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.Result.DateHour.FileDateHour'), '-'), 0),
            Month: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.Result.DateHour.FileDateHour'), '-'), 1),
            Day: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.Result.DateHour.FileDateHour'), '-'), 2),
          },
        });
        getLogFilenameDate.next(getDate);

        const succeed: sfn.Succeed = new sfn.Succeed(scope, 'Succeed');

        getDate.next(succeed);

        return sfn.DefinitionBody.fromChainable(getSourceBucketObject);
      })(),
    });
  }
}