#!/bin/bash

source /home/ec2-user/.bash_profile
cd ~/starteacher
if [[ "$PWD" == *starteacher* ]]; then
    npm stop
fi
