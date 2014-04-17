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

function Cursor(x, y) {
  this.coordinates = [];
  this.n = 0;
  this.recording = true;
  this.dragging = false;
  this.folder;

  this.addXY = function(x, y) {
    this.n++;
    this.coordinates.push({
      x: x,
      y: y
    });
  };
  this.addXY(x, y, "init");

  this.getXY = function() {
     if (this.coordinates.length == 0) {
       return undefined;
     }
     return this.coordinates[this.n % this.coordinates.length];
  };

  this.tick = function() {
    this.n = (this.n + 1) % this.coordinates.length;
  };

  this.drawPath = function(ctx) {
    x0 = this.coordinates[0].x;
    y0 = this.coordinates[0].y;
    xn = this.coordinates[this.coordinates.length - 1].x;
    yn = this.coordinates[this.coordinates.length - 1].y;

    ctx.beginPath();
    ctx.fillStyle = "rgb(0,255,0)";
    ctx.arc(x0 - 3, y0 - 3, 6, 0,Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0,.1)";
    ctx.moveTo(x0, y0);
    for (var n = 0; n < this.coordinates.length; n++) {
      ctx.lineTo(this.coordinates[n].x, this.coordinates[n].y);
    }
    ctx.lineTo(xn, yn);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.arc(xn - 3, yn - 3, 6, 0,Math.PI*2);
    ctx.fill();
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

  this.setCursor = function(cursor) {
    console.log("set cursor");
    this.dragging = true;
    this.cursor = cursor;
    this.cursorOffX = cursor.getXY().x - this.x;
    this.cursorOffY = cursor.getXY().y - this.y;
  };

  this.forgetCursor = function() {
    console.log("forget cursor");
    this.dragging = false;
    this.x = this.cursor.getXY().x - this.cursorOffX;
    this.y = this.cursor.getXY().y - this.cursorOffY;
    this.cursor = undefined;
    this.dragOffX = undefined;
    this.dragOffY = undefined;
  };

  this.draw = function(ctx) {
    if (!this.dragging) {
      ctx.drawImage(FILES, this.x, this.y);
    } else {
      ctx.drawImage(FILES_SELECTED, this.x, this.y);
      ctx.drawImage(FILES_DRAGGING, this.cursor.getXY().x - this.cursorOffX, this.cursor.getXY().y - this.cursorOffY);
    }
  };
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
    console.log("mousedown");
    if (MOUSE_Y < $("#bar").height()) {
      return;
    }
    MOUSE_DOWN = true;
    stopRecording();
    initRecording(MOUSE_X, MOUSE_Y);
    if (fileClick(MOUSE_X, MOUSE_Y)) {
      FOLDER.setCursor(RECORDING);
    }
  }

  window.onmouseup = function() {
    MOUSE_DOWN = false;
    stopRecording();
    if (FOLDER.dragging && FOLDER.cursor == CURSORS[CURSORS.length - 1]) {
      console.log("mouseup forget cursor");
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

function initRecording(x, y) {
  RECORDING = new Cursor(x, y);
  CURSORS.push(RECORDING);
}

function stopRecording() {
  if (RECORDING) {
    RECORDING.recording = false;
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

function fileClick(x, y) {
  return (FOLDER.x < x && x < FOLDER.x + FOLDER.WIDTH) &&
         (FOLDER.y < y && y < FOLDER.y + FOLDER.HEIGHT);
}

var TICK = 0;
function play() {
  TICK++;
  CTX.clearRect(0, 0, WIDTH, HEIGHT);

  FOLDER.draw(CTX);

  for (var i = 0; i < CURSORS.length; i++) {
    var cursor = CURSORS[i];
    if (cursor.recording || cursor.length == 0) {
      continue;
    }
    cursor.tick();
    var x = cursor.getXY().x;
    var y = cursor.getXY().y;

    if (DRAW_CHUTES) {
      cursor.drawPath(CTX);
    }

    // cursors can steal? or hand off?
    if (!FOLDER.dragging && cursor.n == 0 && fileClick(x, y)) {
      console.log("cursor picking up folder");
      FOLDER.setCursor(cursor);
    } else if (!cursor.recording && cursor == FOLDER.cursor && cursor.n == cursor.coordinates.length - 1) {
      console.log("playback forget cursor");
      FOLDER.forgetCursor();
    }

    if (!cursor.recording) {
      CTX.drawImage(CURSOR, x, y);
    }
  }
}
