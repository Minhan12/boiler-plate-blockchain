'use strict';

const express = require('express')
const app = express()
const port = 3000

const path = require('path');
const initHyperlegerFabric = require(path.resolve( __dirname, 'hyperleger-fabric', 'init'));

require('dotenv').config();

((async () => {
  const contract = await initHyperlegerFabric();

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

})());