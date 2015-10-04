# crouton-protoype  (not maintained, release of Crouton here: [https://github.com/edfungus/Crouton](https://github.com/edfungus/Crouton))

You have built a great IOT device with the ESP8266 but don't have an easy way to interact with it? Read on!

## What is this?
This is an interface that makes it easy to interact with your IOT ESP8266. You can see and send data to your IOT ESP8266 device. The only assumptions for you to use Crouton UI is that your ESP8266 uses the MQTT protocol.

## Terminology
* Crouton: An ESP8266 node or your IOT device
* Salad: A network of croutons
* Spices: The functions of the crouton

## Getting started

1. Get Crouton UI by either cloning the repo locally and run `npm install` or using the version online at [crouton-prototype.mybluemix.net](crouton-prototype.mybluemix.net) Connect to a MQTT server from Crouton UI.*

2. Next, connect your crouton to the same MQTT network.

3. To connect your crouton to Crouton UI, your crouton should be listening to the topic `/inbox/device_name/deviceInfo` expecting a payload of `get`. Upon receiving this message, send back a message to `/outbox/device_name/deviceInfo` with your crouton's deviceInfo JSON in the payload. Crouton UI should now populate with the appropriate display and control elements.  and send over a correct deviceInfo JSON.
4. You are ready go to!

*The default MQTT broker server is the public one from [HiveMQ](http://www.hivemq.com/showcase/public-mqtt-broker/) but you are free to run your own as long as it supports websockets.


## Usage
Assuming you have your crouton talking MQTT the following will tell you how your crouton should interface with the UI. If you need help with MQTT on your Crouton (ESP8266 specific) check out [nodemcu](https://github.com/nodemcu/nodemcu-firmware)

#### Topic Definitions
MQTT uses topics for their publish/subscribe model. Crouton UI expects these topics to be in the format `/box/id/address`

`box` denotes the direction of the topic in reference to crouton. It can only be `inbox` where the crouton is receiving a message or `outbox` where the crouton is publishing a message

`id` represents the crouton the topic is referencing.

`address` represents the endpoints to the functions of the crouton

Examples:

```
/inbox/esp1/deviceInfo: esp1 receives command to get deviceInfo
/outbox/esp1/deviceInfo: esp1 publishes deviceInfo
/outbox/esp1/temperature: esp1 publishes temperature details
```

#### DeviceInfo Definitions
Crouton UI understands how to display each crouton by requesting a description via `/inbox/device/deviceInfo`. This JSON response will describe all the functionality of the crouton. The format is as follows. `*  elements are are required`

```
{
    "deviceInfo": {
	    "name": "crouton-computer1",
	    "description": "I am a computer dummy!",
        "status": String,
        "endPoints": {
            "spice_name": {
                "type": String,
                "value": Array or String,
                "ui-type": String,
                "title": String,
                "units": String,
                "description": String,
                "min": Integer,
                "max": Integer
            }
        },       
    }
}
```

`*name` is the name of the crouton and also the name used in the address (must be unique)

`*description` is the description of the crouton shown in Crouton UI

`*status` represents how the crouton is doing. The only options are `good` or `bad`

`*endPoints` represents all the spices or features the crouton has available.  Each spice is represented as an object in in `endPoints`. Each parameters are as follows:

+ `*spice_name` represents the name but also the address (last element of the topic address) to reach this spice.
		+ For example, where `"light": {....}`, the input to this spice will be at `/inbox/crouton_name/light` and output of this spice can be reached  `/outbox/crouton_name/light`
+ `*type` represents what kind of spice it is. There are currently two types to choose from
	+ `report` is for spices that only send data out to the client. Ie. temperature probe
	+ `control` is for spices that communicates back and forth with the client. Ie. lighting control
+ `(*if control) value` represents the type of data that will be sent. Basic types can be string but custom values must be in an array
	+ `String` for values that will be sent as string
	+ `Number` for values that will be sent as integers or floats
	+ `array[]` for custom values. Ie. If a light switch only has on or off, then the declaration will be an array with the values `on` and `off` like `"value": ["on", "off"]`
+ `*ui-type` indicates the type of ui used to display data and controls. This can be customized by adding custom directives. The current options are:
    + `simple-text` for `report` type only and just display value from crouton
+ `title`represents the title of the spice
+ `units` is an optional field for visual aid when the value is displayed and is a string
+ `description` is an optional field to describe your spice in Crouton UI
+ `min` and `max` are both optional fields for integer value validation on the frontend. They can also be used as indicators for reporting spices.




#### Method used to establish connection
In order for Crouton UI to establish a connection with the Crouton, an exchange is made between them. Crouton UI will send a message `get` to the topic `/inbox/device_name/deviceInfo` . Upon receiving this message, the crouton should reply by sending a deviceInfo JSON to `/outbox/device_name/deviceInfo`. Once Crouton UI receives the JSON, Crouton UI will consider the crouton to be online and will configure Crouton UI based on the deviceInfo JSON.

#### LWT and auto-reconnect
Each crouton is assumed to do two things for auto-reconnecting to work:

+ Crouton must broadcast it's deviceInfo upon every connection
+  Crouton must have made a lwt at the address `/outbox/device_name/lwt` with any message with the MQTT broker.

Upon an ungraceful disconnection by a crouton, the Crouton UI will listen for your crouton's deviceInfo. Once your crouton reconnects and publishes it's device info, it will automactically reconnect.


##UI elements

[TBA]

---
Crouton UI uses [Node.js](https://nodejs.org/en/), [Angular.js](https://angularjs.org), [Bootstrap-css](http://getbootstrap.com/css/), [MQTT.js](https://github.com/mqttjs/MQTT.js)

This is my first time using Angular.js/MQTT and the project is still in early stages. Feel free to reach me at edfungus@gmail.com. Feedback always welcome!
