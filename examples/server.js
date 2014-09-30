var zetta = require('zetta');
var ArDrone = require('../index');

zetta()
  .use(ArDrone)
  .listen(1337);
