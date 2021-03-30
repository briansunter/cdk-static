import {  Construct, Stage, StageProps } from '@aws-cdk/core';
import { MyStaticSiteStack } from './static-site';
// import cloudfront = require('@aws-cdk/aws-cloudfront');
// import { S3DeployAction } from '@aws-cdk/aws-codepipeline-actions';
import s3 = require('@aws-cdk/aws-s3');
/**
 * Deployable unit of web service app
 */
export class CdkpipelinesDemoStage extends Stage {
//  public readonly distribution: cloudfront.CloudFrontWebDistribution;
 public readonly siteBucket: s3.Bucket;
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

     const staticSite = new MyStaticSiteStack(this, 'MyStaticSite', { env: {
        account: '847136656635',
        region: 'us-east-1'
    }}); 
    this.siteBucket = staticSite.siteBucket;

    // Expose CdkpipelinesDemoStack's output one level higher
   // this.urlOutput = service.stackName
  }
}