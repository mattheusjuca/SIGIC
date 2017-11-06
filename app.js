var SerialPort  = require('serialport');
var PubNub      = require('pubnub');

var port = new SerialPort('COM4', {
  baudRate: 9600
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
      console.log("Data:", measure);
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
  console.log("published");
  pubnub = new PubNub({
    publishKey: 'pub-c-d3780be2-91fd-466e-9297-c2fe4c633c75',
    subscribeKey: 'sub-c-6566ac86-c19c-11e7-83f0-6e80f1f24680'
  });
  var data = {
    'temperature': measure[0],
    'humidity': measure[1],
    'co': measure[2]
  };
  function publishDataBase() {
    var publishConfig = {
        channel : "SIGIC-DataBase",
        message : data
    }
    pubnub.publish(publishConfig, function(status, response) {
        console.log(status, response);
    })
  }
}
