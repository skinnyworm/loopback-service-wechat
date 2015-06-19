var WechatService = require('../../index')

module.exports = function(Wechat){

  WechatService.bindApi(Wechat);

  WechatService.bindResponder(Wechat, function(responder){
    responder
    .when({MsgType: 'location'}, function(message, reply){
      
    })
    .always(function(message, cb){
      this.messages.create({content: message}, cb);
    })
    .finally(function(message, reply){
      reply.text("Received :p")
    });
  });
};
