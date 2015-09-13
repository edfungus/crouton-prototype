app.directive('croutonDataDisplayLoader', function($compile){
  return {
    restrict: 'E',
    link: function(scope, elem, attrs){
        console.log(scope);
        var htm = "<"+attrs.uitype+" crouton='crouton' spice='spice' spiceinfo='json'></"+attrs.uitype+">";
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

app.filter('noValue', function() {
  return function(items) {
    items = (items == null || items == "") ? "[no value]" : items;
    return items;
  };
});
