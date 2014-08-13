# Zetta ArDrone Driver

[Zetta](http://zettajs.io) device package for ArDrone Quadrocopter, use this to discover ArDrones on your [Zetta](http://zettajs.io) platform.

Uses the [Node ArDrone](https://github.com/felixge/node-ar-drone) from Felix Geisendörfer to communicate to the drone through node.

## Install

```
npm install zetta-ardrone-driver
```

## Usage

```js
var zetta = require('zetta');
var ArDrone = require('zetta-ardrone-driver');

zetta()
  .expose('*')
  .use(ArDrone)
  .listen(3000, function(err) {
    console.log('Listening on http://localhost:3000/');
  });

```

## Connecting to Home Network

If you would like to connect to connect your drone to your home router you can use checkout [this repo](https://github.com/daraosn/ardrone-wpa2).

1. Connect your laptop to your drone's wifi.
2. Install with: ```script/install```
3. Connect to a network with: ```script/connect "<essid>" -p "<password>"```
4. Connect your laptop back to your home wifi.

## License

MIT
