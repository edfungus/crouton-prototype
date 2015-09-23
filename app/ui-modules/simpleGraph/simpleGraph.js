app.directive('simpleGraph', function () {

  var controller = ['$scope', function ($scope) {
    //you get passed into scope: json, spiceValues, and crouton
    //displays a graph of incoming data .. this is poc for spcifically the sinwave example..not flexible yet.. need to choose graph library

    $scope.chartID = "crouton-esp1pwm";
    $scope.data = {};
    $scope.data.labels = [];
    $scope.data.datasets = [];
    var fakeData = {
      fillColor: "rgba(0,0,0,0)",
      strokeColor: "seashell"
    };
    fakeData.data = [];
    $scope.data.datasets.push(fakeData);
    var ctx = document.getElementById($scope.chartID).getContext("2d");
    var myNewChart = new Chart(ctx).Line($scope.data,{
      animation: false,
      showScale: false,
      showTooltips: true,
      scaleShowGridLines : false,
      pointDot : true,
    });

    $scope.$watch('spiceValues["int"]', function() {
      if($scope.data.labels.length >= 100){
        myNewChart.removeData();
      }
      myNewChart.addData([$scope.spiceValues["int"]],"");
    });

    $scope.test = function(){
      console.log($scope);
    }

  }];

  var template = '/app/ui-modules/simpleGraph/simpleGraph.tmpl.html';

  return {
      restrict: 'EA', //Default in 1.3+
      scope: {
        spiceInfo: '=',
        crouton: '=',
        spiceValues: '=',
        spiceName: '='
      },
      controller: controller,
      templateUrl: template
  };
});
