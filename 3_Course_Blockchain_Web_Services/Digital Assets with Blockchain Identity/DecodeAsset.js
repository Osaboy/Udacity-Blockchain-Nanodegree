// Require file system access
fs = require('fs');

// Read file buffer 
imgReadBuffer = fs.readFileSync('encodedHexImage.jpg');

// Decode hex
var imgHexDecode = new Buffer(imgReadBuffer, 'hex');

// Save decoded file file system 
fs.writeFileSync('decodedHexImage.jpg', imgHexDecode);
