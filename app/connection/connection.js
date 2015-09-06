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

  this.connectSalad = function(host,port,name){
    client = mqtt.connect({ port: port, host: host, path: "/mqtt", keepalive: 10000, clientId: name, reconnectPeriod: 0});

    //temp subs
    this.subscribeCrouton("self","/inbox/"+name);

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
      id = topicSplit[2];
      address = topicSplit[3];
      messageObj = JSON.parse(message.toString());

      //Waiting for device info to check if device is online
      if(box === "outbox" && typeof checkStatusTimeout.id != "undefined" && address === "deviceInfo"){
        $timeout.cancel(checkStatusTimeout.id); //cancel timeout
        checkStatusTimeout.splice(id); //destroy timeout element to say we are done checking
        parent.unsubscribeCrouton("/outbox/"+id+"/deviceInfo"); //unsub from outbox
        croutonList.updateDevice(id,"connectionStatus","connected");
      }
    });
    return
  };
  //see is the crouton is online by pinging it a message in its inbox and expecting a device description JSON
  this.checkCroutonConnection = function(id){
    parent.subscribeCrouton(id,"/outbox/"+id+"/deviceInfo");
    parent.publishMessage("/inbox/"+id+"/deviceInfo", "get"); //somehow detect a response back here and set status...you could write the on message function and push for raw data for now
    checkStatusTimeout.id = $timeout(function() {
      parent.unsubscribeCrouton("/outbox/"+id+"/deviceInfo"); //unsub from outbox
      croutonList.updateDevice(id,"connectionStatus","no connection");
    }, 300);
  };
  this.publishMessage = function(topic, message) {
    client.publish(topic, message);
    rawMessages.add("out", topic, message);
  }
  this.subscribeCrouton = function(id,address){
    subList.addSub(id,address);
    client.subscribe(address);
  };
  this.unsubscribeCrouton = function(address){
    subList.removeSub(address);
    client.unsubscribe(address);
  };
  this.disconnectSalad = function(){
    client.end();
  };
});
//Block for mqtt connection
app.controller('ConnectionController', ['$scope', 'mqttClient', 'croutonList', 'subList', '$rootScope', function($scope,mqttClient,croutonList,subList,$rootScope){
  //Variables
  $scope.isConnected = false;
  $scope.connecting = false;
  $scope.badParams = false;
  $scope.connectionParam = {'port': '8000', 'ip': 'broker.mqtt-dashboard.com', 'id': "crounton-webclient" + parseInt(Math.random() * 100, 10) };

  //Update functions
  $rootScope.$on("connectionIs", function(event,arg){
    $scope.isConnected = arg;
    $scope.connecting = false;
  });

  //Functions
  $scope.connectSalad = function() {
    if($scope.connectionParam.ip == '' || $scope.connectionParam.port == '' || $scope.connectionParam.id == ''){
      $scope.badParams = true;
      return;
    }
    $scope.connecting = true;
    mqttClient.connectSalad($scope.connectionParam.ip,$scope.connectionParam.port,$scope.connectionParam.id);
  }

  $scope.disconnectSalad = function() {
    mqttClient.disconnectSalad();
    $rootScope.$broadcast("connectionIs", false);
  }

}]);
