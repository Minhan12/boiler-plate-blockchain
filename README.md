# Boilerplate Blockchain

## Run the network

1. Unpack Binaries.zip within bin foldr

2. Navigate to network dir:  
`cd network/`

3. Ensure no containers are running and clear memory to start fresh:  
`./network.sh down`

4. Set path to bin:  
`export PATH=${PWD}/../bin:$PATH`  
`export FABRIC_CFG_PATH=$PWD/../config/`

5. Create docker containers and create channel with CA:  
`./network.sh up createChannel -c mychannel -ca`

6. Ensure no containers are running and clear memory to start fresh

`./network.sh down`

7. Create docker containers and create channel with CA

`./network.sh up createChannel -c mychannel -ca`

8. Deploy javascript chaincode

`./network.sh deployCC -ccn custom -ccl javascript`

9. Set environment variables

```
# Environment variables for Org1
 
 export CORE_PEER_TLS_ENABLED=true
 export CORE_PEER_LOCALMSPID="Org1MSP"
 export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
 export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
 export CORE_PEER_ADDRESS=localhost:7051
```

10. Initialize ledger with assets

```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n custom --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"InitLedger","Args":[]}'
```


11. Run example query
`peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAssets"]}'`


## Start the application

Navigate to application dir:  
`cd application/`

Install packages:  
`npm install`

Start app:  
`node ./app.js`

Available endpoints. 

GET: localhost:3000 - Return all assets on the ledger. 

GET/:id : localhost3000/:id - Return single asset by id. 

POST: localhost:3000/createAsset.
