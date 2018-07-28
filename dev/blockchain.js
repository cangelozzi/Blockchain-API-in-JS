//TODO Blockchain function constructor, (better than Class :)

// class Blockchain {
//   constructor() {
//     this.chain = [];
//     this.newTransaction = [];
//   }
// }

const sha256 = require("sha256");
const uuid = require("uuid/v1");

// ! ----------------------------------------------------------------------------------------
// ! Now we need to acess the third parameter in the NODE script, so that each node is aware of its url
const currentNodeUrl = process.argv[3];
// ! ----------------------------------------------------------------------------------------

function Blockchain() {
  this.chain = []; // blocks will be stored in this array
  this.pendingTransaction = []; // transactions waiting to be mined


  this.currentNodeUrl = currentNodeUrl; // node url where the blockchain is running, from [3] in node script 
  this.networkNodes = [];  // array of nodes network


  //!  GENESIS BLOCK ------------------
  this.createNewBlock(100, '0', '0');  // GENESIS BLOCK without Proof of Work, with a ARBITRARY PARAMETERS.
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  // create a new Block in the chain, const since block cannot be changed
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransaction,
    nonce: nonce, //! nonce is a proof that we are creating a block legitimate with a Proof of Work
    hash: hash, //! hash is data from new transaction, which will be compressed to a hash
    previousBlockHash: previousBlockHash //! hash/data from the previous block
  };

  this.pendingTransaction = []; // clear the transactions array, ready for next block to be created.
  this.chain.push(newBlock); // push new block to chain

  return newBlock;
};

// method to return LAST BLOCK
Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};

// method for creating new TRANSACTION
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
    transactionId: uuid().split('-').join(''), // get rid of '-' that uuid creates 
  };

  return newTransaction;
};

// add transaction to pending transaction array
Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
  this.pendingTransaction.push(transactionObj);
  return this.getLastBlock()['index'] + 1;
}


// method to get a block and hash it to a "fixed length random" string ie. 'DA434DAAF69'
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData,nonce) {
  // turn ALL the data (functions arguments) into ONE STRING
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);

  // create a hash of the above string
  const hash = sha256(dataAsString);

  return hash;
};

// PROOF OF WORK method, making sure block added to the chain is legitimate
// => repeatedly hash block until it finds the correct hash (start with '0000' )
// => use currentData and previousHash
// => continously changes nonce value (+1) until it finds the correct hash with '0000' at the beginning of the hash
// => return to us the nonce value that create the corect hash
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

  // run untill we get '0000' at beginning...increasing nonce by 1
  while (hash.substring(0, 4) !== "0000") {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    // console.log(hash); 
  }

  // return the nonce value that give the hash with a beginning '0000'
  // NB => previousBlockHash, currentBlockData would return always the same hash, what makes the hash different is the nonce!
  return nonce;
};

//! CONSENSUS Method, verifying chain is valid - Returning if the chain is valid or not! ------------------------
Blockchain.prototype.chainIsValid = function (blockchain) {

  let validChain = true;
  
  // checking if all the blocks in the chain have right previousHash values
  for(var i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];

    // check 1. - re-hash if block to make sure the block is hashed as '0000'
    const blockHash = this.hashBlock(previousBlock["hash"], { transactions: currentBlock["transactions"], index: currentBlock["index"] }, currentBlock["nonce"]);

    if (blockHash.substring(0, 4) !== '0000') {
      validChain = false;
    }

    // check 2. - previousHash === Block Hash
    if (currentBlock['previousBlockHash'] !== previousBlock['hash']) {
      // chain is NOT VALID!
      validChain = false;
    }
    // console.log('previousBlockHash => ', previousBlock['hash']);
    // console.log('currentBlockHash => ', currentBlock['hash']);

  }

  // check 3. - Genesis Block check
  const genesisBlock = blockchain[0];
  const correctNonce = genesisBlock['nonce'] === 100;
  const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
  const correctHash = genesisBlock['hash'] === '0';
  const correctTransactions = genesisBlock['transactions'].length === 0;
  if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) {
    validChain = false;
  }
  
  return validChain;

};



module.exports = Blockchain;
