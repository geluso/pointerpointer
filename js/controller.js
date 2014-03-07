var app = angular.module('app',[]);

app.controller('Controller', ['$scope', function($scope) {
  $scope.input = 'loaded';
  $scope.drawPaths = false;
  $scope.$watch('drawPaths', function(newValue, oldValue) {
    DRAW_CHUTES = newValue;
  });

  $scope.leftPoints = 0;
  $scope.rightPoints = 0;

  setInterval(function() {
    if ((FOLDER.x + FOLDER.WIDTH / 2) < WIDTH / 2 - 10) {
      $scope.$apply(function() {
        $scope.leftPoints++;
      });
    } else if ((FOLDER.x + FOLDER.HEIGHT / 2) > WIDTH / 2 + 10) {
      $scope.$apply(function() {
        $scope.rightPoints++;
      });
    }
  }, FRAMERATE);
}]);
