"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkpipelinesDemoStage = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUtc3RhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS1zdGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBOEQ7QUFDOUQsK0NBQWtEO0FBRWxEOztHQUVHO0FBQ0gsTUFBYSxxQkFBc0IsU0FBUSxZQUFLO0lBQ2hELHlDQUF5QztJQUV2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXZCLElBQUksK0JBQWlCLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxFQUFFLEdBQUcsRUFBRTtnQkFDaEQsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLE1BQU0sRUFBRSxXQUFXO2FBQ3RCLEVBQUMsQ0FBQyxDQUFDO1FBRUoseURBQXlEO1FBQzFELHFDQUFxQztJQUN0QyxDQUFDO0NBQ0Y7QUFkRCxzREFjQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ICBDb25zdHJ1Y3QsIFN0YWdlLCBTdGFnZVByb3BzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBNeVN0YXRpY1NpdGVTdGFjayB9IGZyb20gJy4vc3RhdGljLXNpdGUnO1xuXG4vKipcbiAqIERlcGxveWFibGUgdW5pdCBvZiB3ZWIgc2VydmljZSBhcHBcbiAqL1xuZXhwb3J0IGNsYXNzIENka3BpcGVsaW5lc0RlbW9TdGFnZSBleHRlbmRzIFN0YWdlIHtcbi8vICBwdWJsaWMgcmVhZG9ubHkgdXJsT3V0cHV0OiBDZm5PdXRwdXQ7XG4gIFxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWdlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICBuZXcgTXlTdGF0aWNTaXRlU3RhY2sodGhpcywgJ015U3RhdGljU2l0ZScsIHsgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICc4NDcxMzY2NTY2MzUnLFxuICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnXG4gICAgfX0pOyBcblxuICAgIC8vIEV4cG9zZSBDZGtwaXBlbGluZXNEZW1vU3RhY2sncyBvdXRwdXQgb25lIGxldmVsIGhpZ2hlclxuICAgLy8gdGhpcy51cmxPdXRwdXQgPSBzZXJ2aWNlLnN0YWNrTmFtZVxuICB9XG59Il19