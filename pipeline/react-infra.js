"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactSampleStack = void 0;
const core_1 = require("@aws-cdk/core");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const aws_cloudfront_1 = require("@aws-cdk/aws-cloudfront");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const aws_codebuild_1 = require("@aws-cdk/aws-codebuild");
const aws_codepipeline_1 = require("@aws-cdk/aws-codepipeline");
const aws_codepipeline_actions_1 = require("@aws-cdk/aws-codepipeline-actions");
const aws_route53_1 = require("@aws-cdk/aws-route53");
const aws_certificatemanager_1 = require("@aws-cdk/aws-certificatemanager");
const aws_route53_targets_1 = require("@aws-cdk/aws-route53-targets");
class ReactSampleStack extends core_1.Stack {
    constructor(app, id, props) {
        super(app, id, props);
        const webappBucket = new aws_s3_1.Bucket(this, 'Bucket', {
            bucketName: 'react-sample-web'
        });
        const cloudFrontOAI = new aws_cloudfront_1.OriginAccessIdentity(this, 'OAI', {
            comment: 'OAI for react sample webapp.',
        });
        const cloudfrontS3Access = new aws_iam_1.PolicyStatement();
        cloudfrontS3Access.addActions('s3:GetBucket*');
        cloudfrontS3Access.addActions('s3:GetObject*');
        cloudfrontS3Access.addActions('s3:List*');
        cloudfrontS3Access.addResources(webappBucket.bucketArn);
        cloudfrontS3Access.addResources(`${webappBucket.bucketArn}/*`);
        cloudfrontS3Access.addCanonicalUserPrincipal(cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId);
        webappBucket.addToResourcePolicy(cloudfrontS3Access);
        const hostedZone = aws_route53_1.HostedZone.fromLookup(this, 'HostedZone', {
            domainName: 'briansunter.com',
            privateZone: false
        });
        const certificate = new aws_certificatemanager_1.DnsValidatedCertificate(this, 'Certificate', {
            domainName: 'react.briansunter.com',
            hostedZone
        });
        const distribution = new aws_cloudfront_1.CloudFrontWebDistribution(this, 'Cloudfront', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: webappBucket,
                        originAccessIdentity: cloudFrontOAI
                    },
                    behaviors: [
                        { isDefaultBehavior: true }
                    ]
                }
            ],
            errorConfigurations: [
                {
                    errorCode: 404,
                    responseCode: 200,
                    responsePagePath: '/index.html',
                    errorCachingMinTtl: 0
                }
            ],
            priceClass: aws_cloudfront_1.PriceClass.PRICE_CLASS_100,
            aliasConfiguration: {
                acmCertRef: certificate.certificateArn,
                names: ['react.briansunter.com']
            }
        });
        new aws_route53_1.ARecord(this, 'Alias', {
            zone: hostedZone,
            recordName: 'react-test',
            target: aws_route53_1.RecordTarget.fromAlias(new aws_route53_targets_1.CloudFrontTarget(distribution))
        });
        const sourceOutput = new aws_codepipeline_1.Artifact();
        const buildHtmlOutput = new aws_codepipeline_1.Artifact('base');
        const buildStaticOutput = new aws_codepipeline_1.Artifact('static');
        new aws_codepipeline_1.Pipeline(this, 'Pipeline', {
            stages: [
                {
                    stageName: 'Source',
                    actions: [
                        // Where the source can be found
                        new aws_codepipeline_actions_1.GitHubSourceAction({
                            actionName: 'GitHub',
                            output: sourceOutput,
                            oauthToken: core_1.SecretValue.secretsManager('github-token'),
                            owner: 'briansunter',
                            repo: 'cdk-static',
                            trigger: aws_codepipeline_actions_1.GitHubTrigger.WEBHOOK,
                        }),
                    ]
                },
                {
                    stageName: 'Build',
                    actions: [
                        new aws_codepipeline_actions_1.CodeBuildAction({
                            actionName: 'Webapp',
                            project: new aws_codebuild_1.PipelineProject(this, 'Build', {
                                projectName: 'ReactSample',
                                buildSpec: aws_codebuild_1.BuildSpec.fromObject({
                                    version: '0.2',
                                    phases: {
                                        install: {
                                            commands: [
                                                'npm install'
                                            ]
                                        },
                                        build: {
                                            commands: 'npm run build'
                                        }
                                    },
                                    artifacts: {
                                        'secondary-artifacts': {
                                            [buildHtmlOutput.artifactName]: {
                                                'base-directory': 'dist',
                                                files: [
                                                    '*'
                                                ]
                                            },
                                            [buildStaticOutput.artifactName]: {
                                                'base-directory': 'dist',
                                                files: [
                                                    'static/**/*'
                                                ]
                                            }
                                        }
                                    }
                                }),
                                environment: {
                                    buildImage: aws_codebuild_1.LinuxBuildImage.STANDARD_4_0,
                                }
                            }),
                            input: sourceOutput,
                            outputs: [buildStaticOutput, buildHtmlOutput]
                        })
                    ]
                },
                {
                    stageName: 'Deploy',
                    actions: [
                        new aws_codepipeline_actions_1.S3DeployAction({
                            actionName: 'Static-Assets',
                            input: buildStaticOutput,
                            bucket: webappBucket,
                            cacheControl: [aws_codepipeline_actions_1.CacheControl.setPublic(), aws_codepipeline_actions_1.CacheControl.maxAge(core_1.Duration.days(1))],
                            runOrder: 1
                        }),
                        new aws_codepipeline_actions_1.S3DeployAction({
                            actionName: 'HTML-Assets',
                            input: buildHtmlOutput,
                            bucket: webappBucket,
                            cacheControl: [aws_codepipeline_actions_1.CacheControl.noCache()],
                            runOrder: 2
                        })
                    ]
                }
            ]
        });
    }
}
exports.ReactSampleStack = ReactSampleStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtaW5mcmEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWFjdC1pbmZyYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBNEU7QUFDNUUsNENBQXVDO0FBQ3ZDLDREQUFtRztBQUNuRyw4Q0FBaUQ7QUFDakQsMERBQW1GO0FBQ25GLGdFQUE2RDtBQUM3RCxnRkFNMkM7QUFDM0Msc0RBQXVFO0FBQ3ZFLDRFQUF3RTtBQUN4RSxzRUFBOEQ7QUFFOUQsTUFBYSxnQkFBaUIsU0FBUSxZQUFLO0lBRXpDLFlBQVksR0FBUSxFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUNsRCxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0QixNQUFNLFlBQVksR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQzlDLFVBQVUsRUFBRSxrQkFBa0I7U0FDL0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLEdBQUcsSUFBSSxxQ0FBb0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQzFELE9BQU8sRUFBRSw4QkFBOEI7U0FDeEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUNqRCxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0Msa0JBQWtCLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9DLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELGtCQUFrQixDQUFDLFlBQVksQ0FBQyxHQUFHLFlBQVksQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO1FBQy9ELGtCQUFrQixDQUFDLHlCQUF5QixDQUMxQyxhQUFhLENBQUMsK0NBQStDLENBQzlELENBQUM7UUFFRixZQUFZ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dFZhbHVlLCBTdGFjaywgU3RhY2tQcm9wc30gZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcbmltcG9ydCB7QnVja2V0fSBmcm9tIFwiQGF3cy1jZGsvYXdzLXMzXCI7XG5pbXBvcnQge0Nsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24sIE9yaWdpbkFjY2Vzc0lkZW50aXR5LCBQcmljZUNsYXNzfSBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWRmcm9udCdcbmltcG9ydCB7UG9saWN5U3RhdGVtZW50fSBmcm9tIFwiQGF3cy1jZGsvYXdzLWlhbVwiO1xuaW1wb3J0IHtCdWlsZFNwZWMsIExpbnV4QnVpbGRJbWFnZSwgUGlwZWxpbmVQcm9qZWN0fSBmcm9tIFwiQGF3cy1jZGsvYXdzLWNvZGVidWlsZFwiO1xuaW1wb3J0IHtBcnRpZmFjdCwgUGlwZWxpbmV9IGZyb20gXCJAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lXCI7XG5pbXBvcnQge1xuICBDYWNoZUNvbnRyb2wsXG4gIENvZGVCdWlsZEFjdGlvbixcbiAgR2l0SHViU291cmNlQWN0aW9uLFxuICBHaXRIdWJUcmlnZ2VyLFxuICBTM0RlcGxveUFjdGlvblxufSBmcm9tIFwiQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zXCI7XG5pbXBvcnQge0FSZWNvcmQsIEhvc3RlZFpvbmUsIFJlY29yZFRhcmdldH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1yb3V0ZTUzXCI7XG5pbXBvcnQge0Ruc1ZhbGlkYXRlZENlcnRpZmljYXRlfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWNlcnRpZmljYXRlbWFuYWdlclwiO1xuaW1wb3J0IHtDbG91ZEZyb250VGFyZ2V0fSBmcm9tIFwiQGF3cy1jZGsvYXdzLXJvdXRlNTMtdGFyZ2V0c1wiO1xuXG5leHBvcnQgY2xhc3MgUmVhY3RTYW1wbGVTdGFjayBleHRlbmRzIFN0YWNrIHtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoYXBwLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qgd2ViYXBwQnVja2V0ID0gbmV3IEJ1Y2tldCh0aGlzLCAnQnVja2V0Jywge1xuICAgICAgYnVja2V0TmFtZTogJ3JlYWN0LXNhbXBsZS13ZWInXG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG91ZEZyb250T0FJID0gbmV3IE9yaWdpbkFjY2Vzc0lkZW50aXR5KHRoaXMsICdPQUknLCB7XG4gICAgICBjb21tZW50OiAnT0FJIGZvciByZWFjdCBzYW1wbGUgd2ViYXBwLicsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG91ZGZyb250UzNBY2Nlc3MgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgY2xvdWRmcm9udFMzQWNjZXNzLmFkZEFjdGlvbnMoJ3MzOkdldEJ1Y2tldConKTtcbiAgICBjbG91ZGZyb250UzNBY2Nlc3MuYWRkQWN0aW9ucygnczM6R2V0T2JqZWN0KicpO1xuICAgIGNsb3VkZnJvbnRTM0FjY2Vzcy5hZGRBY3Rpb25zKCdzMzpMaXN0KicpO1xuICAgIGNsb3VkZnJvbnRTM0FjY2Vzcy5hZGRSZXNvdXJjZXMod2ViYXBwQnVja2V0LmJ1Y2tldEFybik7XG4gICAgY2xvdWRmcm9udFMzQWNjZXNzLmFkZFJlc291cmNlcyhgJHt3ZWJhcHBCdWNrZXQuYnVja2V0QXJufS8qYCk7XG4gICAgY2xvdWRmcm9udFMzQWNjZXNzLmFkZENhbm9uaWNhbFVzZXJQcmluY2lwYWwoXG4gICAgICBjbG91ZEZyb250T0FJLmNsb3VkRnJvbnRPcmlnaW5BY2Nlc3NJZGVudGl0eVMzQ2Fub25pY2FsVXNlcklkXG4gICAgKTtcblxuICAgIHdlYmFwcEJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KGNsb3VkZnJvbnRTM0FjY2Vzcyk7XG5cbiAgICBjb25zdCBob3N0ZWRab25lID0gSG9zdGVkWm9uZS5mcm9tTG9va3VwKHRoaXMsICdIb3N0ZWRab25lJywge1xuICAgICAgZG9tYWluTmFtZTogJ2JyaWFuc3VudGVyLmNvbScsXG4gICAgICBwcml2YXRlWm9uZTogZmFsc2VcbiAgICB9KTtcblxuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gbmV3IERuc1ZhbGlkYXRlZENlcnRpZmljYXRlKHRoaXMsICdDZXJ0aWZpY2F0ZScsIHtcbiAgICAgIGRvbWFpbk5hbWU6ICdyZWFjdC5icmlhbnN1bnRlci5jb20nLFxuICAgICAgaG9zdGVkWm9uZVxuICAgIH0pO1xuXG4gICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24odGhpcywgJ0Nsb3VkZnJvbnQnLCB7XG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHdlYmFwcEJ1Y2tldCxcbiAgICAgICAgICAgIG9yaWdpbkFjY2Vzc0lkZW50aXR5OiBjbG91ZEZyb250T0FJXG4gICAgICAgICAgfSxcbiAgICAgICAgICBiZWhhdmlvcnM6IFtcbiAgICAgICAgICAgIHtpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZX1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBlcnJvckNvbmZpZ3VyYXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlcnJvckNvZGU6IDQwNCxcbiAgICAgICAgICByZXNwb25zZUNvZGU6IDIwMCxcbiAgICAgICAgICByZXNwb25zZVBhZ2VQYXRoOiAnL2luZGV4Lmh0bWwnLFxuICAgICAgICAgIGVycm9yQ2FjaGluZ01pblR0bDogMFxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgcHJpY2VDbGFzczogUHJpY2VDbGFzcy5QUklDRV9DTEFTU18xMDAsXG4gICAgICBhbGlhc0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgYWNtQ2VydFJlZjogY2VydGlmaWNhdGUuY2VydGlmaWNhdGVBcm4sXG4gICAgICAgIG5hbWVzOiBbJ3JlYWN0LmJyaWFuc3VudGVyLmNvbSddXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBuZXcgQVJlY29yZCh0aGlzLCAnQWxpYXMnLCB7XG4gICAgICB6b25lOiBob3N0ZWRab25lLFxuICAgICAgcmVjb3JkTmFtZTogJ3JlYWN0LXRlc3QnLFxuICAgICAgdGFyZ2V0OiBSZWNvcmRUYXJnZXQuZnJvbUFsaWFzKG5ldyBDbG91ZEZyb250VGFyZ2V0KGRpc3RyaWJ1dGlvbikpXG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgQXJ0aWZhY3QoKTtcbiAgICBjb25zdCBidWlsZEh0bWxPdXRwdXQgPSBuZXcgQXJ0aWZhY3QoJ2Jhc2UnKTtcbiAgICBjb25zdCBidWlsZFN0YXRpY091dHB1dCA9IG5ldyBBcnRpZmFjdCgnc3RhdGljJyk7XG5cbiAgICBuZXcgUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgc3RhZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAvLyBXaGVyZSB0aGUgc291cmNlIGNhbiBiZSBmb3VuZFxuICAgICBuZXcgR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdHaXRIdWInLFxuICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignZ2l0aHViLXRva2VuJyksXG4gICAgICBvd25lcjogJ2JyaWFuc3VudGVyJyxcbiAgICAgIHJlcG86ICdjZGstc3RhdGljJyxcbiAgICAgIHRyaWdnZXI6IEdpdEh1YlRyaWdnZXIuV0VCSE9PSyxcbiAgICB9KSxcbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgbmV3IENvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdXZWJhcHAnLFxuICAgICAgICAgICAgICBwcm9qZWN0OiBuZXcgUGlwZWxpbmVQcm9qZWN0KHRoaXMsICdCdWlsZCcsIHtcbiAgICAgICAgICAgICAgICBwcm9qZWN0TmFtZTogJ1JlYWN0U2FtcGxlJyxcbiAgICAgICAgICAgICAgICBidWlsZFNwZWM6IEJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgIHZlcnNpb246ICcwLjInLFxuICAgICAgICAgICAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgICAgICAgICAgIGluc3RhbGw6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ25wbSBpbnN0YWxsJ1xuICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogJ25wbSBydW4gYnVpbGQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3NlY29uZGFyeS1hcnRpZmFjdHMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgW2J1aWxkSHRtbE91dHB1dC5hcnRpZmFjdE5hbWUgYXMgc3RyaW5nXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2Jhc2UtZGlyZWN0b3J5JzogJ2Rpc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJyonXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBbYnVpbGRTdGF0aWNPdXRwdXQuYXJ0aWZhY3ROYW1lIGFzIHN0cmluZ106IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdiYXNlLWRpcmVjdG9yeSc6ICdkaXN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzdGF0aWMvKiovKidcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgICAgICAgICAgYnVpbGRJbWFnZTogTGludXhCdWlsZEltYWdlLlNUQU5EQVJEXzRfMCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICBvdXRwdXRzOiBbYnVpbGRTdGF0aWNPdXRwdXQsIGJ1aWxkSHRtbE91dHB1dF1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3RhZ2VOYW1lOiAnRGVwbG95JyxcbiAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICBuZXcgUzNEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnU3RhdGljLUFzc2V0cycsXG4gICAgICAgICAgICAgIGlucHV0OiBidWlsZFN0YXRpY091dHB1dCxcbiAgICAgICAgICAgICAgYnVja2V0OiB3ZWJhcHBCdWNrZXQsXG4gICAgICAgICAgICAgIGNhY2hlQ29udHJvbDogW0NhY2hlQ29udHJvbC5zZXRQdWJsaWMoKSwgQ2FjaGVDb250cm9sLm1heEFnZShEdXJhdGlvbi5kYXlzKDEpKV0sXG4gICAgICAgICAgICAgIHJ1bk9yZGVyOiAxXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG5ldyBTM0RlcGxveUFjdGlvbih7XG4gICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdIVE1MLUFzc2V0cycsXG4gICAgICAgICAgICAgIGlucHV0OiBidWlsZEh0bWxPdXRwdXQsXG4gICAgICAgICAgICAgIGJ1Y2tldDogd2ViYXBwQnVja2V0LFxuICAgICAgICAgICAgICBjYWNoZUNvbnRyb2w6IFtDYWNoZUNvbnRyb2wubm9DYWNoZSgpXSxcbiAgICAgICAgICAgICAgcnVuT3JkZXI6IDJcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==