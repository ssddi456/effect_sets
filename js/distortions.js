// 
// 向中心收缩
// 
function distort_grid_collapse( grid, distortion, radius ) {
  var last= grid.slice(-1)[0].slice(-1)[0];
  var center = [last[0]/2, last[1]/2];

  return grid_walker( grid, function( point ) {
    var d_x = point[0] - center[0];
    var d_y = point[1] - center[1];
    var dis = Math.pow(d_x,2)+Math.pow(d_y,2);
    var dis_root = Math.sqrt(dis);
    if( dis_root > radius ){
      return point.slice(0);
    }
    var dis_r = (radius-dis_root)/radius;
    var rate = Math.pow(1-Math.sin(0.5*Math.PI*(dis_r)),1.8);

    return [center[0] + rate * d_x,
            center[1] + rate * d_y];
  });
}

function distort_grid_fisheye( grid, distortion, radius ) {
  var last= grid.slice(-1)[0].slice(-1)[0];
  var center = [last[0]/2, last[1]/2];
  var k0;
  
  k0 = Math.exp(distortion);
  k0 = k0 / (k0 - 1) * radius;
  var k1 = distortion / radius;

  return grid_walker( grid, function( point ) {
    var d_x = point[0] - center[0];
    var d_y = point[1] - center[1];
    var dis = Math.pow(d_x,2)+Math.pow(d_y,2);
    var dis_root = Math.sqrt(dis);
    if( dis_root >= radius ){
      return point.slice(0);
    }

    var rate = k0 * (1 - Math.exp(-dis_root * k1)) / dis_root * .75 + .25;

    return [center[0] + rate * d_x,
            center[1] + rate * d_y];
  });
}