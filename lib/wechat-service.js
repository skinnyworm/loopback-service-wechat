var _ = require('lodash');
var API = require('wechat-api');

function WechatApi(model){
  var api = new API(model.id, model.appsecret,
    function getToken(cb){
      cb(null, model.accessToken);
    },
    function saveToken(token, cb){
      model.updateAttributes({accessToken: token}, cb);
    }
  );

  api.registerTicketHandle(
    function getTicket(type, cb){
      cb(null, model.ticket);
    },
    function saveTicket(type, ticket, cb){
      model.updateAttributes({ticket: ticket}, cb);
    }
  );
  return api;
}


module.exports = function(Model){
  function apiMethod(options){
    return function(){
      var appid = arguments[0],
          cb = Array.prototype.slice.call(arguments, -1)[0],
          args = Array.prototype.slice.call(arguments, 1),
          santinizedArgs = args.filter(function(e){return e !== undefined});

      Model.findById(appid, function(err, model){
        if (err) return cb(err);
        if (!model) return cb();
        var api = WechatApi(model)
        api[options.apiMethod].apply(api, santinizedArgs);
      });
    };
  };

  function addToModel(apiCfg){
    _.forEach(apiCfg, function(options, method){
      Model[method] = apiMethod(_.pick(options, ['apiMethod']));
      Model.remoteMethod(method, _.pick(options, ['description','accepts', 'returns', 'http']));
    });
  }

  addToModel(require('./api-token'));
  addToModel(require('./api-user'));
  addToModel(require('./api-user-group')); //deleteGroup causing system error
  addToModel(require('./api-url'));
  addToModel(require('./api-js'));
}
