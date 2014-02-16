$(document).ready(canvas);

var WIDTH = 300;
var HEIGHT = 300;

function canvas() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx.fillRect(0 + WIDTH / 4, 0 + HEIGHT / 4, WIDTH / 2, HEIGHT / 2);
}
