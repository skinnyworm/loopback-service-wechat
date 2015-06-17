var WechatService = require('../../index')

module.exports = function(Wechat){

  WechatService.bindApi(Wechat);

  WechatService.bindResponder(Wechat, function(responder){

    responder.always(function(message, cb){
      this.messages.create({content: message}, cb);
    });

    responder.finally(function(message){
      return {
        msgType: 'text',
        content: "Received :)"
      };
    });
  });

};
