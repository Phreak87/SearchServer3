(function() {
  define((function(_this) {
    return function(require) {
      var base, circle, cube, cylinder, geometry2d, geometry3d, log, logging, rectangle, rootAssembly, sphere;
      base = require('./csgBase');
      geometry3d = require('./geometry3d');
      geometry2d = require('./geometry2d');
      logging = require('./logging');
      log = logging.log;
      rootAssembly = base.rootAssembly;
      cube = function(options, parent) {
        var _cube;
        if (parent == null) {
          parent = null;
        }
        _cube = new geometry3d.Cube(options);
        if (parent == null) {
          parent = rootAssembly;
        }
        parent.add(_cube);
        return _cube;
      };
      sphere = function(options, parent) {
        var _sphere;
        if (parent == null) {
          parent = null;
        }
        _sphere = new geometry3d.Sphere(options);
        if (parent == null) {
          parent = rootAssembly;
        }
        parent.add(_sphere);
        return _sphere;
      };
      cylinder = function(options, parent) {
        var _cylinder;
        if (parent == null) {
          parent = null;
        }
        _cylinder = new geometry3d.Cylinder(options);
        if (parent == null) {
          parent = rootAssembly;
        }
        parent.add(_cylinder);
        return _cylinder;
      };
      rectangle = function(options, parent) {
        var _rectangle;
        if (parent == null) {
          parent = null;
        }
        _rectangle = new geometry2d.Rectangle(options);
        if (parent == null) {
          parent = rootAssembly;
        }
        parent.add(_rectangle);
        return _rectangle;
      };
      circle = function(options, parent) {
        var _circle;
        if (parent == null) {
          parent = null;
        }
        _circle = new geometry2d.Circle(options);
        if (parent == null) {
          parent = rootAssembly;
        }
        parent.add(_circle);
        return _circle;
      };
      return {
        "cube": cube,
        "sphere": sphere,
        "cylinder": cylinder,
        "rectangle": rectangle,
        "circle": circle
      };
    };
  })(this));

}).call(this);
