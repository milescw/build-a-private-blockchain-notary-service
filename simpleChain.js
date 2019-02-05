/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level                 |
|  ================================================================= |
|  Criteria:  Configure simpleChain.js with levelDB                  |
|  to persist blockchain dataset using the level Node.js library.    |
|  ==================================================================|*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}


/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		 |
|  ================================================*/

class Blockchain {
  constructor(){
    /*| ================================================================== |
      | Criteria:  Genesis block persist as the first block in the         |
      | blockchain using LevelDB.                                          |
      | ================================================================== |*/
    this.getBlockHeight().then((height) => {
      if (height === -1) {
        this.addBlock(new Block("First block in the chain - Genesis block")).then(() =>
          console.log("Genesis block added!"))
      }
    })
  }
  

 /*| ================================================================== |
   | Criteria:  addBlock(newBlock) function includes a method to store  |
   | newBlock with LevelDB.                                             |
   | ================================================================== |*/
  
  async addBlock(newBlock) {
    // Get the block height
    const height = parseInt(await this.getBlockHeight())

    // Increment block height by 1
    newBlock.height = height + 1
    newBlock.time = new Date().getTime().toString().slice(0, -3)

    // Check previous block hash
    if (newBlock.height > 0) {
      const prevBlock = await this.getBlock(height)
      newBlock.previousBlockHash = prevBlock.hash
      console.log("Previous hash: ", newBlock.previousBlockHash)
    }

    // Set block hash with SHA256 encyption using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()
    console.log("New hash: ", newBlock.hash)

    // Add the newBlock to the blockchain stored on LevelDB
    await this.addLevelDBBlock(newBlock.height, JSON.stringify(newBlock))
  }

    /*| ================================================================= |
    | Criteria:  Modify getBlock() function to retrieve a block by it's |
    | block heigh within the LevelDB chain.                             |
    | ================================================================= |*/
  
  async getBlock(blockHeight) {
    return JSON.parse(await this.getLevelDBBlock(blockHeight))
  }


 /*| ================================================================= |
   | Criteria:  Modify getBlockHeight() function to retrieve              |
   | current block height within the LevelDB chain.                       |
   | ==================================================================== |*/
  
  async getBlockHeight() {
    return await this.getLevelDBBlockHeight()
  }


  /*| ================================================================= |
    | Criteria:  Modify the validateBlock() function to validate a      |
    | block stored within levelDB.                                      |
    | ================================================================= |*/
  
  async validateBlock(blockHeight) {
    let block = await this.getBlock(blockHeight);
    let blockHash = block.hash;
    block.hash = '';
    
    let validBlockHash = SHA256(JSON.stringify(block)).toString();

    if (blockHash === validBlockHash) {
        return true;
      } else {
        console.log("Block # " + blockHeight + "invalid hash: " + blockHash + "<> " + validBlockHash);
        return false;
      }
  }


  /*| ================================================================= |
    | Criteria:  Modify the validateChain() function to validate        |
    | blockchain stored within levelDB.                                 |
    | ================================================================= |*/
  async validateChain() {
    const chain = await this.getLevelDBChain();
    let errorLog = [];

    for (var i = 0; i < chain.length - 1; i++) {
      // validate block
      if (!this.validateBlock(i)) errorLog.push(i);
      // compare blocks hash link
      let blockHash = chain[i].hash;
      let previousHash = chain[i + 1].previousBlockHash;
      if (blockHash !== previousHash) errorLog.push(i);
    }

    if (errorLog.length > 0) {
      console.log('Blockchain errors = ' + errorLog.length);
      console.log('Blockchain Blocks: ' + errorLog);
    } else {
      console.log('No blockchain errors detected');
    }
  }

  // ================================================== |
  // Return LevelDB data with these LevelDB functions = |
  // ================================================== |

  // Add block to LevelDB
  addLevelDBBlock(key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, (error) => {
        if (error) {
          reject(error)
        }
        console.log("Added block # ", key)
        resolve("Added block", key)
      })
    })
  }

  // Get an LevelDB block
  getLevelDBBlock(key) {
    return new Promise((resolve, reject) => {
      db.get(key, (error, value) => {
        if (error) {
          reject(error)
        }
        resolve(value)
      })
    })
  }

  // Get LevelDB block height
  getLevelDBBlockHeight() {
    return new Promise((resolve, reject) => {
      let height = -1

      db.createReadStream().on('data', (data) => {
        height++
      }).on('error', (error) => {
        reject(error)
      }).on('close', () => {
        resolve(height)
      })
    })
  }

  // get entire LevelDB blockchain
  getLevelDBChain() {
    return new Promise((resolve, reject) => {
      let chain = []

      db.createReadStream().on('data', (data) => {
        chain.push(JSON.parse(data.value))
      }).on('error', (error) => {
        reject(error)
      }).on('close', () => {
        resolve(chain)
      })
    })
  }
}


/* let blockchain = new Blockchain();

(function theLoop (i) {
  setTimeout(() => {
    blockchain.addBlock(new Block("Test data " + i)).then(() => {
      if (--i) {
        theLoop(i)
      }
    })
  }, 100);
})(10); */

//setTimeout(() => blockchain.validateChain(), 2000)*/