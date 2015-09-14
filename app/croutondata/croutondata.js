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
  }
  //Remove an online device
  this.removeOnlineDevice = function(name){
    delete onlineDevices[name];
  }
  //Remove all online devices
  this.removeAllOnlineDevice = function(name){
    for (var key in onlineDevices){
      if (onlineDevices.hasOwnProperty(key)) {
        delete onlineDevices[key];
      }
    }
  }
  //Updates new value from crouton
  this.updateDeviceValue = function(name,spice,value){
    onlineDevices[name]['spices'][spice]['value'] = value;
  }
  //Adds property spices that holds the current values of the spices
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
app.controller("DataDisplay", ['$scope', '$rootScope', 'croutonData', 'mqttClient', function($scope,$rootScope,croutonData,mqttClient){
  //Variables
  $scope.onlineDevices = croutonData.getOnlineDevices();
}]);
