app.controller("sendMessage", ['$scope', 'mqttClient', '$timeout', '$rootScope', function($scope,mqttClient,$timeout,$rootScope){
  //Variables
  $scope.connection = mqttClient.getConnection();
  $scope.panelOpen = true;
  $scope.sent = false;
  $scope.message = {"topic":"", "payload":""};

  //Functions
  $scope.sendMessage = function(){
    $scope.sent = true;
    console.log($scope.message.payload);
    $rootScope.$broadcast("sendMessage",{"topic":$scope.message.topic, "payload":$scope.message.payload});
    $timeout(function() {
      $scope.sent = false;
    }, 1000);
  }
}]);
