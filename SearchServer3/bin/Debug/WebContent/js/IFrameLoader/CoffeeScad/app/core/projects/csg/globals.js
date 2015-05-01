(function() {
  define(function(require) {
    var all, back, bottom, defaultResolution2D, defaultResolution3D, front, getTag, left, right, staticTag, top, _CSGDEBUG;
    _CSGDEBUG = false;
    defaultResolution2D = 32;
    defaultResolution3D = 12;
    all = 0;
    top = 1;
    bottom = 2;
    left = 3;
    right = 4;
    front = 5;
    back = 6;
    staticTag = 1;
    getTag = function() {
      return staticTag++;
    };
    return {
      "_CSGDEBUG": _CSGDEBUG,
      "defaultResolution2D": defaultResolution2D,
      "defaultResolution3D": defaultResolution3D,
      "all": "all",
      all: all,
      "top": top,
      "bottom": bottom,
      "left": left,
      "right": right,
      "front": front,
      "back": back,
      "staticTag": staticTag,
      "getTag": getTag
    };
  });

}).call(this);
