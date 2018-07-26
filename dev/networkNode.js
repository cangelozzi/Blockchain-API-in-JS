// Express.js server, test it in http://localhost:3000/ ---- //! BLOCKCHAIN NODE
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const blockchain = require("./blockchain"); // import blockchain contructor function

const rp = require("request-promise");

const uuid = require("uuid/v1"); //! Create this NODE identity, in order to get mining reward, with uuid library
const nodeAddress = uuid()
  .split("-")
  .join(""); // stripping the dashes from this created UNIQUE string id

// ! ----------------------------------------------------------------------------------------
// ! Now we need to create a NETWORK of DECENTRALIZED NODE (API) to hold the blockchain
const port = process.argv[2]; // create more port for servers, not just the 3000, [2] 3001 is the third element of the start script in Package.json => "start": "nodemon --watch dev -e js dev/api.js 3001"
// ! ----------------------------------------------------------------------------------------

const bitcoin = new blockchain(); // create a new blockchain

// request as JSON to be parsed in the routes endpoints with bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//TODO endpoint to send back entire blockchain
app.get("/blockchain", function(req, res) {
  res.send(bitcoin);
});

//TODO endpoint to create a new transaction
app.post("/transaction", function(req, res) {
  const blockIndex = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

//TODO endpoint to mine/create a new Block
app.get("/mine", function(req, res) {
  // get previous block hash
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock.hash;

  // get nonce
  const currentBlockData = {
    transactions: bitcoin.pendingTransaction,
    index: lastBlock.index + 1
  };

  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);

  // get hash for new block
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  //! reward with some (12.5) bitcoin who mined the new block in the blockchain
  bitcoin.createNewTransaction(12.5, "00S3ND3R_R3W4RD", nodeAddress);

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  res.json({
    note: "New Block mined succesfully!",
    block: newBlock
  });
});

// endpoint to register a node to its server and broadcast node to network (other nodes) ----- IMG_1
app.post("/register-and-broadcast-node", function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
    bitcoin.networkNodes.push(newNodeUrl);

  const regNodesPromises = []; // promises returned by rp()
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: {
        newNodeUrl: newNodeUrl
      },
      json: true
    };

    regNodesPromises.push(rp(requestOptions)); // before starting the Promise request asynchronous we put all the request in an array, after we can run (below) the Promise on this array, obtaining the data
  });

  //! Asynchronous requests to all the nodes in the network to record the new node
  Promise.all(regNodesPromises)
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
        },
        json: true
      };

      return rp(bulkRegisterOptions);
    })
    .then(data => {
      res.json({
        note: "New node registered with network successfully."
      });
    });
});

// endopoint to register a the new node to the network ... NO broadcast! JUST register (avoid infinite loop)! ----- IMG_1
app.post("/register-node", (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;

  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

  if (nodeNotAlreadyPresent && notCurrentNode) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  res.json({ note: "New Node register successfully." });
});

// endpoint to register multiple nodes at once  ----- IMG_1
// this endpoint will be hit just when new node is created
app.post("/register-nodes-bulk", (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;

  // loop through all the nodes and register them to the new node
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent =
      bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) {
      bitcoin.networkNodes.push(networkNodeUrl);
    }
  });

  res.json({ note: "Bulk registration successfull!" });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}...`);
});
