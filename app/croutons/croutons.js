/*
Crouton Display
*/
//This only manages the crouton and connection NOT any details about the crouton itself
//Predefined list of croutons... in the future you can pull from server or on the fly add one
app.service('croutonList', function($timeout,$rootScope,$q){
  var parent = this;
  var devicesStatus = {
    "crouton-esp1": {
      "connectionStatus": "unknown connection"
    },
    "crouton-esp2": {
      "connectionStatus": "unknown connection"
    },
  };

  //Return device connection
  this.getDeviceStatusList = function(){
    return devicesStatus;
  }
  this.addCrouton = function(name){
    //controller should have already checked for duplicates
    devicesStatus[name] = {};
    devicesStatus[name]["connectionStatus"] = "unknown connection";
    return '';
  }
  this.removeCrouton = function(name){
    delete devicesStatus[name];
    $rootScope.$broadcast("removeCrouton",{'name':name, 'from':'croutonList'});
  }
  //Updates the connection of a crouton
  this.updateDeviceStatus = function(device,connectionStatus,value){
    $timeout(function() { //this ensures the value has changed first before adjust the scope state
      devicesStatus[device].connectionStatus = value;
    }, 50);
  }
  this.checkForDuplicates = function(name){
    return Object.keys(devicesStatus).indexOf(name) >= 0 ? true : false;
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
app.controller("CroutonController", ['$scope', 'croutonList', 'mqttClient', '$timeout', '$rootScope', '$q', function($scope,croutonList,mqttClient,$timeout,$rootScope,$q){
  //Variables
  $scope.connection = mqttClient.getConnection();
  $scope.croutons = croutonList.getDeviceStatusList();
  $scope.newCroutonName = '';
  $scope.showEmtpyError = false;
  $scope.showDuplicateError = false;

  //Initiate crouton connection
  $scope.testCroutonConnection = function(name){
    if($scope.connection.isConnected === true){
      mqttClient.checkCroutonConnection(name);
    }
  }
  //Remove crouton from list
  $scope.removeCroutonConnection = function(name){
    if($scope.connection.isConnected === true){
      croutonList.removeCrouton(name);
    }
  }
  //Add crouton to list
  $scope.addCroutonConnection = function(){
    if($scope.connection.isConnected === true){
      if($scope.newCroutonName === ""){
        $scope.showEmtpyError = true;
      } else if(croutonList.checkForDuplicates($scope.newCroutonName)){
        $scope.showDuplicateError = true;
      } else {
        //reset errors
        $scope.showEmtpyError = false;
        $scope.showDuplicateError = false;
        $scope.newCroutonName = croutonList.addCrouton($scope.newCroutonName);
      }
    }
  }
}]);
