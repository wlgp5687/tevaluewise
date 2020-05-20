#!/bin/bash

cd ~/starteacher
at now + 2 minutes <<< $'sudo service codedeploy-agent restart'
