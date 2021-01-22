import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

export class CdkVpcPeeringStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    cdk.Tags.of(this).add("Service", "VpcPeeringSample")
    const keyPairName = this.node.tryGetContext('keyPairName')

    //
    const vpc_1 = new ec2.Vpc(this, "Vpc_1", {
      cidr: "10.0.0.0/16",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        }
      ],
    })
    const vpc_2 = new ec2.Vpc(this, "Vpc_2", {
      cidr: "172.31.0.0/16",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        }
      ],
    })

    //
    const host_1 = new ec2.Instance(this, 'Host_1', {
      keyName: keyPairName,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc: vpc_1,
    })
    host_1.connections.allowFromAnyIpv4(ec2.Port.icmpPing())
    host_1.connections.allowFromAnyIpv4(ec2.Port.tcp(22))

    const host_2 = new ec2.Instance(this, 'Host_2', {
      keyName: keyPairName,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc: vpc_2,
    })
    host_2.connections.allowFromAnyIpv4(ec2.Port.icmpPing())
    host_2.connections.allowFromAnyIpv4(ec2.Port.tcp(22))


    //
    const peering_connection = new ec2.CfnVPCPeeringConnection(this, "Peering", {
      peerVpcId: vpc_1.vpcId,
      vpcId: vpc_2.vpcId,
    })
    new ec2.CfnRoute(this, 'vpc_1_route', {
      routeTableId: vpc_1.publicSubnets[0].routeTable.routeTableId,
      destinationCidrBlock: vpc_2.vpcCidrBlock,
      vpcPeeringConnectionId: peering_connection.ref,
    })
    new ec2.CfnRoute(this, 'vpc_2_route', {
      routeTableId: vpc_2.publicSubnets[0].routeTable.routeTableId,
      destinationCidrBlock: vpc_1.vpcCidrBlock,
      vpcPeeringConnectionId: peering_connection.ref,
    })

    //
    new cdk.CfnOutput(this, 'host_1_ip', {
      value: `host_1, public: ${host_1.instancePublicIp}, private: ${host_1.instancePrivateIp}`
    })
    //
    new cdk.CfnOutput(this, 'host_2_ip', {
      value: `host_2, public: ${host_2.instancePublicIp}, private: ${host_2.instancePrivateIp}`
    })
  }
}
