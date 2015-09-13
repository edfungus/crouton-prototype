app.directive('simpleText', function () {

  var controller = ['$scope', function ($scope) {
    //you get passed into scope: json, spiceValues, and crouton
    //temeplate up and sipmle report view with external html file
    //connect another variable so that we dont need to listen here...
    //aka make a croutondata reciever and may add to the onlinedevices object
    console.log($scope);
  }];

  var template = '/app/ui-modules/simpleText/simpleText.tmpl.html';

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
