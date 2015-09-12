app.directive('croutonDataDisplayLoader', function( $compile){
  return {
    restrict: 'E',
    link: function(scope, elem, attrs){
        console.log(scope);
        var htm = "<"+attrs.uitype+" crouton='crouton' spice='spice' json='json'></"+attrs.uitype+">";
        var compiled = $compile(htm)(scope);
        elem.append(compiled);
    },
    scope: {
      uitype: '@',
      json: '=',
      crouton: '=',
      spice: '='
    }
  }
})

app.directive('simpleText', function () {

    var controller = ['$scope', function ($scope) {
      //you get passed into scope: json, spice, and crouton
      //temeplate up and sipmle report view with external html file
      //connect another variable so that we dont need to listen here...
      //aka make a croutondata reciever and may add to the onlinedevices object

    }];

    var template = '<div class="well">Some content {{json}} ++ {{spice}} = {{test}}</div>';

    return {
        restrict: 'EA', //Default in 1.3+
        scope: {
          json: '=',
          crouton: '=',
          spice: '='
        },
        controller: controller,
        template: template
    };
  });
