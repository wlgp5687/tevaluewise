#!/bin/bash

i=0
while [ $i -lt 3 ]
do
	sleep 3s
	result=$(curl -s http://localhost:5000/status)
	if [[ "$result" =~ "OK" ]]; then
		echo "OK"
		exit 0
	else
		echo "Not OK"
	fi
	i=$(( $i + 1 ))
done
echo "Failed to Deploy"
exit 1