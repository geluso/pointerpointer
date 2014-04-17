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

