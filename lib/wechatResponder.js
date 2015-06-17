var _ = require('lodash');
var crypto = require('crypto');
var ejs = require('ejs');
var toXml = ejs.compile(['<xml>',
    '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
    '<CreateTime><%=createTime%></CreateTime>',
    '<% if (msgType === "device_event" && (Event === "subscribe_status" || Event === "unsubscribe_status")) { %>',
      '<% if (Event === "subscribe_status" || Event === "unsubscribe_status") { %>',
        '<MsgType><![CDATA[device_status]]></MsgType>',
        '<DeviceStatus><%=DeviceStatus%></DeviceStatus>',
      '<% } else { %>',
        '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
        '<Event><![CDATA[<%-Event%>]]></Event>',
      '<% } %>',
    '<% } else { %>',
      '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
    '<% } %>',
  '<% if (msgType === "news") { %>',
    '<ArticleCount><%=content.length%></ArticleCount>',
    '<Articles>',
    '<% content.forEach(function(item){ %>',
      '<item>',
        '<Title><![CDATA[<%-item.title%>]]></Title>',
        '<Description><![CDATA[<%-item.description%>]]></Description>',
        '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic %>]]></PicUrl>',
        '<Url><![CDATA[<%-item.url%>]]></Url>',
      '</item>',
    '<% }); %>',
    '</Articles>',
  '<% } else if (msgType === "music") { %>',
    '<Music>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
      '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>',
      '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>',
      '<ThumbMediaId><![CDATA[<%-content.thumbMediaId || content.mediaId %>]]></ThumbMediaId>',
    '</Music>',
  '<% } else if (msgType === "voice") { %>',
    '<Voice>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Voice>',
  '<% } else if (msgType === "image") { %>',
    '<Image>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Image>',
  '<% } else if (msgType === "video") { %>',
    '<Video>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
    '</Video>',
  '<% } else if (msgType === "hardware") { %>',
    '<HardWare>',
      '<MessageView><![CDATA[<%-HardWare.MessageView%>]]></MessageView>',
      '<MessageAction><![CDATA[<%-HardWare.MessageAction%>]]></MessageAction>',
    '</HardWare>',
    '<FuncFlag>0</FuncFlag>',
  '<% } else if (msgType === "device_text" || msgType === "device_event") { %>',
    '<DeviceType><![CDATA[<%-DeviceType%>]]></DeviceType>',
    '<DeviceID><![CDATA[<%-DeviceID%>]]></DeviceID>',
    '<% if (msgType === "device_text") { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
    '<% } else if ((msgType === "device_event" && Event != "subscribe_status" && Event != "unsubscribe_status")) { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
      '<Event><![CDATA[<%-Event%>]]></Event>',
    '<% } %>',
      '<SessionID><%=SessionID%></SessionID>',
  '<% } else if (msgType === "transfer_customer_service") { %>',
    '<% if (content && content.kfAccount) { %>',
      '<TransInfo>',
        '<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>',
      '</TransInfo>',
    '<% } %>',
  '<% } else { %>',
    '<Content><![CDATA[<%-content%>]]></Content>',
  '<% } %>',
  '</xml>'].join(''));






function Responder(options){
  if (!(this instanceof Responder)) {
    return new Responder(options);
  }

  this.conditionHandlers=[];
  this.finalHandler = null;
  this.alwaysProcessor = null;
  return this;
}



// condition with signature function(message) and return boolean
// handler with signature function(message) and return reply object
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
  var conditionHandler = _.find(this.conditionHandlers, function(v){return v.condition(message);}),
      handler = conditionHandler ? conditionHandler.handler : this.finalHandler,
      always = this.alwaysProcessor,
      reply = function(context, message, cb){
        if (handler){
          var response = handler.bind(context)(message);
          var content = toXml(_.merge(response, {
            toUsername: message.FromUserName,
            fromUsername: message.ToUserName,
            createTime: new Date().getTime()
          }));
          cb(null, content);
        }else{
          cb(null, '');
        }
      };

  if (always){
    // invoke always handler before reply
    always.bind(context)(message, function(err){
      if (err){return cb(err);}
      reply(context, message, cb);
    });
  }else{
    // reply to client
    reply(context, message, cb);
  }
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
