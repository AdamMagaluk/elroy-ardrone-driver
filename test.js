var arDrone = require('ar-drone');
var client = arDrone.createClient({ip : '192.168.1.130'});


client.stop()
client.config('general:navdata_demo', 'FALSE');

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


client.on('navdata',throttle(50,function(data){
  console.log(data.altitude);
  return;
  if(data.rawMeasures)
    console.log(data.rawMeasures.batteryMilliVolt)

  if(data.physMeasures){
    console.log(data.physMeasures.accelerometers);
    console.log(data.physMeasures.gyroscopes);
  }
}));

