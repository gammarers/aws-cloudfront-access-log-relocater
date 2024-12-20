import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { CloudFrontAccessLogRelocater } from '../src';

describe('Notifier default Testing', () => {

  const app = new App();
  const stack = new Stack(app, 'TestStack');

  const logBucket = new s3.Bucket(stack, 'LogBucket');

  new CloudFrontAccessLogRelocater(stack, 'CloudFrontAccessLogRelocater', {
    accessLogSource: {
      bucket: logBucket,
      objectPrefix: 'origin-logs',
    },
    accessLogDestination: {
      bucket: logBucket,
      objectPrefix: 'partitioning-log',
    },
  });

  const template = Template.fromStack(stack);

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});