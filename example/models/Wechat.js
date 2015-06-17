var WechatService = require('../../index')

module.exports = function(Wechat){

  WechatService.bindApi(Wechat);

  Wechat.prototype.receiveMsgEcho=function(signature,timestamp,nonce,echostr, ctx, cb){
    var valid = WechatService.messageReceiver.isSignatureValid(signature, {
      token: this.receiverToken,
      timestamp: timestamp,
      nonce:nonce
    })

    if (valid){
      var res = ctx.res;
      res.type('text/plain');
      res.send(echostr);
    }else{
      cb("Invalid request");
    }
  },

  Wechat.remoteMethod('receiveMsgEcho', {
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
      path: "/receive",
      verb: "get"
    }
  });




  Wechat.prototype.receiveMsg=function(signature,timestamp,nonce, data, ctx, cb){
    if (!WechatService.messageReceiver.isSignatureValid(signature, {
      token: this.receiverToken,
      timestamp: timestamp,
      nonce:nonce
    })){
      return cb("Invalid signature");
    }

    var app = Wechat.app;
    var res = ctx.res;
    app.models.Message.create({wechatId: this.id, content: data}, function(err, result){
      res.type('text/xml');
      res.send('');
    });

  }

  Wechat.remoteMethod('receiveMsg', {
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
      type: 'req',
      required: true,
      http: {source: 'context'}
    }],

    returns:{
      arg: "result",
      type: "string"
    },

    http:{
      path: "/receive",
      verb: "post"
    }
  });


};
