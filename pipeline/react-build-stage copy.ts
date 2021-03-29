import {  Construct, Stage, StageProps } from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
/**
 * Deployable unit of web service app
 */
export class ReactBuildStage extends Stage {
//  public readonly urlOutput: CfnOutput;
  
  constructor(scope: Construct, id: string, input: codepipeline.Artifact, output: codepipeline.Artifact, props?: StageProps) {
    super(scope, id, props);

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

    new codepipeline_actions.CodeBuildAction({
      actionName: 'Lambda_Build',
      project: reactBuild,
      input: input,
      outputs: [output],
    })

    // Expose CdkpipelinesDemoStack's output one level higher
   // this.urlOutput = service.stackName
  }
}