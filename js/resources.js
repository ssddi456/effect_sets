function create_canvas ( w, h ) {
  var canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height= h;
  return canvas;
}

function load_img ( path, done ) {
  var img = new Image;
  img.onload = function() {
    done(null,img);
    done = function(){}
  }
  img.onerror = function(err) {
    done(err);
    done = function(){}
  }
  img.src = path;
}

function load_imgs ( paths, done) {
  var len = paths.length;
  var ret = [];
  function finish ( idx ) {
    return function ( err, img ) {
      len --;
      ret[idx] = err || img;
      if( len == 0 ){
        done(null,ret);
      }
    }
  }
  paths.forEach(function( path, idx ) {
    load_img(path,finish(idx));
  });
}

function get_img_data(img, w, h) {
  w = w || img.width;
  h = h || img.height;
  var canvas = create_canvas( w, h );
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  var ret = ctx.getImageData( 0, 0, w, h);
  ctx = null;
  canvas = null;
  return ret;
};