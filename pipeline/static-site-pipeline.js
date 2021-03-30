"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkpipelinesDemoPipelineStack = void 0;
const codepipeline = require("@aws-cdk/aws-codepipeline");
const codepipeline_actions = require("@aws-cdk/aws-codepipeline-actions");
const core_1 = require("@aws-cdk/core");
const pipelines_1 = require("@aws-cdk/pipelines");
const static_site_stage_1 = require("./static-site-stage");
const codebuild = require("@aws-cdk/aws-codebuild");
/**
 * The stack that defines the application pipeline
 */
class CdkpipelinesDemoPipelineStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const sourceArtifact = new codepipeline.Artifact();
        const reactBuildArtifact = new codepipeline.Artifact();
        const cloudAssemblyArtifact = new codepipeline.Artifact();
        const pipeline = new pipelines_1.CdkPipeline(this, 'Pipeline', {
            // The pipeline name
            pipelineName: 'MyStaticPipeline',
            cloudAssemblyArtifact,
            // Where the source can be found
            sourceAction: new codepipeline_actions.GitHubSourceAction({
                actionName: 'GitHub',
                output: sourceArtifact,
                oauthToken: core_1.SecretValue.secretsManager('github-token'),
                owner: 'briansunter',
                repo: 'cdk-static',
            }),
            synthAction: pipelines_1.SimpleSynthAction.standardNpmSynth({
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
        const appStack = new static_site_stage_1.CdkpipelinesDemoStage(this, 'PreProd', {
            env: {
                account: '847136656635',
                region: 'us-east-1'
            }
        });
        const appStage = pipeline.addApplicationStage(appStack);
        appStage.addActions(new codepipeline_actions.CodeBuildAction({
            actionName: 'Lambda_Build',
            project: reactBuild,
            input: sourceArtifact,
            outputs: [reactBuildArtifact],
        }), new codepipeline_actions.S3DeployAction({
            actionName: 'S3Deploy',
            bucket: appStack.siteBucket,
            input: reactBuildArtifact, // Output from Build step
        }));
    }
}
exports.CdkpipelinesDemoPipelineStack = CdkpipelinesDemoPipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUtcGlwZWxpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS1waXBlbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwREFBMEQ7QUFDMUQsMEVBQTBFO0FBQzFFLHdDQUEwRTtBQUMxRSxrREFBb0U7QUFDcEUsMkRBQTJEO0FBQzNELG9EQUFvRDtBQUNwRDs7R0FFRztBQUNILE1BQWEsNkJBQThCLFNBQVEsWUFBSztJQUN0RCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sY0FBYyxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRW5ELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdkQsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUV6RCxNQUFNLFFBQVEsR0FBRyxJQUFJLHVCQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNsRCxvQkFBb0I7WUFDcEIsWUFBWSxFQUFFLGtCQUFrQjtZQUNoQyxxQkFBcUI7WUFFckIsZ0NBQWdDO1lBQ2hDLFlBQVksRUFBRSxJQUFJLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDO2dCQUN4RCxVQUFVLEVBQUUsUUFBUTtnQkFDcEIsTUFBTSxFQUFFLGNBQWM7Z0JBQ3RCLFVBQVUsRUFBRSxrQkFBVyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUM7Z0JBQ3RELEtBQUssRUFBRSxhQUFhO2dCQUNwQixJQUFJLEVBQUUsWUFBWTthQUNuQixDQUFDO1lBRUQsV0FBVyxFQUFFLDZCQUFpQixDQUFDLGdCQUFnQixDQUFDO2dCQUM5QyxjQUFjO2dCQUNkLHFCQUFxQjtnQkFDckIsWUFBWSxFQUFFLFVBQVU7YUFDMUIsQ0FBQztTQUNILENBQUMsQ0FBQztRQUNILE1BQU0sVUFBVSxHQUFHLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ25FLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDeEMsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFO29CQUNOLE9BQU8sRUFBRTt3QkFDUCxRQUFRLEVBQUU7NEJBQ1IsYUFBYTs0QkFDYixhQUFhO3lCQUNkO3FCQUNGO29CQUNELEtBQUssRUFBRTt3QkFDTCxRQUFRLEVBQUUsZUFBZTtxQkFDMUI7aUJBQ0Y7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULGdCQUFnQixFQUFFLFVBQVU7b0JBQzVCLEtBQUssRUFBRTt3QkFDTCxZQUFZO3FCQUNiO2lCQUNGO2FBQ0YsQ0FBQztZQUNGLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxZQUFZO2FBQ25EO1NBQ0YsQ0FBQyxDQUFDO1FBQ1AsTUFBTSxRQUFRLEdBQUcsSUFBSSx5Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ3BELEdBQUcsRUFBRTtnQkFDRCxPQUFPLEVBQUUsY0FBYztnQkFDdkIsTUFBTSxFQUFFLFdBQVc7YUFDdEI7U0FDRixDQUFDLENBQUM7UUFDTCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdEQsUUFBUSxDQUFDLFVBQVUsQ0FDakIsSUFBSSxvQkFBb0IsQ0FBQyxlQUFlLENBQUM7WUFDdkMsVUFBVSxFQUFFLGNBQWM7WUFDMUIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsS0FBSyxFQUFFLGNBQWM7WUFDckIsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7U0FDOUIsQ0FBQyxFQUNGLElBQUksb0JBQW9CLENBQUMsY0FBYyxDQUFDO1lBQ3RDLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLE1BQU0sRUFBRSxRQUFRLENBQUMsVUFBVTtZQUMzQixLQUFLLEVBQUUsa0JBQWtCLEVBQUUseUJBQXlCO1NBQ3JELENBQUMsQ0FBQyxDQUFBO0lBQ1QsQ0FBQztDQUNGO0FBM0VELHNFQTJFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZV9hY3Rpb25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIFNlY3JldFZhbHVlLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ2RrUGlwZWxpbmUsIFNpbXBsZVN5bnRoQWN0aW9uIH0gZnJvbSBcIkBhd3MtY2RrL3BpcGVsaW5lc1wiO1xuaW1wb3J0IHsgQ2RrcGlwZWxpbmVzRGVtb1N0YWdlIH0gZnJvbSAnLi9zdGF0aWMtc2l0ZS1zdGFnZSdcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWJ1aWxkJztcbi8qKlxuICogVGhlIHN0YWNrIHRoYXQgZGVmaW5lcyB0aGUgYXBwbGljYXRpb24gcGlwZWxpbmVcbiAqL1xuZXhwb3J0IGNsYXNzIENka3BpcGVsaW5lc0RlbW9QaXBlbGluZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHNvdXJjZUFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuXG4gICAgY29uc3QgcmVhY3RCdWlsZEFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgIGNvbnN0IGNsb3VkQXNzZW1ibHlBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiBcbiAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgQ2RrUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgLy8gVGhlIHBpcGVsaW5lIG5hbWVcbiAgICAgIHBpcGVsaW5lTmFtZTogJ015U3RhdGljUGlwZWxpbmUnLFxuICAgICAgY2xvdWRBc3NlbWJseUFydGlmYWN0LFxuXG4gICAgICAvLyBXaGVyZSB0aGUgc291cmNlIGNhbiBiZSBmb3VuZFxuICAgICAgc291cmNlQWN0aW9uOiBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0dpdEh1YicsXG4gICAgICAgIG91dHB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKCdnaXRodWItdG9rZW4nKSxcbiAgICAgICAgb3duZXI6ICdicmlhbnN1bnRlcicsXG4gICAgICAgIHJlcG86ICdjZGstc3RhdGljJyxcbiAgICAgIH0pLFxuXG4gICAgICAgc3ludGhBY3Rpb246IFNpbXBsZVN5bnRoQWN0aW9uLnN0YW5kYXJkTnBtU3ludGgoe1xuICAgICAgICAgc291cmNlQXJ0aWZhY3QsXG4gICAgICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICAgICBzdWJkaXJlY3Rvcnk6ICdwaXBlbGluZScsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBjb25zdCByZWFjdEJ1aWxkID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QodGhpcywgJ1JlYWN0QnVpbGQnLCB7XG4gICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgICAgIHZlcnNpb246ICcwLjInLFxuICAgICAgICBwaGFzZXM6IHtcbiAgICAgICAgICBpbnN0YWxsOiB7XG4gICAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgICAnY2QgZnJvbnRlbmQnLFxuICAgICAgICAgICAgICAnbnBtIGluc3RhbGwnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICBjb21tYW5kczogJ25wbSBydW4gYnVpbGQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFydGlmYWN0czoge1xuICAgICAgICAgICdiYXNlLWRpcmVjdG9yeSc6ICdmcm9udGVuZCcsXG4gICAgICAgICAgZmlsZXM6IFtcbiAgICAgICAgICAgICdidWlsZC8qKi8qJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhCdWlsZEltYWdlLlNUQU5EQVJEXzJfMCxcbiAgICAgIH0sXG4gICAgfSk7XG5jb25zdCBhcHBTdGFjayA9IG5ldyBDZGtwaXBlbGluZXNEZW1vU3RhZ2UodGhpcywgJ1ByZVByb2QnLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgICAgYWNjb3VudDogJzg0NzEzNjY1NjYzNScsXG4gICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnIFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICBjb25zdCBhcHBTdGFnZSA9IHBpcGVsaW5lLmFkZEFwcGxpY2F0aW9uU3RhZ2UoYXBwU3RhY2spO1xuXG4gICAgICBhcHBTdGFnZS5hZGRBY3Rpb25zKFxuICAgICAgICBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnTGFtYmRhX0J1aWxkJyxcbiAgICAgICAgICBwcm9qZWN0OiByZWFjdEJ1aWxkLFxuICAgICAgICAgIGlucHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgICBvdXRwdXRzOiBbcmVhY3RCdWlsZEFydGlmYWN0XSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5TM0RlcGxveUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ1MzRGVwbG95JyxcbiAgICAgICAgICBidWNrZXQ6IGFwcFN0YWNrLnNpdGVCdWNrZXQsIC8vIFNlZSBidWNrZXQgY29uZmlnIGJlbG93XG4gICAgICAgICAgaW5wdXQ6IHJlYWN0QnVpbGRBcnRpZmFjdCwgLy8gT3V0cHV0IGZyb20gQnVpbGQgc3RlcFxuICAgICAgICB9KSlcbiAgfVxufSJdfQ==