app.directive('simpleText', function () {

  var controller = ['$scope', function ($scope) {
    //you get passed into scope: json, spiceValues, and crouton
    //Display a string

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
