var app = angular.module('app',[]);

app.controller('Controller', ['$scope', function($scope) {
  $scope.input = 'loaded';
  $scope.drawPaths = false;

  $scope.record = true;
  $scope.permagrab = true;
  $scope.quickSteal = true;

  $scope.reset = function() {
    CURSORS = [];
  };

  $scope.loadChutes = function() {
    $scope.setBackground(CHUTES_AND_LADDERS.background);
    $scope.background = CHUTES_AND_LADDERS.background;
    initCursors(CHUTES_AND_LADDERS.cursors);
  };

  $scope.loadPlinko = function() {
    $scope.setBackground(PLINKO.background);
    $scope.background = PLINKO.background;
    initCursors(PLINKO.cursors);
  };

  function initCursors(cursors) {
    CURSORS = [];
    for (var i = 0; i < cursors.length; i++) {
      var cursor = new Cursor();
      cursor.fromJSON(cursors[i]);
      CURSORS.push(cursor);
    }
  }

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

  $scope.$watch('record', function(newValue, oldValue) {
    RECORD = newValue;
  });

  $scope.setBackground = function(url) {
    url = url || $scope.background;
    var img = createImage(url);
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
