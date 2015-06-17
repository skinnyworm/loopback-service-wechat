var NotifyRequest = require('../lib/messageReceiver');
var expect = require('chai').expect;

describe("NotifyRequest", function(){
  it("can validate signature", function(){
    expect(NotifyRequest.isSignatureValid('signature', {token:'token', timestamp:'123456', nonce:'nonce'})).to.equal(false);
  });
})
