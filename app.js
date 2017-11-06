// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').Server(app);

var SerialPort  = require('serialport');
var PubNub      = require('pubnub');

var port = new SerialPort('COM4', {
  baudRate: 9600
});

var pubnub = new PubNub({
  publishKey: 'pub-c-d3780be2-91fd-466e-9297-c2fe4c633c75',
  subscribeKey: 'sub-c-6566ac86-c19c-11e7-83f0-6e80f1f24680'
});

// Routing
app.use(express.static(__dirname + '/SigicDashboard'));
app.get('/', function (req, res){
  res.sendFile(__dirname + '/index.html');
});

var measure = '';
var flag = false;

port.on('error', function(err) {
  console.log('Error: ', err.message);
})

port.on('readable', function () {
  data = port.read();
  data = data.toString('ascii');
  processData(data);
});

function processData(data) {
  for (var i=0; i < data.length; i++) {
    if (data[i] === '\n') {
      flag = true;
    }
    measure = measure + data[i];
    if (flag) {
      measure = spliter(measure);
      //console.log("Data:", measure);
      if(measure.length === 3) {
        publish(measure);
      }
      flag = false;
      measure = '';
    }
  }
}

function spliter(measure) {
  measure = measure.split("T: ").toString().split(" H: ").toString().split(" C: ").toString().substr(1).split("\r\n");
  measure = measure[0].split(",");
  return measure;
}

function publish(measure) {
  //console.log("published");
  var data = {
    'ambient_temperature': Number(measure[0]),
    'humidity': Number(measure[1]),
    'co': Number(measure[2])
  };
  publishData(data);
}

function publishData(data) {
  var publishConfig = {
      channel : "SIGIC-SensorData",
      message : data
  }
  pubnub.publish(publishConfig, function(status, response) {
      console.log(status, response);
  })
}

http.listen(3000, function (){
  console.log('listening on *:3000');
});