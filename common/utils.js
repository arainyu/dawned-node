var crypto = require('crypto');

exports.isFunction = function(val) {
  return typeof val === 'function';
};

exports.returnValue = function(code, data, message) {
  return {
    code: code,
    data: data,
    message: message
  };
};

exports.extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || typeof add !== 'object') return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

exports.encrypt = function(str, secret) {
  var ciphper = crypto.createCipher('aes192', sectet);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};

exports.decrypt = function(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

exports.md5 = function(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};

exports.randomString = function(size) {
  size = size || 6;
  var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var max_num = code_string.length + 1;
  var new_pass = '';
  while (size > 0) {
    new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
    size--;
  }
  return new_pass;
};