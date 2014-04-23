var NMIN, NMAX, NSTART, NEND;
var app = angular.module('app',[]);

app.controller('Controller', ['$scope', function($scope) {
  $scope.input = 'loaded';
  $scope.drawPaths = false;

  $scope.record = true;
  $scope.permagrab = true;
  $scope.quickSteal = true;

  $scope.nstart = 0;
  $scope.nend = 0;
  $scope.$watch('nstart', function(newVal, oldVal) {
    console.log("nstart", NSTART);
    NSTART = $scope.nstart;
  });
  $scope.$watch('nend', function(newVal, oldVal) {
    console.log("nend", NEND);
    NEND = $scope.nend;
  });

  NMIN = 0;
  $scope.nmin = function() {
    if (CURSORS.length == 0) {
      return undefined;
    }
    var min = CURSORS[0].coordinates.length;
    for (var i = 0; i < CURSORS.length; i++) {
      min = Math.min(CURSORS[i].coordinates.length, min);
    }
    NMIN = min;
    return min;
  };

  NMAX = 0;
  $scope.nmax = function() {
    var max = 0;  
    for (var i = 0; i < CURSORS.length; i++) {
      max = Math.max(CURSORS[i].coordinates.length, max);
    }
    NMAX = max;
    return max;
  };

  $scope.reset = function() {
    CURSORS = [];
    $scope.background = "";
    BACKGROUND_IMAGE = undefined;
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

  $scope.loadCrosswalk = function() {
    $scope.setBackground(CROSSWALK.background);
    $scope.background = CROSSWALK.background;
    initCursors(CROSSWALK.cursors);
  };

  $scope.merge = function() {
    $scope.background = "";
    initCursors(CROSSWALK.cursors);
    appendCursors(CHUTES_AND_LADDERS.cursors);
    appendCursors(PLINKO.cursors);
  };

  function initCursors(cursors) {
    CURSORS = [];
    appendCursors(cursors);
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
