#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
// import { StaticSite } from './static-site';

import { CdkpipelinesDemoPipelineStack } from './static-site-pipeline';
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
new CdkpipelinesDemoPipelineStack(app, 'CdkpipelinesDemoPipelineStack', {
    env: { account: '847136656635', region: 'us-east-1' },
  });
  
app.synth();
