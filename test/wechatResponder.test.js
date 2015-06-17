var WechatResponder = require('..').WechatResponder;
var expect = require('chai').expect;



describe('WechatResponder', function(){

  var responder;

  beforeEach(function(){
    responder = WechatResponder();
  })

  it('should create condition handlers', function(){
    var condition=function(message){}
    var handler = function(message){}
    var ch = responder.when(condition, handler).conditionHandlers;

    expect(ch.length).to.equal(1);
    expect(ch[0].condition).to.equal(condition);
    expect(ch[0].handler).to.equal(handler);
  });

  it('should create final handlers', function(){
    var handler = function(message){}
    var fh = responder.finally(handler).finalHandler;

    expect(fh).to.equal(handler);
  });

  it('should create always processor', function(){
    var processor=function(message){}
    var ap = responder.always(processor).alwaysProcessor;

    expect(ap).to.equal(processor);
  });

  it("can validate signature", function(){
    expect(WechatResponder.isSignatureValid('signature', {token:'token', timestamp:'123456', nonce:'nonce'})).to.equal(false);
  });


  // signature: d575c50d45c00ce5c05d0f68be88de4bbc1b4370
  // timestamp: 123456
  // nonce: nonce
  // respondToken: 123456
  // id: wxa1ed259569e08093
  describe('response function', function(){

    it('should always do something then response something', function(done){
      var message = "a message";

      responder
      .always(function(message, cb){
        expect(message).to.equal("a message");
        cb(null, 'result');
      });

      responder.response(this, message, function(err, result){
        expect(err).to.equal(null);
        // response with empty given no handler registered
        expect(result.content).to.equal('');
        done();
      });
    });

    it('should response xml content', function(done){
      var message = {
        FromUserName: 'fromUser',
        ToUserName: 'toUser'
      }

      responder
      .finally(function(msg, reply){
        expect(msg).to.equal(message);
        reply.text('content');
      });

      responder.response(message, message, function(err, result){
        expect(err).to.equal(null);
        // console.log(result);
        done();
      });
    });


  });
})
