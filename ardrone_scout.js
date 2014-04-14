var EventEmitter = require('events').EventEmitter;
var util = require('util');
var portscanner = require('portscanner');
var async = require('async');
var ArdroneDriver = require('./ardrone_driver.js');

var ArdroneScout = module.exports = function() {
  this.drivers = [];

  var subnet = '192.168.1.';
  this._ips = [];
  for(var i=2;i<255;i++)
    this._ips.push(subnet+i);

  EventEmitter.call(this);
};
util.inherits(ArdroneScout, EventEmitter);

ArdroneScout.prototype.init = function(next) {
  next();
  
  this.search();
  setInterval(this.search.bind(this),5000);
};

ArdroneScout.prototype.search = function(){
  var self = this;
  function scan(ip,cb){
    portscanner.checkPortStatus(5555,ip, function(error, status) {
      cb((status === 'closed') ? false : true);
    });
  }
  
  async.filter(this._ips,scan,function(results){
    results.forEach(function(ip){
      self.emit('discover', ArdroneDriver, ip);
    });
  });
};

