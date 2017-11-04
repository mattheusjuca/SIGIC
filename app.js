var SerialPort  = require('serialport');
var PubNub      = require('pubnub');

var port = new SerialPort('COM3', {
  baudRate: 9600
});

var dataBase = '';
var dataArray = new Array(100);
var arrayIndex = 0;
var counter = 0;

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
      counter++;
    }
    dataBase = dataBase + data[i];
    if (counter === 3) {
      dataArray[arrayIndex] = dataBase;
      arrayIndex++;
      counter = 0;
      dataBase = '';
      if (arrayIndex === 100) {
        arrayIndex = 0;
        //console.log(dataArray);
        publish();
      }
    }
  }
}

function publish() {
  //console.log("published");
  pubnub = new PubNub({
    publishKey: 'pub-c-d3780be2-91fd-466e-9297-c2fe4c633c75',
    subscribeKey: 'sub-c-6566ac86-c19c-11e7-83f0-6e80f1f24680'
  });
  var data = { 
    'data': dataArray
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
