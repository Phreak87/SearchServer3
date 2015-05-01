(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var CAGBase, CSGBase, Circle, Cube, Cylinder, Part, Plane, Rectangle, Sphere, additional, base, classRegistry, classRegistryToId, exports, extend, extras, log, materials, maths, merge, otherRegistry, properties, register, shapes2d, shapes3d, simplifiedApi, utils;
    base = require('./csgBase');
    CSGBase = base.CSGBase;
    CAGBase = base.CAGBase;
    shapes3d = require('./geometry3d');
    shapes2d = require('./geometry2d');
    Cube = shapes3d.Cube;
    Sphere = shapes3d.Sphere;
    Cylinder = shapes3d.Cylinder;
    Rectangle = shapes2d.Rectangle;
    Circle = shapes2d.Circle;
    maths = require('./maths');
    Plane = maths.Plane;
    extras = require('./extras');
    properties = require('./properties');
    materials = require('./materials');
    log = require('./logging');
    utils = require('./utils');
    merge = utils.merge;
    extend = utils.extend;
    simplifiedApi = require('./simplifiedApi');
    classRegistry = {};
    classRegistryToId = {};
    otherRegistry = {};
    register = (function(_this) {
      return function(classname, klass, params) {

        /*Registers a class (instance) based on its name,  
        and params (different params need to show up as different object in the bom for examples)
         */
        var compressedParams;
        if (params == null) {
          compressedParams = "";
        } else {
          compressedParams = JSON.stringify(params);
        }
        if (!(classname in classRegistry)) {
          classRegistry[classname] = {};
          otherRegistry[classname] = {};
        }
        if (!(compressedParams in classRegistry[classname])) {
          classRegistry[classname][compressedParams] = {};
          classRegistry[classname][compressedParams].quantity = 0;
          classRegistry[classname][compressedParams].uids = [];
        }
        classRegistry[classname][compressedParams].quantity += 1;
        classRegistry[classname][compressedParams].uids.push(klass.uid);
        return otherRegistry[classname] = klass;
      };
    })(this);
    Part = (function(_super) {
      __extends(Part, _super);

      function Part(options) {
        var defaults, parent;
        Part.__super__.constructor.call(this, options);
        parent = this.__proto__.__proto__.constructor.name;
        register(this.__proto__.constructor.name, this, options);
        defaults = {
          manufactured: true
        };
        options = merge(defaults, options);
        this.manufactured = options.manufactured;
      }

      return Part;

    })(CSGBase);
    additional = {
      "Part": Part,
      "register": register,
      "classRegistry": classRegistry,
      "otherRegistry": otherRegistry
    };
    exports = merge(shapes2d, shapes3d);
    exports = merge(exports, base);
    exports = merge(exports, maths);
    exports = merge(exports, extras);
    exports = merge(exports, properties);
    exports = merge(exports, additional);
    exports = merge(exports, materials);
    exports = merge(exports, simplifiedApi);
    exports = merge(exports, log);
    exports = merge(exports, utils);
    return exports;
  });

}).call(this);
