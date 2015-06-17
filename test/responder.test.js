var Responder = require('../lib/responder');
var expect = require('chai').expect;

describe('Responder', function(){

  it('should create condition handlers', function(){
    var condition=function(message){}
    var handler = function(message){}
    var ch = Responder().when(condition).do(handler).conditionHandlers;

    expect(ch.length).to.equal(1);
    expect(ch[0].condition).to.equal(condition);
    expect(ch[0].handler).to.equal(handler);
  });

  it('should create always handlers', function(){
    var always = function(message){};

    var ah = Responder()
    .when(function(message){}).do(function(message){})
    .always(always)
    .alwayProcessor;

    expect(ah).to.equal(always);
  });

  it('should create final handlers', function(){
    var finalHandler = function(message){};

    var fh = Responder()
    .when(function(message){}).do(function(message){})
    .finally().do(finalHandler)
    .finalHandler;

    expect(fh).to.equal(finalHandler);
  });

  it('should throw error when tranfer to wrong state', function(){
    var responder = Responder();
    responder.when(function(){});

    expect(function(){responder.always(function(){})}).to.throw(/still in when transtion/);
    expect(function(){responder.finally(function(){})}).to.throw(/still in when transtion/);
    expect(function(){responder.when(function(){})}).to.throw(/still in when transtion/);
  });



})
