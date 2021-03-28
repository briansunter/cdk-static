#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const static_site_1 = require("./static-site");
/**
 * This stack relies on getting the domain name from CDK context.
 * Use 'cdk synth -c domain=mystaticsite.com -c subdomain=www'
 * Or add the following to cdk.json:
 * {
 *   "context": {
 *     "domain": "mystaticsite.com",
 *     "subdomain": "www"
 *   }
 * }
**/
class MyStaticSiteStack extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        new static_site_1.StaticSite(this, 'StaticSite', {
            domainName: this.node.tryGetContext('domain'),
            siteSubDomain: this.node.tryGetContext('subdomain'),
        });
    }
}
const app = new cdk.App();
new MyStaticSiteStack(app, 'MyStaticSite', { env: {
        // Stack must be in us-east-1, because the ACM certificate for a
        // global CloudFront distribution must be requested in us-east-1.
        account: '847136656635',
        region: 'us-east-1'
    } });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBc0M7QUFDdEMsK0NBQTJDO0FBRTNDOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3JDLFlBQVksTUFBZSxFQUFFLElBQVksRUFBRSxLQUFxQjtRQUM1RCxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzQixJQUFJLHdCQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUMvQixVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO1lBQzdDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7U0FDdEQsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztDQUNIO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsY0FBYyxFQUFFLEVBQUUsR0FBRyxFQUFFO1FBQzlDLGdFQUFnRTtRQUNoRSxpRUFBaUU7UUFDakUsT0FBTyxFQUFFLGNBQWM7UUFDdkIsTUFBTSxFQUFFLFdBQVc7S0FDdEIsRUFBQyxDQUFDLENBQUM7QUFFSixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY29yZScpO1xuaW1wb3J0IHsgU3RhdGljU2l0ZSB9IGZyb20gJy4vc3RhdGljLXNpdGUnO1xuXG4vKipcbiAqIFRoaXMgc3RhY2sgcmVsaWVzIG9uIGdldHRpbmcgdGhlIGRvbWFpbiBuYW1lIGZyb20gQ0RLIGNvbnRleHQuXG4gKiBVc2UgJ2NkayBzeW50aCAtYyBkb21haW49bXlzdGF0aWNzaXRlLmNvbSAtYyBzdWJkb21haW49d3d3J1xuICogT3IgYWRkIHRoZSBmb2xsb3dpbmcgdG8gY2RrLmpzb246XG4gKiB7XG4gKiAgIFwiY29udGV4dFwiOiB7XG4gKiAgICAgXCJkb21haW5cIjogXCJteXN0YXRpY3NpdGUuY29tXCIsXG4gKiAgICAgXCJzdWJkb21haW5cIjogXCJ3d3dcIlxuICogICB9XG4gKiB9XG4qKi9cbmNsYXNzIE15U3RhdGljU2l0ZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5BcHAsIG5hbWU6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzKSB7XG4gICAgICAgIHN1cGVyKHBhcmVudCwgbmFtZSwgcHJvcHMpO1xuXG4gICAgICAgIG5ldyBTdGF0aWNTaXRlKHRoaXMsICdTdGF0aWNTaXRlJywge1xuICAgICAgICAgICAgZG9tYWluTmFtZTogdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ2RvbWFpbicpLFxuICAgICAgICAgICAgc2l0ZVN1YkRvbWFpbjogdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ3N1YmRvbWFpbicpLFxuICAgICAgICB9KTtcbiAgIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IE15U3RhdGljU2l0ZVN0YWNrKGFwcCwgJ015U3RhdGljU2l0ZScsIHsgZW52OiB7XG4gICAgLy8gU3RhY2sgbXVzdCBiZSBpbiB1cy1lYXN0LTEsIGJlY2F1c2UgdGhlIEFDTSBjZXJ0aWZpY2F0ZSBmb3IgYVxuICAgIC8vIGdsb2JhbCBDbG91ZEZyb250IGRpc3RyaWJ1dGlvbiBtdXN0IGJlIHJlcXVlc3RlZCBpbiB1cy1lYXN0LTEuXG4gICAgYWNjb3VudDogJzg0NzEzNjY1NjYzNScsXG4gICAgcmVnaW9uOiAndXMtZWFzdC0xJ1xufX0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==