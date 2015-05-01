(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var CSGBase, Connector, Cube, Cylinder, Polygon, Properties, RoundedCube, Sphere, Vector3D, Vertex, base, maths, parseCenter, parseOptionAs3DVector, parseOptionAsBool, parseOptionAsFloat, parseOptionAsInt, properties, utils;
    base = require('./csgBase');
    CSGBase = base.CSGBase;
    maths = require('./maths');
    Vertex = maths.Vertex;
    Vector3D = maths.Vector3D;
    Polygon = maths.Polygon;
    properties = require('./properties');
    Properties = properties.Properties;
    Connector = properties.Connector;
    utils = require('./utils');
    parseOptionAs3DVector = utils.parseOptionAs3DVector;
    parseOptionAsFloat = utils.parseOptionAsFloat;
    parseOptionAsInt = utils.parseOptionAsInt;
    parseOptionAsBool = utils.parseOptionAsBool;
    parseCenter = utils.parseCenter;
    Cube = (function(_super) {
      __extends(Cube, _super);

      function Cube(options) {
        var center, cornerRadius, cornerResolution, defaults, size;
        options = options || {};
        defaults = {
          size: [1, 1, 1],
          center: [0, 0, 0],
          r: 0,
          $fn: 0
        };
        Cube.__super__.constructor.call(this, options);
        size = parseOptionAs3DVector(options, "size", defaults["size"]);
        center = parseCenter(options, "center", size.dividedBy(2), defaults["center"], Vector3D);
        if (size.x < 0 || size.y < 0 || size.z < 0) {
          throw new Error("Cube size should be non-negative");
        }
        cornerRadius = parseOptionAsFloat(options, "r", 0);
        cornerResolution = parseOptionAsFloat(options, "$fn", 0);
        if (cornerResolution < 4) {
          cornerResolution = 4;
        }
        this.polygons = [[[0, 4, 6, 2], [-1, 0, 0]], [[1, 3, 7, 5], [+1, 0, 0]], [[0, 1, 5, 4], [0, -1, 0]], [[2, 6, 7, 3], [0, +1, 0]], [[0, 2, 3, 1], [0, 0, -1]], [[4, 5, 7, 6], [0, 0, +1]]].map(function(info) {
          var normal, vertices;
          normal = new Vector3D(info[1]);
          vertices = info[0].map(function(i) {
            var pos;
            pos = new Vector3D(center.x + size.x / 2 * (2 * !!(i & 1) - 1), center.y + size.y / 2 * (2 * !!(i & 2) - 1), center.z + size.z / 2 * (2 * !!(i & 4) - 1));
            return new Vertex(pos);
          });
          return new Polygon(vertices, null);
        });
        this.properties.cube = new Properties();
        this.properties.cube.center = new Vector3D(center);
        this.properties.cube.facecenters = [new Connector(new Vector3D([size.x, 0, 0]).plus(center), [1, 0, 0], [0, 0, 1]), new Connector(new Vector3D([-size.x, 0, 0]).plus(center), [-1, 0, 0], [0, 0, 1]), new Connector(new Vector3D([0, size.y, 0]).plus(center), [0, 1, 0], [0, 0, 1]), new Connector(new Vector3D([0, -size.y, 0]).plus(center), [0, -1, 0], [0, 0, 1]), new Connector(new Vector3D([0, 0, size.z]).plus(center), [0, 0, 1], [1, 0, 0]), new Connector(new Vector3D([0, 0, -size.z]).plus(center), [0, 0, -1], [1, 0, 0])];
        this.isCanonicalized = false;
        this.isRetesselated = false;
      }

      return Cube;

    })(CSGBase);
    RoundedCube = (function(_super) {
      __extends(RoundedCube, _super);

      function RoundedCube(options) {
        var center, cuberadius, cylinder, d, innercuberadius, level, p1, p2, p3, p4, resolution, result, roundradius, sphere, z;
        center = parseOptionAs3DVector(options, "center", [0, 0, 0]);
        cuberadius = parseOptionAs3DVector(options, "radius", [1, 1, 1]);
        resolution = parseOptionAsFloat(options, "resolution", CSGBase.defaultResolution3D);
        if (resolution < 4) {
          resolution = 4;
        }
        roundradius = parseOptionAsFloat(options, "roundradius", 0.2);
        innercuberadius = cuberadius;
        innercuberadius = innercuberadius.minus(new Vector3D(roundradius));
        result = new Cube({
          center: center,
          radius: [cuberadius.x, innercuberadius.y, innercuberadius.z]
        });
        result = result.unionSub(new Cube({
          center: center,
          radius: [innercuberadius.x, cuberadius.y, innercuberadius.z]
        }), false, false);
        result = result.unionSub(new Cube({
          center: center,
          radius: [innercuberadius.x, innercuberadius.y, cuberadius.z]
        }), false, false);
        level = 0;
        while (level < 2) {
          z = innercuberadius.z;
          if (level === 1) {
            z = -z;
          }
          p1 = new Vector3D(innercuberadius.x, innercuberadius.y, z).plus(center);
          p2 = new Vector3D(innercuberadius.x, -innercuberadius.y, z).plus(center);
          p3 = new Vector3D(-innercuberadius.x, -innercuberadius.y, z).plus(center);
          p4 = new Vector3D(-innercuberadius.x, innercuberadius.y, z).plus(center);
          sphere = Sphere({
            center: p1,
            radius: roundradius,
            resolution: resolution
          });
          result = result.unionSub(sphere, false, false);
          sphere = new Sphere({
            center: p2,
            radius: roundradius,
            resolution: resolution
          });
          result = result.unionSub(sphere, false, false);
          sphere = new Sphere({
            center: p3,
            radius: roundradius,
            resolution: resolution
          });
          result = result.unionSub(sphere, false, false);
          sphere = new Sphere({
            center: p4,
            radius: roundradius,
            resolution: resolution
          });
          result = result.unionSub(sphere, false, true);
          cylinder = new Cylinder({
            start: p1,
            end: p2,
            radius: roundradius,
            resolution: resolution
          });
          result = result.unionSub(cylinder, false, false);
          cylinder = new Cylinder({
            start: p2,
            end: p3,
            radius: roundradius,
            resolution: resolution
          });
          result = result.unionSub(cylinder, false, false);
          cylinder = new Cylinder({
            start: p3,
            end: p4,
            radius: roundradius,
            resolution: resolution
          });
          result = result.unionSub(cylinder, false, false);
          cylinder = new Cylinder({
            start: p4,
            end: p1,
            radius: roundradius,
            resolution: resolution
          });
          result = result.unionSub(cylinder, false, false);
          if (level === 0) {
            d = new Vector3D(0, 0, -2 * z);
            cylinder = new Cylinder({
              start: p1,
              end: p1.plus(d),
              radius: roundradius,
              resolution: resolution
            });
            result = result.unionSub(cylinder);
            cylinder = new Cylinder({
              start: p2,
              end: p2.plus(d),
              radius: roundradius,
              resolution: resolution
            });
            result = result.unionSub(cylinder);
            cylinder = new Cylinder({
              start: p3,
              end: p3.plus(d),
              radius: roundradius,
              resolution: resolution
            });
            result = result.unionSub(cylinder);
            cylinder = new Cylinder({
              start: p4,
              end: p4.plus(d),
              radius: roundradius,
              resolution: resolution
            });
            result = result.unionSub(cylinder, false, true);
          }
          level++;
        }
        result = result.reTesselated();
        result.properties.roundedCube = new Properties();
        result.properties.roundedCube.center = new Vertex(center);
        result.properties.roundedCube.facecenters = [new Connector(new Vector3D([cuberadius.x, 0, 0]).plus(center), [1, 0, 0], [0, 0, 1]), new Connector(new Vector3D([-cuberadius.x, 0, 0]).plus(center), [-1, 0, 0], [0, 0, 1]), new Connector(new Vector3D([0, cuberadius.y, 0]).plus(center), [0, 1, 0], [0, 0, 1]), new Connector(new Vector3D([0, -cuberadius.y, 0]).plus(center), [0, -1, 0], [0, 0, 1]), new Connector(new Vector3D([0, 0, cuberadius.z]).plus(center), [0, 0, 1], [1, 0, 0]), new Connector(new Vector3D([0, 0, -cuberadius.z]).plus(center), [0, 0, -1], [1, 0, 0])];
        this.properties = result.properties;
        this.polygons = result.polygons;
        this.isCanonicalized = result.isCanonicalized;
        this.isRetesselated = result.isRetesselated;
      }

      return RoundedCube;

    })(CSGBase);
    Sphere = (function(_super) {
      __extends(Sphere, _super);

      function Sphere(options) {
        var angle, center, cospitch, cylinderpoint, defaults, diameter, hasRadius, pitch, polygons, prevcospitch, prevcylinderpoint, prevsinpitch, qresolution, radius, resolution, sinpitch, slice1, slice2, vertices, xvector, yvector, zvector;
        options = options || {};
        if ("r" in options) {
          hasRadius = true;
        }
        defaults = {
          r: 1,
          d: 2,
          center: [0, 0, 0],
          $fn: CSGBase.defaultResolution3D
        };
        Sphere.__super__.constructor.call(this, options);
        diameter = parseOptionAsFloat(options, "d", defaults["d"]);
        radius = diameter / 2;
        if (hasRadius) {
          radius = parseOptionAsFloat(options, "r", radius);
        }
        center = parseCenter(options, "center", defaults["center"], defaults["center"], Vector3D);
        resolution = parseOptionAsInt(options, "$fn", CSGBase.defaultResolution3D);
        if (radius < 0) {
          throw new Error("Sphere Radius/diameter should be non-negative");
        }
        if (resolution < 0) {
          throw new Error("Sphere Resolution should be non-negative");
        }
        xvector = void 0;
        yvector = void 0;
        zvector = void 0;
        if ("axes" in options) {
          xvector = options.axes[0].unit().times(radius);
          yvector = options.axes[1].unit().times(radius);
          zvector = options.axes[2].unit().times(radius);
        } else {
          xvector = new Vector3D([1, 0, 0]).times(radius);
          yvector = new Vector3D([0, -1, 0]).times(radius);
          zvector = new Vector3D([0, 0, 1]).times(radius);
        }
        if (resolution < 4) {
          resolution = 4;
        }
        qresolution = Math.round(resolution / 4);
        prevcylinderpoint = void 0;
        polygons = [];
        slice1 = 0;
        while (slice1 <= resolution) {
          angle = Math.PI * 2.0 * slice1 / resolution;
          cylinderpoint = xvector.times(Math.cos(angle)).plus(yvector.times(Math.sin(angle)));
          if (slice1 > 0) {
            vertices = [];
            prevcospitch = void 0;
            prevsinpitch = void 0;
            slice2 = 0;
            while (slice2 <= qresolution) {
              pitch = 0.5 * Math.PI * slice2 / qresolution;
              cospitch = Math.cos(pitch);
              sinpitch = Math.sin(pitch);
              if (slice2 > 0) {
                vertices = [];
                vertices.push(new Vertex(center.plus(prevcylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))));
                vertices.push(new Vertex(center.plus(cylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))));
                if (slice2 < qresolution) {
                  vertices.push(new Vertex(center.plus(cylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))));
                }
                vertices.push(new Vertex(center.plus(prevcylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))));
                polygons.push(new Polygon(vertices));
                vertices = [];
                vertices.push(new Vertex(center.plus(prevcylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))));
                vertices.push(new Vertex(center.plus(cylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))));
                if (slice2 < qresolution) {
                  vertices.push(new Vertex(center.plus(cylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))));
                }
                vertices.push(new Vertex(center.plus(prevcylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))));
                vertices.reverse();
                polygons.push(new Polygon(vertices));
              }
              prevcospitch = cospitch;
              prevsinpitch = sinpitch;
              slice2++;
            }
          }
          prevcylinderpoint = cylinderpoint;
          slice1++;
        }
        this.polygons = polygons;
        this.isCanonicalized = false;
        this.isRetesselated = false;
        this.properties.sphere = new Properties();
        this.properties.sphere.center = new Vector3D(center);
        this.properties.sphere.facepoint = center.plus(xvector);
      }

      return Sphere;

    })(CSGBase);
    Cylinder = (function(_super) {
      __extends(Cylinder, _super);

      function Cylinder(options) {
        var axisX, axisY, axisZ, center, defaults, e, end, h, halfHeightVect, hasRadius, i, max, min, point, polygons, rEnd, rStart, radius, radiusOffset, ray, reducedEnd, reducedStart, roundEnds, s, slices, start, t0, t1;
        options = options || {};
        if ("r" in options || "r1" in options) {
          hasRadius = true;
        }
        defaults = {
          h: 1,
          center: [0, 0, 0],
          r: 1,
          d: 2,
          $fn: CSGBase.defaultResolution2D,
          rounded: false
        };
        Cylinder.__super__.constructor.call(this, options);
        point = function(stack, slice, radius) {
          var angle, out, pos;
          angle = slice * Math.PI * 2;
          out = axisX.times(Math.cos(angle)).plus(axisY.times(Math.sin(angle)));
          pos = s.plus(ray.times(stack)).plus(out.times(radius));
          return new Vertex(pos);
        };
        h = parseOptionAsFloat(options, "h", defaults["h"]);
        s = new Vector3D([0, 0, -h / 2]);
        e = new Vector3D([0, 0, h / 2]);
        radius = parseOptionAsFloat(options, "d", defaults["d"]) / 2;
        rEnd = parseOptionAsFloat(options, "d1", radius * 2) / 2;
        rStart = parseOptionAsFloat(options, "d2", radius * 2) / 2;
        if (hasRadius) {
          radius = parseOptionAsFloat(options, "r", radius);
          rEnd = parseOptionAsFloat(options, "r2", radius);
          rStart = parseOptionAsFloat(options, "r1", radius);
        }
        min = s.min(e);
        max = s.max(e);
        halfHeightVect = max.minus(min).dividedBy(2);
        center = parseCenter(options, "center", halfHeightVect, defaults["center"], Vector3D);
        s = center.minus(halfHeightVect);
        e = center.plus(halfHeightVect);
        if ((rEnd < 0) || (rStart < 0)) {
          throw new Error("Radius should be non-negative");
        }
        if ((rEnd === 0) && (rStart === 0)) {
          throw new Error("Either radiusStart or radiusEnd should be positive");
        }
        roundEnds = parseOptionAsBool(options, "rounded", false);
        if (roundEnds) {
          radiusOffset = new Vector3D(0, 0, radius);
          reducedEnd = e.minus(radiusOffset);
          reducedStart = s.plus(radiusOffset);
          if (reducedEnd.lengthSquared() === 0 && reducedStart.lengthSquared() === 0) {
            throw new Error("Size with roundings is too small");
          }
          s = reducedStart;
          e = reducedEnd;
        }
        slices = parseOptionAsFloat(options, "$fn", defaults["$fn"]);
        ray = e.minus(s);
        axisZ = ray.unit();
        axisX = axisZ.randomNonParallelVector().unit();
        axisY = axisX.cross(axisZ).unit();
        start = new Vertex(s);
        end = new Vertex(e);
        polygons = [];
        i = 0;
        while (i < slices) {
          t0 = i / slices;
          t1 = (i + 1) / slices;
          if (rEnd === rStart) {
            polygons.push(new Polygon([start, point(0, t0, rEnd), point(0, t1, rEnd)]));
            polygons.push(new Polygon([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]));
            polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]));
          } else {
            if (rStart > 0) {
              polygons.push(new Polygon([start, point(0, t0, rStart), point(0, t1, rStart)]));
              polygons.push(new Polygon([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]));
            }
            if (rEnd > 0) {
              polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]));
              polygons.push(new Polygon([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]));
            }
          }
          i++;
        }
        this.polygons = polygons;
        this.isCanonicalized = false;
        this.isRetesselated = false;
        this.properties.cylinder = new Properties();
        this.properties.cylinder.start = new Connector(s, axisZ.negated(), axisX);
        this.properties.cylinder.end = new Connector(e, axisZ, axisX);
        this.properties.cylinder.facepoint = s.plus(axisX.times(rStart));
        if (roundEnds) {
          this.union(new Sphere({
            r: radius,
            $fn: slices
          }).translate(e));
          this.union(new Sphere({
            r: radius,
            $fn: slices
          }).translate(s));
        }
      }

      return Cylinder;

    })(CSGBase);
    return {
      "Cube": Cube,
      "Sphere": Sphere,
      "Cylinder": Cylinder
    };
  });

}).call(this);
