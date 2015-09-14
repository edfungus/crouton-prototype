var app = angular.module('Crouton', ['ui.bootstrap']); //defining our angular app

//service returns its own instance
//factory returns a unique instance

/*
General things
*/

//custom filter to reverse order of sorting
app.filter('reverse', function() {
  return function(items) {
    items = (items == null) ? "" : items.slice().reverse();
    return items;
  };
});

/*
These aren't needed really anymore
*/
//update a scope variable and forces an update
var updateScope = function(scopeController,updateElement,updateContent){
  var appElement = document.querySelector('[ng-controller='+scopeController+']');
  var $scope = angular.element(appElement).scope();
  $scope.$apply(function(){
      $scope[updateElement] = updateContent;
  });
}

//calls a function within another controller (not being used right now)
var callScopeFunction = function(scopeController,functionName,params){
  var appElement = document.querySelector('[ng-controller='+scopeController+']');
  var $scope = angular.element(appElement).scope();
  return $scope[functionName].apply(undefined,params);
}
