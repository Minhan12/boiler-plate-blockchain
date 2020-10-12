# Boilerplate Blockchain

**Run the network:**

Navigate to network dir:  
`cd network/`

Set path to bin:  
`export PATH=${PWD}/../bin:$PATH`  
`export FABRIC_CFG_PATH=$PWD/../config/`

Ensure no containers are running and clear memory to start fresh:  
`./network.sh down`

Create docker containers and create channel with CA:  
`./network.sh up createChannel -c mychannel -ca`

Deploy javascript chaincode:  
`./network.sh deployCC -ccn basic -ccl javascript`


**Start the application:**

Navigate to application dir:  
`cd application/`

Install packages:  
`npm install`

Start app:  
`node ./app.js`

