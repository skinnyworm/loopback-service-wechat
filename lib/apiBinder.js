var _ = require('lodash');
var WechatApi = require('./wechatApi');


module.exports = function(Model){

  Model.prototype.$wechatApi = function(){
    if (!this._wechatApi){
      var self = this;
      var api = new WechatApi(self.id, self.appsecret, function getToken(cb){
        cb(null, self.apiToken);
      },
      function saveToken(token, cb){
        self.updateAttributes({apiToken: token}, cb);
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
  };

  function bind(method, options){
    Model.prototype[method] = function(){
      var api = this.$wechatApi();
      var santinizedArgs = _.filter(arguments, function(v){return v !== undefined;});
      return api[options.apiMethod].apply(api, santinizedArgs);
    };
    Model.remoteMethod(method, _.merge({isStatic:false}, _.pick(options, ['description','accepts', 'returns', 'http'])));
  }

  function bindConfig(cfg){
    _.forEach(cfg, function(options, method){
      bind(method, options);
    });
  }

  bindConfig(require('./api-token'));
  bindConfig(require('./api-user'));
  bindConfig(require('./api-group'));
  bindConfig(require('./api-menu'));
  bindConfig(require('./api-media'));
  bindConfig(require('./api-reply'));
  bindConfig(require('./api-broadcast'));
  bindConfig(require('./api-template'));
  bindConfig(require('./api-semantic'));
  bindConfig(require('./api-js'));
  bindConfig(require('./api-utils'));
};
