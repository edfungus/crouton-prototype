/*
Crouton Data Display
*/
app.service("croutonData", function($rootScope){
  var onlineDevices = {};

  //Returns all the online devices
  this.getOnlineDevices = function(){
    return onlineDevices;
  }
  //Add an online device
  this.addOnlineDevice = function(name,json){
    onlineDevices[name] = json;
    configureOnlineDevices(name);
    $rootScope.$broadcast("addOnlineDevices",name);
  }
  //Remove an online device
  this.removeOnlineDevice = function(name){
    delete onlineDevices[name];
    $rootScope.$broadcast("removeOnlineDevices",name);
  }
  //Remove all online devices
  this.removeAllOnlineDevice = function(name){
    onlineDevices = {};
    $rootScope.$broadcast("removeOnlineDevices","All devices");
  }
  //Updates new value from crouton
  this.updateDeviceValue = function(name,spice,value){
    onlineDevices[name]['spices'][spice]['value'] = value;
  }
  var configureOnlineDevices = function(name){
    //configure locations to keep updated values of each endpoint
    onlineDevices[name]['spices'] = {}
    for(var spice in onlineDevices[name]['deviceInfo']['endPoints']){
      onlineDevices[name]['spices'][spice] = {};
      onlineDevices[name]['spices'][spice]['value'] = '';
    }
  }
})
//Block for displaying crouton data
app.controller("DataDisplay", ['$scope', '$rootScope', 'croutonData', function($scope,$rootScope,croutonData){
  //Variables
  $scope.onlineDevices = {};

  //functions
  var updateOnlineDevices = function(){
    $scope.onlineDevices = croutonData.getOnlineDevices();
  }

  //Update functions
  $rootScope.$on("addOnlineDevices", function(event,arg){
    updateOnlineDevices();
    console.log(arg+" is online");
  });
  $rootScope.$on("removeOnlineDevices", function(event,arg){
    updateOnlineDevices();
    console.log(arg+" is offline");
  });
  $rootScope.$on("updateOnlineDevices", function(event,arg){
    updateOnlineDevices();
  });
}]);
