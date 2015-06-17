var _ = require('lodash');
var request = require('request');
var API = require('wechat-api');

// type: 'image' | 'voice' | 'video' | 'thumb'
API.prototype._uploadMedia = function (req, type, cb) {
  var url = this.prefix + 'media/upload?access_token=' + this.token.accessToken + '&type=' + type;
  this._uploadFile(req, url, cb);
};

// type: 'image' | 'voice' | 'video' | 'thumb'
API.prototype._uploadMaterial = function (req, type, cb) {
  var url = this.prefix + 'material/add_material?access_token=' + this.token.accessToken + '&type=' + type;
  this._uploadFile(req, url, cb);
};

API.prototype._uploadFile = function(req, url, cb){
  req.pipe(request.post(url, function(err, res, data){
    if(err){
      cb(err);
    }else{
      cb(null, JSON.parse(data));
    }
  }));
};

API.prototype.broadcast = function(content, cb){
  var type = content.type;
  if(['mpnews', 'text', 'voice', 'image','mpvideo'].indexOf(type) < 0){
    return cb("Invalid broadcast type");
  }

  var data = {msgtype: type};
  data[type] = content.data;
  this.massSend(data, content.receivers, cb);
};

API.prototype.broadcastPreview = function(openid, content, cb){
  this.preRequest(this._broadcastPreview, arguments);
};

API.prototype._broadcastPreview = function (openid, content, cb) {
  var type = content.type;
  if(['mpnews', 'text', 'voice', 'image','mpvideo'].indexOf(type) < 0){
    return cb("Invalid preview type");
  }
  var url = this.prefix + 'message/mass/preview?access_token=' + this.token.accessToken;
  this._sendMessageToUser(url, openid, type, content, cb);
};


API.prototype.reply = function(openid, data, cb){
  this.preRequest(this._reply, arguments);
};

API.prototype._reply = function(openid, content, cb){
  var type = content.type;
  if(['articles', 'text', 'voice', 'image','video', 'music'].indexOf(type) < 0){
    return cb("Invalid reply type");
  }

  var url = this.prefix + 'message/custom/send?access_token=' + this.token.accessToken;
  this._sendMessageToUser(url, openid, type, content, cb);
};

API.prototype._sendMessageToUser = function(url, openid, type, content, cb){
  var data = {
    touser: openid,
    msgtype: type
  };

  data[type] = content.data;
  this.request(url, jsonRequest(data), wrapper(cb));
};


function jsonRequest(data) {
  return {
    dataType: 'json',
    data: data,
    type: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
}

function wrapper(callback) {
  return function (err, data, res) {
    callback = callback || function () {};
    if (err) {
      err.name = 'WeChatAPI' + err.name;
      return callback(err, data, res);
    }
    if (data && data.errcode) {
      err = new Error(data.errmsg);
      err.name = 'WeChatAPIError';
      err.code = data.errcode;
      return callback(err, data, res);
    }
    callback(null, data, res);
  };
}

// // fixing a bug updateNewsMaterial
// API.prototype.updateNewsMaterial = function (news, callback) {
//   this.preRequest(this._updateNewsMaterial, arguments);
// };
//
// API.prototype._updateNewsMaterial = function (news, callback) {
//   var url = this.prefix + 'material/update_news?access_token=' + this.token.accessToken;
//   var content = {
//     dataType: 'json',
//     type: 'POST',
//     data: news,
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };
//   this.request(url, content, callback);
// };


module.exports = API;
