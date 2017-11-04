var SerialPort  = require('serialport');
var PubNub      = require('pubnub');

var port = new SerialPort('COM3', {
  baudRate: 9600
});

var dataBase;

port.on('error', function(err) {
  console.log('Error: ', err.message);
})

port.on('readable', function () {
  data = port.read();
  data = data.toString('ascii');
  dataBase = dataBase + data;
  //console.log(dataBase);
  setInterval(publish, 3000);
});

function publish() {
  console.log("published");
  pubnub = new PubNub({
    publishKey: 'pub-c-d3780be2-91fd-466e-9297-c2fe4c633c75',
    subscribeKey: 'sub-c-6566ac86-c19c-11e7-83f0-6e80f1f24680'
  });
  var data = { 
    'dataBase': dataBase,
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
