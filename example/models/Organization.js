module.exports = function(Organization){

  Organization.prototype.extra = function(cb){
    cb(null, this.name + ".extra");
  }
  Organization.prototype.extra.shared=true;
  Organization.prototype.extra.isStatic=false;
  Organization.prototype.extra.accepts=[],
  Organization.prototype.extra.returns={
    arg: "result",
    type: "string",
    root:true
  }
  Organization.prototype.http={
    path:'/extra',
    verb: 'get'
  }
};
