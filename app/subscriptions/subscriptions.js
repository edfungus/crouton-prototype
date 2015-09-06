/*
Subcription Display
*/
//keep a running list of all subscribed addresses
app.service('subList',function($rootScope){
  var subs = {};
  var parent = this;

  this.getSubList = function(){
    return subs;
  }
  this.addSub = function(id,address){
    subs[address] = id;
  }
  this.removeSub = function(address){
    delete subs[address];
  }
  this.removeAll = function(){
    subs = {}; //this doesn't actually change the mqtt status, just visual
    $rootScope.$broadcast("updateSubs");
  }

  $rootScope.$on("connectionIs", function(event,arg){!arg && parent.removeAll();});
});
app.controller("SubDisplay", ['$scope', 'subList', '$rootScope', function($scope,subList,$rootScope){
  //Variables
  $scope.subs = subList.getSubList();

  //Update Functions
  $rootScope.$on('updateSubs', function(event, arg){
    $scope.subs = subList.getSubList();
  });
}]);
