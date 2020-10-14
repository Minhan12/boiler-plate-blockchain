const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require(path.resolve( __dirname, 'CAUtil.js'));
const { buildCCPOrg1, buildWallet } = require(path.resolve( __dirname, 'AppUtil.js'));

const channelName = 'mychannel';
const chaincodeName = 'custom';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

(async () => {
  // initialize express
  const app = express();
  module.exports = {};

  // CORS headers
  app.use(cors());

  // bodyParser
  app.use(bodyParser.json());


  async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
            const contract = network.getContract(chaincodeName);
            
            // Register endpoints
            app.get('/', async (req, res) => {
                let result = await contract.evaluateTransaction('GetAllAssets')
                res.send(prettyJSONString(result));
              });

            app.get('/:asset', async (req, res) => {
                let asset = req.params.asset;
                let result = await contract.evaluateTransaction('ReadAsset', asset);
                res.send(prettyJSONString(result));
            });

            app.post('/createAsset', async (req, res) => {
                let asset = {
                    id: req.body.id,
                    color: req.body.color,
                    size: req.body.size,
                    owner: req.body.owner,
                    appraisedValue: req.body.appraisedValue,
                };

                let result = await contract.submitTransaction('CreateAsset', asset.id, asset.color, asset.size, asset.owner, asset.appraisedValue);
                res.send(prettyJSONString(result));
            });
        } finally {
            console.log('succes');
        }
    }
        
        catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
        }
    }
  
  // Run server
  app.listen(3000, () => {
    console.log('Listening on http://localhost:' + 3000)
    main();
  });

  module.exports = app;
})()