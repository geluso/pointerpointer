var app = angular.module('app',[]);

app.controller('Controller', ['$scope', function($scope) {
  $scope.input = 'loaded';
  $scope.drawPaths = false;

  $scope.record = true;
  $scope.permagrab = true;
  $scope.quickSteal = true;

  $scope.reset = function() {
    FOLDER.forgetCursor();
    FOLDER.x = .5;
    FOLDER.y = .5;

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

  $scope.save = function() {
    var json = {
      record: $scope.record,
      permagrab: $scope.permagrab,
      quickSteal: $scope.quickSteal,
      background: $scope.background,
      cursors: CURSORS
    };
    var str = JSON.prune(json);
    console.log("save length:", str.length);
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
}]);
