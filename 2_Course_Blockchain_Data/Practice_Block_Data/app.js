/* Using BlockExplorer API to search Block Data */
// require the module
const be = require('blockexplorer');
// Explore Block Data function
function getBlock(index) {
   //Add your code here
   // Start by requesting the hash
   // Then, request the block and use console.log.
  var hash = be.blockIndex(index).then((result) => {
    console.log(result);
   let hashAux = JSON.parse(result).blockHash;
    console.log(hashAux);
    var block = be.block(hashAux).then((result) => {
      console.log(result)
    }).catch((err) => {
    throw err
    });
  }).catch((err) => {
    throw err
  }); 

}

(function theLoop (i) {
 setTimeout(function () {
        getBlock(i);
        i++;
  if (i < 3) theLoop(i);
 }, 3600);
  })(0);