var app = angular.module('app',[]);

app.controller('Controller', ['$scope', function($scope) {
  $scope.input = 'loaded';
  $scope.drawPaths = false;

  $scope.permagrab = true;
  $scope.quickSteal = true;

  $scope.$watch('permagrab', function(newValue, oldValue) {
    PERMAGRAB = newValue;
  });

  $scope.$watch('drawPaths', function(newValue, oldValue) {
    DRAW_CHUTES = newValue;
  });

  $scope.$watch('quickSteal', function(newValue, oldValue) {
    QUICK_STEAL = newValue;
  });

  $scope.$watch('onlyCurrentCursor', function(newValue, oldValue) {
    ONLY_CURRENT_CURSOR = newValue;
  });

  $scope.setBackground = function() {
    var img = createImage($scope.background);
    img.onload = function() {
      BACKGROUND_IMAGE = img;
    };
  }

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
