'use strict';

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

const path = require('path');
const initHyperlegerFabric = require(path.resolve( __dirname, 'hyperleger-fabric', 'init'));

require('dotenv').config();

const prettyJSONString = (inputString) => (JSON.stringify(JSON.parse(inputString), null, 2));

// bodyParser
app.use(bodyParser.json());

((async () => {
  const contract = await initHyperlegerFabric();

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

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

})());