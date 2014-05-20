var app = angular.module('app',[]);

app.controller('Controller', ['$scope', function($scope) {
  $scope.input = 'loaded';
  $scope.drawPaths = false;

  $scope.record = true;
  $scope.permagrab = true;
  $scope.quickSteal = true;

  $scope.reset = function() {
    CURSORS = [];
    $scope.background = "";
    BACKGROUND_IMAGE = undefined;
  };

  $scope.loadChutes = function() {
    load(CHUTES_AND_LADDERS);
  };

  $scope.loadPlinko = function() {
    load(PLINKO);
  };

  $scope.loadCrosswalk = function() {
    load(CROSSWALK);
  };

  $scope.merge = function() {
    $scope.background = "";
    load(CROSSWALK);
    appendCursors(CHUTES_AND_LADDERS);
    appendCursors(PLINKO);
  };

  function load(data) {
    $scope.record = data.record;
    $scope.permagrab = data.permagrab;
    $scope.quickSteal = data.quickSteal;

    $scope.setBackground(data.background);

    CURSORS = [];
    appendCursors(data.cursors);
  }

  function appendCursors(cursors) {
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
    $scope.background = url;
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
