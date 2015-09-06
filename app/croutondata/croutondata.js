/*
Crouton Data Display
*/
//Block for displaying crouton data
app.controller("DataDisplay", ['$scope', 'croutonList', function($scope,croutonList){
  //Variables
  $scope.croutons = croutonList.getDeviceList();
}]);
