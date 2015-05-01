(function() {
  define(function(require) {
    var IsFloat, Line2D, Line3D, Matrix4x4, OrthoNormalBasis, Path2D, Plane, Polygon, PolygonShared, Side, Vector2D, Vector3D, Vertex, Vertex2D, getTag, globals, solve2Linear, staticTag, _CSGDEBUG;
    Function.prototype.property = function(prop, desc) {
      return Object.defineProperty(this.prototype, prop, desc);
    };
    globals = require('./globals');
    _CSGDEBUG = globals._CSGDEBUG;
    staticTag = globals.staticTag;
    getTag = globals.getTag;
    IsFloat = function(n) {
      return (!isNaN(n)) || (n === Infinity) || (n === -Infinity);
    };
    solve2Linear = function(a, b, c, d, u, v) {
      var det, invdet, x, y;
      det = a * d - b * c;
      invdet = 1.0 / det;
      x = u * d - b * v;
      y = -u * c + a * v;
      x *= invdet;
      y *= invdet;
      return [x, y];
    };
    Vector2D = (function() {
      function Vector2D(x, y) {
        var ok, v;
        if (arguments.length === 2) {
          this._x = parseFloat(x);
          this._y = parseFloat(y);
        } else {
          ok = true;
          if (arguments.length === 0) {
            this._x = 0;
            this._y = 0;
          } else if (arguments.length === 1) {
            if (typeof x === "object") {
              if (x instanceof Vector2D) {
                this._x = x._x;
                this._y = x._y;
              } else if (x instanceof Array) {
                this._x = parseFloat(x[0]);
                this._y = parseFloat(x[1]);
              } else if (("x" in x) && ("y" in x)) {
                this._x = parseFloat(x.x);
                this._y = parseFloat(x.y);
              } else {
                ok = false;
              }
            } else {
              v = parseFloat(x);
              this._x = v;
              this._y = v;
            }
          } else {
            ok = false;
          }
          if (ok) {
            if ((!IsFloat(this._x)) || (!IsFloat(this._y))) {
              ok = false;
            }
          }
          if (!ok) {
            throw new Error("wrong arguments");
          }
        }
      }

      Vector2D.property('x', {
        get: function() {
          return this._x;
        },
        set: function(v) {
          throw new Error("Vector2D is immutable");
        }
      });

      Vector2D.property('y', {
        get: function() {
          return this._y;
        },
        set: function(v) {
          throw new Error("Vector2D is immutable");
        }
      });

      Vector2D.fromAngle = function(radians) {
        return Vector2D.fromAngleRadians(radians);
      };

      Vector2D.fromAngleDegrees = function(degrees) {
        var radians;
        radians = Math.PI * degrees / 180;
        return Vector2D.fromAngleRadians(radians);
      };

      Vector2D.fromAngleRadians = function(radians) {
        return new Vector2D(Math.cos(radians), Math.sin(radians));
      };

      Vector2D.prototype.toVector3D = function(z) {
        if (z == null) {
          z = 0;
        }
        return new Vector3D(this._x, this._y, z);
      };

      Vector2D.prototype.equals = function(a) {
        return (this._x === a._x) && (this._y === a._y);
      };

      Vector2D.prototype.clone = function() {
        return new Vector2D(this._x, this._y);
      };

      Vector2D.prototype.negated = function() {
        return new Vector2D(-this._x, -this._y);
      };

      Vector2D.prototype.plus = function(a) {
        return new Vector2D(this._x + a._x, this._y + a._y);
      };

      Vector2D.prototype.minus = function(a) {
        return new Vector2D(this._x - a._x, this._y - a._y);
      };

      Vector2D.prototype.times = function(a) {
        return new Vector2D(this._x * a, this._y * a);
      };

      Vector2D.prototype.dividedBy = function(a) {
        return new Vector2D(this._x / a, this._y / a);
      };

      Vector2D.prototype.dot = function(a) {
        return this._x * a._x + this._y * a._y;
      };

      Vector2D.prototype.lerp = function(a, t) {
        return this.plus(a.minus(this).times(t));
      };

      Vector2D.prototype.length = function() {
        return Math.sqrt(this.dot(this));
      };

      Vector2D.prototype.distanceTo = function(a) {
        return this.minus(a).length();
      };

      Vector2D.prototype.distanceToSquared = function(a) {
        return this.minus(a).lengthSquared();
      };

      Vector2D.prototype.lengthSquared = function() {
        return this.dot(this);
      };

      Vector2D.prototype.normalize = function() {
        return this.dividedBy(this.length());
      };

      Vector2D.prototype.setLength = function(l) {
        return this.normal().times(l);
      };

      Vector2D.prototype.unit = function() {
        return this.dividedBy(this.length());
      };

      Vector2D.prototype.cross = function(a) {
        return this._x * a._y - this._y * a._x;
      };

      Vector2D.prototype.normal = function() {
        return new Vector2D(this._y, -this._x);
      };

      Vector2D.prototype.multiply4x4 = function(matrix4x4) {
        return matrix4x4.leftMultiply1x2Vector(this);
      };

      Vector2D.prototype.transform = function(matrix4x4) {
        return matrix4x4.leftMultiply1x2Vector(this);
      };

      Vector2D.prototype.angle = function() {
        return this.angleRadians();
      };

      Vector2D.prototype.angleDegrees = function() {
        var radians;
        radians = this.angleRadians();
        return 180 * radians / Math.PI;
      };

      Vector2D.prototype.angleRadians = function() {
        return Math.atan2(this._y, this._x);
      };

      Vector2D.prototype.min = function(p) {
        return new Vector2D(Math.min(this._x, p._x), Math.min(this._y, p._y));
      };

      Vector2D.prototype.max = function(p) {
        return new Vector2D(Math.max(this._x, p._x), Math.max(this._y, p._y));
      };

      Vector2D.prototype.toString = function() {
        return "(" + this._x + ", " + this._y + ")";
      };

      return Vector2D;

    })();
    Vector3D = (function() {
      function Vector3D(x, y, z) {
        var ok, v;
        if (arguments.length === 3) {
          this._x = parseFloat(x);
          this._y = parseFloat(y);
          this._z = parseFloat(z);
        } else if (arguments.length === 2) {
          this._x = parseFloat(x);
          this._y = parseFloat(y);
        } else if (arguments.length === 0) {
          this._x = 0;
          this._y = 0;
          this._z = 0;
        } else {
          ok = true;
          if (arguments.length === 1) {
            if (typeof x === "object") {
              if (x instanceof Vector3D) {
                this._x = x._x;
                this._y = x._y;
                this._z = x._z;
              } else if (x instanceof Vector2D) {
                this._x = x._x;
                this._y = x._y;
                this._z = 0;
              } else if (x instanceof Array) {
                if ((x.length < 2) || (x.length > 3)) {
                  ok = false;
                } else {
                  this._x = parseFloat(x[0]);
                  this._y = parseFloat(x[1]);
                  if (x.length === 3) {
                    this._z = parseFloat(x[2]);
                  } else {
                    this._z = 0;
                  }
                }
              } else if (("x" in x) && ("y" in x)) {
                this._x = parseFloat(x.x);
                this._y = parseFloat(x.y);
                if ("z" in x) {
                  this._z = parseFloat(x.z);
                } else {
                  this._z = 0;
                }
              } else {
                ok = false;
              }
            } else {
              if (x == null) {
                this._x = 0;
                this._y = 0;
                this._z = 0;
              } else {
                v = parseFloat(x);
                this._x = v;
                this._y = v;
                this._z = v;
              }
            }
          } else {
            ok = false;
          }
          if (ok) {
            if ((!IsFloat(this._x)) || (!IsFloat(this._y)) || (!IsFloat(this._z))) {
              ok = false;
            }
          }
          if (!ok) {
            throw new Error("wrong arguments");
          }
        }
      }

      Vector3D.property('x', {
        get: function() {
          return this._x;
        },
        set: function(v) {
          throw new Error("Vector3D is immutable");
        }
      });

      Vector3D.property('y', {
        get: function() {
          return this._y;
        },
        set: function(v) {
          throw new Error("Vector3D is immutable");
        }
      });

      Vector3D.property('z', {
        get: function() {
          return this._z;
        },
        set: function(v) {
          throw new Error("Vector3D is immutable");
        }
      });

      Vector3D.prototype.clone = function() {
        return new Vector3D(this);
      };

      Vector3D.prototype.negated = function() {
        return new Vector3D(-this._x, -this._y, -this._z);
      };

      Vector3D.prototype.abs = function() {
        return new Vector3D(Math.abs(this._x), Math.abs(this._y), Math.abs(this._z));
      };

      Vector3D.prototype.plus = function(a) {
        return new Vector3D(this._x + a._x, this._y + a._y, this._z + a._z);
      };

      Vector3D.prototype.minus = function(a) {
        return new Vector3D(this._x - a._x, this._y - a._y, this._z - a._z);
      };

      Vector3D.prototype.times = function(a) {
        return new Vector3D(this._x * a, this._y * a, this._z * a);
      };

      Vector3D.prototype.dividedBy = function(a) {
        return new Vector3D(this._x / a, this._y / a, this._z / a);
      };

      Vector3D.prototype.dot = function(a) {
        return this._x * a._x + this._y * a._y + this._z * a._z;
      };

      Vector3D.prototype.lerp = function(a, t) {
        return this.plus(a.minus(this).times(t));
      };

      Vector3D.prototype.lengthSquared = function() {
        return this.dot(this);
      };

      Vector3D.prototype.length = function() {
        return Math.sqrt(this.lengthSquared());
      };

      Vector3D.prototype.unit = function() {
        return this.dividedBy(this.length());
      };

      Vector3D.prototype.cross = function(a) {
        return new Vector3D(this._y * a._z - this._z * a._y, this._z * a._x - this._x * a._z, this._x * a._y - this._y * a._x);
      };

      Vector3D.prototype.distanceTo = function(a) {
        return this.minus(a).length();
      };

      Vector3D.prototype.distanceToSquared = function(a) {
        return this.minus(a).lengthSquared();
      };

      Vector3D.prototype.equals = function(a) {
        return (this._x === a._x) && (this._y === a._y) && (this._z === a._z);
      };

      Vector3D.prototype.multiply4x4 = function(matrix4x4) {
        return matrix4x4.leftMultiply1x3Vector(this);
      };

      Vector3D.prototype.transform = function(matrix4x4) {
        return matrix4x4.leftMultiply1x3Vector(this);
      };

      Vector3D.prototype.toStlString = function() {
        return this._x + " " + this._y + " " + this._z;
      };

      Vector3D.prototype.toString = function() {
        return "(" + this._x + ", " + this._y + ", " + this._z + ")";
      };

      Vector3D.prototype.randomNonParallelVector = function() {
        var abs;
        abs = this.abs();
        if ((abs._x <= abs._y) && (abs._x <= abs._z)) {
          return new Vector3D(1, 0, 0);
        } else if ((abs._y <= abs._x) && (abs._y <= abs._z)) {
          return new Vector3D(0, 1, 0);
        } else {
          return new Vector3D(0, 0, 1);
        }
      };

      Vector3D.prototype.min = function(p) {
        return new Vector3D(Math.min(this._x, p._x), Math.min(this._y, p._y), Math.min(this._z, p._z));
      };

      Vector3D.prototype.max = function(p) {
        return new Vector3D(Math.max(this._x, p._x), Math.max(this._y, p._y), Math.max(this._z, p._z));
      };

      return Vector3D;

    })();
    Vertex = (function() {
      function Vertex(pos) {
        this.pos = pos;
      }

      Vertex.fromObject = function(obj) {
        var pos;
        pos = new Vector3D(obj.pos);
        return new Vertex(pos);
      };

      Vertex.prototype.flipped = function() {
        return this;
      };

      Vertex.prototype.getTag = function() {
        var result;
        result = this.tag;
        if (!result) {
          result = getTag();
          this.tag = result;
        }
        return result;
      };

      Vertex.prototype.interpolate = function(other, t) {
        var newpos;
        newpos = this.pos.lerp(other.pos, t);
        return new Vertex(newpos);
      };

      Vertex.prototype.transform = function(matrix4x4) {
        var newpos;
        newpos = this.pos.multiply4x4(matrix4x4);
        return new Vertex(newpos);
      };

      Vertex.prototype.toStlString = function() {
        return "vertex " + this.pos.toStlString() + "\n";
      };

      Vertex.prototype.toString = function() {
        return this.pos.toString();
      };

      return Vertex;

    })();
    Line2D = (function() {
      function Line2D(normal, w) {
        var l;
        normal = new Vector2D(normal);
        w = parseFloat(w);
        l = normal.length();
        w *= l;
        normal = normal.times(1.0 / l);
        this.normal = normal;
        this.w = w;
      }

      Line2D.fromPoints = function(p1, p2) {
        var direction, normal, w;
        p1 = new Vector2D(p1);
        p2 = new Vector2D(p2);
        direction = p2.minus(p1);
        normal = direction.normal().negated().unit();
        w = p1.dot(normal);
        return new Line2D(normal, w);
      };

      Line2D.prototype.reverse = function() {
        return new Line2D(this.normal.negated(), -this.w);
      };

      Line2D.prototype.equals = function(l) {
        return l.normal.equals(this.normal) && (l.w === this.w);
      };

      Line2D.prototype.origin = function() {
        return this.normal.times(this.w);
      };

      Line2D.prototype.direction = function() {
        return this.normal.normal();
      };

      Line2D.prototype.xAtY = function(y) {
        var x;
        x = (this.w - this.normal._y * y) / this.normal.x;
        return x;
      };

      Line2D.prototype.absDistanceToPoint = function(point) {
        var distance, point_projected;
        point = new Vector2D(point);
        point_projected = point.dot(this.normal);
        distance = Math.abs(point_projected - this.w);
        return distance;
      };

      Line2D.prototype.closestPoint = function(point) {
        var vector;
        point = new Vector2D(point);
        vector = point.dot(this.direction());
        return origin.plus(vector);
      };

      Line2D.prototype.intersectWithLine = function(line2d) {
        var point;
        point = solve2Linear(this.normal.x, this.normal.y, line2d.normal.x, line2d.normal.y, this.w, line2d.w);
        point = new Vector2D(point);
        return point;
      };

      Line2D.prototype.transform = function(matrix4x4) {
        var newnormal, neworigin, neworiginPlusNormal, newpointOnPlane, neww, origin, pointOnPlane;
        origin = new Vector2D(0, 0);
        pointOnPlane = this.normal.times(this.w);
        neworigin = origin.multiply4x4(matrix4x4);
        neworiginPlusNormal = this.normal.multiply4x4(matrix4x4);
        newnormal = neworiginPlusNormal.minus(neworigin);
        newpointOnPlane = pointOnPlane.multiply4x4(matrix4x4);
        neww = newnormal.dot(newpointOnPlane);
        return new Line2D(newnormal, neww);
      };

      return Line2D;

    })();
    Line3D = (function() {
      function Line3D(point, direction) {
        point = new Vector3D(point);
        direction = new Vector3D(direction);
        this.point = point;
        this.direction = direction.unit();
      }

      Line3D.fromPoints = function(p1, p2) {
        var direction;
        p1 = new Vector3D(p1);
        p2 = new Vector3D(p2);
        direction = p2.minus(p1).unit();
        return new Line3D(p1, direction);
      };

      Line3D.fromPlanes = function(p1, p2) {
        var direction, l, mabsx, mabsy, mabsz, origin, r;
        direction = p1.normal.cross(p2.normal);
        l = direction.length();
        if (l < 1e-10) {
          throw new Error("Parallel planes");
        }
        direction = direction.times(1.0 / l);
        mabsx = Math.abs(direction.x);
        mabsy = Math.abs(direction.y);
        mabsz = Math.abs(direction.z);
        origin = void 0;
        if ((mabsx >= mabsy) && (mabsx >= mabsz)) {
          r = solve2Linear(p1.normal.y, p1.normal.z, p2.normal.y, p2.normal.z, p1.w, p2.w);
          origin = new Vector3D(0, r[0], r[1]);
        } else if ((mabsy >= mabsx) && (mabsy >= mabsz)) {
          r = solve2Linear(p1.normal.x, p1.normal.z, p2.normal.x, p2.normal.z, p1.w, p2.w);
          origin = new Vector3D(r[0], 0, r[1]);
        } else {
          r = solve2Linear(p1.normal.x, p1.normal.y, p2.normal.x, p2.normal.y, p1.w, p2.w);
          origin = new Vector3D(r[0], r[1], 0);
        }
        return new Line3D(origin, direction);
      };

      Line3D.prototype.intersectWithPlane = function(plane) {
        var labda, point;
        labda = (plane.w - plane.normal.dot(this.point)) / plane.normal.dot(this.direction);
        point = this.point.plus(this.direction.times(labda));
        return point;
      };

      Line3D.prototype.clone = function(line) {
        return new Line3D(this.point.clone(), this.direction.clone());
      };

      Line3D.prototype.reverse = function() {
        return new Line3D(this.point.clone(), this.direction.negated());
      };

      Line3D.prototype.transform = function(matrix4x4) {
        var newPointPlusDirection, newdirection, newpoint, pointPlusDirection;
        newpoint = this.point.multiply4x4(matrix4x4);
        pointPlusDirection = this.point.plus(this.direction);
        newPointPlusDirection = pointPlusDirection.multiply4x4(matrix4x4);
        newdirection = newPointPlusDirection.minus(newpoint);
        return new Line3D(newpoint, newdirection);
      };

      Line3D.prototype.closestPointOnLine = function(point) {
        var closestpoint, t;
        point = new Vector3D(point);
        t = point.minus(this.point).dot(this.direction) / this.direction.dot(this.direction);
        closestpoint = this.point.plus(this.direction.times(t));
        return closestpoint;
      };

      Line3D.prototype.distanceToPoint = function(point) {
        var closestpoint, distance, distancevector;
        point = new Vector3D(point);
        closestpoint = this.closestPointOnLine(point);
        distancevector = point.minus(closestpoint);
        distance = distancevector.length();
        return distance;
      };

      Line3D.prototype.equals = function(line3d) {
        var distance;
        if (!this.direction.equals(line3d.direction)) {
          return false;
        }
        distance = this.distanceToPoint(line3d.point);
        if (distance > 1e-8) {
          return false;
        }
        return true;
      };

      return Line3D;

    })();
    Plane = (function() {
      Plane.EPSILON = 1e-5;

      function Plane(normal, w) {
        this.normal = normal;
        this.w = w;
      }

      Plane.fromObject = function(obj) {
        var normal, w;
        normal = new Vector3D(obj.normal);
        w = parseFloat(obj.w);
        return new Plane(normal, w);
      };

      Plane.fromVector3Ds = function(a, b, c) {
        var n;
        n = b.minus(a).cross(c.minus(a)).unit();
        return new Plane(n, n.dot(a));
      };

      Plane.anyPlaneFromVector3Ds = function(a, b, c) {
        var normal, v1, v2;
        v1 = b.minus(a);
        v2 = c.minus(a);
        if (v1.length() < 1e-5) {
          v1 = v2.randomNonParallelVector();
        }
        if (v2.length() < 1e-5) {
          v2 = v1.randomNonParallelVector();
        }
        normal = v1.cross(v2);
        if (normal.length() < 1e-5) {
          v2 = v1.randomNonParallelVector();
          normal = v1.cross(v2);
        }
        normal = normal.unit();
        return new Plane(normal, normal.dot(a));
      };

      Plane.fromPoints = function(a, b, c) {
        a = new Vector3D(a);
        b = new Vector3D(b);
        c = new Vector3D(c);
        return Plane.fromVector3Ds(a, b, c);
      };

      Plane.fromNormalAndPoint = function(normal, point) {
        var w;
        normal = new Vector3D(normal);
        point = new Vector3D(point);
        normal = normal.unit();
        w = point.dot(normal);
        return new Plane(normal, w);
      };

      Plane.prototype.flipped = function() {
        return new Plane(this.normal.negated(), -this.w);
      };

      Plane.prototype.getTag = function() {
        var result;
        result = this.tag;
        if (!result) {
          result = getTag();
          this.tag = result;
        }
        return result;
      };

      Plane.prototype.equals = function(n) {
        return this.normal.equals(n.normal) && this.w === n.w;
      };

      Plane.prototype.transform = function(matrix4x4) {
        var ismirror, newplane, point1, point2, point3, r, u, v;
        ismirror = matrix4x4.isMirroring();
        r = this.normal.randomNonParallelVector();
        u = this.normal.cross(r);
        v = this.normal.cross(u);
        point1 = this.normal.times(this.w);
        point2 = point1.plus(u);
        point3 = point1.plus(v);
        point1 = point1.multiply4x4(matrix4x4);
        point2 = point2.multiply4x4(matrix4x4);
        point3 = point3.multiply4x4(matrix4x4);
        newplane = Plane.fromVector3Ds(point1, point2, point3);
        if (ismirror) {
          newplane = newplane.flipped();
        }
        return newplane;
      };

      Plane.prototype.splitPolygon = function(polygon) {
        var EPS, EPS_SQUARED, MINEPS, backvertices, frontvertices, hasback, hasfront, i, intersectionpoint, intersectionvertex, isback, nextisback, nextpoint, nextvertexindex, numvertices, planenormal, point, prevvertex, result, t, thisw, vertex, vertexIsBack, vertexindex, vertices, _i, _len;
        result = {
          type: null,
          front: null,
          back: null
        };
        planenormal = this.normal;
        vertices = polygon.vertices;
        numvertices = vertices.length;
        if (polygon.plane.equals(this)) {
          result.type = 0;
        } else {
          EPS = Plane.EPSILON;
          thisw = this.w;
          hasfront = false;
          hasback = false;
          vertexIsBack = [];
          MINEPS = -EPS;
          i = 0;
          for (_i = 0, _len = vertices.length; _i < _len; _i++) {
            vertex = vertices[_i];
            t = planenormal.dot(vertex.pos) - thisw;
            isback = t < 0;
            vertexIsBack.push(isback);
            if (t > EPS) {
              hasfront = true;
            }
            if (t < MINEPS) {
              hasback = true;
            }
          }
          if ((!hasfront) && (!hasback)) {
            t = planenormal.dot(polygon.plane.normal);
            result.type = (t >= 0 ? 0 : 1);
          } else if (!hasback) {
            result.type = 2;
          } else if (!hasfront) {
            result.type = 3;
          } else {
            result.type = 4;
            frontvertices = [];
            backvertices = [];
            isback = vertexIsBack[0];
            vertexindex = 0;
            while (vertexindex < numvertices) {
              vertex = vertices[vertexindex];
              nextvertexindex = vertexindex + 1;
              if (nextvertexindex >= numvertices) {
                nextvertexindex = 0;
              }
              nextisback = vertexIsBack[nextvertexindex];
              if (isback === nextisback) {
                if (isback) {
                  backvertices.push(vertex);
                } else {
                  frontvertices.push(vertex);
                }
              } else {
                point = vertex.pos;
                nextpoint = vertices[nextvertexindex].pos;
                intersectionpoint = this.splitLineBetweenPoints(point, nextpoint);
                intersectionvertex = new Vertex(intersectionpoint);
                if (isback) {
                  backvertices.push(vertex);
                  backvertices.push(intersectionvertex);
                  frontvertices.push(intersectionvertex);
                } else {
                  frontvertices.push(vertex);
                  frontvertices.push(intersectionvertex);
                  backvertices.push(intersectionvertex);
                }
              }
              isback = nextisback;
              vertexindex++;
            }
            EPS_SQUARED = Plane.EPSILON * Plane.EPSILON;
            if (backvertices.length >= 3) {
              prevvertex = backvertices[backvertices.length - 1];
              vertexindex = 0;
              while (vertexindex < backvertices.length) {
                vertex = backvertices[vertexindex];
                if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
                  backvertices.splice(vertexindex, 1);
                  vertexindex--;
                }
                prevvertex = vertex;
                vertexindex++;
              }
            }
            if (frontvertices.length >= 3) {
              prevvertex = frontvertices[frontvertices.length - 1];
              vertexindex = 0;
              while (vertexindex < frontvertices.length) {
                vertex = frontvertices[vertexindex];
                if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
                  frontvertices.splice(vertexindex, 1);
                  vertexindex--;
                }
                prevvertex = vertex;
                vertexindex++;
              }
            }
            if (frontvertices.length >= 3) {
              result.front = new Polygon(frontvertices, polygon.shared, polygon.plane);
            }
            if (backvertices.length >= 3) {
              result.back = new Polygon(backvertices, polygon.shared, polygon.plane);
            }
          }
        }
        return result;
      };

      Plane.prototype.splitLineBetweenPoints = function(p1, p2) {
        var direction, labda, result;
        direction = p2.minus(p1);
        labda = (this.w - this.normal.dot(p1)) / this.normal.dot(direction);
        if (isNaN(labda)) {
          labda = 0;
        }
        if (labda > 1) {
          labda = 1;
        }
        if (labda < 0) {
          labda = 0;
        }
        result = p1.plus(direction.times(labda));
        return result;
      };

      Plane.prototype.intersectWithLine = function(line3d) {
        return line3d.intersectWithPlane(this);
      };

      Plane.prototype.intersectWithPlane = function(plane) {
        return Line3D.fromPlanes(this, plane);
      };

      Plane.prototype.signedDistanceToPoint = function(point) {
        var t;
        t = this.normal.dot(point) - this.w;
        return t;
      };

      Plane.prototype.toString = function() {
        return "[normal: " + this.normal.toString() + ", w: " + this.w + "]";
      };

      Plane.prototype.mirrorPoint = function(point3d) {
        var distance, mirrored;
        distance = this.signedDistanceToPoint(point3d);
        mirrored = point3d.minus(this.normal.times(distance * 2.0));
        return mirrored;
      };

      return Plane;

    })();
    Polygon = (function() {
      function Polygon(vertices, shared, plane) {
        var numvertices;
        this.vertices = vertices;
        if (!shared) {
          shared = Polygon.defaultShared;
        }
        this.shared = shared;
        numvertices = vertices.length;
        if (arguments.length >= 3) {
          this.plane = plane;
        } else {
          this.plane = Plane.fromVector3Ds(vertices[0].pos, vertices[1].pos, vertices[2].pos);
        }
        if (_CSGDEBUG) {
          this.checkIfConvex();
        }
      }

      Polygon.fromObject = function(obj) {
        var plane, shared, vertices;
        vertices = obj.vertices.map(function(v) {
          return Vertex.fromObject(v);
        });
        shared = PolygonShared.fromObject(obj.shared);
        plane = Plane.fromObject(obj.plane);
        return new Polygon(vertices, shared, plane);
      };

      Polygon.prototype.checkIfConvex = function() {
        if (!Polygon.verticesConvex(this.vertices, this.plane.normal)) {
          Polygon.verticesConvex(this.vertices, this.plane.normal);
          throw new Error("Not convex!");
        }
      };

      Polygon.prototype.extrude = function(offsetvector) {
        var direction, i, newpolygons, nexti, numvertices, polygon1, polygon2, sidefacepoints, sidefacepolygon;
        newpolygons = [];
        polygon1 = this;
        direction = polygon1.plane.normal.dot(offsetvector);
        if (direction > 0) {
          polygon1 = polygon1.flipped();
        }
        newpolygons.push(polygon1);
        polygon2 = polygon1.translate(offsetvector);
        numvertices = this.vertices.length;
        i = 0;
        while (i < numvertices) {
          sidefacepoints = [];
          nexti = (i < (numvertices - 1) ? i + 1 : 0);
          sidefacepoints.push(polygon1.vertices[i].pos);
          sidefacepoints.push(polygon2.vertices[i].pos);
          sidefacepoints.push(polygon2.vertices[nexti].pos);
          sidefacepoints.push(polygon1.vertices[nexti].pos);
          sidefacepolygon = Polygon.createFromPoints(sidefacepoints, this.shared);
          newpolygons.push(sidefacepolygon);
          i++;
        }
        polygon2 = polygon2.flipped();
        newpolygons.push(polygon2);
        return newpolygons;
      };

      Polygon.prototype.translate = function(offset) {
        return this.transform(Matrix4x4.translation(offset));
      };

      Polygon.prototype.boundingSphere = function() {
        var box, middle, radius, radius3;
        if (!this.cachedBoundingSphere) {
          box = this.boundingBox();
          middle = box[0].plus(box[1]).times(0.5);
          radius3 = box[1].minus(middle);
          radius = radius3.length();
          this.cachedBoundingSphere = [middle, radius];
        }
        return this.cachedBoundingSphere;
      };

      Polygon.prototype.boundingBox = function() {
        var i, maxpoint, minpoint, numvertices, point, vertices;
        if (!this.cachedBoundingBox) {
          minpoint = void 0;
          maxpoint = void 0;
          vertices = this.vertices;
          numvertices = vertices.length;
          if (numvertices === 0) {
            minpoint = new Vector3D(0, 0, 0);
          } else {
            minpoint = vertices[0].pos;
          }
          maxpoint = minpoint;
          i = 1;
          while (i < numvertices) {
            point = vertices[i].pos;
            minpoint = minpoint.min(point);
            maxpoint = maxpoint.max(point);
            i++;
          }
          this.cachedBoundingBox = [minpoint, maxpoint];
        }
        return this.cachedBoundingBox;
      };

      Polygon.prototype.flipped = function() {
        var newplane, newvertices;
        newvertices = this.vertices.map(function(v) {
          return v.flipped();
        });
        newvertices.reverse();
        newplane = this.plane.flipped();
        return new Polygon(newvertices, this.shared, newplane);
      };

      Polygon.prototype.transform = function(matrix4x4) {
        var newplane, newvertices, scalefactor;
        newvertices = this.vertices.map(function(v) {
          return v.transform(matrix4x4);
        });
        newplane = this.plane.transform(matrix4x4);
        scalefactor = matrix4x4.elements[0] * matrix4x4.elements[5] * matrix4x4.elements[10];
        if (scalefactor < 0) {
          newvertices.reverse();
        }
        return new Polygon(newvertices, this.shared, newplane);
      };

      Polygon.prototype.toStlString = function() {
        var firstVertexStl, i, result;
        result = "";
        if (this.vertices.length >= 3) {
          firstVertexStl = this.vertices[0].toStlString();
          i = 0;
          while (i < this.vertices.length - 2) {
            result += "facet normal " + this.plane.normal.toStlString() + "\nouter loop\n";
            result += firstVertexStl;
            result += this.vertices[i + 1].toStlString();
            result += this.vertices[i + 2].toStlString();
            result += "endloop\nendfacet\n";
            i++;
          }
        }
        return result;
      };

      Polygon.prototype.toString = function() {
        var result;
        result = "Polygon plane: " + this.plane.toString() + "\n";
        this.vertices.map(function(vertex) {
          return result += "  " + vertex.toString() + "\n";
        });
        return result;
      };

      Polygon.prototype.projectToOrthoNormalBasis = function(orthobasis) {
        var area, points2d, result;
        points2d = this.vertices.map(function(vertex) {
          return orthobasis.to2D(vertex.pos);
        });
        result = CAG.fromPointsNoCheck(points2d);
        area = result.area();
        if (Math.abs(area) < 1e-5) {
          result = new CAG();
        } else {
          if (area < 0) {
            result = result.flipped();
          }
        }
        return result;
      };

      Polygon.verticesConvex = function(vertices, planenormal) {
        var i, numvertices, pos, prevpos, prevprevpos;
        numvertices = vertices.length;
        if (numvertices > 2) {
          prevprevpos = vertices[numvertices - 2].pos;
          prevpos = vertices[numvertices - 1].pos;
          i = 0;
          while (i < numvertices) {
            pos = vertices[i].pos;
            if (!Polygon.isConvexPoint(prevprevpos, prevpos, pos, planenormal)) {
              return false;
            }
            prevprevpos = prevpos;
            prevpos = pos;
            i++;
          }
        }
        return true;
      };

      Polygon.createFromPoints = function(points, shared, plane) {
        var normal, polygon, vertices;
        normal = void 0;
        if (arguments.length < 3) {
          normal = new Vector3D(0, 0, 0);
        } else {
          normal = plane.normal;
        }
        vertices = [];
        points.map(function(p) {
          var vec, vertex;
          vec = new Vector3D(p);
          vertex = new Vertex(vec);
          return vertices.push(vertex);
        });
        polygon = void 0;
        if (arguments.length < 3) {
          polygon = new Polygon(vertices, shared);
        } else {
          polygon = new Polygon(vertices, shared, plane);
        }
        return polygon;
      };

      Polygon.isConvexPoint = function(prevpoint, point, nextpoint, normal) {
        var crossdotnormal, crossproduct;
        crossproduct = point.minus(prevpoint).cross(nextpoint.minus(point));
        crossdotnormal = crossproduct.dot(normal);
        return crossdotnormal >= 0;
      };

      Polygon.isStrictlyConvexPoint = function(prevpoint, point, nextpoint, normal) {
        var crossdotnormal, crossproduct;
        crossproduct = point.minus(prevpoint).cross(nextpoint.minus(point));
        crossdotnormal = crossproduct.dot(normal);
        return crossdotnormal >= 1e-5;
      };

      return Polygon;

    })();
    PolygonShared = (function() {
      function PolygonShared(color, name) {
        this.color = color;
        this.name = name;
      }

      PolygonShared.fromObject = function(obj) {
        return new PolygonShared(obj.color, obj.name);
      };

      PolygonShared.prototype.getTag = function() {
        var result;
        result = this.tag;
        if (!result) {
          result = getTag();
          this.tag = result;
        }
        return result;
      };

      PolygonShared.prototype.getHash = function() {
        if (!this.color) {
          return "null";
        }
        return "" + this.color[0] + "/" + this.color[1] + "/" + this.color[2];
      };

      PolygonShared.prototype.getName = function() {
        if (!this.name) {
          return "null";
        }
        return this.name;
      };

      return PolygonShared;

    })();
    Polygon.defaultShared = new PolygonShared(null, null);
    Path2D = (function() {
      function Path2D(points, closed) {
        var newpoints, prevpoint;
        closed = !!closed;
        points = points || [];
        prevpoint = null;
        if (closed && (points.length > 0)) {
          prevpoint = new Vector2D(points[points.length - 1]);
        }
        newpoints = [];
        points.map(function(point) {
          var distance, skip;
          point = new Vector2D(point);
          skip = false;
          if (prevpoint !== null) {
            distance = point.distanceTo(prevpoint);
            skip = distance < 1e-5;
          }
          if (!skip) {
            newpoints.push(point);
          }
          return prevpoint = point;
        });
        this.points = newpoints;
        this.closed = closed;
      }

      Path2D.arc = function(options) {
        var absangledif, angle, center, edgestepsize, endangle, i, maketangent, numsteps, numsteps_mod, point, points, radius, resolution, startangle, step;
        center = parseOptionAs2DVector(options, "center", 0);
        radius = parseOptionAsFloat(options, "radius", 1);
        startangle = parseOptionAsFloat(options, "startangle", 0);
        endangle = parseOptionAsFloat(options, "endangle", 360);
        resolution = parseOptionAsFloat(options, "resolution", defaultResolution2D);
        maketangent = parseOptionAsBool(options, "maketangent", false);
        while (endangle - startangle >= 720) {
          endangle -= 360;
        }
        while (endangle - startangle <= -720) {
          endangle += 360;
        }
        points = [];
        absangledif = Math.abs(endangle - startangle);
        if (absangledif < 1e-5) {
          point = Vector2D.fromAngle(startangle / 180.0 * Math.PI).times(radius);
          points.push(point.plus(center));
        } else {
          numsteps = Math.floor(resolution * absangledif / 360) + 1;
          edgestepsize = numsteps * 0.5 / absangledif;
          if (edgestepsize > 0.25) {
            edgestepsize = 0.25;
          }
          numsteps_mod = (maketangent ? numsteps + 2 : numsteps);
          i = 0;
          while (i <= numsteps_mod) {
            step = i;
            if (maketangent) {
              step = (i - 1) * (numsteps - 2 * edgestepsize) / numsteps + edgestepsize;
              if (step < 0) {
                step = 0;
              }
              if (step > numsteps) {
                step = numsteps;
              }
            }
            angle = startangle + step * (endangle - startangle) / numsteps;
            point = Vector2D.fromAngle(angle / 180.0 * Math.PI).times(radius);
            points.push(point.plus(center));
            i++;
          }
        }
        return new Path2D(points, false);
      };

      Path2D.prototype.concat = function(otherpath) {
        var newpoints;
        if (this.closed || otherpath.closed) {
          throw new Error("Paths must not be closed");
        }
        newpoints = this.points.concat(otherpath.points);
        return new Path2D(newpoints);
      };

      Path2D.prototype.appendPoint = function(point) {
        var newpoints;
        if (this.closed) {
          throw new Error("Paths must not be closed");
        }
        newpoints = this.points.concat([point]);
        return new Path2D(newpoints);
      };

      Path2D.prototype.close = function() {
        return new Path2D(this.points, true);
      };

      Path2D.prototype.rectangularExtrude = function(width, height, resolution) {
        var cag, result;
        cag = this.expandToCAG(width / 2, resolution);
        result = cag.extrude({
          offset: [0, 0, height]
        });
        return result;
      };

      Path2D.prototype.expandToCAG = function(pathradius, resolution) {
        var expanded, i, numpoints, point, pointindex, prevvertex, shellcag, side, sides, startindex, vertex;
        sides = [];
        numpoints = this.points.length;
        startindex = 0;
        if (this.closed && (numpoints > 2)) {
          startindex = -1;
        }
        prevvertex = void 0;
        i = startindex;
        while (i < numpoints) {
          pointindex = i;
          if (pointindex < 0) {
            pointindex = numpoints - 1;
          }
          point = this.points[pointindex];
          vertex = new Vertex2D(point);
          if (i > startindex) {
            side = new Side(prevvertex, vertex);
            sides.push(side);
          }
          prevvertex = vertex;
          i++;
        }
        shellcag = CAG.fromSides(sides);
        expanded = shellcag.expandedShell(pathradius, resolution);
        return expanded;
      };

      Path2D.prototype.innerToCAG = function() {
        if (!this.closed) {
          throw new Error("The path should be closed!");
        }
        return CAG.fromPoints(this.points);
      };

      Path2D.prototype.transform = function(matrix4x4) {
        var newpoints;
        newpoints = this.points.map(function(point) {
          return point.multiply4x4(matrix4x4);
        });
        return new Path2D(newpoints, this.closed);
      };

      return Path2D;

    })();
    Matrix4x4 = (function() {
      function Matrix4x4(elements) {
        if (arguments.length >= 1) {
          this.elements = elements;
        } else {
          this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        }
      }

      Matrix4x4.prototype.plus = function(m) {
        var i, r;
        r = [];
        i = 0;
        while (i < 16) {
          r[i] = this.elements[i] + m.elements[i];
          i++;
        }
        return new Matrix4x4(r);
      };

      Matrix4x4.prototype.minus = function(m) {
        var i, r;
        r = [];
        i = 0;
        while (i < 16) {
          r[i] = this.elements[i] - m.elements[i];
          i++;
        }
        return new Matrix4x4(r);
      };

      Matrix4x4.prototype.multiply = function(m) {
        var m0, m1, m10, m11, m12, m13, m14, m15, m2, m3, m4, m5, m6, m7, m8, m9, result, this0, this1, this10, this11, this12, this13, this14, this15, this2, this3, this4, this5, this6, this7, this8, this9;
        this0 = this.elements[0];
        this1 = this.elements[1];
        this2 = this.elements[2];
        this3 = this.elements[3];
        this4 = this.elements[4];
        this5 = this.elements[5];
        this6 = this.elements[6];
        this7 = this.elements[7];
        this8 = this.elements[8];
        this9 = this.elements[9];
        this10 = this.elements[10];
        this11 = this.elements[11];
        this12 = this.elements[12];
        this13 = this.elements[13];
        this14 = this.elements[14];
        this15 = this.elements[15];
        m0 = m.elements[0];
        m1 = m.elements[1];
        m2 = m.elements[2];
        m3 = m.elements[3];
        m4 = m.elements[4];
        m5 = m.elements[5];
        m6 = m.elements[6];
        m7 = m.elements[7];
        m8 = m.elements[8];
        m9 = m.elements[9];
        m10 = m.elements[10];
        m11 = m.elements[11];
        m12 = m.elements[12];
        m13 = m.elements[13];
        m14 = m.elements[14];
        m15 = m.elements[15];
        result = [];
        result[0] = this0 * m0 + this1 * m4 + this2 * m8 + this3 * m12;
        result[1] = this0 * m1 + this1 * m5 + this2 * m9 + this3 * m13;
        result[2] = this0 * m2 + this1 * m6 + this2 * m10 + this3 * m14;
        result[3] = this0 * m3 + this1 * m7 + this2 * m11 + this3 * m15;
        result[4] = this4 * m0 + this5 * m4 + this6 * m8 + this7 * m12;
        result[5] = this4 * m1 + this5 * m5 + this6 * m9 + this7 * m13;
        result[6] = this4 * m2 + this5 * m6 + this6 * m10 + this7 * m14;
        result[7] = this4 * m3 + this5 * m7 + this6 * m11 + this7 * m15;
        result[8] = this8 * m0 + this9 * m4 + this10 * m8 + this11 * m12;
        result[9] = this8 * m1 + this9 * m5 + this10 * m9 + this11 * m13;
        result[10] = this8 * m2 + this9 * m6 + this10 * m10 + this11 * m14;
        result[11] = this8 * m3 + this9 * m7 + this10 * m11 + this11 * m15;
        result[12] = this12 * m0 + this13 * m4 + this14 * m8 + this15 * m12;
        result[13] = this12 * m1 + this13 * m5 + this14 * m9 + this15 * m13;
        result[14] = this12 * m2 + this13 * m6 + this14 * m10 + this15 * m14;
        result[15] = this12 * m3 + this13 * m7 + this14 * m11 + this15 * m15;
        return new Matrix4x4(result);
      };

      Matrix4x4.prototype.clone = function() {
        var elements;
        elements = this.elements.map(function(p) {
          return p;
        });
        return new Matrix4x4(elements);
      };

      Matrix4x4.prototype.rightMultiply1x3Vector = function(v) {
        var invw, v0, v1, v2, v3, w, x, y, z;
        v0 = v._x;
        v1 = v._y;
        v2 = v._z;
        v3 = 1;
        x = v0 * this.elements[0] + v1 * this.elements[1] + v2 * this.elements[2] + v3 * this.elements[3];
        y = v0 * this.elements[4] + v1 * this.elements[5] + v2 * this.elements[6] + v3 * this.elements[7];
        z = v0 * this.elements[8] + v1 * this.elements[9] + v2 * this.elements[10] + v3 * this.elements[11];
        w = v0 * this.elements[12] + v1 * this.elements[13] + v2 * this.elements[14] + v3 * this.elements[15];
        if (w !== 1) {
          invw = 1.0 / w;
          x *= invw;
          y *= invw;
          z *= invw;
        }
        return new Vector3D(x, y, z);
      };

      Matrix4x4.prototype.leftMultiply1x3Vector = function(v) {
        var invw, v0, v1, v2, v3, w, x, y, z;
        v0 = v._x;
        v1 = v._y;
        v2 = v._z;
        v3 = 1;
        x = v0 * this.elements[0] + v1 * this.elements[4] + v2 * this.elements[8] + v3 * this.elements[12];
        y = v0 * this.elements[1] + v1 * this.elements[5] + v2 * this.elements[9] + v3 * this.elements[13];
        z = v0 * this.elements[2] + v1 * this.elements[6] + v2 * this.elements[10] + v3 * this.elements[14];
        w = v0 * this.elements[3] + v1 * this.elements[7] + v2 * this.elements[11] + v3 * this.elements[15];
        if (w !== 1) {
          invw = 1.0 / w;
          x *= invw;
          y *= invw;
          z *= invw;
        }
        return new Vector3D(x, y, z);
      };

      Matrix4x4.prototype.rightMultiply1x2Vector = function(v) {
        var invw, v0, v1, v2, v3, w, x, y, z;
        v0 = v.x;
        v1 = v.y;
        v2 = 0;
        v3 = 1;
        x = v0 * this.elements[0] + v1 * this.elements[1] + v2 * this.elements[2] + v3 * this.elements[3];
        y = v0 * this.elements[4] + v1 * this.elements[5] + v2 * this.elements[6] + v3 * this.elements[7];
        z = v0 * this.elements[8] + v1 * this.elements[9] + v2 * this.elements[10] + v3 * this.elements[11];
        w = v0 * this.elements[12] + v1 * this.elements[13] + v2 * this.elements[14] + v3 * this.elements[15];
        if (w !== 1) {
          invw = 1.0 / w;
          x *= invw;
          y *= invw;
          z *= invw;
        }
        return new Vector2D(x, y);
      };

      Matrix4x4.prototype.leftMultiply1x2Vector = function(v) {
        var invw, v0, v1, v2, v3, w, x, y, z;
        v0 = v.x;
        v1 = v.y;
        v2 = 0;
        v3 = 1;
        x = v0 * this.elements[0] + v1 * this.elements[4] + v2 * this.elements[8] + v3 * this.elements[12];
        y = v0 * this.elements[1] + v1 * this.elements[5] + v2 * this.elements[9] + v3 * this.elements[13];
        z = v0 * this.elements[2] + v1 * this.elements[6] + v2 * this.elements[10] + v3 * this.elements[14];
        w = v0 * this.elements[3] + v1 * this.elements[7] + v2 * this.elements[11] + v3 * this.elements[15];
        if (w !== 1) {
          invw = 1.0 / w;
          x *= invw;
          y *= invw;
          z *= invw;
        }
        return new Vector2D(x, y);
      };

      Matrix4x4.prototype.isMirroring = function() {
        var ismirror, mirrorvalue, u, v, w;
        u = new Vector3D(this.elements[0], this.elements[4], this.elements[8]);
        v = new Vector3D(this.elements[1], this.elements[5], this.elements[9]);
        w = new Vector3D(this.elements[2], this.elements[6], this.elements[10]);
        mirrorvalue = u.cross(v).dot(w);
        ismirror = mirrorvalue < 0;
        return ismirror;
      };

      Matrix4x4.unity = function() {
        return new Matrix4x4();
      };

      Matrix4x4.rotationX = function(degrees) {
        var cos, els, radians, sin;
        radians = degrees * Math.PI * (1.0 / 180.0);
        cos = Math.cos(radians);
        sin = Math.sin(radians);
        els = [1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1];
        return new Matrix4x4(els);
      };

      Matrix4x4.rotationY = function(degrees) {
        var cos, els, radians, sin;
        radians = degrees * Math.PI * (1.0 / 180.0);
        cos = Math.cos(radians);
        sin = Math.sin(radians);
        els = [cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, 0, 0, 0, 1];
        return new Matrix4x4(els);
      };

      Matrix4x4.rotationZ = function(degrees) {
        var cos, els, radians, sin;
        radians = degrees * Math.PI * (1.0 / 180.0);
        cos = Math.cos(radians);
        sin = Math.sin(radians);
        els = [cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        return new Matrix4x4(els);
      };

      Matrix4x4.rotation = function(rotationCenter, rotationAxis, degrees) {
        var orthobasis, rotationPlane, transformation;
        rotationCenter = new Vector3D(rotationCenter);
        rotationAxis = new Vector3D(rotationAxis);
        rotationPlane = Plane.fromNormalAndPoint(rotationAxis, rotationCenter);
        orthobasis = new OrthoNormalBasis(rotationPlane);
        transformation = Matrix4x4.translation(rotationCenter.negated());
        transformation = transformation.multiply(orthobasis.getProjectionMatrix());
        transformation = transformation.multiply(Matrix4x4.rotationZ(degrees));
        transformation = transformation.multiply(orthobasis.getInverseProjectionMatrix());
        transformation = transformation.multiply(Matrix4x4.translation(rotationCenter));
        return transformation;
      };

      Matrix4x4.translation = function(v) {
        var els, vec;
        vec = new Vector3D(v);
        els = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, vec.x, vec.y, vec.z, 1];
        return new Matrix4x4(els);
      };

      Matrix4x4.mirroring = function(plane) {
        var els, nx, ny, nz, w;
        nx = plane.normal.x;
        ny = plane.normal.y;
        nz = plane.normal.z;
        w = plane.w;
        els = [1.0 - 2.0 * nx * nx, -2.0 * ny * nx, -2.0 * nz * nx, 0, -2.0 * nx * ny, 1.0 - 2.0 * ny * ny, -2.0 * nz * ny, 0, -2.0 * nx * nz, -2.0 * ny * nz, 1.0 - 2.0 * nz * nz, 0, -2.0 * nx * w, -2.0 * ny * w, -2.0 * nz * w, 1];
        return new Matrix4x4(els);
      };

      Matrix4x4.scaling = function(v) {
        var els, vec;
        vec = new Vector3D(v);
        els = [vec.x, 0, 0, 0, 0, vec.y, 0, 0, 0, 0, vec.z, 0, 0, 0, 0, 1];
        return new Matrix4x4(els);
      };

      return Matrix4x4;

    })();
    OrthoNormalBasis = (function() {
      function OrthoNormalBasis(plane, rightvector) {
        if (arguments.length < 2) {
          rightvector = plane.normal.randomNonParallelVector();
        } else {
          rightvector = new Vector3D(rightvector);
        }
        this.v = plane.normal.cross(rightvector).unit();
        this.u = this.v.cross(plane.normal);
        this.plane = plane;
        this.planeorigin = plane.normal.times(plane.w);
      }

      OrthoNormalBasis.Z0Plane = function() {
        var plane;
        plane = new Plane(new Vector3D([0, 0, 1]), 0);
        return new OrthoNormalBasis(plane, new Vector3D([1, 0, 0]));
      };

      OrthoNormalBasis.prototype.getProjectionMatrix = function() {
        return new Matrix4x4([this.u.x, this.v.x, this.plane.normal.x, 0, this.u.y, this.v.y, this.plane.normal.y, 0, this.u.z, this.v.z, this.plane.normal.z, 0, 0, 0, -this.plane.w, 1]);
      };

      OrthoNormalBasis.prototype.getInverseProjectionMatrix = function() {
        var p;
        p = this.plane.normal.times(this.plane.w);
        return new Matrix4x4([this.u.x, this.u.y, this.u.z, 0, this.v.x, this.v.y, this.v.z, 0, this.plane.normal.x, this.plane.normal.y, this.plane.normal.z, 0, p.x, p.y, p.z, 1]);
      };

      OrthoNormalBasis.prototype.to2D = function(vec3) {
        return new Vector2D(vec3.dot(this.u), vec3.dot(this.v));
      };

      OrthoNormalBasis.prototype.to3D = function(vec2) {
        return this.planeorigin.plus(this.u.times(vec2.x)).plus(this.v.times(vec2.y));
      };

      OrthoNormalBasis.prototype.line3Dto2D = function(line3d) {
        var a, a2d, b, b2d;
        a = line3d.point;
        b = line3d.direction.plus(a);
        a2d = this.to2D(a);
        b2d = this.to2D(b);
        return Line2D.fromPoints(a2d, b2d);
      };

      OrthoNormalBasis.prototype.line2Dto3D = function(line2d) {
        var a, a3d, b, b3d;
        a = line2d.origin();
        b = line2d.direction().plus(a);
        a3d = this.to3D(a);
        b3d = this.to3D(b);
        return Line3D.fromPoints(a3d, b3d);
      };

      OrthoNormalBasis.prototype.transform = function(matrix4x4) {
        var newbasis, newplane, newrighthandvector, origin_transformed, rightpoint_transformed;
        newplane = this.plane.transform(matrix4x4);
        rightpoint_transformed = this.u.transform(matrix4x4);
        origin_transformed = new Vector3D(0, 0, 0).transform(matrix4x4);
        newrighthandvector = rightpoint_transformed.minus(origin_transformed);
        newbasis = new OrthoNormalBasis(newplane, newrighthandvector);
        return newbasis;
      };

      return OrthoNormalBasis;

    })();
    Vertex2D = (function() {
      function Vertex2D(pos) {
        this.pos = pos;
      }

      Vertex2D.prototype.getTag = function() {
        var result;
        result = this.tag;
        if (!result) {
          result = getTag();
          this.tag = result;
        }
        return result;
      };

      return Vertex2D;

    })();
    Side = (function() {
      function Side(vertex0, vertex1) {
        this.vertex0 = vertex0;
        this.vertex1 = vertex1;
      }

      Side.fromFakePolygon = function(polygon) {
        var d, i, indicesZeroZ, p1, p2, pointsZeroZ, pos, result;
        if (polygon.vertices.length !== 4) {
          throw new Error("Assertion failed");
        }
        pointsZeroZ = [];
        indicesZeroZ = [];
        i = 0;
        while (i < 4) {
          pos = polygon.vertices[i].pos;
          if ((pos.z >= -1.001) && (pos.z < -0.999)) {

          } else {
            if (!((pos.z >= 0.999) && (pos.z < 1.001))) {
              throw new Error("Assertion failed");
            }
          }
          if (pos.z > 0) {
            pointsZeroZ.push(new Vector2D(pos.x, pos.y));
            indicesZeroZ.push(i);
          }
          i++;
        }
        if (pointsZeroZ.length !== 2) {
          throw new Error("Assertion failed");
        }
        d = indicesZeroZ[1] - indicesZeroZ[0];
        p1 = void 0;
        p2 = void 0;
        if (d === 1) {
          p1 = pointsZeroZ[1];
          p2 = pointsZeroZ[0];
        } else if (d === 3) {
          p1 = pointsZeroZ[0];
          p2 = pointsZeroZ[1];
        } else {
          throw new Error("Assertion failed");
        }
        result = new Side(new Vertex2D(p1), new Vertex2D(p2));
        return result;
      };

      Side.prototype.toString = function() {
        return "(" + this.vertex0.pos.x + "," + this.vertex0.pos.y + ") -> (" + this.vertex1.pos.x + "," + this.vertex1.pos.y + ")";
      };

      Side.prototype.toPolygon3D = function(z0, z1) {
        var vertices;
        vertices = [new Vertex(this.vertex0.pos.toVector3D(z0)), new Vertex(this.vertex1.pos.toVector3D(z0)), new Vertex(this.vertex1.pos.toVector3D(z1)), new Vertex(this.vertex0.pos.toVector3D(z1))];
        return new Polygon(vertices);
      };

      Side.prototype.transform = function(matrix4x4) {
        var newp1, newp2;
        newp1 = this.vertex0.pos.transform(matrix4x4);
        newp2 = this.vertex1.pos.transform(matrix4x4);
        return new Side(new Vertex2D(newp1), new Vertex2D(newp2));
      };

      Side.prototype.flipped = function() {
        return new Side(this.vertex1, this.vertex0);
      };

      Side.prototype.direction = function() {
        return this.vertex1.pos.minus(this.vertex0.pos);
      };

      Side.prototype.getTag = function() {
        var result;
        result = this.tag;
        if (!result) {
          result = getTag();
          this.tag = result;
        }
        return result;
      };

      return Side;

    })();
    return {
      "Vector3D": Vector3D,
      "Vector2D": Vector2D,
      "Plane": Plane,
      "Vertex": Vertex,
      "Line2D": Line2D,
      "Line3D": Line3D,
      "Polygon": Polygon,
      "PolygonShared": PolygonShared,
      "Path2D": Path2D,
      "Matrix4x4": Matrix4x4,
      "OrthoNormalBasis": OrthoNormalBasis,
      "solve2Linear": solve2Linear,
      "Vertex2D": Vertex2D,
      "Side": Side
    };
  });

}).call(this);
