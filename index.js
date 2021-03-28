#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
// import { StaticSite } from './static-site';
const static_site_pipeline_1 = require("./static-site-pipeline");
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
const app = new cdk.App();
// new MyStaticSiteStack(app, 'MyStaticSite', { env: {
//     // Stack must be in us-east-1, because the ACM certificate for a
//     // global CloudFront distribution must be requested in us-east-1.
//     account: '847136656635',
//     region: 'us-east-1'
// }});
new static_site_pipeline_1.CdkpipelinesDemoPipelineStack(app, 'CdkpipelinesDemoPipelineStack', {
    env: { account: '847136656635', region: 'us-east-1' },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBc0M7QUFDdEMsOENBQThDO0FBRTlDLGlFQUF1RTtBQUN2RTs7Ozs7Ozs7OztHQVVHO0FBR0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsc0RBQXNEO0FBQ3RELHVFQUF1RTtBQUN2RSx3RUFBd0U7QUFDeEUsK0JBQStCO0FBQy9CLDBCQUEwQjtBQUMxQixPQUFPO0FBQ1AsSUFBSSxvREFBNkIsQ0FBQyxHQUFHLEVBQUUsK0JBQStCLEVBQUU7SUFDcEUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO0NBQ3RELENBQUMsQ0FBQztBQUVMLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCBjZGsgPSByZXF1aXJlKCdAYXdzLWNkay9jb3JlJyk7XG4vLyBpbXBvcnQgeyBTdGF0aWNTaXRlIH0gZnJvbSAnLi9zdGF0aWMtc2l0ZSc7XG5cbmltcG9ydCB7IENka3BpcGVsaW5lc0RlbW9QaXBlbGluZVN0YWNrIH0gZnJvbSAnLi9zdGF0aWMtc2l0ZS1waXBlbGluZSc7XG4vKipcbiAqIFRoaXMgc3RhY2sgcmVsaWVzIG9uIGdldHRpbmcgdGhlIGRvbWFpbiBuYW1lIGZyb20gQ0RLIGNvbnRleHQuXG4gKiBVc2UgJ2NkayBzeW50aCAtYyBkb21haW49bXlzdGF0aWNzaXRlLmNvbSAtYyBzdWJkb21haW49d3d3J1xuICogT3IgYWRkIHRoZSBmb2xsb3dpbmcgdG8gY2RrLmpzb246XG4gKiB7XG4gKiAgIFwiY29udGV4dFwiOiB7XG4gKiAgICAgXCJkb21haW5cIjogXCJteXN0YXRpY3NpdGUuY29tXCIsXG4gKiAgICAgXCJzdWJkb21haW5cIjogXCJ3d3dcIlxuICogICB9XG4gKiB9XG4qKi9cblxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4vLyBuZXcgTXlTdGF0aWNTaXRlU3RhY2soYXBwLCAnTXlTdGF0aWNTaXRlJywgeyBlbnY6IHtcbi8vICAgICAvLyBTdGFjayBtdXN0IGJlIGluIHVzLWVhc3QtMSwgYmVjYXVzZSB0aGUgQUNNIGNlcnRpZmljYXRlIGZvciBhXG4vLyAgICAgLy8gZ2xvYmFsIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uIG11c3QgYmUgcmVxdWVzdGVkIGluIHVzLWVhc3QtMS5cbi8vICAgICBhY2NvdW50OiAnODQ3MTM2NjU2NjM1Jyxcbi8vICAgICByZWdpb246ICd1cy1lYXN0LTEnXG4vLyB9fSk7XG5uZXcgQ2RrcGlwZWxpbmVzRGVtb1BpcGVsaW5lU3RhY2soYXBwLCAnQ2RrcGlwZWxpbmVzRGVtb1BpcGVsaW5lU3RhY2snLCB7XG4gICAgZW52OiB7IGFjY291bnQ6ICc4NDcxMzY2NTY2MzUnLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXG4gIH0pO1xuICBcbmFwcC5zeW50aCgpO1xuIl19