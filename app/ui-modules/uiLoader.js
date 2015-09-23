app.directive('croutonDataDisplayLoader', function($compile){
  return {
    restrict: 'E',
    link: function(scope, elem, attrs){
        console.log(scope);
        var htm = "<"+attrs.uitype+" crouton='crouton' spice-values='spice' spice-info='json' spice-name='spiceName'></"+attrs.uitype+">";
        var compiled = $compile(htm)(scope);
        elem.append(compiled);
    },
    scope: {
      uitype: '@',
      json: '=',
      crouton: '=',
      spice: '=',
      spiceName: '='
    }
  }
})

app.filter('noValue', function() {
  return function(items) {
    items = (items === null || items === "") ? "[no value]" : items;
    return items;
  };
});

app.filter('booleanStringToggle', function() {
  // for toggles and buttons, there is an option to change string based on the button's boolean value
  return function(item, bool) {
    if(bool == null){
      return "[no value]"
    }
    if(item.indexOf('/') === -1){
      //if there are no options, return the string
      return bool ? item : ""
    } else {
      var options = item.split('/');
      return bool ? options[0] : options[1] //take the first value for true
    }
  };
});
