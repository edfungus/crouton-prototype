/*
Crouton Display
*/
//stores all croutons in session
//predefined list of croutons... in the future you can pull from server or on the fly add one
app.service('croutonList', function($timeout,$rootScope){
  var parent = this;
  var devices = {
    "crouton-esp1": {
      "name": "ESP1",
      "connectionStatus": "unknown connection"
    },
    "crouton-esp2": {
      "name": "ESP2",
      "connectionStatus": "unknown connection"
    },
    "crouton-computer1": {
      "name": "Computer1",
      "connectionStatus": "unknown connection"
    },
    "crouton-computer2": {
      "name": "Computer2",
      "connectionStatus": "unknown connection"
    },
  };

  this.getDeviceList = function(){
    return devices;
  }
  this.updateDevice = function(device,param,value){
    devices[device][param] = value;
    $timeout(function() { //this ensures the value has changed first before adjust the scope state
      $rootScope.$broadcast("updateCroutons");
    }, 50);
  }
  this.disconnectAll = function(){  //right now this is visual, but later we should be unconnecting via the mqtt service which that disconection here
    for (var key in devices){
      if (devices.hasOwnProperty(key)) {
        devices[key].connectionStatus = "unknown connection"
      }
    }
    $rootScope.$broadcast("updateCroutons");
  }

  $rootScope.$on("connectionIs", function(event,arg){!arg && parent.disconnectAll();});
});
//Block for showing croutons and their connection status
app.controller("CroutonController", ['$scope', 'croutonList', 'mqttClient', '$timeout', '$rootScope', function($scope,croutonList,mqttClient,$timeout,$rootScope){
  //Variables
  $scope.isConnected = false;
  $scope.croutons = croutonList.getDeviceList();

  //Update functions
  $rootScope.$on("updateCroutons", function(event,arg){
    $scope.croutons = croutonList.getDeviceList();
  });
  $rootScope.$on("connectionIs", function(event,arg){$scope.isConnected = arg;});


  //Functions
  $scope.testConnection = function(id){
    if($scope.isConnected === true){
      mqttClient.checkCroutonConnection(id);
    }
  }
}]);
