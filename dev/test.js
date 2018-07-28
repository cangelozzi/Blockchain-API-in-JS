const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();  // create Chain

const bc1 = {
  "chain": [
    {
      "index": 1,
      "timestamp": 1532810628456,
      "transactions": [],
      "nonce": 100,
      "hash": "0",
      "previousBlockHash": "0"
    },
    {
      "index": 2,
      "timestamp": 1532811350273,
      "transactions": [],
      "nonce": 18140,
      "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
      "previousBlockHash": "0"
    },
    {
      "index": 3,
      "timestamp": 1532811423968,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recipient": "edacee8092a611e88c4845c014bdb740",
          "transactionId": "9bed47a092a811e88c4845c014bdb740"
        },
        {
          "amount": "19",
          "sender": "TH353ND3R",
          "recipient": "TH3R3C1P13N7",
          "transactionId": "ba73273092a811e88c4845c014bdb740"
        },
        {
          "amount": "69",
          "sender": "TH353ND3R",
          "recipient": "TH3R3C1P13N7",
          "transactionId": "c05f443092a811e88c4845c014bdb740"
        },
        {
          "amount": "1969",
          "sender": "TH353ND3R",
          "recipient": "TH3R3C1P13N7",
          "transactionId": "c3d9ec0092a811e88c4845c014bdb740"
        }
      ],
      "nonce": 33838,
      "hash": "0000ad8dbcae81e294905bffc341c74051cc4d67a6b8a0fa8916a9da3d92a171",
      "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
      "index": 4,
      "timestamp": 1532811470879,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recipient": "edacee8092a611e88c4845c014bdb740",
          "transactionId": "c7d6e33092a811e88c4845c014bdb740"
        },
        {
          "amount": "196919",
          "sender": "TH353ND3R",
          "recipient": "TH3R3C1P13N7",
          "transactionId": "d8bce82092a811e88c4845c014bdb740"
        },
        {
          "amount": "69196919",
          "sender": "TH353ND3R",
          "recipient": "TH3R3C1P13N7",
          "transactionId": "db64af9092a811e88c4845c014bdb740"
        },
        {
          "amount": "1969196919",
          "sender": "TH353ND3R",
          "recipient": "TH3R3C1P13N7",
          "transactionId": "dd6c185092a811e88c4845c014bdb740"
        },
        {
          "amount": "691969196919",
          "sender": "TH353ND3R",
          "recipient": "TH3R3C1P13N7",
          "transactionId": "e068dd9092a811e88c4845c014bdb740"
        }
      ],
      "nonce": 25465,
      "hash": "00004ef7d0ae85698b3dd35d352fb61eec2dd328ecdeba77c3cb6fbd4ad1fc1f",
      "previousBlockHash": "0000ad8dbcae81e294905bffc341c74051cc4d67a6b8a0fa8916a9da3d92a171"
    },
    {
      "index": 5,
      "timestamp": 1532811485081,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recipient": "edacee8092a611e88c4845c014bdb740",
          "transactionId": "e3ccf02092a811e88c4845c014bdb740"
        }
      ],
      "nonce": 131360,
      "hash": "00005df46b003d2f00e69fb1e870e4b3d7ce3d517d3d3dd2817c32f945501d24",
      "previousBlockHash": "00004ef7d0ae85698b3dd35d352fb61eec2dd328ecdeba77c3cb6fbd4ad1fc1f"
    },
    {
      "index": 6,
      "timestamp": 1532811488785,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recipient": "edacee8092a611e88c4845c014bdb740",
          "transactionId": "ec43d6b092a811e88c4845c014bdb740"
        }
      ],
      "nonce": 78161,
      "hash": "00000a156783b4cb02d5dfaaca27b764d5080ed45f3d34fc893043d4a8269680",
      "previousBlockHash": "00005df46b003d2f00e69fb1e870e4b3d7ce3d517d3d3dd2817c32f945501d24"
    }
  ],
    "pendingTransaction": [
      {
        "amount": 12.5,
        "sender": "00",
        "recipient": "edacee8092a611e88c4845c014bdb740",
        "transactionId": "ee792d4092a811e88c4845c014bdb740"
      }
    ],
      "currentNodeUrl": "http://localhost:3001",
        "networkNodes": []
};

console.log("Chain valid: ",bitcoin.chainIsValid(bc1.chain));