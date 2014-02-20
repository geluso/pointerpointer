$(document).ready(canvas);

var FRAMERATE = 30;
var TIMEOUT = 500;

var WIDTH;
var HEIGHT;
var CURSOR;

var DRAW_CHUTES = true;

var MOUSE_DOWN = false;
var MOUSE_X;
var MOUSE_Y;
var LAST_MOUSE_X;
var LAST_MOUSE_Y;
var LAST_MOVE = 0;

var ONLY_START_ON_MOUSE_DOWN = true;

var RECORDING = false;
var ALIVE = false;

function createImage(src) {
  var img = new Image(); 
  img.src = src;
  return img;
} 

var CANVAS;
var CTX;
var FILE_WIDTH = 68;
var FILE_HEIGHT = 88;
var FILES = createImage("img/files.png");
var FILES_SELECTED = createImage("img/files_selected.png");
var FILES_DRAGGING = createImage("img/files_dragging.png");
var CURSOR = createImage("img/cursor.png");
var THEN = undefined;

FILE_DRAGGING = false;
FILE_CURSOR = -1;
FILE_X = 0;
FILE_Y = 0;
FILE_DRAG_X = 0;
FILE_DRAG_Y = 0;
FILE_CURSOR_OFF_X = 0;
FILE_CURSOR_OFF_Y = 0;

function resize() {
  WIDTH = $(window).width();
  HEIGHT = $(window).height() - $("#bar").height();
  CANVAS.width = WIDTH;
  CANVAS.height = HEIGHT;
}

function canvas() {
  CANVAS = document.getElementById("canvas");
  CTX = CANVAS.getContext("2d");
  WIDTH = $(window).width();
  HEIGHT = $(window).height() - $("#bar").height();
  FILE_X = WIDTH / 2 - FILE_WIDTH / 2;
  FILE_Y = HEIGHT / 2 - FILE_HEIGHT / 2;
  FILE_X = Math.round(FILE_X);
  FILE_Y = Math.round(FILE_Y);

  CANVAS.width = WIDTH;
  CANVAS.height = HEIGHT;

  window.onresize = resize;

  window.onmousedown = function() {
    MOUSE_DOWN = true;
    stopRecording();
    initRecording();
    if (fileClick(MOUSE_X, MOUSE_Y)) {
      startDragging(CURSORS.length - 1, MOUSE_X, MOUSE_Y);
    }
  }

  window.onmouseup = function() {
    MOUSE_DOWN = false;
    stopRecording();
    if (FILE_DRAGGING && FILE_CURSOR == CURSORS.length - 1) {
      stopDragging(MOUSE_X, MOUSE_Y);
    }
  }

  window.onmousemove = function(ev) {
    MOUSE_X = ev.clientX;
    MOUSE_Y = ev.clientY;
    LAST_MOVE = Date.now();
  };

  setInterval(function() {
    move();
    record();
    play();
  }, FRAMERATE);
}

function stoppedMoving() {
}

function initRecording() {
  RECORDING = true;
  CURSORS.push([]);
}

function stopRecording() {
  RECORDING = false;
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
    initRecording();
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
  CURSORS[CURSORS.length - 1].push({
    x: MOUSE_X,
    y: MOUSE_Y
  });
}

function fileClick(x, y) {
  return (FILE_X < x && x < FILE_X + FILE_WIDTH) &&
         (FILE_Y < y && y < FILE_Y + FILE_HEIGHT);
}

function startDragging(cursor, x, y) {
  FILE_DRAGGING = true;
  FILE_CURSOR = cursor;
  FILE_DRAG_X = x;
  FILE_DRAG_Y = y;
  FILE_CURSOR_OFF_X = x - FILE_X;
  FILE_CURSOR_OFF_Y = y - FILE_Y;
}

function stopDragging(x, y) {
  FILE_DRAGGING = false;
  FILE_X = x - FILE_CURSOR_OFF_X;
  FILE_Y = y - FILE_CURSOR_OFF_Y;
}

var TICK = 0;
function play() {
  TICK++;
  CTX.clearRect(0, 0, WIDTH, HEIGHT);

  if (!FILE_DRAGGING) {
    CTX.drawImage(FILES, FILE_X, FILE_Y);
  } else if (RECORDING && FILE_CURSOR == CURSORS.length - 1) {
    CTX.drawImage(FILES_SELECTED, FILE_X, FILE_Y);
    CTX.drawImage(FILES_DRAGGING, MOUSE_X - FILE_CURSOR_OFF_X, MOUSE_Y - FILE_CURSOR_OFF_Y);
  } else {
    CTX.drawImage(FILES_SELECTED, FILE_X, FILE_Y);
    CTX.drawImage(FILES_DRAGGING, FILE_DRAG_X - FILE_CURSOR_OFF_X, FILE_DRAG_Y - FILE_CURSOR_OFF_Y);
  }

  var length = RECORDING ? CURSORS.length - 1 : CURSORS.length;
  for (var i = 0; i < length; i++) {
    var cursor = CURSORS[i];
    var frame = TICK % cursor.length;
    var x = cursor[frame].x;
    var y = cursor[frame].y;

    if (DRAW_CHUTES) {
      x0 = cursor[0].x;
      y0 = cursor[0].y;
      xn = cursor[cursor.length - 1].x;
      yn = cursor[cursor.length - 1].y;

      CTX.beginPath();
      CTX.fillStyle = "rgb(0,255,0)";
      CTX.arc(x0 - 3, y0 - 3, 6, 0,Math.PI*2);
      CTX.fill();

      CTX.beginPath();
      CTX.strokeStyle = "rgba(0,0,0,.1)";
      CTX.moveTo(x0, y0);
      for (var n = 0; n < cursor.length; n++) {
        CTX.lineTo(cursor[n].x, cursor[n].y);
      }
      CTX.lineTo(xn, yn);
      CTX.stroke();

      CTX.beginPath();
      CTX.fillStyle = "rgb(255,0,0)";
      CTX.arc(xn - 3, yn - 3, 6, 0,Math.PI*2);
      CTX.fill();
    }

    // cursors can steal? or hand off?
    if (!FILE_DRAGGING && frame == 0 && fileClick(x, y)) {
      startDragging(i, x, y);
    } else if (i == FILE_CURSOR && frame == cursor.length - 1) {
      stopDragging(x, y);
    } else if (i == FILE_CURSOR) {
      FILE_DRAG_X = x;
      FILE_DRAG_Y = y;
    }

    CTX.drawImage(CURSOR, x, y);
  }
}

