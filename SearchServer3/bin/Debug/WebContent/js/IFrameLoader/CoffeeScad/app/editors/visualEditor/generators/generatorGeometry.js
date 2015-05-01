(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var CoffeeSCadVisitor, GeometryVisitor, OpenJSCadVisitor, OpenSCadVisitor, THREE, cubeGenerator, cylinderGenerator, sphereGenerator;
    THREE = require('three');
    GeometryVisitor = (function() {
      function GeometryVisitor() {
        this.visit = __bind(this.visit, this);
        this.geomInstanceIndices = {};
        this.geomInstanceIndices["cube"] = 0;
        this.geomInstanceIndices["sphere"] = 0;
        this.geomInstanceIndices["cylinder"] = 0;
      }

      GeometryVisitor.prototype.visit = function(geometryObj) {
        console.log("visiting", geometryObj);
        return "";
      };

      return GeometryVisitor;

    })();
    CoffeeSCadVisitor = (function(_super) {
      __extends(CoffeeSCadVisitor, _super);

      function CoffeeSCadVisitor() {
        this.visit = __bind(this.visit, this);
        CoffeeSCadVisitor.__super__.constructor.call(this);
      }

      CoffeeSCadVisitor.prototype.visit = function(geometryObj) {
        var geom, id, meshCode, position, positionStr;
        console.log("visiting", geometryObj);
        geom = geometryObj.geometry;
        position = geometryObj.position;
        positionStr = "";
        if (position.x !== 0 || position.y !== 0 || position.z !== 0) {
          positionStr = ".translate([" + position.x + "," + position.y + "," + position.z + "])";
        }
        if (geom instanceof THREE.CubeGeometry) {
          id = this.geomInstanceIndices["cube"];
          meshCode = ("cube" + id + " = new Cube({size:[" + geom.width + "," + geom.depth + "," + geom.height + "],center:true})") + positionStr;
          this.geomInstanceIndices["cube"] += 1;
          return meshCode;
        } else if (geom instanceof THREE.CylinderGeometry) {
          id = this.geomInstanceIndices["cylinder"];
          meshCode = ("cylinder" + id + " = new Cylinder({r1:" + geom.radiusTop + ",r2:" + geom.radiusBottom + ",h:" + geom.height + ",center:true})") + positionStr;
          this.geomInstanceIndices["cylinder"] += 1;
          return meshCode;
        } else if (geom instanceof THREE.SphereGeometry) {
          id = this.geomInstanceIndices["sphere"];
          meshCode = ("sphere" + id + " = new Sphere({r:" + geom.radius + ",center:true})") + positionStr;
          this.geomInstanceIndices["sphere"] += 1;
          return meshCode;
        }
      };

      return CoffeeSCadVisitor;

    })(GeometryVisitor);
    OpenJSCadVisitor = (function(_super) {
      __extends(OpenJSCadVisitor, _super);

      function OpenJSCadVisitor() {
        this.visit = __bind(this.visit, this);
        OpenJSCadVisitor.__super__.constructor.call(this);
      }

      OpenJSCadVisitor.prototype.visit = function(geometryObj) {
        return console.log("visiting", geometryObj);
      };

      return OpenJSCadVisitor;

    })(GeometryVisitor);
    OpenSCadVisitor = (function(_super) {
      __extends(OpenSCadVisitor, _super);

      function OpenSCadVisitor() {
        this.visit = __bind(this.visit, this);
        OpenSCadVisitor.__super__.constructor.call(this);
      }

      OpenSCadVisitor.prototype.visit = function(geometryObj) {
        var geom, id, meshCode, position, positionStr;
        console.log("visiting", geometryObj);
        geom = geometryObj.geometry;
        position = geometryObj.position;
        positionStr = "";
        if (position.x !== 0 || position.y !== 0 || position.z !== 0) {
          positionStr = ".translate([" + position.x + "," + position.y + "," + position.z + "])";
        }
        if (geom instanceof THREE.CubeGeometry) {
          id = this.geomInstanceIndices["cube"];
          meshCode = ("cube(size=[" + geom.width + "," + geom.depth + "," + geom.height + "],center=true)") + positionStr;
          this.geomInstanceIndices["cube"] += 1;
          return meshCode;
        } else if (geom instanceof THREE.CylinderGeometry) {
          id = this.geomInstanceIndices["cylinder"];
          meshCode = ("cylinder(r1=" + geom.radiusTop + ",r2=" + geom.radiusBottom + ",h=" + geom.height + ",center:true)") + positionStr;
          this.geomInstanceIndices["cylinder"] += 1;
          return meshCode;
        } else if (geom instanceof THREE.SphereGeometry) {
          id = this.geomInstanceIndices["sphere"];
          meshCode = ("sphere(r=" + geom.radius + ",center=true})") + positionStr;
          this.geomInstanceIndices["sphere"] += 1;
          return meshCode;
        }
      };

      return OpenSCadVisitor;

    })(GeometryVisitor);
    cubeGenerator = function(size) {
      var cube;
      size = size || [20, 20, 20];
      cube = new THREE.Mesh(new THREE.CubeGeometry(size[0], size[1], size[2]), new THREE.MeshNormalMaterial());
      cube.accept = (function(_this) {
        return function(visitor) {
          return visitor.visit(cube);
        };
      })(this);
      cube.meta = cube.meta || {};
      cube.meta.startIndex = 0;
      cube.meta.blockLength = 0;
      cube.meta.code = "";
      return cube;
    };
    cylinderGenerator = function(height, r1, r2) {
      var cylinder;
      height = height || 30;
      r1 = r1 || 10;
      r2 = r2 || 10;
      cylinder = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, height), new THREE.MeshNormalMaterial());
      cylinder.accept = (function(_this) {
        return function(visitor) {
          return visitor.visit(cylinder);
        };
      })(this);
      cylinder.meta = cylinder.meta || {};
      cylinder.meta.startIndex = 0;
      cylinder.meta.blockLength = 0;
      cylinder.meta.code = "";
      return cylinder;
    };
    sphereGenerator = function(r) {
      var sphere;
      r = r || 20;
      sphere = new THREE.Mesh(new THREE.SphereGeometry(r), new THREE.MeshNormalMaterial());
      sphere.accept = (function(_this) {
        return function(visitor) {
          return visitor.visit(sphere);
        };
      })(this);
      sphere.meta = sphere.meta || {};
      sphere.meta.startIndex = 0;
      sphere.meta.blockLength = 0;
      sphere.meta.code = "";
      return sphere;
    };
    return {
      "CoffeeSCadVisitor": CoffeeSCadVisitor,
      "OpenJSCadVisitor": OpenJSCadVisitor,
      "OpenSCadVisitor": OpenSCadVisitor,
      "cubeGenerator": cubeGenerator,
      "cylinderGenerator": cylinderGenerator,
      "sphereGenerator": "sphereGenerator",
      sphereGenerator: sphereGenerator
    };
  });

}).call(this);
