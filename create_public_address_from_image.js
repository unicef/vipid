// Generate a public address from an image file.
var bitcore = require('bitcore-lib');
var getHash = require('hash-stream')
var dir     = 'public/images'
var fs            = require('fs');
// Generate public address for first image in directory
fs.readdir('public/images', (err, data) => {
	if (err) throw err;
	first = data.filter(function(e){
		return e.match(/(jpg|png|gif)$/)
	})[0]

	getHash('public/images/' + first, 'sha256', function (err, hash) {
		privateKey      = hash.toString('hex')
		privateKey      = new bitcore.PrivateKey(privateKey);
		public_key      = bitcore.PublicKey(privateKey)
		public_address  = bitcore.Address.fromPublicKey(public_key).toString()    
		console.log("Public address for image: " + public_address)
	})
});