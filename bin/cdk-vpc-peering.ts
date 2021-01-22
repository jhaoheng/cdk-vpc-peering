#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkVpcPeeringStack } from '../lib/cdk-vpc-peering-stack';

const app = new cdk.App();
new CdkVpcPeeringStack(app, 'CdkVpcPeeringStack');
