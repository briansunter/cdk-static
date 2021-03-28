"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkpipelinesDemoPipelineStack = void 0;
const codepipeline = require("@aws-cdk/aws-codepipeline");
const codepipeline_actions = require("@aws-cdk/aws-codepipeline-actions");
const core_1 = require("@aws-cdk/core");
const pipelines_1 = require("@aws-cdk/pipelines");
const static_site_stage_1 = require("./static-site-stage");
const react_build_stage_1 = require("./react-build-stage");
/**
 * The stack that defines the application pipeline
 */
class CdkpipelinesDemoPipelineStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const sourceArtifact = new codepipeline.Artifact();
        const reactBuild = new codepipeline.Artifact();
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
        pipeline.addApplicationStage(new react_build_stage_1.ReactBuildStage(this, 'React Build', sourceArtifact, reactBuild));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUtcGlwZWxpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS1waXBlbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwREFBMEQ7QUFDMUQsMEVBQTBFO0FBQzFFLHdDQUEwRTtBQUMxRSxrREFBb0U7QUFDcEUsMkRBQTJEO0FBQzNELDJEQUFxRDtBQUNyRDs7R0FFRztBQUNILE1BQWEsNkJBQThCLFNBQVEsWUFBSztJQUN0RCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sY0FBYyxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRW5ELE1BQU0sVUFBVSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQy9DLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFekQsTUFBTSxRQUFRLEdBQUcsSUFBSSx1QkFBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbEQsb0JBQW9CO1lBQ3BCLFlBQVksRUFBRSxrQkFBa0I7WUFDaEMscUJBQXFCO1lBRXJCLGdDQUFnQztZQUNoQyxZQUFZLEVBQUUsSUFBSSxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDeEQsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixVQUFVLEVBQUUsa0JBQVcsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO2dCQUN0RCxLQUFLLEVBQUUsYUFBYTtnQkFDcEIsSUFBSSxFQUFFLFlBQVk7YUFDbkIsQ0FBQztZQUVELFdBQVcsRUFBRSw2QkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDOUMsY0FBYztnQkFDZCxxQkFBcUI7Z0JBQ3JCLFlBQVksRUFBRSxVQUFVO2FBQzFCLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsbUJBQW1CLENBQUMsSUFBSSxtQ0FBZSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDbkcsUUFBUSxDQUFDLG1CQUFtQixDQUFDLElBQUkseUNBQXFCLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUNwRSxHQUFHLEVBQUU7Z0JBQ0QsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLE1BQU0sRUFBRSxXQUFXO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDTiw4Q0FBOEM7UUFDOUMsTUFBTTtJQUNSLENBQUM7Q0FDRjtBQXhDRCxzRUF3Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmVfYWN0aW9ucyBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBTZWNyZXRWYWx1ZSwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENka1BpcGVsaW5lLCBTaW1wbGVTeW50aEFjdGlvbiB9IGZyb20gXCJAYXdzLWNkay9waXBlbGluZXNcIjtcbmltcG9ydCB7IENka3BpcGVsaW5lc0RlbW9TdGFnZSB9IGZyb20gJy4vc3RhdGljLXNpdGUtc3RhZ2UnXG5pbXBvcnQgeyBSZWFjdEJ1aWxkU3RhZ2UgfSBmcm9tICcuL3JlYWN0LWJ1aWxkLXN0YWdlJ1xuLyoqXG4gKiBUaGUgc3RhY2sgdGhhdCBkZWZpbmVzIHRoZSBhcHBsaWNhdGlvbiBwaXBlbGluZVxuICovXG5leHBvcnQgY2xhc3MgQ2RrcGlwZWxpbmVzRGVtb1BpcGVsaW5lU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qgc291cmNlQXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG5cbiAgICBjb25zdCByZWFjdEJ1aWxkID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgIGNvbnN0IGNsb3VkQXNzZW1ibHlBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiBcbiAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgQ2RrUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgLy8gVGhlIHBpcGVsaW5lIG5hbWVcbiAgICAgIHBpcGVsaW5lTmFtZTogJ015U3RhdGljUGlwZWxpbmUnLFxuICAgICAgY2xvdWRBc3NlbWJseUFydGlmYWN0LFxuXG4gICAgICAvLyBXaGVyZSB0aGUgc291cmNlIGNhbiBiZSBmb3VuZFxuICAgICAgc291cmNlQWN0aW9uOiBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0dpdEh1YicsXG4gICAgICAgIG91dHB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKCdnaXRodWItdG9rZW4nKSxcbiAgICAgICAgb3duZXI6ICdicmlhbnN1bnRlcicsXG4gICAgICAgIHJlcG86ICdjZGstc3RhdGljJyxcbiAgICAgIH0pLFxuXG4gICAgICAgc3ludGhBY3Rpb246IFNpbXBsZVN5bnRoQWN0aW9uLnN0YW5kYXJkTnBtU3ludGgoe1xuICAgICAgICAgc291cmNlQXJ0aWZhY3QsXG4gICAgICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICAgICBzdWJkaXJlY3Rvcnk6ICdwaXBlbGluZScsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIHBpcGVsaW5lLmFkZEFwcGxpY2F0aW9uU3RhZ2UobmV3IFJlYWN0QnVpbGRTdGFnZSh0aGlzLCAnUmVhY3QgQnVpbGQnLCBzb3VyY2VBcnRpZmFjdCwgcmVhY3RCdWlsZCkpO1xuICAgIHBpcGVsaW5lLmFkZEFwcGxpY2F0aW9uU3RhZ2UobmV3IENka3BpcGVsaW5lc0RlbW9TdGFnZSh0aGlzLCAnUHJlUHJvZCcsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgICBhY2NvdW50OiAnODQ3MTM2NjU2NjM1JyxcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScgXG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICAvLyBUaGlzIGlzIHdoZXJlIHdlIGFkZCB0aGUgYXBwbGljYXRpb24gc3RhZ2VzXG4gICAgLy8gLi4uXG4gIH1cbn0iXX0=