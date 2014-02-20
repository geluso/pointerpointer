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
var CURSOR = createImage("img/cursor.png");
var THEN = undefined;

function Cursor() {
  this.coordinates = [];
  this.n = 0;
  this.dragging = false;
  this.folder;

  this.getXY = function() {
     if (this.coordinates.length > n) {
       return undefined;
     }
     return this.coordinates[this.n];
  };

  this.addXY = function(x, y) {
    this.coordinates[this.n++] = {
      x: x,
      y: y
    };
  };
}

// TODO pull out to image.js
// or canvas. ohh.. damn.
var FILES = createImage("img/files.png");
var FILES_SELECTED = createImage("img/files_selected.png");
var FILES_DRAGGING = createImage("img/files_dragging.png");

function Folder(x, y) {
  this.WIDTH = 68;
  this.HEIGHT = 88;

  this.x = x || 0;
  this.y = y || 0;
  this.dragX;
  this.dragY;

  this.dragging = false;
  this.cursor;
  this.cursorOffX;
  this.cursorOffY;

  // TODO: finish Cursor class
  this.setCursor = function(cursor, x, y) {
    this.dragging = true;
    this.cursor = cursor;
    this.dragX = x;
    this.dragY = x;
    this.cursorOffX = x - this.x;
    this.cursorOffY = y - this.y;
  };

  this.forgetCursor = function() {
    this.dragging = false;
    this.cursor = undefined;
    this.x = this.dragX - this.cursorOffX;
    this.y = this.dragY - this.cursorOffY;
    this.dragX = undefined;
    this.dragY = undefined;
    this.dragOffX = undefined;
    this.dragOffY = undefined;
  };

  this.draw = function(ctx) {
    if (!this.dragging) {
      ctx.drawImage(FILES, this.x, this.y);
    } else if (RECORDING && this.cursor == CURSORS.length - 1) {
      ctx.drawImage(FILES_SELECTED, this.x, this.y);
      this.drawDragging(ctx, MOUSE_X - this.cursorOffX, MOUSE_Y - this.cursorOffY);
    } else {
      ctx.drawImage(FILES_SELECTED, this.x, this.y);
      this.drawDragging(ctx, this.dragX - this.cursorOffX, this.dragY - this.cursorOffY);
    }
  };

  this.drawDragging = function(ctx, x, y) {
    ctx.drawImage(FILES_DRAGGING, x, y);
  }
}

var FOLDER = new Folder();

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
  FOLDER.x = Math.round(WIDTH / 2 - FOLDER.WIDTH / 2);
  FOLDER.y = Math.round(HEIGHT / 2 - FOLDER.HEIGHT / 2);

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
    if (FOLDER.dragging && FOLDER.cursor == CURSORS.length - 1) {
      FOLDER.forgetCursor();
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
  return (FOLDER.x < x && x < FOLDER.x + FOLDER.WIDTH) &&
         (FOLDER.y < y && y < FOLDER.y + FOLDER.HEIGHT);
}

function startDragging(cursor, x, y) {
}

var TICK = 0;
function play() {
  TICK++;
  CTX.clearRect(0, 0, WIDTH, HEIGHT);

  FOLDER.draw(CTX);

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
    if (!FOLDER.dragging && frame == 0 && fileClick(x, y)) {
      FOLDER.setCursor(i, x, y);
    } else if (i == FOLDER.cursor && frame == cursor.length - 1) {
      FOLDER.forgetCursor();
    } else if (i == FOLDER.cursor) {
      FOLDER.dragX = x;
      FOLDER.dragY = y;
    }

    CTX.drawImage(CURSOR, x, y);
  }
}

