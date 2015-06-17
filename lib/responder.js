function Responder(options){
  if (!(this instanceof Responder)) {
    return new Responder(options);
  }

  this.conditionHandlers=[];
  this.finalHandler = null;
  this.alwayProcessor = null;
  this._flag = null;
  return this;
}

function transit(callback){
  return {
    do: function(handler){
      return callback(handler);
    }
  }
}

/**
 Create a condition function with signature function(message)
**/
function conditionFunc(conditions){
  return function(message){

  }
}

Responder.prototype.when = function(condition){
  var self = this;
  return this.state('when', function(handler){
    self.conditionHandlers.push({condition: condition, handler: handler});
  });
}

Responder.prototype.finally = function(){
  var self = this;
  return this.state('when', function(handler){
    self.finalHandler = handler;
  });
}

Responder.prototype.always = function(alwayProcessor){
  if (this._flag){
    throw "still in "+ this._flag +" transtion";
  }
  this.alwayProcessor = alwayProcessor;
  return this;
}

Responder.prototype.state= function(state, action){
  if (this._flag){
    throw "still in "+ this._flag +" transtion";
  }

  this._flag = state;
  var self = this;

  return transit(function(handler){
    action(handler)
    self._flag = null;
    return self;
  });
}

module.exports = Responder;
