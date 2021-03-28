#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticSite = void 0;
const cloudfront = require("@aws-cdk/aws-cloudfront");
const route53 = require("@aws-cdk/aws-route53");
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const acm = require("@aws-cdk/aws-certificatemanager");
const cdk = require("@aws-cdk/core");
const targets = require("@aws-cdk/aws-route53-targets/lib");
const core_1 = require("@aws-cdk/core");
/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
class StaticSite extends core_1.Construct {
    constructor(parent, name, props) {
        super(parent, name);
        const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });
        const siteDomain = props.siteSubDomain + '.' + props.domainName;
        new cdk.CfnOutput(this, 'Site', { value: 'https://' + siteDomain });
        // Content bucket
        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            bucketName: siteDomain,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html',
            publicReadAccess: true,
            // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
            // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
            // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
            removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
        });
        new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });
        // TLS certificate
        const certificateArn = new acm.DnsValidatedCertificate(this, 'SiteCertificate', {
            domainName: siteDomain,
            hostedZone: zone,
            region: 'us-east-1', // Cloudfront only checks this region for certificates.
        }).certificateArn;
        new cdk.CfnOutput(this, 'Certificate', { value: certificateArn });
        // CloudFront distribution that provides HTTPS
        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
            aliasConfiguration: {
                acmCertRef: certificateArn,
                names: [siteDomain],
                sslMethod: cloudfront.SSLMethod.SNI,
                securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
            },
            originConfigs: [
                {
                    customOriginSource: {
                        domainName: siteBucket.bucketWebsiteDomainName,
                        originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                }
            ]
        });
        new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
        // Route53 alias record for the CloudFront distribution
        new route53.ARecord(this, 'SiteAliasRecord', {
            recordName: siteDomain,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            zone
        });
        // Deploy site contents to S3 bucket
        new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [s3deploy.Source.asset('./site-contents')],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'],
        });
    }
}
exports.StaticSite = StaticSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0Esc0RBQXVEO0FBQ3ZELGdEQUFpRDtBQUNqRCxzQ0FBdUM7QUFDdkMsdURBQXdEO0FBQ3hELHVEQUF3RDtBQUN4RCxxQ0FBc0M7QUFDdEMsNERBQTZEO0FBQzdELHdDQUEwQztBQU8xQzs7Ozs7R0FLRztBQUNILE1BQWEsVUFBVyxTQUFRLGdCQUFTO0lBQ3JDLFlBQVksTUFBaUIsRUFBRSxJQUFZLEVBQUUsS0FBc0I7UUFDL0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVwQixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxhQUFhLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDaEUsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxHQUFHLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFcEUsaUJBQWlCO1FBQ2pCLE1BQU0sVUFBVSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2pELFVBQVUsRUFBRSxVQUFVO1lBQ3RCLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxnQkFBZ0IsRUFBRSxJQUFJO1lBRXRCLGdHQUFnRztZQUNoRyxzR0FBc0c7WUFDdEcscUdBQXFHO1lBQ3JHLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxzQ0FBc0M7U0FDbkYsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFcEUsa0JBQWtCO1FBQ2xCLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUM1RSxVQUFVLEVBQUUsVUFBVTtZQUN0QixVQUFVLEVBQUUsSUFBSTtZQUNoQixNQUFNLEVBQUUsV0FBVyxFQUFFLHVEQUF1RDtTQUMvRSxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ2xCLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFFbEUsOENBQThDO1FBQzlDLE1BQU0sWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUNwRixrQkFBa0IsRUFBRTtnQkFDaEIsVUFBVSxFQUFFLGNBQWM7Z0JBQzFCLEtBQUssRUFBRSxDQUFFLFVBQVUsQ0FBRTtnQkFDckIsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRztnQkFDbkMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhO2FBQ2xFO1lBQ0QsYUFBYSxFQUFFO2dCQUNYO29CQUNJLGtCQUFrQixFQUFFO3dCQUNoQixVQUFVLEVBQUUsVUFBVSxDQUFDLHVCQUF1Qjt3QkFDOUMsb0JBQW9CLEVBQUUsVUFBVSxDQUFDLG9CQUFvQixDQUFDLFNBQVM7cUJBQ2xFO29CQUNELFNBQVMsRUFBRyxDQUFFLEVBQUMsaUJBQWlCLEVBQUUsSUFBSSxFQUFDLENBQUM7aUJBQzNDO2FBQ0o7U0FDSixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBRWxGLHVEQUF1RDtRQUN2RCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3pDLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLE1BQU0sRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNsRixJQUFJO1NBQ1AsQ0FBQyxDQUFDO1FBRUgsb0NBQW9DO1FBQ3BDLElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUMxRCxPQUFPLEVBQUUsQ0FBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFFO1lBQ3JELGlCQUFpQixFQUFFLFVBQVU7WUFDN0IsWUFBWTtZQUNaLGlCQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDO1NBQzFCLENBQUMsQ0FBQztJQUNULENBQUM7Q0FDSjtBQWpFRCxnQ0FpRUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgY2xvdWRmcm9udCA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1jbG91ZGZyb250Jyk7XG5pbXBvcnQgcm91dGU1MyA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJyk7XG5pbXBvcnQgczMgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtczMnKTtcbmltcG9ydCBzM2RlcGxveSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1zMy1kZXBsb3ltZW50Jyk7XG5pbXBvcnQgYWNtID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWNlcnRpZmljYXRlbWFuYWdlcicpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NvcmUnKTtcbmltcG9ydCB0YXJnZXRzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXJvdXRlNTMtdGFyZ2V0cy9saWInKTtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRpY1NpdGVQcm9wcyB7XG4gICAgZG9tYWluTmFtZTogc3RyaW5nO1xuICAgIHNpdGVTdWJEb21haW46IHN0cmluZztcbn1cblxuLyoqXG4gKiBTdGF0aWMgc2l0ZSBpbmZyYXN0cnVjdHVyZSwgd2hpY2ggZGVwbG95cyBzaXRlIGNvbnRlbnQgdG8gYW4gUzMgYnVja2V0LlxuICpcbiAqIFRoZSBzaXRlIHJlZGlyZWN0cyBmcm9tIEhUVFAgdG8gSFRUUFMsIHVzaW5nIGEgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24sXG4gKiBSb3V0ZTUzIGFsaWFzIHJlY29yZCwgYW5kIEFDTSBjZXJ0aWZpY2F0ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRpY1NpdGUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogQ29uc3RydWN0LCBuYW1lOiBzdHJpbmcsIHByb3BzOiBTdGF0aWNTaXRlUHJvcHMpIHtcbiAgICAgICAgc3VwZXIocGFyZW50LCBuYW1lKTtcblxuICAgICAgICBjb25zdCB6b25lID0gcm91dGU1My5Ib3N0ZWRab25lLmZyb21Mb29rdXAodGhpcywgJ1pvbmUnLCB7IGRvbWFpbk5hbWU6IHByb3BzLmRvbWFpbk5hbWUgfSk7XG4gICAgICAgIGNvbnN0IHNpdGVEb21haW4gPSBwcm9wcy5zaXRlU3ViRG9tYWluICsgJy4nICsgcHJvcHMuZG9tYWluTmFtZTtcbiAgICAgICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1NpdGUnLCB7IHZhbHVlOiAnaHR0cHM6Ly8nICsgc2l0ZURvbWFpbiB9KTtcblxuICAgICAgICAvLyBDb250ZW50IGJ1Y2tldFxuICAgICAgICBjb25zdCBzaXRlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnU2l0ZUJ1Y2tldCcsIHtcbiAgICAgICAgICAgIGJ1Y2tldE5hbWU6IHNpdGVEb21haW4sXG4gICAgICAgICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgd2Vic2l0ZUVycm9yRG9jdW1lbnQ6ICdlcnJvci5odG1sJyxcbiAgICAgICAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IHRydWUsXG5cbiAgICAgICAgICAgIC8vIFRoZSBkZWZhdWx0IHJlbW92YWwgcG9saWN5IGlzIFJFVEFJTiwgd2hpY2ggbWVhbnMgdGhhdCBjZGsgZGVzdHJveSB3aWxsIG5vdCBhdHRlbXB0IHRvIGRlbGV0ZVxuICAgICAgICAgICAgLy8gdGhlIG5ldyBidWNrZXQsIGFuZCBpdCB3aWxsIHJlbWFpbiBpbiB5b3VyIGFjY291bnQgdW50aWwgbWFudWFsbHkgZGVsZXRlZC4gQnkgc2V0dGluZyB0aGUgcG9saWN5IHRvXG4gICAgICAgICAgICAvLyBERVNUUk9ZLCBjZGsgZGVzdHJveSB3aWxsIGF0dGVtcHQgdG8gZGVsZXRlIHRoZSBidWNrZXQsIGJ1dCB3aWxsIGVycm9yIGlmIHRoZSBidWNrZXQgaXMgbm90IGVtcHR5LlxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSwgLy8gTk9UIHJlY29tbWVuZGVkIGZvciBwcm9kdWN0aW9uIGNvZGVcbiAgICAgICAgfSk7XG4gICAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdCdWNrZXQnLCB7IHZhbHVlOiBzaXRlQnVja2V0LmJ1Y2tldE5hbWUgfSk7XG5cbiAgICAgICAgLy8gVExTIGNlcnRpZmljYXRlXG4gICAgICAgIGNvbnN0IGNlcnRpZmljYXRlQXJuID0gbmV3IGFjbS5EbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZSh0aGlzLCAnU2l0ZUNlcnRpZmljYXRlJywge1xuICAgICAgICAgICAgZG9tYWluTmFtZTogc2l0ZURvbWFpbixcbiAgICAgICAgICAgIGhvc3RlZFpvbmU6IHpvbmUsXG4gICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLCAvLyBDbG91ZGZyb250IG9ubHkgY2hlY2tzIHRoaXMgcmVnaW9uIGZvciBjZXJ0aWZpY2F0ZXMuXG4gICAgICAgIH0pLmNlcnRpZmljYXRlQXJuO1xuICAgICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQ2VydGlmaWNhdGUnLCB7IHZhbHVlOiBjZXJ0aWZpY2F0ZUFybiB9KTtcblxuICAgICAgICAvLyBDbG91ZEZyb250IGRpc3RyaWJ1dGlvbiB0aGF0IHByb3ZpZGVzIEhUVFBTXG4gICAgICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24odGhpcywgJ1NpdGVEaXN0cmlidXRpb24nLCB7XG4gICAgICAgICAgICBhbGlhc0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgICBhY21DZXJ0UmVmOiBjZXJ0aWZpY2F0ZUFybixcbiAgICAgICAgICAgICAgICBuYW1lczogWyBzaXRlRG9tYWluIF0sXG4gICAgICAgICAgICAgICAgc3NsTWV0aG9kOiBjbG91ZGZyb250LlNTTE1ldGhvZC5TTkksXG4gICAgICAgICAgICAgICAgc2VjdXJpdHlQb2xpY3k6IGNsb3VkZnJvbnQuU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMV8yMDE2LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbU9yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9tYWluTmFtZTogc2l0ZUJ1Y2tldC5idWNrZXRXZWJzaXRlRG9tYWluTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpblByb3RvY29sUG9saWN5OiBjbG91ZGZyb250Lk9yaWdpblByb3RvY29sUG9saWN5LkhUVFBfT05MWSxcbiAgICAgICAgICAgICAgICAgICAgfSwgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9ycyA6IFsge2lzRGVmYXVsdEJlaGF2aW9yOiB0cnVlfV0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICAgICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0Rpc3RyaWJ1dGlvbklkJywgeyB2YWx1ZTogZGlzdHJpYnV0aW9uLmRpc3RyaWJ1dGlvbklkIH0pO1xuXG4gICAgICAgIC8vIFJvdXRlNTMgYWxpYXMgcmVjb3JkIGZvciB0aGUgQ2xvdWRGcm9udCBkaXN0cmlidXRpb25cbiAgICAgICAgbmV3IHJvdXRlNTMuQVJlY29yZCh0aGlzLCAnU2l0ZUFsaWFzUmVjb3JkJywge1xuICAgICAgICAgICAgcmVjb3JkTmFtZTogc2l0ZURvbWFpbixcbiAgICAgICAgICAgIHRhcmdldDogcm91dGU1My5SZWNvcmRUYXJnZXQuZnJvbUFsaWFzKG5ldyB0YXJnZXRzLkNsb3VkRnJvbnRUYXJnZXQoZGlzdHJpYnV0aW9uKSksXG4gICAgICAgICAgICB6b25lXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERlcGxveSBzaXRlIGNvbnRlbnRzIHRvIFMzIGJ1Y2tldFxuICAgICAgICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudCh0aGlzLCAnRGVwbG95V2l0aEludmFsaWRhdGlvbicsIHtcbiAgICAgICAgICAgIHNvdXJjZXM6IFsgczNkZXBsb3kuU291cmNlLmFzc2V0KCcuL3NpdGUtY29udGVudHMnKSBdLFxuICAgICAgICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHNpdGVCdWNrZXQsXG4gICAgICAgICAgICBkaXN0cmlidXRpb24sXG4gICAgICAgICAgICBkaXN0cmlidXRpb25QYXRoczogWycvKiddLFxuICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==