/* eslint-disable @typescript-eslint/no-use-before-define */
import { Stack, StackContext } from '@serverless-stack/resources';
import { Duration } from 'aws-cdk-lib';
import { IVpc, Peer, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import {
  Cluster,
  Compatibility,
  ContainerImage,
  EcrImage,
  FargateService,
  LogDriver,
  Protocol,
  Secret,
  TaskDefinition,
} from 'aws-cdk-lib/aws-ecs';
import { ApplicationTargetGroup } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as awsSecretsManager from 'aws-cdk-lib/aws-secretsmanager';
import { DiscoveryType, DnsRecordType, PrivateDnsNamespace, Service } from 'aws-cdk-lib/aws-servicediscovery';

import { getResourceName, SERVICE_NAME } from './commons';

const { version: appVersion } = require('../package.json');

export function AwsCdkStack({ stack }: StackContext) {
  const allowedStages: string[] = process.env.SST_AWS_CDK_STACK_ALLOWED_STAGES.split(',');
  if (!allowedStages.includes(stack.stage)) {
    console.warn(`Skip creating AwsCdkStack resources for ${stack.stage} stage`);
    return;
  }

  const vpc: IVpc = getVpc(stack);
  const ecrImage: EcrImage = getEcrImage(stack);

  const ecsCluster: Cluster = createEcsCluster(stack, vpc);
  const ecsTaskDefinition: TaskDefinition = createEcsTaskDefinition(stack, ecrImage);
  const ecsService: FargateService = createEcsService(stack, vpc, ecsCluster, ecsTaskDefinition);
}

function getVpc(stack: Stack): IVpc {
  const publicSubnetIds: string[] = process.env.AWS_PUBLIC_SUBNET_IDS.split(',');
  return Vpc.fromVpcAttributes(stack, 'VPC', {
    vpcId: process.env.AWS_VPC_ID,
    availabilityZones: [process.env.AWS_DEFAULT_REGION],
    publicSubnetIds: publicSubnetIds,
  });
}

function getEcrImage(stack: Stack): EcrImage {
  const ecsRepo = Repository.fromRepositoryName(stack, 'ECRRepo', process.env.AWS_ECR_REPOSITORY)
  return ContainerImage.fromEcrRepository(ecsRepo, appVersion);
}

function createEcsCluster(stack: Stack, vpc: IVpc): Cluster {
  return new Cluster(stack, 'ECSCluster', {
    clusterName: getResourceName(stack),
    vpc: vpc,
    containerInsights: false,
  });
}

function createEcsTaskDefinition(stack: Stack, ecrImage: EcrImage): TaskDefinition {
  const taskDef = new TaskDefinition(stack, 'ECSTaskDefinition', {
    family: getResourceName(stack, SERVICE_NAME),
    compatibility: Compatibility.FARGATE,
    cpu: '256',
    memoryMiB: '512',
  });

  const secret = awsSecretsManager.Secret.fromSecretNameV2(stack, 'Secret', process.env.AWS_RDS_DB_PASSWORD_SECRET_NAME);

  taskDef.addContainer('ECSContainer', {
    containerName: getResourceName(stack, SERVICE_NAME),
    image: ecrImage,
    environment: {
      DB_SCHEMA: process.env.AWS_RDS_DB_SCHEMA,
    },
    secrets: {
      DB_HOST: Secret.fromSecretsManager(secret, 'host'),
      DB_PORT: Secret.fromSecretsManager(secret, 'port'),
      DB_USER: Secret.fromSecretsManager(secret, 'username'),
      DB_PASSWORD: Secret.fromSecretsManager(secret, 'password'),
    },
    portMappings: [
      {
        containerPort: 3000,
        hostPort: 3000,
        protocol: Protocol.TCP,
      },
    ],
    logging: LogDriver.awsLogs({streamPrefix: getResourceName(stack, SERVICE_NAME)}),
  });

  return taskDef;
}

function createEcsService(stack: Stack, vpc: IVpc, cluster: Cluster, taskDefinition: TaskDefinition): FargateService {
  const securityGroup = new SecurityGroup(stack, 'SecurityGroup', {
    securityGroupName: getResourceName(stack, SERVICE_NAME),
    vpc: vpc,
    allowAllOutbound: true,
  });
  securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(5432));
  securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(3000));

  const service = new FargateService(stack, 'ECSService', {
    serviceName: getResourceName(stack, SERVICE_NAME),
    cluster: cluster,
    taskDefinition: taskDefinition,
    desiredCount: 1,
    assignPublicIp: true,
    securityGroups: [securityGroup],
  });

  const targetGroup = ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'AppTargetGroup', {
    targetGroupArn: process.env.AWS_RDS_TARGET_GROUP_ARN,
  });
  service.attachToApplicationTargetGroup(targetGroup);

  const privateDnsNamespace = new PrivateDnsNamespace(stack, 'CloudMapNamespace', {
    name: getResourceName(stack, SERVICE_NAME),
    vpc: vpc,
  });
  const discoveryService = new Service(stack, 'SummitService', {
    namespace: privateDnsNamespace,
    name: getResourceName(stack, SERVICE_NAME),
    dnsRecordType: DnsRecordType.A,
    discoveryType: DiscoveryType.DNS_AND_API,
    dnsTtl: Duration.seconds(10),
    customHealthCheck: {
      failureThreshold: 1,
    },
  });
  service.associateCloudMapService({
    service: discoveryService,
  });

  return service;
}
