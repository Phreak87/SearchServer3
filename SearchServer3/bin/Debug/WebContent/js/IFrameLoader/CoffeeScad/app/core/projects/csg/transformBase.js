(function() {
  define(function(require) {
    var Matrix4x4, Plane, TransformBase, Vector3D, csgMaths;
    csgMaths = require('./maths');
    Matrix4x4 = csgMaths.Matrix4x4;
    Vector3D = csgMaths.Vector3D;
    Plane = csgMaths.Plane;
    TransformBase = (function() {
      function TransformBase(options) {
        this.position = new Vector3D(0, 0, 0);
        this.rotation = new Vector3D(0, 0, 0);
      }

      TransformBase.prototype.mirrored = function(plane) {
        return this.transform(Matrix4x4.mirroring(plane));
      };

      TransformBase.prototype.mirroredX = function() {
        var plane;
        plane = new Plane(new Vector3D(1, 0, 0), 0);
        return this.mirrored(plane);
      };

      TransformBase.prototype.mirroredY = function() {
        var plane;
        plane = new Plane(new Vector3D(0, 1, 0), 0);
        return this.mirrored(plane);
      };

      TransformBase.prototype.mirroredZ = function() {
        var plane;
        plane = new Plane(new Vector3D(0, 0, 1), 0);
        return this.mirrored(plane);
      };

      TransformBase.prototype.translate = function(v) {
        if (this.position != null) {
          if (v instanceof csgMaths.Vector2D) {
            v = v.toVector3D();
          }
          v = new Vector3D(v);
          this.position = this.position.plus(v);
        } else {
          if (v instanceof csgMaths.Vector2D) {
            v = v.toVector3D();
          }
          v = new Vector3D(v);
          this.position = new Vector3D(v);
        }
        return this.transform(Matrix4x4.translation(v));
      };

      TransformBase.prototype.scale = function(f) {
        return this.transform(Matrix4x4.scaling(f));
      };

      TransformBase.prototype.rotateX = function(deg) {
        return this.transform(Matrix4x4.rotationX(deg));
      };

      TransformBase.prototype.rotateY = function(deg) {
        return this.transform(Matrix4x4.rotationY(deg));
      };

      TransformBase.prototype.rotateZ = function(deg) {
        return this.transform(Matrix4x4.rotationZ(deg));
      };

      TransformBase.prototype.rotate = function(degrees, rotationCenter) {
        var xMatrix, yMatrix, zMatrix;
        if (rotationCenter == null) {
          rotationCenter = [0, 0, 0];
        }
        this.translate(rotationCenter);
        xMatrix = Matrix4x4.rotationX(degrees[0]);
        yMatrix = Matrix4x4.rotationY(degrees[1]);
        zMatrix = Matrix4x4.rotationZ(degrees[2]);
        this.transform(xMatrix);
        this.transform(yMatrix);
        this.transform(zMatrix);
        if (this.rotation == null) {
          this.rotation = new Vector3D();
        }
        this.rotation = this.rotation.multiply4x4(yMatrix).transform(yMatrix).transform(zMatrix);
        return this;
      };

      return TransformBase;

    })();
    return TransformBase;
  });

}).call(this);
