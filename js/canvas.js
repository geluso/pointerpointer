$(document).ready(canvas);

var FRAMERATE = 30;
var TIMEOUT = 500;

var WIDTH;
var HEIGHT;
var CURSOR;

var PERMAGRAB = true;
var QUICK_STEAL = true;
var DRAW_CHUTES = false;
var ONLY_CURRENT_CURSOR = false;

var BACKGROUND_IMAGE = undefined;

var MOUSE_DOWN = false;
var MOUSE_X;
var MOUSE_Y;
var LAST_MOUSE_X;
var LAST_MOUSE_Y;
var LAST_MOVE = 0;

var ONLY_START_ON_MOUSE_DOWN = true;

var RECORDING = false;
var RECORD = true;
var ALIVE = false;

function createImage(src) {
  var img = new Image(); 
  img.src = src;
  return img;
} 

var CANVAS;
var CTX;
var CURSOR = createImage("img/cursor.png");
var THEN = undefined;

// TODO pull out to image.js
// or canvas. ohh.. damn.
var FILES = createImage("img/files.png");
var FILES_SELECTED = createImage("img/files_selected.png");
var FILES_DRAGGING = createImage("img/files_dragging.png");

var FOLDER = new Folder();

function dimensions() {
  WIDTH = $(window).width() - $("#controls").outerWidth();
  HEIGHT = $(window).height();
}

function resize() {
  dimensions();
  CANVAS.width = WIDTH;
  CANVAS.height = HEIGHT;
}

function canvas() {
  CANVAS = document.getElementById("canvas");
  CTX = CANVAS.getContext("2d");
  dimensions();
  FOLDER.x = .5;
  FOLDER.y = .5;

  CANVAS.width = WIDTH;
  CANVAS.height = HEIGHT;

  window.onresize = resize;

  window.onmousedown = function() {
    MOUSE_DOWN = true;
    stopRecording();

    initRecording(MOUSE_X, MOUSE_Y);
    if (FOLDER.isClickedOn(MOUSE_X, MOUSE_Y)) {
      FOLDER.setCursor(RECORDING);
    }
  }

  window.onmouseup = function() {
    MOUSE_DOWN = false;
    if (FOLDER.dragging && FOLDER.cursor == CURSORS[CURSORS.length - 1] || !RECORD) {
      FOLDER.forgetCursor();
    }
    stopRecording();
  }

  window.onmousemove = function(ev) {
    MOUSE_X = (ev.clientX - $("#controls").outerWidth()) / window.innerWidth;
    MOUSE_X = Math.max(0, MOUSE_X);
    MOUSE_Y = ev.clientY / window.innerHeight;

    LAST_MOVE = Date.now();
  };

  setInterval(function() {
    move();
    record();
    play();
  }, FRAMERATE);
}

function initRecording(x, y) {
  RECORDING = new Cursor(x, y);
  if (RECORD) {
    CURSORS.push(RECORDING);
  }
}

function stopRecording() {
  if (RECORDING) {
    RECORDING.recording = false;
    RECORDING.n = 0;
  }
  RECORDING = undefined;

}

function isStagnant() {
  var now = Date.now()
  var longTime = (now - LAST_MOVE) > TIMEOUT;
  var stagnant = longTime && MOUSE_X == LAST_MOUSE_X && MOUSE_Y == LAST_MOUSE_Y;
  // It is not stagnant if the mouse is down.
  return !MOUSE_DOWN && stagnant;
}

function move() {
  // Stop recording
  var stagnant = isStagnant();
  if (RECORDING && stagnant) {
    stopRecording();
  // Start recording
  } else if (!RECORDING && !stagnant && !ONLY_START_ON_MOUSE_DOWN) {
    initRecording(MOUSE_X, MOUSE_Y);
  }
  LAST_MOUSE_X = MOUSE_X;
  LAST_MOUSE_Y = MOUSE_Y;
}

var CURSORS = [];
var FOLDERS = [1];
function record() {
  if (!RECORDING || !MOUSE_X || !MOUSE_Y) {
    return;
  }
  RECORDING.addXY(MOUSE_X, MOUSE_Y);
}

var TICK = 0;
function play() {
  TICK++;
  CTX.clearRect(0, 0, WIDTH, HEIGHT);

  if (BACKGROUND_IMAGE) {
    CTX.drawImage(BACKGROUND_IMAGE, 0, 0, CANVAS.width, CANVAS.height);
  }

  FOLDER.draw(CTX);

  if (CURSORS.length == 0) {
    return;
  }


  for (var i = 0; i < CURSORS.length; i++) {
    var cursor = CURSORS[i];
    cursor.draw(CTX)
    if (cursor.recording || cursor.length == 0) {
      continue;
    }
    var x = cursor.getXY().x;
    var y = cursor.getXY().y;

    if (FOLDER.isClickedOn(x, y)) {
      // Is the cursor grabbing the folder?
      if (cursor.n == 0 || QUICK_STEAL) {
        if (!FOLDER.dragging || FOLDER.dragging && !PERMAGRAB) {
          FOLDER.setCursor(cursor);
        }
      }
    }
    var folderHasCursor = !cursor.recording && cursor == FOLDER.cursor;
    var isAtEnd = (cursor.n % cursor.coordinates.length) == cursor.coordinates.length - 1;
    if (folderHasCursor && isAtEnd) {
      // The cursor is done dragging the folder.
      FOLDER.forgetCursor();
    }
    
    cursor.draw(CTX)
    cursor.tick();
  }
}
