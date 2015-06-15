var _ = require('lodash');
var WechatApi = require('./wechatApi');


module.exports = function(Model){

  Model.prototype.$wechatApi = function(){
    if (!this._wechatApi){
      var self = this;
      var api = new WechatApi(self.id, self.appsecret, function getToken(cb){
        cb(null, self.accessToken);
      },
      function saveToken(token, cb){
        self.updateAttributes({accessToken: token}, cb);
      });

      api.registerTicketHandle(
        function getTicket(type, cb){
          cb(null, self.ticket);
        },
        function saveTicket(type, ticket, cb){
          self.updateAttributes({ticket: ticket}, cb);
        }
      );

      this._wechatApi = api;
    }
    return this._wechatApi;
  }



  function wrap(method, options){
    Model.prototype[method] = function(){
      var api = this.$wechatApi();
      var santinizedArgs = _.filter(arguments, function(v){return v !== undefined});
      return api[options.apiMethod].apply(api, santinizedArgs)
    }
    Model.remoteMethod(method, _.merge({isStatic:false}, _.pick(options, ['description','accepts', 'returns', 'http'])));
  }

  function wrapAll(cfg){
    _.forEach(cfg, function(options, method){
      wrap(method, options);
    });
  }

  wrapAll(require('./api-token'));
  wrapAll(require('./api-user'));
  wrapAll(require('./api-group'));
  wrapAll(require('./api-menu'));
  wrapAll(require('./api-media'));
  wrapAll(require('./api-reply'));
  wrapAll(require('./api-broadcast'));
  wrapAll(require('./api-template'));
  wrapAll(require('./api-semantic'));
  wrapAll(require('./api-js'));
  wrapAll(require('./api-utils'));
}
