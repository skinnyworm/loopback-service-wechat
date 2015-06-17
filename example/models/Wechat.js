var WechatService = require('../../index')
module.exports = function(Wechat){

  WechatService.bindApi(Wechat);

  Wechat.echo = function(data, cb){
    cb(null, data);
  }

  Wechat.remoteMethod('echo', {
    accepts: [{
      arg: 'data',
      type: 'object',
      required: true,
      http: {source: 'body'}
    }],
    returns: {
      arg: "result",
      type: "object",
      root: true
    },
    http:{
      path: "/echo",
      verb: "post"
    }
  });
};
