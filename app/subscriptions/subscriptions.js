/*
Subcription Display
*/
//keep a running list of all subscribed addresses
app.service('subList',function($rootScope){
  var parent = this;
  var subs = {}; //key: address, value: crouton name it belongs to

  //Returns the current subscription list.
  this.getSubList = function(){
    return subs;
  }
  //Adds one address
  this.addAddress = function(name,address){
    subs[address] = name;
    console.log("added: " + address);
    $rootScope.$broadcast("subscribeAddress",address);
  }
  //Adds all the addresses for a crouton json
  this.addCrouton = function(name,json){
    //defaultly listen to the lwt
    parent.addAddress(name,"/outbox/" + name + "/lwt");

    //gets all the endpoints
    var endPoints = json.deviceInfo.endPoints; //need error handling here
    for (var key in endPoints){
      if (endPoints.hasOwnProperty(key)) {
        parent.addAddress(name,"/outbox/" + name + "/" + key)
      }
    }
  }
  //Removes one address
  this.removeAddress = function(address){
    delete subs[address];
    console.log("removed: " + address);
    $rootScope.$broadcast("unsubscribeAddress",address);
  }
  //Removes all addresses related to a crouton
  this.removeCrouton = function(name){
    for (var key in subs){
      if (subs.hasOwnProperty(key) && key.toString().split("/")[2] === name) {
        parent.removeAddress(key);
      }
    }
  }
  //Remove all subscriptions
  this.removeAll = function(){
    for (var key in subs){
      if (subs.hasOwnProperty(key)) {
        parent.removeAddress(key);
      }
    }
  }

  //If there an disconnect from MQTT, unsubscribe from everything
  $rootScope.$on("connectionIs", function(event,connectionOnline){!connectionOnline && parent.removeAll();});
});
app.controller("SubDisplay", ['$scope', 'subList', '$rootScope', function($scope,subList,$rootScope){
  //Variables
  $scope.subs = subList.getSubList();
}]);
