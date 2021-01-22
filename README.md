![img](./assets/cdk-peering.svg)

# deploy
- `cdk deploy -c keyPairName=...`

![deploy](./assets/deploy.png)

# validate

1. `ssh -i $KeyPairName ec2-user@$Host_1_Public_IP`
2. `ping $Host_2_Private_IP`

![validate](./assets/validate.png)

# destroy

- `cdk destroy`