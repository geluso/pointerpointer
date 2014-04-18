var CURSOR_WIDTH = 13;
var CURSOR_HEIGHT = 19;

function Cursor(x, y) {
  this.WIDTH = 13;
  this.HEIGHT = 19;

  this.coordinates = [];
  this.n = 0;
  this.recording = true;
  this.dragging = false;
  this.folder;

  this.fromJSON = function(json) {
    this.coordinates = json.coordinates;
    this.n = json.n;
    this.recording = json.recording;
    this.dragging = json.dragging;
    this.folder = json.folder;
  };

  this.addXY = function(x, y) {
    this.n++;
    this.coordinates.push({
      x: x,
      y: y
    });
  };
  if (x && y) {
    this.addXY(x, y);
  }

  this.getXY = function() {
     if (this.coordinates.length == 0) {
       return undefined;
     } else if (this.recording) {
       return this.coordinates[this.coordinates.length - 1];
     } else {
       return this.coordinates[this.n % this.coordinates.length];
     }
  };

  this.tick = function() {
    this.n = (this.n + 1) % this.coordinates.length;
  };

  this.draw = function(ctx) {
    if (DRAW_CHUTES) {
      this.drawPath(ctx);
    }
    if (!this.recording) {
      var x = this.getXY().x;
      var y = this.getXY().y;
      // including stange manually-calibrated offsets.
      x = absX(x) - 2;
      y = absY(y) - CURSOR_HEIGHT - 6;
      absDrawImage(ctx, CURSOR, x, y);
    }
  };

  this.drawPath = function(ctx) {
    x0 = this.coordinates[0].x;
    y0 = this.coordinates[0].y;
    xn = this.coordinates[this.coordinates.length - 1].x;
    yn = this.coordinates[this.coordinates.length - 1].y;

    ctx.beginPath();
    ctx.fillStyle = "rgb(0,255,0)";
    absArc(ctx, absX(x0) - 3, absY(y0) - 3, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0,.1)";
    absMoveTo(ctx, x0, y0);
    for (var n = 0; n < this.coordinates.length; n++) {
      absLineTo(ctx, this.coordinates[n].x, this.coordinates[n].y);
    }
    absLineTo(ctx, xn, yn);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "rgb(255,0,0)";
    absArc(ctx, absX(xn) - 3, absY(yn) - 3, 6, 0, Math.PI * 2);
    ctx.fill();
  };
}

