"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactBuildStage = void 0;
const core_1 = require("@aws-cdk/core");
const codebuild = require("@aws-cdk/aws-codebuild");
const codepipeline_actions = require("@aws-cdk/aws-codepipeline-actions");
/**
 * Deployable unit of web service app
 */
class ReactBuildStage extends core_1.Stage {
    //  public readonly urlOutput: CfnOutput;
    constructor(scope, id, input, output, props) {
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
        });
        // Expose CdkpipelinesDemoStack's output one level higher
        // this.urlOutput = service.stackName
    }
}
exports.ReactBuildStage = ReactBuildStage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtYnVpbGQtc3RhZ2UgY29weS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlYWN0LWJ1aWxkLXN0YWdlIGNvcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQThEO0FBQzlELG9EQUFvRDtBQUVwRCwwRUFBMEU7QUFDMUU7O0dBRUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsWUFBSztJQUMxQyx5Q0FBeUM7SUFFdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QixFQUFFLE1BQTZCLEVBQUUsS0FBa0I7UUFDdkgsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDbkUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO2dCQUN4QyxPQUFPLEVBQUUsS0FBSztnQkFDZCxNQUFNLEVBQUU7b0JBQ04sT0FBTyxFQUFFO3dCQUNQLFFBQVEsRUFBRTs0QkFDUixhQUFhOzRCQUNiLGFBQWE7eUJBQ2Q7cUJBQ0Y7b0JBQ0QsS0FBSyxFQUFFO3dCQUNMLFFBQVEsRUFBRSxlQUFlO3FCQUMxQjtpQkFDRjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsZ0JBQWdCLEVBQUUsVUFBVTtvQkFDNUIsS0FBSyxFQUFFO3dCQUNMLFlBQVk7cUJBQ2I7aUJBQ0Y7YUFDRixDQUFDO1lBQ0YsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxTQUFTLENBQUMsZUFBZSxDQUFDLFlBQVk7YUFDbkQ7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLG9CQUFvQixDQUFDLGVBQWUsQ0FBQztZQUN2QyxVQUFVLEVBQUUsY0FBYztZQUMxQixPQUFPLEVBQUUsVUFBVTtZQUNuQixLQUFLLEVBQUUsS0FBSztZQUNaLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztTQUNsQixDQUFDLENBQUE7UUFFRix5REFBeUQ7UUFDMUQscUNBQXFDO0lBQ3RDLENBQUM7Q0FDRjtBQTFDRCwwQ0EwQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyAgQ29uc3RydWN0LCBTdGFnZSwgU3RhZ2VQcm9wcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lX2FjdGlvbnMgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcbi8qKlxuICogRGVwbG95YWJsZSB1bml0IG9mIHdlYiBzZXJ2aWNlIGFwcFxuICovXG5leHBvcnQgY2xhc3MgUmVhY3RCdWlsZFN0YWdlIGV4dGVuZHMgU3RhZ2Uge1xuLy8gIHB1YmxpYyByZWFkb25seSB1cmxPdXRwdXQ6IENmbk91dHB1dDtcbiAgXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGlucHV0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QsIG91dHB1dDogY29kZXBpcGVsaW5lLkFydGlmYWN0LCBwcm9wcz86IFN0YWdlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHJlYWN0QnVpbGQgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdCh0aGlzLCAnUmVhY3RCdWlsZCcsIHtcbiAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICAgIHBoYXNlczoge1xuICAgICAgICAgIGluc3RhbGw6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICdjZCBmcm9udGVuZCcsXG4gICAgICAgICAgICAgICducG0gaW5zdGFsbCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiAnbnBtIHJ1biBidWlsZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYXJ0aWZhY3RzOiB7XG4gICAgICAgICAgJ2Jhc2UtZGlyZWN0b3J5JzogJ2Zyb250ZW5kJyxcbiAgICAgICAgICBmaWxlczogW1xuICAgICAgICAgICAgJ2J1aWxkLyoqLyonLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuU1RBTkRBUkRfMl8wLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0xhbWJkYV9CdWlsZCcsXG4gICAgICBwcm9qZWN0OiByZWFjdEJ1aWxkLFxuICAgICAgaW5wdXQ6IGlucHV0LFxuICAgICAgb3V0cHV0czogW291dHB1dF0sXG4gICAgfSlcblxuICAgIC8vIEV4cG9zZSBDZGtwaXBlbGluZXNEZW1vU3RhY2sncyBvdXRwdXQgb25lIGxldmVsIGhpZ2hlclxuICAgLy8gdGhpcy51cmxPdXRwdXQgPSBzZXJ2aWNlLnN0YWNrTmFtZVxuICB9XG59Il19