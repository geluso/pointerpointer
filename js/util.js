function absX(x) {
  return Math.round(x * window.innerWidth);
}

function absY(y) {
  return Math.round(y * (window.innerHeight - $("#bar").height()));
}

function absDrawImage(ctx, img, x, y, width, height) {
  if (x < 1) x = absX(x);
  if (y < 1) y = absY(y);
  if (width && height) {
    ctx.drawImage(img, x, y, width, height);
  } else {
    ctx.drawImage(img, x, y);
  }
}

function absArc(ctx, x, y, radius, start, end) {
  if (x < 1) x = absX(x);
  if (y < 1) y = absY(y);
  ctx.arc(x, y, radius, start, end);
}

function absMoveTo(ctx, x, y) {
  if (x < 1) x = absX(x);
  if (y < 1) y = absY(y);
  ctx.moveTo(x, y);
}

function absLineTo(ctx, x, y) {
  if (x < 1) x = absX(x);
  if (y < 1) y = absY(y);
  ctx.lineTo(x, y);
}
