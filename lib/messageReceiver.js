var crypto = require('crypto');

module.exports = {
  isSignatureValid: function(signature, opts){
    var arr = [opts.token, opts.timestamp, opts.nonce].sort(),
        shasum = crypto.createHash('sha1');

    shasum.update(arr.join(''));

    var digest = shasum.digest('hex');
    console.log(digest);

    return signature === digest;
  }
}
