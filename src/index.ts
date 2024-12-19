import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { RelocatorStateMachine } from './resources/relocate-state-machine';

export interface AccessLogSource {
  readonly bucket: s3.IBucket;
  readonly objectPrefix: string;
}

// export enum PartitioningFormatType {
//   /** yyyy/mm/dd */
//   HIERARCHICAL_DATE_PARTITIONING_FORMAT,
//   /** y=yyyy/m=mm/d=dd */
//   KEY_VALUE_DATE_PARTITIONING_FORMAT,
// }

export interface AccessLogDestination {
  readonly bucket: s3.IBucket;
  readonly objectPrefix: string;
  // readonly partitioningFormatType: PartitioningFormatType;
}

export interface CloudFrontAccessLogRelocaterProps {
  readonly accessLogSource: AccessLogSource;
  readonly accessLogDestination: AccessLogDestination;
}

export class CloudFrontAccessLogRelocater extends Construct {
  constructor(scope: Construct, id: string, props: CloudFrontAccessLogRelocaterProps) {
    super(scope, id);

    // 👇 relocate state machine(bukect object copy & delete)
    const machine = new RelocatorStateMachine(this, 'RelocatorStateMachine');

    // 👇 access log created event catch rule
    new events.Rule(this, 'EventRule', {
      // ruleName: `hac-cloudfront-log-output-${props.random}-event-rule`,
      description: 'event rule.',
      eventPattern: {
        source: ['aws.s3'],
        detailType: ['Object Created'],
        detail: {
          bucket: {
            name: [props.accessLogSource.bucket.bucketName],
          },
          object: {
            key: [
              {
                wildcard: `${props.accessLogSource.objectPrefix}/*.gz`,
              },
            ],
          },
        },
      },
      targets: [
        new targets.SfnStateMachine(machine, {
          input: events.RuleTargetInput.fromObject({
            event: events.EventField.fromPath('$'),
            params: {
              accessLogDestination: {
                bucketName: props.accessLogDestination.bucket.bucketName,
                objectPrifix: props.accessLogDestination.objectPrefix,
              },
            },
          }),
        }),
      ],
    });
    //   input: events.RuleTargetInput.fromObject({
    // event: events.RuleTargetInput.fromEventPath('$'),
    // customKey: 'customValue',
  }
}