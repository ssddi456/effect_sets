function r_on_line ( start, end, rate ) {
  return [start[0] + (end[0] - start[0]) * rate,
          start[1] + (end[1] - start[1]) * rate];
}

function get_line_cross_point ( line_a, line_b ) {
  //线段ab的法线N1  
  var nx1 = line_a[1][1] - line_a[0][1];
  var ny1 = line_a[0][0] - line_a[1][0];

  //线段cd的法线N2  
  var nx2 = line_b[1][1] - line_b[0][1];
  var ny2 = line_b[0][0] - line_b[1][0];

  //两条法线做叉乘, 如果结果为0, 
  //说明线段ab和线段cd平行或共线,不相交  
  var denominator = nx1*ny2 - ny1*nx2;  
  if (denominator==0) {  
      return false;  
  }
    
  //在法线N2上的投影  
  var distC_N2=nx2 * line_b[0][0] + ny2 * line_b[0][1];
  var distA_N2=nx2 * line_a[0][0] + ny2 * line_a[0][1]-distC_N2;  

  //计算交点坐标  
  var fraction= distA_N2 / denominator;  
  var dx= fraction * ny1,  
      dy= -fraction * nx1;  
  return [ (0.5 + line_a[0][0] + dx) << 0,
           (0.5 + line_a[0][1] + dy) << 0];
}

function bbox ( source ) {
  function dqs ( a, b ) {
    return a-b;
  }

  var s_tl = source[0][0];
  var s_tr = source[0].slice(-1)[0];

  var last_l = source.slice(-1)[0];
  var s_bl = last_l[0];
  var s_br = last_l.slice(-1)[0];

  var xs = [s_tl[0],s_tr[0],s_bl[0],s_br[0]].sort(dqs);
  var ys = [s_tl[1],s_tr[1],s_bl[1],s_br[1]].sort(dqs);

  var tl = [ xs[0], ys[0] ];
  var br = [ xs.slice(-1)[0], ys.slice(-1)[0] ];

  return [tl,br];
}