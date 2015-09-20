app.directive('simpleToggle', function () {

  var controller = ['$scope', '$rootScope', function ($scope,$rootScope) {
    //you get passed into scope: json, spiceValues, and crouton
    //temeplate up and sipmle report view with external html file
    //connect another variable so that we dont need to listen here...
    //aka make a croutondata reciever and may add to the onlinedevices object

    $scope.button = {};

    $scope.selectToggle = function(option){
      console.log(option);
      $scope.button[option] = true;
      for (var key in $scope.button){
        if(key !== option){
          $scope.button[key] = false;
        }
      }
      console.log($scope.button);
      console.log($scope.buttonVisual);
    }


  }];

  var template = '/app/ui-modules/simpleToggle/simpleToggle.tmpl.html';

  return {
      restrict: 'EA', //Default in 1.3+
      scope: {
        spiceInfo: '=',
        crouton: '=',
        spiceValues: '='
      },
      controller: controller,
      templateUrl: template
  };
});
