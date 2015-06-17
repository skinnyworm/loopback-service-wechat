var crypto = require('crypto');

module.exports = {
  isSignatureValid: function(signature, opts){
    var arr = [opts.token, opts.timestamp, opts.nonce].sort(),
        shasum = crypto.createHash('sha1');

    shasum.update(arr.join(''));
    return signature === shasum.digest('hex');
  },

  parseRequest: function(){
    
  }
}
