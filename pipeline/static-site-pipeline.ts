import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from './static-site-stage'
import { ReactBuildStage } from './react-build-stage'
/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();

    const reactBuild = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();
 
     const pipeline = new CdkPipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyStaticPipeline',
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('github-token'),
        owner: 'briansunter',
        repo: 'cdk-static',
      }),

       synthAction: SimpleSynthAction.standardNpmSynth({
         sourceArtifact,
         cloudAssemblyArtifact,
         subdirectory: 'pipeline',
      }),
    });

    pipeline.addApplicationStage(new ReactBuildStage(this, 'React Build', sourceArtifact, reactBuild));
    pipeline.addApplicationStage(new CdkpipelinesDemoStage(this, 'PreProd', {
        env: {
            account: '847136656635',
            region: 'us-east-1' 
        }
      }));
    // This is where we add the application stages
    // ...
  }
}