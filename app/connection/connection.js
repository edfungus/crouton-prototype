/*
Connection Display
*/
//service for mqtt processes including the client, sub, unsub, publish, receive, disconnect
app.service("mqttClient", function($timeout,subList,croutonList,$rootScope,rawMessages){
  var client;
  var connectEvent;
  var closeEvent;
  var checkStatusTimeout = [];
  var parent = this;

  //This is the main function that connects the ui to the mqtt broker
  this.connectSalad = function(host,port,clientName){
    client = mqtt.connect({ port: port, host: host, path: "/mqtt", keepalive: 10000, clientId: clientName, reconnectPeriod: 0});

    //Subcriptions for incoming communications direct to us... possibly return device json later...
    subList.addAddress("self","/inbox/"+clientName);

    //Change the connection module's ui when connecting/disconnecting
    client.on('connect', function() {
      $timeout(function() {
        $rootScope.$broadcast("connectionIs", true);
      },300);
    });
    client.on('close', function() {
      $timeout(function() {
        $rootScope.$broadcast("connectionIs", false);
      },300);
    });

    //All incoming messages go through here... it might get a little messy
    client.on('message', function (topic, message) {
      rawMessages.add("in",topic.toString(),message.toString())
      //http://stackoverflow.com/questions/22994871/setting-a-timeout-handler-on-a-promise-in-angularjs
      topicSplit = topic.toString().split("/");
      box = topicSplit[1];
      name = topicSplit[2];
      address = topicSplit[3];

      //Waiting for device info to check if device is online
      if(box === "outbox" && typeof checkStatusTimeout.name != "undefined" && address === "deviceInfo"){
        messageObj = JSON.parse(message.toString());
        $timeout.cancel(checkStatusTimeout.name); //cancel timeout
        checkStatusTimeout.splice(name); //destroy timeout element to say we are done checking
        subList.removeAddress("/outbox/"+name+"/deviceInfo"); //unsub from outbox
        croutonList.updateDeviceStatus(name,"connectionStatus","connected",messageObj);
      }

      //lwt - device has disconnected
      if(box === "outbox" && address === "lwt"){
        //we want to remain subscribed unless we want to remove device or 'no connection'
        croutonList.updateDeviceStatus(name,"connectionStatus","disconnected");
        subList.removeCrouton(name);
        subList.addAddress(name,"/outbox/"+name+"/deviceInfo");
      }
    });
    return
  };
  //See is the crouton is online by pinging it a message in its inbox and expecting a device description JSON
  this.checkCroutonConnection = function(name){
    subList.addAddress(name,"/outbox/"+name+"/deviceInfo");
    parent.publishMessage("/inbox/"+name+"/deviceInfo", "get"); //somehow detect a response back here and set status...you could write the on message function and push for raw data for now
    checkStatusTimeout.name = $timeout(function() {
      subList.removeAddress("/outbox/"+name+"/deviceInfo"); //unsub from outbox
      croutonList.updateDeviceStatus(name,"connectionStatus","no connection");
    }, 300);
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
  //Close MQTT Broker connection
  this.disconnectSalad = function(){
    client.end();
  };


  //A request to subscribe to a topic
  $rootScope.$on("subscribeAddress", function(event, arg){
    subscribeAddress(arg[0]);
  });
  //A request to unsubscribe to a topic
  $rootScope.$on("unsubscribeAddress", function(event, arg){
    unsubscribeAddress(arg[0]);
  });
});
//Block for mqtt connection
app.controller('ConnectionController', ['$scope', 'mqttClient', 'croutonList', 'subList', '$rootScope', function($scope,mqttClient,croutonList,subList,$rootScope){
  //Variables
  $scope.isConnected = false;
  $scope.connecting = false;
  $scope.badParams = false;
  $scope.connectionParam = {'port': '8000', 'ip': 'broker.mqtt-dashboard.com', 'clientName': "crounton-webclient" + parseInt(Math.random() * 100, 10) };
  //$scope.connectionParam = {'port': '6789', 'ip': 'localhost', 'clientName': "crounton-webclient" + parseInt(Math.random() * 100, 10) };

  //Update functions
  $rootScope.$on("connectionIs", function(event,arg){
    $scope.isConnected = arg;
    $scope.connecting = false;
  });

  //Function linked to connect button on UI
  $scope.connectSalad = function() {
    if($scope.connectionParam.ip == '' || $scope.connectionParam.port == '' || $scope.connectionParam.clientName == ''){
      $scope.badParams = true;
      return;
    }
    $scope.connecting = true;
    mqttClient.connectSalad($scope.connectionParam.ip,$scope.connectionParam.port,$scope.connectionParam.clientName);
  }

  //Function linked to disconnect button on UI
  $scope.disconnectSalad = function() {
    mqttClient.disconnectSalad();
    $rootScope.$broadcast("connectionIs", false);
  }

}]);
