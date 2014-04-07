var EventEmitter = require('events').EventEmitter;
var util = require('util');
var ArdroneDriver = require('./ardrone_driver.js');

var defaultIp = '192.168.1.130';

var ArdroneScout = module.exports = function() {
  this.drivers = [];
  EventEmitter.call(this);
};
util.inherits(ArdroneScout, EventEmitter);

ArdroneScout.prototype.init = function(next) {
  next();
  this.emit('discover', ArdroneDriver, defaultIp);
};

