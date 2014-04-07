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
  this._streams = {};
};


function throttle(time,func){
  var lastEvent = 0;
  return function(){
    var now = new Date().getTime();
    if(now-lastEvent > time){
      func.apply(this,arguments);
      lastEvent = now;
    }
  };
}

ArdroneDriver.prototype.init = function(config){
  config
    .when('landed', { allow: ['take-off','blink'] })
    .when('flying', { allow: ['stop','land','front','back','up','down','left','right','flip','blink','clockwise','counter-clockwise'] })
    .map('stop',this.stop)
    .map('take-off', this.takeOff)
    .map('land', this.land)
    .map('up', this.up)
    .map('down', this.down)
    .map('left', this.left)
    .map('right', this.right)
    .map('front',this.front)
    .map('back',this.back)
    .map('blink',this.blink)
    .map('flip',this.flip)
    .map('clockwise',this.clockwise)
    .map('counter-clockwise',this.counterClockwise)
    .stream('battery-level',this.onBatteryLevelStream)
    .stream('gyroscope-x',this.onGyroscopeXStream)
    .stream('gyroscope-y',this.onGyroscopeYStream)
    .stream('gyroscope-z',this.onGyroscopeZStream)
    .stream('accelerometers-x',this.onAccelXStream)
    .stream('accelerometers-y',this.onAccelYStream)
    .stream('accelerometers-z',this.onAccelZStream);
  
  this._client = arDrone.createClient({ip : this.data.ip});
  this._client.disableEmergency();
  this._client.config('general:navdata_demo', 'FALSE');
  this._client.on('navdata',throttle(50,this.onNavData.bind(this)));
};

ArdroneDriver.prototype.onBatteryLevelStream = function(stream){
  this._streams['battery-level'] = stream;
};

ArdroneDriver.prototype.onGyroscopeXStream = function(stream){
  this._streams['gyroscope-x'] = stream;
};

ArdroneDriver.prototype.onGyroscopeYStream = function(stream){
  this._streams['gyroscope-y'] = stream;
};

ArdroneDriver.prototype.onGyroscopeZStream = function(stream){
  this._streams['gyroscope-z'] = stream;
};

ArdroneDriver.prototype.onAccelXStream = function(stream){
  this._streams['accelerometers-x'] = stream;
};

ArdroneDriver.prototype.onAccelYStream = function(stream){
  this._streams['accelerometers-y'] = stream;
};

ArdroneDriver.prototype.onAccelZStream = function(stream){
  this._streams['accelerometers-z'] = stream;
};


ArdroneDriver.prototype.onNavData = function(data){
  if(data.lowBattery == 1){
    console.log('low battery')
    this.state = 'low-battery';
    this.land();
  }else {
    if(data.droneState.flying == 0)
      this.state = 'landed';
    else
      this.state = 'flying';
  }
  
  if(data.rawMeasures){
    this._streams['battery-level'].emit('data',data.rawMeasures.batteryMilliVolt);
  }

  if(data.physMeasures){
    this._streams['gyroscope-x'].emit('data',data.physMeasures.gyroscopes.x);
    this._streams['gyroscope-y'].emit('data',data.physMeasures.gyroscopes.y);
    this._streams['gyroscope-z'].emit('data',data.physMeasures.gyroscopes.z);
    
    this._streams['accelerometers-x'].emit('data',data.physMeasures.accelerometers.x);
    this._streams['accelerometers-y'].emit('data',data.physMeasures.accelerometers.y);
    this._streams['accelerometers-z'].emit('data',data.physMeasures.accelerometers.z);
  }

};

ArdroneDriver.prototype.blink = function(cb){
  this._client.animateLeds('doubleMissile', 5, 2);
  cb();
};

ArdroneDriver.prototype.flip = function(cb){
  this._client.animate('flipLeft', 1000);
  cb();
};


ArdroneDriver.prototype.takeOff = function(cb){
  this._client.takeoff(function(){
    cb();
  });
};

ArdroneDriver.prototype.land = function(cb){
  var self = this;
  this._client.land(function(){
    self.state = 'landed';
    cb();
  });
};

ArdroneDriver.prototype.stop = function(cb){
  this._client.stop(function(){
    cb();
  });
};


ArdroneDriver.prototype._timedCall = function(func,cb){
//  this.state = func;
  cb();
  var self = this;
  this._client[func](this.data.movementSpeed);
  setTimeout(function(){
    self._client.stop();
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

ArdroneDriver.prototype.clockwise = function(cb){
  this._timedCall('clockwise',cb);
};

ArdroneDriver.prototype.counterClockwise = function(cb){
  this._timedCall('counterClockwise',cb);
};
