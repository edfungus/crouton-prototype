/*
Crouton Display
*/
//This only manages the crouton and connection NOT any details about the crouton itself
//Predefined list of croutons... in the future you can pull from server or on the fly add one
app.service('croutonList', function($timeout,$rootScope){
  var parent = this;
  var devicesStatus = {
    "crouton-esp1": {
      "connectionStatus": "unknown connection"
    },
    "crouton-esp2": {
      "connectionStatus": "unknown connection"
    },
    "crouton-computer1": {
      "connectionStatus": "unknown connection"
    },
    "crouton-computer2": {
      "connectionStatus": "unknown connection"
    },
  };

  //Return device connection
  this.getDeviceStatusList = function(){
    return devicesStatus;
  }
  //Updates the connection of a crouton
  this.updateDeviceStatus = function(device,connectionStatus,value){
    $timeout(function() { //this ensures the value has changed first before adjust the scope state
      devicesStatus[device].connectionStatus = value;
    }, 50);
  }
  //Makes all crouton connections "unknown connection"
  this.disconnectAll = function(){  //right now this is visual, but later we should be unconnecting via the mqtt service which that disconection here
    for (var key in devicesStatus){
      if (devicesStatus.hasOwnProperty(key)) {
        devicesStatus[key].connectionStatus = "unknown connection";
      }
    }
  }

});
//Block for showing croutons and their connection status
app.controller("CroutonController", ['$scope', 'croutonList', 'mqttClient', '$timeout', '$rootScope', function($scope,croutonList,mqttClient,$timeout,$rootScope){
  //Variables
  $scope.connection = mqttClient.getConnection();
  $scope.croutons = croutonList.getDeviceStatusList();

  //Function linked to connect crouton button on UI
  $scope.testConnection = function(id){
    if($scope.connection.isConnected === true){
      mqttClient.checkCroutonConnection(id);
    }
  }
}]);
