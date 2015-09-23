app.directive('simpleToggle', function () {

  var controller = ['$scope', '$rootScope', function ($scope,$rootScope) {
    //you get passed into scope: json, spiceValues, and crouton
    //simpleToggle requires two or more buttons and only one button may be true at once
    //the logic in which only one is selected also requires backend to comply in only setting one value as true
    //NOTE: the flicking problem is ..idk 

    $scope.selectToggle = function(option){
      var optionPayload = "{"; //need to change this later so that it is from a JSON
      var temp = 0;
      for(key in $scope.spiceValues){ //We can get this either from spiceValues or from spiceInfo
        if(temp){
          optionPayload = optionPayload + ",";
        }
        temp = 1;
        if(key === option){
          optionPayload = optionPayload + '"' + key + '":' + true;
        } else {
          optionPayload = optionPayload + '"' + key + '":' + false;
        }
      }
      var topic = "/inbox/"+$scope.crouton+"/"+$scope.spiceName;
      optionPayload = optionPayload + "}";
      $rootScope.$broadcast("sendMessage",{"topic":topic, "payload":optionPayload});
    }
  }];

  var template = '/app/ui-modules/simpleToggle/simpleToggle.tmpl.html';

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
