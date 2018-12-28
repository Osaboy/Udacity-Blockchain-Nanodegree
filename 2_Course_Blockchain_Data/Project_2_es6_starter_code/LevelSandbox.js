/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

// Importing the module 'level'
const level = require('level');

// Declaring the folder path that store the data
const chainDB = './chaindata';

// Declaring the LevelSandbox class
class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this; // because we are returning a promise we will need this to be able to reference 'this' inside the Promise constructor
        return new Promise(function(resolve, reject) {
            self.db.get(key, (err, value) => {
                if(err){
                    if (err.type == 'NotFoundError') {
                        resolve(undefined);
                    }else {
                        console.log('Block ' + key + ' get failed', err);
                        reject(err);
                    }
                }else {
                    resolve(value);
                }
            });
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this; // because we are returning a promise we will need this to be able to reference 'this' inside the Promise constructor
        return new Promise(function(resolve, reject) {
            self.db.put(key, value, function(err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
                resolve(value);
            });
        });
    }

    addDataToLevelDB(value) {
        let self = this; // because we are returning a promise we will need this to be able to reference 'this' inside the Promise constructor
        let i = 0;
        return new Promise(function(resolve, reject) {
            self.db.createReadStream().on('data', function(data) {
                i++;
            }).on('error', function(err) {
                reject(err)
            }).on('close', function() {
                self.addLevelDBData(i, value);
                console.log('Block #' + i);
                resolve(true)
            });   
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this; // because we are returning a promise we will need this to be able to reference 'this' inside the Promise constructor
        var count_keys = 0; // this variable tracks the block height i.e how many keys
        
        return new Promise(function(resolve, reject) {
            self.db.createReadStream().on('data', function (key) {
              // Count each object inserted
              count_keys++;
            }).on('error', function (err) {
                // reject with error
                console.log('No blocks found', err);
                reject();
            }).on('close', function () {
                //resolve with the count value
                resolve(count_keys);
            });
        });
    }

    // Method returns all items
    getAllData() {
        let self = this;
        let dataArray = [];
        
        return new Promise(function(resolve, reject){
            self.db.createKeyStream().on('data', function (data) {
                dataArray.push(data);
            }).on('error', function (err) {
                reject(err)
            }).on('close', function () {
                resolve(dataArray);
            });
        });
    }
        
}

module.exports.LevelSandbox = LevelSandbox;