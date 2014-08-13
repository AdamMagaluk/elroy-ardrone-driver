var util = require('util');
var Scout = require('zetta').Scout;
var scanNodes = require('scan-neighbors').scanNodes;
var ArDroneDriver = require('./ardrone.js');

var SEARCH_PORT = 5555;

var ArDroneScout = module.exports = function() {
  Scout.call(this);
};
util.inherits(ArDroneScout, Scout);

ArDroneScout.prototype.init = function(next) {
  next();
  this.search();
  setInterval(this.search.bind(this), 5000);
};

ArDroneScout.prototype.search = function() {
  var self = this;
  scanNodes(SEARCH_PORT, function(err, nodes) {
    nodes.forEach(self.foundDrone.bind(self));
  });
};

ArDroneScout.prototype.foundDrone = function(ip) {
  var self = this;
  var query = this.server.where({ type: 'ardrone', ip: ip });
  this.server.find(query, function(err, results) {
    if (results.length > 0) {
      self.provision(results[0], ArDroneDriver, ip);
    } else {
      self.discover(ArDroneDriver, ip);
    }
  });
};


