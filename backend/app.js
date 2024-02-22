const express = require('express')
const app = express()
const port = 3001

// gRPC imports
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require("fs");

process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

const loaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};

const packageDefinition = protoLoader.loadSync('lightning.proto', loaderOptions);

// Load lnd macaroon
let m = fs.readFileSync('/Users/john/.polar/networks/1/volumes/lnd/bob/data/chain/bitcoin/regtest/admin.macaroon');
let macaroon = m.toString('hex');

// Build meta data credentials
let metadata = new grpc.Metadata()
metadata.add('macaroon', macaroon)
let macaroonCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => {
  callback(null, metadata);
});

// Combine credentials
let lndCert = fs.readFileSync('/Users/john/.polar/networks/1/volumes/lnd/bob/tls.cert');
let sslCreds = grpc.credentials.createSsl(lndCert);
let credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);

// Create client
let lnrpcDescriptor = grpc.loadPackageDefinition(packageDefinition);
let lnrpc = lnrpcDescriptor.lnrpc;
let client = new lnrpc.Lightning('127.0.0.1:10002', credentials);

app.get('/', (req, res) => {
  res.send('Hello lightning world!')
})

app.get("/getinfo", function (req, res) {
  client.getInfo({}, function(err, response) {
    if (err) {
      console.log('Error: ' + err);
    }
    res.json(response);
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
