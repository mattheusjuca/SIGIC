var SerialPort = require('serialport');

var port = new SerialPort('COM3', {
  baudRate: 9600
});

port.on('error', function(err) {
  console.log('Error: ', err.message);
})
/*
port.on('data', function (data) {
  data = data.toString('ascii');
  console.log('Data:', data);
});
*/
var dataBase;

port.on('readable', function () {
  data = port.read();
  data = data.toString('ascii');
  dataBase = dataBase + data;
  console.log(dataBase);
});
