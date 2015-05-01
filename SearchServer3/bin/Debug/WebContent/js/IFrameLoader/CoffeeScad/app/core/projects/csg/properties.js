(function() {
  define(function(require) {
    var Connector, Matrix4x4, OrthoNormalBasis, Plane, Properties, Vector3D, csgMaths;
    csgMaths = require('./maths');
    Vector3D = csgMaths.Vector3D;
    Matrix4x4 = csgMaths.Matrix4x4;
    Plane = csgMaths.Plane;
    OrthoNormalBasis = csgMaths.OrthoNormalBasis;
    Properties = (function() {
      function Properties() {}

      Properties.prototype._transform = function(matrix4x4) {
        var result;
        result = new Properties();
        Properties.transformObj(this, result, matrix4x4);
        return result;
      };

      Properties.prototype._merge = function(otherproperties) {
        var result;
        result = new Properties();
        Properties.cloneObj(this, result);
        Properties.addFrom(result, otherproperties);
        return result;
      };

      Properties.transformObj = function(source, result, matrix4x4) {
        var propertyname, propertyvalue, transformed, _results;
        _results = [];
        for (propertyname in source) {
          if (propertyname === "_transform") {
            continue;
          }
          if (propertyname === "_merge") {
            continue;
          }
          propertyvalue = source[propertyname];
          transformed = propertyvalue;
          if (typeof propertyvalue === "object") {
            if (("transform" in propertyvalue) && (typeof propertyvalue.transform === "function")) {
              transformed = propertyvalue.transform(matrix4x4);
            } else if (propertyvalue instanceof Array) {
              transformed = [];
              Properties.transformObj(propertyvalue, transformed, matrix4x4);
            } else if (propertyvalue instanceof Properties) {
              transformed = new Properties();
              Properties.transformObj(propertyvalue, transformed, matrix4x4);
            }
          }
          _results.push(result[propertyname] = transformed);
        }
        return _results;
      };

      Properties.cloneObj = function(source, result) {
        var cloned, i, propertyname, propertyvalue, _results;
        _results = [];
        for (propertyname in source) {
          if (propertyname === "_transform") {
            continue;
          }
          if (propertyname === "_merge") {
            continue;
          }
          propertyvalue = source[propertyname];
          cloned = propertyvalue;
          if (typeof propertyvalue === "object") {
            if (propertyvalue instanceof Array) {
              cloned = [];
              i = 0;
              while (i < propertyvalue.length) {
                cloned.push(propertyvalue[i]);
                i++;
              }
            } else if (propertyvalue instanceof Properties) {
              cloned = new Properties();
              Properties.cloneObj(propertyvalue, cloned);
            }
          }
          _results.push(result[propertyname] = cloned);
        }
        return _results;
      };

      Properties.addFrom = function(result, otherproperties) {
        var propertyname, _results;
        _results = [];
        for (propertyname in otherproperties) {
          if (propertyname === "_transform") {
            continue;
          }
          if (propertyname === "_merge") {
            continue;
          }
          if ((propertyname in result) && (typeof result[propertyname] === "object") && (result[propertyname] instanceof Properties) && (typeof otherproperties[propertyname] === "object") && (otherproperties[propertyname] instanceof Properties)) {
            _results.push(Properties.addFrom(result[propertyname], otherproperties[propertyname]));
          } else {
            if (!(propertyname in result)) {
              _results.push(result[propertyname] = otherproperties[propertyname]);
            } else {
              _results.push(void 0);
            }
          }
        }
        return _results;
      };

      return Properties;

    })();
    Connector = (function() {
      function Connector(point, axisvector, normalvector) {
        this.point = new Vector3D(point);
        this.axisvector = new Vector3D(axisvector).unit();
        this.normalvector = new Vector3D(normalvector).unit();
      }

      Connector.prototype.normalized = function() {
        var axisvector, n, normalvector;
        axisvector = this.axisvector.unit();
        n = this.normalvector.cross(axisvector).unit();
        normalvector = axisvector.cross(n);
        this.axisvector = axisvector;
        this.normalvector = normalvector;
        return this;
      };

      Connector.prototype.transform = function(matrix4x4) {
        var axisvector, normalvector, point;
        point = this.point.multiply4x4(matrix4x4);
        axisvector = this.point.plus(this.axisvector).multiply4x4(matrix4x4).minus(point);
        normalvector = this.point.plus(this.normalvector).multiply4x4(matrix4x4).minus(point);
        this.point = point;
        this.axisvector = axisvector;
        this.normalvector = normalvector;
        return this;
      };

      Connector.prototype.getTransformationTo = function(other, mirror, normalrotation) {
        var angle1, angle2, axesbasis, axesplane, normalsbasis, normalsplane, rotation, transformation, us, usAligned, usAxesAligned;
        mirror = (mirror ? true : false);
        normalrotation = (normalrotation ? Number(normalrotation) : 0);
        us = this.normalized();
        other = other.normalized();
        transformation = Matrix4x4.translation(this.point.negated());
        axesplane = Plane.anyPlaneFromVector3Ds(new Vector3D(0, 0, 0), us.axisvector, other.axisvector);
        axesbasis = new OrthoNormalBasis(axesplane);
        angle1 = axesbasis.to2D(us.axisvector).angle();
        angle2 = axesbasis.to2D(other.axisvector).angle();
        rotation = 180.0 * (angle2 - angle1) / Math.PI;
        if (mirror) {
          rotation += 180.0;
        }
        transformation = transformation.multiply(axesbasis.getProjectionMatrix());
        transformation = transformation.multiply(Matrix4x4.rotationZ(rotation));
        transformation = transformation.multiply(axesbasis.getInverseProjectionMatrix());
        usAxesAligned = us.transform(transformation);
        normalsplane = Plane.fromNormalAndPoint(other.axisvector, new Vector3D(0, 0, 0));
        normalsbasis = new OrthoNormalBasis(normalsplane);
        angle1 = normalsbasis.to2D(usAxesAligned.normalvector).angle();
        angle2 = normalsbasis.to2D(other.normalvector).angle();
        rotation = 180.0 * (angle2 - angle1) / Math.PI;
        rotation += normalrotation;
        transformation = transformation.multiply(normalsbasis.getProjectionMatrix());
        transformation = transformation.multiply(Matrix4x4.rotationZ(rotation));
        transformation = transformation.multiply(normalsbasis.getInverseProjectionMatrix());
        transformation = transformation.multiply(Matrix4x4.translation(other.point));
        usAligned = us.transform(transformation);
        return transformation;
      };

      Connector.prototype.axisLine = function() {
        return new Line3D(this.point, this.axisvector);
      };

      Connector.prototype.extend = function(distance) {
        var newpoint;
        newpoint = this.point.plus(this.axisvector.unit().times(distance));
        return new Connector(newpoint, this.axisvector, this.normalvector);
      };

      return Connector;

    })();
    return {
      "Connector": Connector,
      "Properties": Properties
    };
  });

}).call(this);
