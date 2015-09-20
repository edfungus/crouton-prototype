/*
Connection Display
*/
//service for mqtt processes including the client, sub, unsub, publish, receive, disconnect
app.service("mqttClient", function($timeout,$rootScope,subList,croutonList,rawMessages,croutonData){
  var client;
  var checkStatusTimeout = [];
  var connection = {};
    connection['isConnected'] = false;
    connection['connecting'] = false;
  var parent = this;

  //This is the main function that connects the ui to the mqtt broker
  this.connectSalad = function(host,port,clientName){
    connection.connecting = true;
    client = mqtt.connect({ port: port, host: host, path: "/mqtt", keepalive: 10000, clientId: clientName, reconnectPeriod: 0});

    //Subcriptions for incoming communications direct to us... possibly return device json later...
    subList.addAddress("self","/inbox/"+clientName);

    //Change the connection module's ui when connecting/disconnecting
    client.on('connect', function() {
      $rootScope.$apply(function(){
        connection.isConnected = true;
        connection.connecting = false;
      });
    });
    client.on('close', function() {
      clearUI();
    });

    //All incoming messages go through here... it might get a little messy
    client.on('message', function (topic, message) {
      $rootScope.$apply(function(){
        rawMessages.add("in",topic.toString(),message.toString());
      });

      topicSplit = topic.toString().split("/");
      box = topicSplit[1];
      name = topicSplit[2];
      address = topicSplit[3];
      message = message.toString();

      //Waiting for device info to check if device is online
      if(box === "outbox" && typeof checkStatusTimeout.name != "undefined" && address === "deviceInfo"){
        messageObj = JSON.parse(message.toString());
        $timeout.cancel(checkStatusTimeout.name); //cancel timeout
        checkStatusTimeout.splice(name); //destroy timeout element to say we are done checking
        croutonData.addOnlineDevice(name,messageObj);
        croutonList.updateDeviceStatus(name,"connectionStatus","connected");
        subList.removeAddress("/outbox/"+name+"/deviceInfo"); //unsub from outbox
        subList.addCrouton(name,messageObj);
        return;
      }

      //lwt - device has disconnected
      if(box === "outbox" && address === "lwt"){
        //we want to remain subscribed unless we want to remove device or 'no connection'
        croutonList.updateDeviceStatus(name,"connectionStatus","disconnected");
        subList.removeCrouton(name);
        subList.addAddress(name,"/outbox/"+name+"/deviceInfo");
        croutonData.removeOnlineDevice(name);
        return;
      }

      //If it is just a normal value update from a crouton...
      //might need some sanitation here or something
      if(box === "outbox"){
        $rootScope.$apply(function(){
          croutonData.updateDeviceValue(name,address,message);
        });
      }
    });
    return;
  };
  //See is the crouton is online by pinging it a message in its inbox and expecting a device description JSON
  this.checkCroutonConnection = function(name){
    subList.addAddress(name,"/outbox/"+name+"/deviceInfo");
    parent.publishMessage("/inbox/"+name+"/deviceInfo", "get"); //somehow detect a response back here and set status...you could write the on message function and push for raw data for now
    croutonList.updateDeviceStatus(name,'connectionStatus','connecting...')
    checkStatusTimeout.name = $timeout(function() {
      subList.removeAddress("/outbox/"+name+"/deviceInfo"); //unsub from outbox
      croutonList.updateDeviceStatus(name,"connectionStatus","no response");
    }, 5000);
  };
  //Pubilsh a message to MQTT broker
  this.publishMessage = function(topic, message) {
    client.publish(topic, message);
    rawMessages.add("out", topic, message);
  }
  //Tell MQTT Broker to subscribe us to address
  var subscribeAddress = function(address){
    client.subscribe(address);
  };
  //Tell MQTT Broker to unsubscribe us to address
  var unsubscribeAddress = function(address){
    client.unsubscribe(address);
  };
  var clearUI = function() {
    rawMessages.clear();
    croutonList.disconnectAll();
    croutonData.removeAllOnlineDevice();
    subList.removeAll();
    connection.isConnected = false;
  }
  //Close MQTT Broker connection
  this.disconnectSalad = function(){
    clearUI();
    client.end();
  };

  //Get Variables
  this.getConnection = function(){
    return connection;
  }

  //A request to subscribe to a topic
  $rootScope.$on("subscribeAddress", function(event, address){
    subscribeAddress(address);
  });
  //A request to unsubscribe to a topic
  $rootScope.$on("unsubscribeAddress", function(event, address){
    unsubscribeAddress(address);
  });
  $rootScope.$on("removeCrouton", function(event, message){
    if (message["from"] !== "croutonList"){ //we deleted the entry already
      croutonList.updateDeviceStatus(message["name"],"connectionStatus","disconnected");
    }
    subList.removeCrouton(message["name"]);
    croutonData.removeOnlineDevice(message["name"]);
  });
  $rootScope.$on("sendMessage", function(event, message){
    console.log(message);
    parent.publishMessage(message["topic"], message["payload"]);
  });
});
//Block for mqtt connection
app.controller('ConnectionController', ['$scope', 'mqttClient', 'croutonList', 'subList', '$rootScope', function($scope,mqttClient,croutonList,subList,$rootScope){
  //Variables
  $scope.connection = mqttClient.getConnection();
  $scope.badParams = false;
  $scope.connectionParam = {'port': '8000', 'ip': 'broker.mqtt-dashboard.com', 'clientName': "crounton-webclient" + parseInt(Math.random() * 100, 10) };
  //$scope.connectionParam = {'port': '6789', 'ip': 'localhost', 'clientName': "crounton-webclient" + parseInt(Math.random() * 100, 10) };

  //Function linked to connect button on UI
  $scope.connectSalad = function() {
    if($scope.connectionParam.ip == '' || $scope.connectionParam.port == '' || $scope.connectionParam.clientName == ''){
      $scope.badParams = true;
      return;
    }
    $scope.badParams = false;
    mqttClient.connectSalad($scope.connectionParam.ip,$scope.connectionParam.port,$scope.connectionParam.clientName);
  }

  //Function linked to disconnect button on UI
  $scope.disconnectSalad = function() {
    mqttClient.disconnectSalad();
  }

}]);
