var arDrone = require('ar-drone');
var throttle = require('throttle-event');

var client = arDrone.createClient({ip : process.argv[2]});
client.stop()
client.config('general:navdata_demo', 'FALSE');

client.on('navdata', throttle(50, function(data) {
  var accel = data.physMeasures.accelerometers;
  var gyro = data.physMeasures.gyroscopes;
  console.log('Battery:', data.rawMeasures.batteryMilliVolt);
  console.log('Acceleromter XYZ: ', accel.x.toFixed(3), accel.y.toFixed(3), accel.z.toFixed(3));
  console.log('Gyroscope XYZ: ', gyro.x.toFixed(3), gyro.y.toFixed(3), gyro.z.toFixed(3));
  console.log();
}));

