# boiler-plate-blockchain

Command to run network

`cd network/`

Set path to bin
`export PATH=${PWD}/../bin:$PATH`
`export FABRIC_CFG_PATH=$PWD/../config/`

Ensure no containers are running and clear memory to start fresh
`./network.sh down`

Create docker containers and create channel with CA
`./network.sh up createChannel -c mychannel -ca`

Deploy chaincode with javascript
`./network.sh deployCC -ccn basic -ccl javascript`


