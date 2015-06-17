var _ = require('lodash');
var crypto = require('crypto');
var ContentBuilder = require('./contentBuilder');
var async = require('async');

function Responder(options){
  if (!(this instanceof Responder)) {
    return new Responder(options);
  }

  this.conditionHandlers = [];
  this.alwaysProcessor = null;
  this.finalHandler = function(message, reply){
    reply();
  };
  return this;
}

// condition with signature function(message) and return boolean
// handler with signature function(message, reply) and return reply object
Responder.prototype.when = function(condition, handler){
  this.conditionHandlers.push({condition: condition, handler: handler});
  return this;
};

// handler with signature function(message) and return reply object
Responder.prototype.finally = function(handler){
  this.finalHandler = handler;
  return this;
};

// processor with signature function(message, callback)
Responder.prototype.always = function(processor){
  this.alwaysProcessor = processor;
  return this;
};

Responder.prototype.response = function(context, message, cb){
  var always = this.alwaysProcessor;
  var matched = _.find(this.conditionHandlers, function(v){return v.condition(message);}) || {handler: this.finalHandler};

  async.parallel({
    content: function(callback){
      matched.handler.bind(context)(message, ContentBuilder(message, callback));
    },
    always: function(callback){
      always ? always.bind(context)(message, callback) : callback(null,{});
    }
  }, cb);
};

Responder.isSignatureValid = function (signature, opts){
  return signature === Responder.createSignature(opts);
};

Responder.createSignature = function (opts){
  var arr = [opts.token, opts.timestamp, opts.nonce].sort(),
      shasum = crypto.createHash('sha1');
  shasum.update(arr.join(''));
  return shasum.digest('hex');
};

module.exports = Responder;
