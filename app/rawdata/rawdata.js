/*
Raw Data Display
*/
//handles and updates the raw data display
app.service('rawMessages', function($rootScope){
  var rawDataOutput = [];
  var parent = this;

  this.getData = function(){
    return rawDataOutput;
  }

  this.add = function(inOrOut, topic, message){
    var newMessage = {
      "direction": inOrOut,
      "topic": topic,
      "message": message
    };

    rawDataOutput.push(newMessage);
  }
  this.clear = function(){
    rawDataOutput.splice(0,rawDataOutput.length)
  }

  //$rootScope.$on("connectionIs", function(event,arg){!arg && parent.clear();});
});
//BLock for displaying raw data
app.controller("RawDataDisplay", ['$scope', 'mqttClient', '$rootScope', 'rawMessages', function($scope,mqttClient,$rootScope,rawMessages){
  //Variables
  $scope.rawData = rawMessages.getData();
}]);
