var arDrone = require('ar-drone'),
    extend = require('extend');

module.exports = ArdroneDriver = function(ip){
  this.type = 'ardrone';
  this.name = 'Ardrone ' + ip;
  this.data = {
    ip : ip,
    movementSpeed : 0.5,
    movementTime : 1000
  };
  this.state = 'landed';
  this._client = null;
};


ArdroneDriver.prototype.init = function(config){
  config
    .when('landed', { allow: ['take-off'] })
    .when('flying', { allow: ['stop','land','front','back','up','down','left','right'] })
    .map('stop',this.stop)
    .map('take-off', this.takeOff)
    .map('land', this.land)
    .map('up', this.up)
    .map('down', this.down)
    .map('left', this.left)
    .map('right', this.right)
    .map('front',this.front)
    .map('back',this.back);
  
  this._client = arDrone.createClient({ip : this.data.ip});
  this._cleint.on('navdata',this.onNavData.bind(this));
};

ArdroneDriver.prototype.onNavData = function(data){
  extend(this.data,data);
};

ArdroneDriver.prototype.takeOff = function(cb){
  this._client.takeOff(function(){
    self.state = 'flying';
    cb();
  });
};

ArdroneDriver.prototype.land = function(cb){
  this._client.land(function(){
    self.state = 'landed';
    cb();
  });
};

ArdroneDriver.prototype._timedCall = function(func,cb){
  var self = this;
  this._cleint[func](this.data.movementSpeed);
  setTimeout(function(){
    self._client[func](0);
    cb();
  },this.data.movementTime);
};

ArdroneDriver.prototype.up = function(cb){
  this._timedCall('up',cb);
};

ArdroneDriver.prototype.down = function(cb){
  this._timedCall('down',cb);
};

ArdroneDriver.prototype.right = function(cb){
  this._timedCall('right',cb);
};

ArdroneDriver.prototype.left = function(cb){
  this._timedCall('left',cb);
};

ArdroneDriver.prototype.front = function(cb){
  this._timedCall('front',cb);
};

ArdroneDriver.prototype.back = function(cb){
  this._timedCall('back',cb);
};
