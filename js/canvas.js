$(document).ready(canvas);

var WIDTH;
var HEIGHT;
var CURSOR;

var MOUSE_X;
var MOUSE_Y;

function createImage(src) {
  var img = new Image(); 
  img.src = src;
  return img;
} 

function canvas() {
  console.log("hey");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  WIDTH = $(window).width();
  HEIGHT = $(window).height();
  console.log(WIDTH, HEIGHT);

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx.fillRect(0 + WIDTH / 4, 0 + HEIGHT / 4, WIDTH / 2, HEIGHT / 2);

  var cursor = createImage("img/cursor.png");
  window.onmousemove = function(ev) {
    MOUSE_X = ev.clientX;
    MOUSE_Y = ev.clientY;
  };
  setInterval(function() {
    ctx.drawImage(cursor, MOUSE_X, MOUSE_Y);
  }, 100);
  setInterval(function() {
    ctx.drawImage(cursor, MOUSE_X, MOUSE_Y);
  }, 200);
  setInterval(function() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(cursor, MOUSE_X, MOUSE_Y);
  }, 300);
}
