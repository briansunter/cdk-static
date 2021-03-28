"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkpipelinesDemoPipelineStack = void 0;
const codepipeline = require("@aws-cdk/aws-codepipeline");
const codepipeline_actions = require("@aws-cdk/aws-codepipeline-actions");
const core_1 = require("@aws-cdk/core");
const pipelines_1 = require("@aws-cdk/pipelines");
/**
 * The stack that defines the application pipeline
 */
class CdkpipelinesDemoPipelineStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const sourceArtifact = new codepipeline.Artifact();
        const cloudAssemblyArtifact = new codepipeline.Artifact();
        new pipelines_1.CdkPipeline(this, 'Pipeline', {
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
            // How it will be built and synthesized
            synthAction: pipelines_1.SimpleSynthAction.standardNpmSynth({
                sourceArtifact,
                cloudAssemblyArtifact,
                // We need a build step to compile the TypeScript Lambda
                buildCommand: 'npm run build'
            }),
        });
        // This is where we add the application stages
        // ...
    }
}
exports.CdkpipelinesDemoPipelineStack = CdkpipelinesDemoPipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUtcGlwZWxpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS1waXBlbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwREFBMEQ7QUFDMUQsMEVBQTBFO0FBQzFFLHdDQUEwRTtBQUMxRSxrREFBb0U7QUFFcEU7O0dBRUc7QUFDSCxNQUFhLDZCQUE4QixTQUFRLFlBQUs7SUFDdEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLGNBQWMsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNuRCxNQUFNLHFCQUFxQixHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXpELElBQUksdUJBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2pDLG9CQUFvQjtZQUNwQixZQUFZLEVBQUUsa0JBQWtCO1lBQ2hDLHFCQUFxQjtZQUVyQixnQ0FBZ0M7WUFDaEMsWUFBWSxFQUFFLElBQUksb0JBQW9CLENBQUMsa0JBQWtCLENBQUM7Z0JBQ3hELFVBQVUsRUFBRSxRQUFRO2dCQUNwQixNQUFNLEVBQUUsY0FBYztnQkFDdEIsVUFBVSxFQUFFLGtCQUFXLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQztnQkFDdEQsS0FBSyxFQUFFLGFBQWE7Z0JBQ3BCLElBQUksRUFBRSxZQUFZO2FBQ25CLENBQUM7WUFFRCx1Q0FBdUM7WUFDdkMsV0FBVyxFQUFFLDZCQUFpQixDQUFDLGdCQUFnQixDQUFDO2dCQUM5QyxjQUFjO2dCQUNkLHFCQUFxQjtnQkFFckIsd0RBQXdEO2dCQUN4RCxZQUFZLEVBQUUsZUFBZTthQUM5QixDQUFDO1NBQ0osQ0FBQyxDQUFDO1FBRUgsOENBQThDO1FBQzlDLE1BQU07SUFDUixDQUFDO0NBQ0Y7QUFsQ0Qsc0VBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lX2FjdGlvbnMgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcbmltcG9ydCB7IENvbnN0cnVjdCwgU2VjcmV0VmFsdWUsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDZGtQaXBlbGluZSwgU2ltcGxlU3ludGhBY3Rpb24gfSBmcm9tIFwiQGF3cy1jZGsvcGlwZWxpbmVzXCI7XG5cbi8qKlxuICogVGhlIHN0YWNrIHRoYXQgZGVmaW5lcyB0aGUgYXBwbGljYXRpb24gcGlwZWxpbmVcbiAqL1xuZXhwb3J0IGNsYXNzIENka3BpcGVsaW5lc0RlbW9QaXBlbGluZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHNvdXJjZUFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgIGNvbnN0IGNsb3VkQXNzZW1ibHlBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiBcbiAgICAgbmV3IENka1BpcGVsaW5lKHRoaXMsICdQaXBlbGluZScsIHtcbiAgICAgIC8vIFRoZSBwaXBlbGluZSBuYW1lXG4gICAgICBwaXBlbGluZU5hbWU6ICdNeVN0YXRpY1BpcGVsaW5lJyxcbiAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcblxuICAgICAgLy8gV2hlcmUgdGhlIHNvdXJjZSBjYW4gYmUgZm91bmRcbiAgICAgIHNvdXJjZUFjdGlvbjogbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkdpdEh1YlNvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdHaXRIdWInLFxuICAgICAgICBvdXRwdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgICBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignZ2l0aHViLXRva2VuJyksXG4gICAgICAgIG93bmVyOiAnYnJpYW5zdW50ZXInLFxuICAgICAgICByZXBvOiAnY2RrLXN0YXRpYycsXG4gICAgICB9KSxcblxuICAgICAgIC8vIEhvdyBpdCB3aWxsIGJlIGJ1aWx0IGFuZCBzeW50aGVzaXplZFxuICAgICAgIHN5bnRoQWN0aW9uOiBTaW1wbGVTeW50aEFjdGlvbi5zdGFuZGFyZE5wbVN5bnRoKHtcbiAgICAgICAgIHNvdXJjZUFydGlmYWN0LFxuICAgICAgICAgY2xvdWRBc3NlbWJseUFydGlmYWN0LFxuICAgICAgICAgXG4gICAgICAgICAvLyBXZSBuZWVkIGEgYnVpbGQgc3RlcCB0byBjb21waWxlIHRoZSBUeXBlU2NyaXB0IExhbWJkYVxuICAgICAgICAgYnVpbGRDb21tYW5kOiAnbnBtIHJ1biBidWlsZCdcbiAgICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRoaXMgaXMgd2hlcmUgd2UgYWRkIHRoZSBhcHBsaWNhdGlvbiBzdGFnZXNcbiAgICAvLyAuLi5cbiAgfVxufSJdfQ==