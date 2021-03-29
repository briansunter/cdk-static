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
        pipeline.addStage("Reac").addActions(new codepipeline_actions.CodeBuildAction({
            actionName: 'Lambda_Build',
            project: reactBuild,
            input: sourceArtifact,
            outputs: [reactBuildArtifact],
        }));
        // pipeline.addApplicationStage(new ReactBuildStage(this, 'ReactBuild', sourceArtifact, reactBuild));
        pipeline.addApplicationStage(new static_site_stage_1.CdkpipelinesDemoStage(this, 'PreProd', {
            env: {
                account: '847136656635',
                region: 'us-east-1'
            }
        }));
        // This is where we add the application stages
        // ...
    }
}
exports.CdkpipelinesDemoPipelineStack = CdkpipelinesDemoPipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUtcGlwZWxpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS1waXBlbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwREFBMEQ7QUFDMUQsMEVBQTBFO0FBQzFFLHdDQUEwRTtBQUMxRSxrREFBb0U7QUFDcEUsMkRBQTJEO0FBQzNELG9EQUFvRDtBQUNwRDs7R0FFRztBQUNILE1BQWEsNkJBQThCLFNBQVEsWUFBSztJQUN0RCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sY0FBYyxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRW5ELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdkQsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUV6RCxNQUFNLFFBQVEsR0FBRyxJQUFJLHVCQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNsRCxvQkFBb0I7WUFDcEIsWUFBWSxFQUFFLGtCQUFrQjtZQUNoQyxxQkFBcUI7WUFFckIsZ0NBQWdDO1lBQ2hDLFlBQVksRUFBRSxJQUFJLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDO2dCQUN4RCxVQUFVLEVBQUUsUUFBUTtnQkFDcEIsTUFBTSxFQUFFLGNBQWM7Z0JBQ3RCLFVBQVUsRUFBRSxrQkFBVyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUM7Z0JBQ3RELEtBQUssRUFBRSxhQUFhO2dCQUNwQixJQUFJLEVBQUUsWUFBWTthQUNuQixDQUFDO1lBRUQsV0FBVyxFQUFFLDZCQUFpQixDQUFDLGdCQUFnQixDQUFDO2dCQUM5QyxjQUFjO2dCQUNkLHFCQUFxQjtnQkFDckIsWUFBWSxFQUFFLFVBQVU7YUFDMUIsQ0FBQztTQUNILENBQUMsQ0FBQztRQUNILE1BQU0sVUFBVSxHQUFHLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ25FLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDeEMsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFO29CQUNOLE9BQU8sRUFBRTt3QkFDUCxRQUFRLEVBQUU7NEJBQ1IsYUFBYTs0QkFDYixhQUFhO3lCQUNkO3FCQUNGO29CQUNELEtBQUssRUFBRTt3QkFDTCxRQUFRLEVBQUUsZUFBZTtxQkFDMUI7aUJBQ0Y7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULGdCQUFnQixFQUFFLFVBQVU7b0JBQzVCLEtBQUssRUFBRTt3QkFDTCxZQUFZO3FCQUNiO2lCQUNGO2FBQ0YsQ0FBQztZQUNGLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxZQUFZO2FBQ25EO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBRXBDLElBQUksb0JBQW9CLENBQUMsZUFBZSxDQUFDO1lBQ3ZDLFVBQVUsRUFBRSxjQUFjO1lBQzFCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLEtBQUssRUFBRSxjQUFjO1lBQ3JCLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDO1NBQzlCLENBQUMsQ0FDRCxDQUFBO1FBQ0QscUdBQXFHO1FBQ3JHLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLHlDQUFxQixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDcEUsR0FBRyxFQUFFO2dCQUNELE9BQU8sRUFBRSxjQUFjO2dCQUN2QixNQUFNLEVBQUUsV0FBVzthQUN0QjtTQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ04sOENBQThDO1FBQzlDLE1BQU07SUFDUixDQUFDO0NBQ0Y7QUExRUQsc0VBMEVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lX2FjdGlvbnMgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcbmltcG9ydCB7IENvbnN0cnVjdCwgU2VjcmV0VmFsdWUsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDZGtQaXBlbGluZSwgU2ltcGxlU3ludGhBY3Rpb24gfSBmcm9tIFwiQGF3cy1jZGsvcGlwZWxpbmVzXCI7XG5pbXBvcnQgeyBDZGtwaXBlbGluZXNEZW1vU3RhZ2UgfSBmcm9tICcuL3N0YXRpYy1zaXRlLXN0YWdlJ1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnO1xuLyoqXG4gKiBUaGUgc3RhY2sgdGhhdCBkZWZpbmVzIHRoZSBhcHBsaWNhdGlvbiBwaXBlbGluZVxuICovXG5leHBvcnQgY2xhc3MgQ2RrcGlwZWxpbmVzRGVtb1BpcGVsaW5lU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qgc291cmNlQXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG5cbiAgICBjb25zdCByZWFjdEJ1aWxkQXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgY29uc3QgY2xvdWRBc3NlbWJseUFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuIFxuICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBDZGtQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICAvLyBUaGUgcGlwZWxpbmUgbmFtZVxuICAgICAgcGlwZWxpbmVOYW1lOiAnTXlTdGF0aWNQaXBlbGluZScsXG4gICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG5cbiAgICAgIC8vIFdoZXJlIHRoZSBzb3VyY2UgY2FuIGJlIGZvdW5kXG4gICAgICBzb3VyY2VBY3Rpb246IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5HaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnR2l0SHViJyxcbiAgICAgICAgb3V0cHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgb2F1dGhUb2tlbjogU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2dpdGh1Yi10b2tlbicpLFxuICAgICAgICBvd25lcjogJ2JyaWFuc3VudGVyJyxcbiAgICAgICAgcmVwbzogJ2Nkay1zdGF0aWMnLFxuICAgICAgfSksXG5cbiAgICAgICBzeW50aEFjdGlvbjogU2ltcGxlU3ludGhBY3Rpb24uc3RhbmRhcmROcG1TeW50aCh7XG4gICAgICAgICBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgICAgIHN1YmRpcmVjdG9yeTogJ3BpcGVsaW5lJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIGNvbnN0IHJlYWN0QnVpbGQgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdCh0aGlzLCAnUmVhY3RCdWlsZCcsIHtcbiAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICAgIHBoYXNlczoge1xuICAgICAgICAgIGluc3RhbGw6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICdjZCBmcm9udGVuZCcsXG4gICAgICAgICAgICAgICducG0gaW5zdGFsbCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiAnbnBtIHJ1biBidWlsZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYXJ0aWZhY3RzOiB7XG4gICAgICAgICAgJ2Jhc2UtZGlyZWN0b3J5JzogJ2Zyb250ZW5kJyxcbiAgICAgICAgICBmaWxlczogW1xuICAgICAgICAgICAgJ2J1aWxkLyoqLyonLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuU1RBTkRBUkRfMl8wLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHBpcGVsaW5lLmFkZFN0YWdlKFwiUmVhY1wiKS5hZGRBY3Rpb25zKFxuICAgICAgXG4gICAgbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnTGFtYmRhX0J1aWxkJyxcbiAgICAgIHByb2plY3Q6IHJlYWN0QnVpbGQsXG4gICAgICBpbnB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICBvdXRwdXRzOiBbcmVhY3RCdWlsZEFydGlmYWN0XSxcbiAgICB9KVxuICAgIClcbiAgICAvLyBwaXBlbGluZS5hZGRBcHBsaWNhdGlvblN0YWdlKG5ldyBSZWFjdEJ1aWxkU3RhZ2UodGhpcywgJ1JlYWN0QnVpbGQnLCBzb3VyY2VBcnRpZmFjdCwgcmVhY3RCdWlsZCkpO1xuICAgIHBpcGVsaW5lLmFkZEFwcGxpY2F0aW9uU3RhZ2UobmV3IENka3BpcGVsaW5lc0RlbW9TdGFnZSh0aGlzLCAnUHJlUHJvZCcsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgICBhY2NvdW50OiAnODQ3MTM2NjU2NjM1JyxcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScgXG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICAvLyBUaGlzIGlzIHdoZXJlIHdlIGFkZCB0aGUgYXBwbGljYXRpb24gc3RhZ2VzXG4gICAgLy8gLi4uXG4gIH1cbn0iXX0=