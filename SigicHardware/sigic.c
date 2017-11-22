#include <SimpleDHT.h>
#include <stdio.h>

// for DHT11, 
//      VCC: 5V or 3V
//      GND: GND
//      DATA: A1
char buffer[50];
int pinDHT11 = A1;
SimpleDHT11 dht11;
// for MQ7
//      VCC: 5V
//      GND: GND
//      AOUT: A0
//      DOUT: D8
int value;
const int AOUTpin=0;//the AOUT pin of the CO sensor goes into analog pin A0 of the arduino
const int DOUTpin=8;//the DOUT pin of the CO sensor goes into digital pin D8 of the arduino

void setup() {
  Serial.begin(9600);
  pinMode(DOUTpin, INPUT);//sets the pin as an input to the arduino
}

void loop() {
  // read without samples.
  byte temperature = 0;
  byte humidity = 0;
  int err = SimpleDHTErrSuccess;
  while ((err = dht11.read(pinDHT11, &temperature, &humidity, NULL)) != SimpleDHTErrSuccess) {
    err = SimpleDHTErrSuccess;
    delay(1000);
  }
  value= analogRead(AOUTpin);//reads the analaog value from the CO sensor's AOUT pin
  sprintf(buffer,"T: %d H: %d C: %d",(int)temperature,(int)humidity,value);
  Serial.println(buffer);

  // DHT11 sampling rate is 1HZ.
  delay(1000);
}