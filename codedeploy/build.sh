#!/bin/bash

source /home/ec2-user/.bash_profile
cd ~/starteacher
sudo chown ec2-user:ec2-user ~/starteacher
NODE_ENV=development npm ci
npm run build
echo "{\"id\": \"$DEPLOYMENT_ID\", \"groupName\": \"$DEPLOYMENT_GROUP_NAME\", \"groupId\": \"$DEPLOYMENT_GROUP_ID\"}" > deployment.json
