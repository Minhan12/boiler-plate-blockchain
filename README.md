# boiler-plate-blockchain

Command to run network

`cd network/`

Ensure no containers are running and clear memory to start fresh
`./network.sh down`

Set path to bin
`export PATH=${PWD}/../bin:$PATH`
`export FABRIC_CFG_PATH=$PWD/../config/`

Create docker containers and create channel with CA
`./network.sh up createChannel -c mychannel -ca`

Deploy chaincode with javascript
`./network.sh deployCC -ccn custom -ccl javascript`


Run the application

`cd ../application`

Install node_modules
`npm i`

Start the server
`node server.js`

Available endpoints

GET: localhost:3000 - Return all assets on the ledger
GET/:id : localhost3000/:id - Return single asset by id
POST: localhost:3000/createAsset

