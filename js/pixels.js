//
// 像素和网格操作相关方法
// 

function get_skips ( w, point ) {
    return point[1] * w * 4 
         + point[0] * 4;
}

function set_pixel( imgdata, point, pixel ) {
  var w = imgdata.width;
  var skips = get_skips(w, point);
  var data = imgdata.data;
  data[skips     ] = pixel[0];
  data[skips + 1 ] = pixel[1];
  data[skips + 2 ] = pixel[2];
  data[skips + 3 ] = pixel[3];
}

function get_pixel ( imgdata, point ) {
  var w = imgdata.width;
  var data= imgdata.data;
  var skips = get_skips(w, point);
  return [
          data[skips  ],
          data[skips+1],
          data[skips+2],
          data[skips+3]
        ];
}

function chip ( x, y, w, h ) {
  this.x = x;
  this.y = y;
  this.x1= x+w;
  this.y1= y+h;
  this.w = w;
  this.h = h;
  this.tl = [x,y];
  this.tr = [this.x1,y];
  this.bl = [x,this.y1];
  this.br = [this.x1,this.y1];
}
chip.prototype.walk = function( walker ) {
  var j;
  for(var i =this.y;i<this.y1;i++){
    for(j=this.x;j<this.x1;j++){
      walker(j, i);
    }
  }
}
chip.prototype.async_walk = function( walker, done ) {
  var i = 0;
  var j = 0;
  var self = this;
  function next () {
    if( i || j ){
      if( j >= self.x1 ){
        j = 0;
        i ++;
      }
      if( i >= self.y1 ){
        return done && done();
      }
    }
    walker(j,i, next);
    j ++;
  }
  next();
}

function poly( tl, tr, bl, br ) {
  this.tl = tl;
  this.tr = tr;
  this.bl = bl;
  this.br = br;
}

function create_grid( n, m ) {
  var ret = [];
  var line;
  var j;
  for(var i = 0; i < m; i ++ ){
    ret.push((line = []));
    for(j = 0; j < n; j ++ ){
      line.push([j,i]);
    }
  }
  return ret;
}

function grid_walker(grid,walker) {
  var ret = [];
  var line;
  var r_line;
  var point;
  var j;
  var n;
  var m = grid.length;
  for(var i =0;i<m;i++){
    line = grid[i];
    ret.push((r_line = []));
    n = line.length;
    for(j=0;j<n;j++){
      r_line.push(walker(line[j],line,j,i ));
    }
  }
  return ret;
}

function trans_chip ( t, s ) {
  function get_line_h (ry) {
    return [ r_on_line( s.tl, s.bl, ry), 
             r_on_line( s.tr, s.br, ry) ];
  }
  function get_line_v (rx) {
    return [ r_on_line( s.tl, s.tr, rx), 
             r_on_line( s.bl, s.br, rx) ];
  }
  return function transfer ( x, y ) {
    return get_line_cross_point(
            get_line_h( (y - t.y)/t.h ),
            get_line_v( (x - t.x)/t.w ));
  }
}

function trans_img_chip( target_chip, source_chip,
                         target_data, source_data ) {
  var transfer = trans_chip( target_chip, source_chip );
  target_chip.walk(function( x, y ) {
    set_pixel( target_data, [Math.floor(x),Math.floor(y)],
      get_pixel( source_data, transfer(x,y)));
  });
}
