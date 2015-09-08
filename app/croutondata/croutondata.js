/*
Crouton Data Display
*/
app.service("croutonData", function($rootScope,subList){
  var onlineDevices = {};

  //Returns all the online devices
  this.getOnlineDevices = function(){
    return onlineDevices;
  }
  //Add an online device
  this.addOnlineDevice = function(name,json){
    onlineDevices[name] = json;
    subList.addCrouton(name,json);
    $rootScope.$broadcast("updateOnlineDevices");
  }
  //Remove an online device
  this.removeOnlineDevice = function(name){
    delete onlineDevices[name];
    $rootScope.$broadcast("updateOnlineDevices");
  }
})
//Block for displaying crouton data
app.controller("DataDisplay", ['$scope', 'croutonList', '$rootScope', 'croutonData', function($scope,croutonList,$rootScope,croutonData){
  //Variables
  $scope.croutons = croutonList.getDeviceStatusList();
  $scope.onlineDevices = {};

  $scope.tabs = [];

  //Update functions
  $rootScope.$on("updateCroutons", function(event,arg){
    $scope.croutons = croutonList.getDeviceStatusList();
  });
  $rootScope.$on("updateOnlineDevices", function(event,arg){
    $scope.onlineDevices = croutonData.getOnlineDevices();
  });
}]);
