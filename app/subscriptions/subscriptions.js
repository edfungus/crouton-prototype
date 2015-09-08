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
    $rootScope.$broadcast("subscribeAddress",[address]);
  }
  //Adds all the addresses for a crouton json
  this.addCrouton = function(name,json){
    var addresses = JSONtoAddresses(json);
    parent.addAddress(name,"/outbox/" + name + "/lwt");
    for (var i = 0; i < addresses.length; i++) {
      subs[addresses[i]] = name;
      parent.addAddress(name,addresses[i]);
    }
  }
  //Removes one address
  this.removeAddress = function(address){
    delete subs[address];
    console.log("removed: " + address);
    $rootScope.$broadcast("unsubscribeAddress",[address]);
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
    $rootScope.$broadcast("updateSubs");
  }

  //generate a list of address to add from crouton json
  var JSONtoAddresses = function(json){
    var addresses = [];
    var endPoints = json.deviceInfo.endPoints; //need error handling here
    var name = json.deviceInfo.name;
    for (var key in endPoints){
      if (endPoints.hasOwnProperty(key)) {
        //both control and report will have /outbox/
        addresses.push("/outbox/" + name + "/" + endPoints[key].address)
        //only control will have /inbox/
        if(endPoints[key].type === "control" ){
          addresses.push("/inbox/" + name + "/" + endPoints[key].address)
        }
      }
    }
    return addresses;
  }

  //If there an disconnect from MQTT, unsubscribe from everything
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
