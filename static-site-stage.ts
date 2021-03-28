import {  Construct, Stage, StageProps } from '@aws-cdk/core';
import { MyStaticSiteStack } from './static-site';

/**
 * Deployable unit of web service app
 */
export class CdkpipelinesDemoStage extends Stage {
//  public readonly urlOutput: CfnOutput;
  
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

     new MyStaticSiteStack(this, 'MyStaticSite', { env: {
        account: '847136656635',
        region: 'us-east-1'
    }}); 

    // Expose CdkpipelinesDemoStack's output one level higher
   // this.urlOutput = service.stackName
  }
}