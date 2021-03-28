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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtYnVpbGQtc3RhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWFjdC1idWlsZC1zdGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBOEQ7QUFDOUQsb0RBQW9EO0FBRXBELDBFQUEwRTtBQUMxRTs7R0FFRztBQUNILE1BQWEsZUFBZ0IsU0FBUSxZQUFLO0lBQzFDLHlDQUF5QztJQUV2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTRCLEVBQUUsTUFBNkIsRUFBRSxLQUFrQjtRQUN2SCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFVBQVUsR0FBRyxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNuRSxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE1BQU0sRUFBRTtvQkFDTixPQUFPLEVBQUU7d0JBQ1AsUUFBUSxFQUFFOzRCQUNSLGFBQWE7NEJBQ2IsYUFBYTt5QkFDZDtxQkFDRjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsUUFBUSxFQUFFLGVBQWU7cUJBQzFCO2lCQUNGO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxnQkFBZ0IsRUFBRSxVQUFVO29CQUM1QixLQUFLLEVBQUU7d0JBQ0wsWUFBWTtxQkFDYjtpQkFDRjthQUNGLENBQUM7WUFDRixXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLFNBQVMsQ0FBQyxlQUFlLENBQUMsWUFBWTthQUNuRDtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksb0JBQW9CLENBQUMsZUFBZSxDQUFDO1lBQ3ZDLFVBQVUsRUFBRSxjQUFjO1lBQzFCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLEtBQUssRUFBRSxLQUFLO1lBQ1osT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO1NBQ2xCLENBQUMsQ0FBQTtRQUVGLHlEQUF5RDtRQUMxRCxxQ0FBcUM7SUFDdEMsQ0FBQztDQUNGO0FBMUNELDBDQTBDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ICBDb25zdHJ1Y3QsIFN0YWdlLCBTdGFnZVByb3BzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmVfYWN0aW9ucyBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuLyoqXG4gKiBEZXBsb3lhYmxlIHVuaXQgb2Ygd2ViIHNlcnZpY2UgYXBwXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFjdEJ1aWxkU3RhZ2UgZXh0ZW5kcyBTdGFnZSB7XG4vLyAgcHVibGljIHJlYWRvbmx5IHVybE91dHB1dDogQ2ZuT3V0cHV0O1xuICBcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgaW5wdXQ6IGNvZGVwaXBlbGluZS5BcnRpZmFjdCwgb3V0cHV0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QsIHByb3BzPzogU3RhZ2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgcmVhY3RCdWlsZCA9IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHRoaXMsICdSZWFjdEJ1aWxkJywge1xuICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgaW5zdGFsbDoge1xuICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgJ2NkIGZyb250ZW5kJyxcbiAgICAgICAgICAgICAgJ25wbSBpbnN0YWxsJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgY29tbWFuZHM6ICducG0gcnVuIGJ1aWxkJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBhcnRpZmFjdHM6IHtcbiAgICAgICAgICAnYmFzZS1kaXJlY3RvcnknOiAnZnJvbnRlbmQnLFxuICAgICAgICAgIGZpbGVzOiBbXG4gICAgICAgICAgICAnYnVpbGQvKiovKicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5TVEFOREFSRF8yXzAsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnTGFtYmRhX0J1aWxkJyxcbiAgICAgIHByb2plY3Q6IHJlYWN0QnVpbGQsXG4gICAgICBpbnB1dDogaW5wdXQsXG4gICAgICBvdXRwdXRzOiBbb3V0cHV0XSxcbiAgICB9KVxuXG4gICAgLy8gRXhwb3NlIENka3BpcGVsaW5lc0RlbW9TdGFjaydzIG91dHB1dCBvbmUgbGV2ZWwgaGlnaGVyXG4gICAvLyB0aGlzLnVybE91dHB1dCA9IHNlcnZpY2Uuc3RhY2tOYW1lXG4gIH1cbn0iXX0=