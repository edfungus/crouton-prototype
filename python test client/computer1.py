import paho.mqtt.client as mqtt
from pprint import pprint
import time
import json
import math

clientName = "crouton-esp1"

#device setup
j = """
{
    "deviceInfo": {
        "status": "good",
        "endPoints": {
            "simpleTest": {
                "units": " people",
                "type": "report",
                "values": {
                    "value": 0
                },
                "description": "This is the description of the simple value reporting unit.",
                "ui-type": "simple-text",
                "title": "Simple example"
            },
            "pwm": {
                "units": "uu",
                "type": "report",
                "values": {
                    "int": null
                },
                "description": "test sinwave",
                "ui-type": "simple-graph",
                "title": "Sinwave"
            },
            "light1": {
                "values": {
                    "red": false,
                    "blue": false,
                    "green": false
                },
                "type": "control",
                "description": "Ceiling light",
                "ui-type": "simple-toggle",
                "title": "Multiple color lights"
            },
            "light2": {
                "values": {
                    "on/off": null,
                    "yes/no": null,
                    "test": null
                },
                "type": "control",
                "description": "Ceiling light",
                "ui-type": "simple-button",
                "title": "Kitchen Light"
            }
        },
        "description": "I am a computer dummy!"
    }
}

"""

device = json.loads(j)
device["deviceInfo"]["name"] = clientName
deviceJson = json.dumps(device)

print deviceJson

#callback when we recieve a connack
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))

#callback when we receive a published message from the server
def on_message(client, userdata, msg):
    print(msg.topic + ": " + str(msg.payload))
    box = msg.topic.split("/")[1]
    name = msg.topic.split("/")[2]
    address = msg.topic.split("/")[3]

    if box == "inbox" and str(msg.payload) == "get" and address == "deviceInfo":
        client.publish("/outbox/"+clientName+"/deviceInfo", deviceJson)
    print address

    if box == "inbox" and (address == "light1" or address == "light2"):
        #currently only echoing to simulate turning on the lights successfully
        #turn on light here and if success, do the following..
        client.publish("/outbox/"+clientName+"/"+address, str(msg.payload))



def on_disconnect(client, userdata, rc):
    if rc != 0:
        print("Broker disconnection")

client = mqtt.Client(clientName)
client.on_connect = on_connect
client.on_message = on_message
client.on_disconnect = on_disconnect
client.username_pw_set("","")
client.will_set('/outbox/'+clientName+'/lwt', 'anythinghere', 0, False)

#client.connect("127.0.0.1", 1883, 60)
#client.connect("localhost", 1883, 60)
client.connect("broker.mqtt-dashboard.com", 1883, 60)


client.subscribe("/inbox/"+clientName+"/deviceInfo")
client.publish("/outbox/"+clientName+"/deviceInfo", deviceJson)
client.subscribe("/inbox/"+clientName+"/light1")
client.subscribe("/inbox/"+clientName+"/light2")
client.subscribe("/inbox/"+clientName+"/pwm")

counter = 0
sine = -40

client.loop_start()
while True:
    time.sleep(.5)
    rangedSine = (sine/40.0)*2*math.pi
    numericSine100 = 100*math.sin(rangedSine)
    finalSine = math.floor(numericSine100)/100.0
    #if(counter%4 == 0):
    #    client.publish("/outbox/"+clientName+"/light1", '{"red":true,"blueYAY/blueNOO":false,"green":false}')
    #    client.publish("/outbox/"+clientName+"/light2", '{"yes/no":true}')
    client.publish("/outbox/"+clientName+"/simpleTest", '{"value":'+str(counter)+'}')
    client.publish("/outbox/"+clientName+"/pwm", '{"int":'+str(finalSine)+'}')
    print finalSine
    counter = counter + 1
    if sine <= 38:
        sine = sine + 1
    else:
        sine = -40

#client.loop_forever()
