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

  this.connectSalad = function(host,port,clientName){
    client = mqtt.connect({ port: port, host: host, path: "/mqtt", keepalive: 10000, clientId: clientName, reconnectPeriod: 0});

    //temp subs
    subList.addAddress("self","/inbox/"+clientName);

    //change the connection module's ui when connecting
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

    //all incoming messages go through here... it might get a little messy
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
  //see is the crouton is online by pinging it a message in its inbox and expecting a device description JSON
  this.checkCroutonConnection = function(name){
    subList.addAddress(name,"/outbox/"+name+"/deviceInfo");
    parent.publishMessage("/inbox/"+name+"/deviceInfo", "get"); //somehow detect a response back here and set status...you could write the on message function and push for raw data for now
    checkStatusTimeout.name = $timeout(function() {
      subList.removeAddress("/outbox/"+name+"/deviceInfo"); //unsub from outbox
      croutonList.updateDeviceStatus(name,"connectionStatus","no connection");
    }, 300);
  };
  this.publishMessage = function(topic, message) {
    client.publish(topic, message);
    rawMessages.add("out", topic, message);
  }
  var subscribeAddress = function(address){
    client.subscribe(address);
  };
  var unsubscribeAddress = function(address){
    client.unsubscribe(address);
  };
  this.disconnectSalad = function(){
    client.end();
  };
  $rootScope.$on("subscribeAddress", function(event, arg){
    subscribeAddress(arg[0]);
  });
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
  //$scope.connectionParam = {'port': '8000', 'ip': 'broker.mqtt-dashboard.com', 'clientName': "crounton-webclient" + parseInt(Math.random() * 100, 10) };
  $scope.connectionParam = {'port': '6789', 'ip': 'localhost', 'clientName': "crounton-webclient" + parseInt(Math.random() * 100, 10) };

  //Update functions
  $rootScope.$on("connectionIs", function(event,arg){
    $scope.isConnected = arg;
    $scope.connecting = false;
  });

  //Functions
  $scope.connectSalad = function() {
    if($scope.connectionParam.ip == '' || $scope.connectionParam.port == '' || $scope.connectionParam.clientName == ''){
      $scope.badParams = true;
      return;
    }
    $scope.connecting = true;
    mqttClient.connectSalad($scope.connectionParam.ip,$scope.connectionParam.port,$scope.connectionParam.clientName);
  }

  $scope.disconnectSalad = function() {
    mqttClient.disconnectSalad();
    $rootScope.$broadcast("connectionIs", false);
  }

}]);
