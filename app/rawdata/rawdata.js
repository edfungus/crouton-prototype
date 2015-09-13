/*
Raw Data Display
*/
//handles and updates the raw data display
app.service('rawMessages', function($rootScope){
  this.rawDataOutput = [];
  var parent = this;

  this.add = function(inOrOut, topic, message){
    var newMessage = {
      "direction": inOrOut,
      "topic": topic,
      "message": message
    };

    this.rawDataOutput.push(newMessage);
    $rootScope.$broadcast("updateRawData");
  }
  this.clear = function(){
    rawDataOutput = [];
    $rootScope.$broadcast("updateRawData");
  }

  $rootScope.$on("connectionIs", function(event,arg){!arg && parent.clear();});
});
//BLock for displaying raw data
app.controller("RawDataDisplay", ['$scope', 'mqttClient', '$rootScope', 'rawMessages', function($scope,mqttClient,$rootScope,rawMessages){
  //Variables
  $scope.rawData = rawMessages.rawDataOutput;

  //Update functions
  $rootScope.$on('updateRawData', function(event, args) {
    $scope.rawData = rawMessages.rawDataOutput;    
  });
}]);
