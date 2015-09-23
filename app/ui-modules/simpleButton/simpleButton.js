app.directive('simpleButton', function () {

  var controller = ['$scope', '$rootScope', function ($scope,$rootScope) {
    //you get passed into scope: json, spiceValues, and crouton
    //simpleButton allows you create one or more buttons that can be switched independently

    $scope.selectButton = function(option){
      var topic = "/inbox/"+$scope.crouton+"/"+$scope.spiceName;
      var optionPayload = '{"'+option+'":'+!$scope.spiceValues[option]+'}';
      $rootScope.$broadcast("sendMessage",{"topic":topic, "payload":optionPayload});
    }
  }];

  var template = '/app/ui-modules/simpleButton/simpleButton.tmpl.html';

  return {
      restrict: 'EA', //Default in 1.3+
      scope: {
        spiceInfo: '=',
        crouton: '=',
        spiceValues: '=',
        spiceName: '='
      },
      controller: controller,
      templateUrl: template
  };
});
