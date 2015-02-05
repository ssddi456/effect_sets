function draw_line( ctx, line, close ) {
  ctx.beginPath();
  line.forEach(function( point, idx ) {
    ctx[idx?'lineTo':'moveTo'](point[0],point[1]);
  });
  close && ctx.closePath();
  ctx.stroke();
}

function draw_grid( ctx, grid, color ) {
  ctx.beginPath();
  grid.forEach(function( line, idx, lines ) {

    line.forEach(function( point, jdx, points){
      ctx[ jdx ?'lineTo' :'moveTo']
        .apply(ctx,point);
    });

    line.forEach(function( point, jdx, points) {
      grid.forEach(function( line, idx ) {
        ctx[ idx ?'lineTo' :'moveTo']
          .apply(ctx,line[jdx]);
      });
    });

  });
  ctx.strokeStyle = color;
  ctx.stroke();
}