
var number_map = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9
};
var config = require('../../config'); // get our config file

function string_to_hash() {
  var string = process.env.id_org || config.id_org;
  var properties = string.split(', ');
  var obj = {};
  properties.forEach(function(property) {
    var tup = property.split(':');
    obj[tup[0]] = tup[1];
  });
  return obj;
}

function clean_phrase(req) {
  var phrase = req.params.url.split(/\s+/).map(function(e) {
    return number_map[e] ? number_map[e] : e;
  });
  return phrase.join('').toLowerCase();
}

function is_image(image_url) {
  return image_url.match(/(jpg|png|gif)$/);
}

function mask(long_string) {
  return long_string.replace(/...................................../, '*************');
}

exports.string_to_hash = string_to_hash;
exports.clean_phrase = clean_phrase;
exports.is_image = is_image;
exports.mask = mask;
