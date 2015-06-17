var Responder = require('./wechatResponder');

module.exports = function(Model, config){

  var responder = Responder();

  config(responder);

  Model.prototype.respondEcho = function(signature, timestamp, nonce, echostr, ctx, cb){
    if (!Responder.isSignatureValid(signature, {
      token: this.respondToken,
      timestamp: timestamp,
      nonce:nonce
    })){
      return cb("Invalid signature");
    }

    var res = ctx.res;
    res.type('text/plain');
    res.send(echostr);
  };

  Model.remoteMethod('respondEcho', {
    isStatic: false,
    accepts: [{
      arg: 'signature',
      type: 'string',
      required: true,
      http: {source: 'query'}
    },{
      arg: 'timestamp',
      type: 'string',
      required: true,
      http: {source: 'query'}

    },{
      arg: 'nonce',
      type: 'string',
      required: true,
      http: {source: 'query'}

    },{
      arg: 'echostr',
      type: 'string',
      required: true,
      http: {source: 'query'}
    },{
      arg: 'ctx',
      type: 'req',
      required: true,
      http: {source: 'context'}
    }],

    returns:{
      arg: "echo",
      type: "string"
    },

    http:{
      path: "/respond",
      verb: "get"
    }
  });


  Model.prototype.respondMessage = function(signature, timestamp, nonce, data, ctx, cb){
    if (!Responder.isSignatureValid(signature, {
      token: this.respondToken,
      timestamp: timestamp,
      nonce:nonce
    })){
      return cb("Invalid signature");
    }

    var message = data.xml;
    responder.response(this, message, function(err, result){
      if (err){
        return cb(err);
      }
      if (ctx){
        var res = ctx.res;
        res.type('text/xml');
        res.send(result.content);
      }else{
        cb(null, result.content);
      }
    });
  };


  Model.remoteMethod('respondMessage', {
    isStatic: false,
    accepts: [{
      arg: 'signature',
      type: 'string',
      required: true,
      http: {source: 'query'}
    },{
      arg: 'timestamp',
      type: 'string',
      required: true,
      http: {source: 'query'}

    },{
      arg: 'nonce',
      type: 'string',
      required: true,
      http: {source: 'query'}

    },{
      arg: 'data',
      type: 'object',
      required: true,
      http: {source: 'body'}
    },{
      arg: 'ctx',
      type: 'object',
      required: true,
      http: {source: 'context'}
    }],

    returns:{
      arg: "response",
      type: "object"
    },

    http:{
      path: "/respond",
      verb: "post"
    }
  });

};
