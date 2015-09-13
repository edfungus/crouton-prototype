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
    configureOnlineDevices(name);
    $rootScope.$broadcast("addOnlineDevices",name);
  }
  //Remove an online device
  this.removeOnlineDevice = function(name){
    delete onlineDevices[name];
    $rootScope.$broadcast("removeOnlineDevices",name);
  }

  var configureOnlineDevices = function(name){
    //configure locations to keep updated values of each endpoint
    onlineDevices[name]['spices'] = {}
    for(var spice in onlineDevices[name]['deviceInfo']['endPoints']){
      onlineDevices[name]['spices'][spice] = {};
      onlineDevices[name]['spices'][spice]['value'] = '';
    }
    console.log(onlineDevices);
  }
})
//Block for displaying crouton data
app.controller("DataDisplay", ['$scope', '$rootScope', 'croutonData', function($scope,$rootScope,croutonData){
  //Variables
  $scope.onlineDevices = {};

  //Update functions
  $rootScope.$on("addOnlineDevices", function(event,arg){
    $scope.onlineDevices = croutonData.getOnlineDevices();
    console.log(arg+" is online");
  });
  $rootScope.$on("removeOnlineDevices", function(event,arg){
    $scope.onlineDevices = croutonData.getOnlineDevices();
    console.log(arg+" is offline");
  });
}]);
