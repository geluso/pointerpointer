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

