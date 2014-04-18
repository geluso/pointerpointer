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
    // forget any previous cursor.
    this.forgetCursor();

    this.dragging = true;
    this.cursor = cursor;
    this.cursorOffX = cursor.getXY().x - this.x;
    this.cursorOffY = cursor.getXY().y - this.y;
    debugger
  };

  this.forgetCursor = function() {
    if (!this.cursor) {
      return;
    }
    this.dragging = false;
    this.x = this.cursor.getXY().x - this.cursorOffX;
    this.y = this.cursor.getXY().y - this.cursorOffY;
    this.cursor = undefined;
    this.dragOffX = undefined;
    this.dragOffY = undefined;
  };

  this.isClickedOn = function(x, y) {
    var thisX, thisY;
    if (this.dragging) {
      thisX = this.cursor.getXY().x - this.cursorOffX;
      thisY = this.cursor.getXY().y - this.cursorOffY;
    } else {
      thisX = this.x;
      thisY = this.y;
    }
    debugger
    result = (absX(thisX) < absX(x) && absX(x) < absX(thisX) + this.WIDTH) &&
             (absY(thisY) < absY(y) && absY(y) < absY(thisY) + this.HEIGHT);
    return result;
  };

  this.draw = function(ctx) {
    if (!this.dragging) {
      absDrawImage(ctx, FILES, this.x, this.y);
    } else {
      var x = this.cursor.getXY().x;
      var y = this.cursor.getXY().y;
      absDrawImage(ctx, FILES_SELECTED, this.x, this.y);
      // investigate cursorOffX
      absDrawImage(ctx, FILES_DRAGGING, x - this.cursorOffX, y - this.cursorOffY);
    }
  };
}

