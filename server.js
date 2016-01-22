var express       = require("express");
var app           = express();
var port          = process.env.PORT || 3000;

var util          = require('./app/models/utility')
var config        = require('./config'); // get our config file
var bitly         = require('bitly')
// Bitly key
var bitly_token   = process.env.bitly_token || config.bitly_token
var token         = new bitly(bitly_token) 
var fs            = require('fs');
var sha           = require('sha256')
var request       = require('request')
var request_json  = require('request-json');

var client        = request_json.createClient('http://blockchain.info/');
var bitcore       = require('bitcore-lib');
var privateKey    = new bitcore.PrivateKey();

// Image will be stored here before being hashed
var file_name     = 'temp.txt';
var path          = require("path");
var temp_dir      = path.join(process.cwd(), 'temp/');
var getHash       = require('hash-stream')

// Look up of public address to organization
var id_org        = util.string_to_hash();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Routes
app.get("/", function(req, res){
  res.render('index',  {});
});

// Fetch long url associated with bitly mnemonic 
// download image and hash it before searching its public address on the blockchain
app.get("/get-hash/:url", function(req, res){
  // Remove spaces, lowercase everything, and change number words to integers
	phrase = util.clean_phrase(req)
  token.expand('http://bitly.com/' + phrase).then(function(response){
 
    // No long url is found
    if(!!response.data.expand[0].error){
      res.json([false, false ])
    }else{
      if (!fs.existsSync(temp_dir))
          fs.mkdirSync(temp_dir);

      img_url = response.data.expand[0].long_url
      request(img_url).pipe(fs.createWriteStream(temp_dir + '/' + file_name)).on('finish',function () {

        getHash(temp_dir + '/' + file_name, 'sha256', function (err, hash) {
          privateKey      = hash.toString('hex')
          privateKey      = new bitcore.PrivateKey(privateKey);
          public_key      = bitcore.PublicKey(privateKey)
          public_address  = bitcore.Address.fromPublicKey(public_key).toString()
          file_kind       = response.data.expand[0].long_url.split('.').pop()

          client.get('address/' + public_address + '?format=json', function(err, xxx, body) {
            // There are no transactions for this address
            if(body.txs.length==0){
              res.json([false, false])
             // document is not an image 
            }else{
              // last transaction with public address that represents image
              last   = body.txs[0].inputs.length
              payer  = body.txs[0].inputs[last-1].prev_out.addr
              // transaction date
              x_date = body.txs[0].time

              // Return false if payer address does not match one of the orgs.
              if(!util.is_image(img_url)){
                res.json([false, !!id_org[payer], '' ])
              }else{ // Success. Image is of an approved person
                dt = new Date(parseInt(x_date + '000'))
                x_date = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();

                json_r = [
                  img_url,
                  !!id_org[payer],
                  id_org[payer],
                  file_kind,
                  // Don't display full private / public key 
                  util.mask(privateKey.toString()),
                  util.mask(public_key.toString()), 
                  public_address,
                  x_date
                ]
                res.json(json_r)
             }
            }
          });
        })
      })
    }
  return
  })
});

app.listen(port);

console.log("Listening on port " + port);



