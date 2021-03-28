"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const static_site_1 = require("./static-site");
/**
 * Deployable unit of web service app
 */
class CdkpipelinesDemoStage extends core_1.Stage {
    //  public readonly urlOutput: CfnOutput;
    constructor(scope, id, props) {
        super(scope, id, props);
        new static_site_1.MyStaticSiteStack(this, 'MyStaticSite', { env: {
                account: '847136656635',
                region: 'us-east-1'
            } });
        // Expose CdkpipelinesDemoStack's output one level higher
        // this.urlOutput = service.stackName
    }
}
exports.CdkpipelinesDemoStage = CdkpipelinesDemoStage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUtc3RhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS1zdGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUE4RDtBQUM5RCwrQ0FBa0Q7QUFFbEQ7O0dBRUc7QUFDSCxNQUFhLHFCQUFzQixTQUFRLFlBQUs7SUFDaEQseUNBQXlDO0lBRXZDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdkIsSUFBSSwrQkFBaUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEVBQUUsR0FBRyxFQUFFO2dCQUNoRCxPQUFPLEVBQUUsY0FBYztnQkFDdkIsTUFBTSxFQUFFLFdBQVc7YUFDdEIsRUFBQyxDQUFDLENBQUM7UUFFSix5REFBeUQ7UUFDMUQscUNBQXFDO0lBQ3RDLENBQUM7Q0FDRjtBQWRELHNEQWNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgIENvbnN0cnVjdCwgU3RhZ2UsIFN0YWdlUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IE15U3RhdGljU2l0ZVN0YWNrIH0gZnJvbSAnLi9zdGF0aWMtc2l0ZSc7XG5cbi8qKlxuICogRGVwbG95YWJsZSB1bml0IG9mIHdlYiBzZXJ2aWNlIGFwcFxuICovXG5leHBvcnQgY2xhc3MgQ2RrcGlwZWxpbmVzRGVtb1N0YWdlIGV4dGVuZHMgU3RhZ2Uge1xuLy8gIHB1YmxpYyByZWFkb25seSB1cmxPdXRwdXQ6IENmbk91dHB1dDtcbiAgXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhZ2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgIG5ldyBNeVN0YXRpY1NpdGVTdGFjayh0aGlzLCAnTXlTdGF0aWNTaXRlJywgeyBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzg0NzEzNjY1NjYzNScsXG4gICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMSdcbiAgICB9fSk7IFxuXG4gICAgLy8gRXhwb3NlIENka3BpcGVsaW5lc0RlbW9TdGFjaydzIG91dHB1dCBvbmUgbGV2ZWwgaGlnaGVyXG4gICAvLyB0aGlzLnVybE91dHB1dCA9IHNlcnZpY2Uuc3RhY2tOYW1lXG4gIH1cbn0iXX0=