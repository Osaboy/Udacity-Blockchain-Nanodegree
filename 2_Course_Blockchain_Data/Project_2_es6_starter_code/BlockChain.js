/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.db = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Auxiliar method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock() {
        // Add your code here
        let self = this;  
        self.db.getBlocksCount().then((result) => {
            //console.log("get block count ="+result);
            if (result == 0) {
                self.addBlock(new Block.Block("First block in the chain - Genesis block"));
            }               
        })
        .catch(function(err) {
             reject(err);
        })
    }

    // Get block height, it is auxiliar method that return the height of the blockchain
    getBlockHeight() {
        // Add your code here
        let self = this;
        return new Promise(function(resolve, reject) {
          self.db.getBlocksCount().then((result) => {
              resolve(result);
          })
          .catch(function(err){
              reject(err);
          });
        });
    }

    // Add new block
    addBlock(block) {
        // Add your code here
        let self = this;
        return new Promise(function(resolve, reject) { 
            self.db.getBlocksCount().then((result) => {
                // console.log("result ="+result);
                if (result == 0) {
                    block.height = 0;
                    block.time = new Date().getTime().toString().slice(0,-3);
                    block.previousBlockHash = "";
                    block.hash = SHA256(JSON.stringify(block)).toString();
                    self.db.addLevelDBData(block.height, JSON.stringify(block).toString());
                    resolve(block);
                } 
                else {
                    // console.log("adding new blocks");
                    self.db.getLevelDBData(result-1).then((previousBlock) => {
                        block.height = result;
                        block.time = new Date().getTime().toString().slice(0,-3);
                        block.previousBlockHash = JSON.parse(previousBlock).hash;
                        block.hash = SHA256(JSON.stringify(block)).toString();
                        self.db.addDataToLevelDB(JSON.stringify(block).toString());
                        resolve(block);
                    })
                    .catch(function(err) {
                        reject(err);
                    })
                }
            })
            .catch(function (err) {
                reject(err);
            });
        });

    }

    // Get Block By Height
    getBlock(height) {
        // Add your code here getLevelDBData(key){
        let self = this;
        return new Promise((resolve, reject) => {
            self.db.getLevelDBData(height).then((block) => {
                resolve(block);
            })
            .catch(function(err) {
                reject(err);
            });
                
        });
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // Add your code here
        let self = this;
        return new Promise(function(resolve,reject) {
            self.db.getLevelDBData(height).then((block) => {
                // get block object
                let checkblock = JSON.parse(block);
                // get block hash
                let blockhash = checkblock.hash;
                // remove block hash to test block integriy
                checkblock.hash = "";
                // generate block hash
                let validBlockHash = SHA256(JSON.stringify(checkblock)).toString();
                checkblock.hash = blockhash;
            
                if(checkblock.hash === validBlockHash) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            })
            .catch(function(err) {
                reject(err);
            });
        });
    }

    // Validate Blockchain
    validateChain() {
        // Add your code here
        let self = this;
        let errorlog = [];
        return new Promise(function(resolve,reject) {
            self.db.getBlocksCount().then((height) => {
                // loop through each block from block one used to compare pervious hash
                for (var a = 0; a < height; a++) {
                    // console.log("var a is " + a); //debugging purposes
                    if (!self.validateBlock(a)) {
                        errorlog.push(height);
                        console.log('Block errors detected at' +height);
                    }
                }
                resolve(errorlog);    
            })
            .catch(function(err) {
              reject(err);
            })
        });
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                console.log(blockModified);
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }

    // Utility 
   
}

module.exports.Blockchain = Blockchain;