import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from './static-site-stage'
import * as codebuild from '@aws-cdk/aws-codebuild';
/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();

    const reactBuildArtifact = new codepipeline.Artifact();
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
    const reactBuild = new codebuild.PipelineProject(this, 'ReactBuild', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'cd frontend',
              'npm install',
            ],
          },
          build: {
            commands: 'npm run build',
          },
        },
        artifacts: {
          'base-directory': 'frontend',
          files: [
            'build/**/*',
          ],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
      },
    });
const appStack = new CdkpipelinesDemoStage(this, 'PreProd', {
        env: {
            account: '847136656635',
            region: 'us-east-1' 
        }
      });
    const appStage = pipeline.addApplicationStage(appStack);

      appStage.addActions(
        new codepipeline_actions.CodeBuildAction({
          actionName: 'Lambda_Build',
          project: reactBuild,
          input: sourceArtifact,
          outputs: [reactBuildArtifact],
        }),
        new codepipeline_actions.S3DeployAction({
          actionName: 'S3Deploy',
          bucket: appStack.siteBucket, // See bucket config below
          input: reactBuildArtifact, // Output from Build step
        }))
  }
}