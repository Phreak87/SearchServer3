(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define(function(require) {
    var CAGBase, CSGBase, FuzzyCAGFactory, FuzzyCSGFactory, OrthoNormalBasis, Polygon, PolygonShared, Properties, Side, TransformBase, Tree, Vector2D, Vector3D, Vertex, Vertex2D, globals, guid, materials, maths, parseOptionAs2DVector, parseOptionAs3DVector, parseOptionAsFloat, parseOptionAsInt, properties, reTesselateCoplanarPolygons, rootAssembly, s4, solve2Linear, sphereUtil, trees, utils, _CSGDEBUG;
    TransformBase = require('./transformBase');
    maths = require('./maths');
    Vertex = maths.Vertex;
    Vertex2D = maths.Vertex2D;
    Vector3D = maths.Vector3D;
    Polygon = maths.Polygon;
    PolygonShared = maths.PolygonShared;
    Vector2D = maths.Vector2D;
    Side = maths.Side;
    solve2Linear = maths.solve2Linear;
    OrthoNormalBasis = maths.OrthoNormalBasis;
    properties = require('./properties');
    Properties = properties.Properties;
    trees = require('./trees');
    Tree = trees.Tree;
    utils = require('./utils');
    reTesselateCoplanarPolygons = utils.reTesselateCoplanarPolygons;
    parseOptionAs2DVector = utils.parseOptionAs2DVector;
    parseOptionAs3DVector = utils.parseOptionAs3DVector;
    parseOptionAsFloat = utils.parseOptionAsFloat;
    parseOptionAsInt = utils.parseOptionAsInt;
    FuzzyCSGFactory = utils.FuzzyCSGFactory;
    FuzzyCAGFactory = utils.FuzzyCAGFactory;
    globals = require('./globals');
    _CSGDEBUG = globals._CSGDEBUG;
    materials = require('./materials');
    s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    guid = function() {
      return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    };
    Function.prototype.getter = function(prop, get) {
      return Object.defineProperty(this.prototype, prop, {
        get: get,
        configurable: true
      });
    };
    Function.prototype.setter = function(prop, set) {
      return Object.defineProperty(this.prototype, prop, {
        set: set,
        configurable: true
      });
    };
    CSGBase = (function(_super) {
      __extends(CSGBase, _super);

      CSGBase.defaultResolution2D = 32;

      CSGBase.defaultResolution3D = 12;

      function CSGBase(options) {
        this.clear = __bind(this.clear, this);
        this.remove = __bind(this.remove, this);
        this.add = __bind(this.add, this);
        this.injectOptions = __bind(this.injectOptions, this);
        CSGBase.__super__.constructor.call(this, options);
        this.polygons = [];
        this.properties = new Properties();
        this.isCanonicalized = true;
        this.isRetesselated = true;
        this.uid = guid();
        this.parent = null;
        this.children = [];
        this._material = new materials.BaseMaterial();
        this.color(this._material.color);
      }

      CSGBase.getter('material', function() {
        return this._material;
      });

      CSGBase.setter('material', function(material) {
        this._material = material;
        return this.color(material.color);
      });

      CSGBase.prototype.injectOptions = function(defaults, options) {
        var fullOptions, key, value;
        fullOptions = utils.merge(defaults, options);
        for (key in fullOptions) {
          value = fullOptions[key];
          if (!this.hasOwnProperty(key)) {
            this[key] = value;
          }
        }
        return fullOptions;
      };

      CSGBase.prototype.add = function() {
        var obj, objectsToAdd, _i, _len, _results;
        objectsToAdd = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _results = [];
        for (_i = 0, _len = objectsToAdd.length; _i < _len; _i++) {
          obj = objectsToAdd[_i];
          obj.position = obj.position.plus(this.position);
          if (obj.parent != null) {
            obj.parent.remove(obj);
          }
          obj.parent = this;
          _results.push(this.children.push(obj));
        }
        return _results;
      };

      CSGBase.prototype.remove = function() {
        var child, childrenToRemove, index, _i, _len, _results;
        childrenToRemove = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _results = [];
        for (_i = 0, _len = childrenToRemove.length; _i < _len; _i++) {
          child = childrenToRemove[_i];
          index = this.children.indexOf(child);
          if (index !== -1) {
            child.parent = null;
            _results.push(this.children.splice(index, 1));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      CSGBase.prototype.clear = function() {
        var child, i, _i, _ref;
        for (i = _i = _ref = this.children.length - 1; _i >= 0; i = _i += -1) {
          child = this.children[i];
          this.remove(child);
        }
        return this.children = [];
      };

      CSGBase.prototype.clone = function() {
        var child, childClone, key, newInstance, tmp, _clone, _i, _len, _ref;
        _clone = function(obj) {
          var flags, key, newInstance;
          if ((obj == null) || typeof obj !== 'object') {
            return obj;
          }
          if (obj instanceof Date) {
            return new Date(obj.getTime());
          }
          if (obj instanceof RegExp) {
            flags = '';
            if (obj.global != null) {
              flags += 'g';
            }
            if (obj.ignoreCase != null) {
              flags += 'i';
            }
            if (obj.multiline != null) {
              flags += 'm';
            }
            if (obj.sticky != null) {
              flags += 'y';
            }
            return new RegExp(obj.source, flags);
          }
          if (obj instanceof CSGBase || obj instanceof CAGBase) {
            return obj.clone();
          }
          newInstance = new obj.constructor();
          for (key in obj) {
            newInstance[key] = _clone(obj[key]);
          }
          return newInstance;
        };
        newInstance = new this.constructor();
        tmp = CSGBase.fromPolygons(this.polygons);
        newInstance.polygons = tmp.polygons;
        newInstance.isCanonicalized = this.isCanonicalized;
        newInstance.isRetesselated = this.isRetesselated;
        for (key in this) {
          if (key !== "polygons" && key !== "isCanonicalized" && key !== "isRetesselated" && key !== "constructor" && key !== "children" && key !== "uid" && key !== "parent") {
            if (this.hasOwnProperty(key)) {
              newInstance[key] = _clone(this[key]);
            }
          }
        }
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          childClone = child.clone();
          newInstance.children.push(childClone);
        }
        newInstance.uid = guid();
        return newInstance;
      };

      CSGBase.fromPolygons = function(polygons) {
        var csg;
        csg = new CSGBase();
        csg.polygons = polygons;
        csg.isCanonicalized = false;
        csg.isRetesselated = false;
        return csg;
      };

      CSGBase.fromObject = function(obj) {
        var csg, polygons;
        polygons = obj.polygons.map(function(p) {
          return Polygon.fromObject(p);
        });
        csg = CSGBase.fromPolygons(polygons);
        csg = csg.canonicalize();
        return csg;
      };

      CSGBase.fromCompactBinary = function(bin) {
        var arrayindex, csg, i, normal, numVerticesPerPolygon, numplanes, numpolygons, numpolygonvertices, numvertices, plane, planeData, planeindex, planes, polygon, polygonPlaneIndexes, polygonSharedIndexes, polygonVertices, polygonindex, polygons, polygonvertices, pos, shared, shareds, vertex, vertexData, vertexindex, vertices, w, x, y, z;
        if (bin["class"] !== "CSG") {
          throw new Error("Not a CSG");
        }
        planes = [];
        planeData = bin.planeData;
        numplanes = planeData.length / 4;
        arrayindex = 0;
        planeindex = 0;
        while (planeindex < numplanes) {
          x = planeData[arrayindex++];
          y = planeData[arrayindex++];
          z = planeData[arrayindex++];
          w = planeData[arrayindex++];
          normal = new Vector3D(x, y, z);
          plane = new Plane(normal, w);
          planes.push(plane);
          planeindex++;
        }
        vertices = [];
        vertexData = bin.vertexData;
        numvertices = vertexData.length / 3;
        arrayindex = 0;
        vertexindex = 0;
        while (vertexindex < numvertices) {
          x = vertexData[arrayindex++];
          y = vertexData[arrayindex++];
          z = vertexData[arrayindex++];
          pos = new Vector3D(x, y, z);
          vertex = new Vertex(pos);
          vertices.push(vertex);
          vertexindex++;
        }
        shareds = bin.shared.map(function(shared) {
          return Polygon.Shared.fromObject(shared);
        });
        polygons = [];
        numpolygons = bin.numPolygons;
        numVerticesPerPolygon = bin.numVerticesPerPolygon;
        polygonVertices = bin.polygonVertices;
        polygonPlaneIndexes = bin.polygonPlaneIndexes;
        polygonSharedIndexes = bin.polygonSharedIndexes;
        arrayindex = 0;
        polygonindex = 0;
        while (polygonindex < numpolygons) {
          numpolygonvertices = numVerticesPerPolygon[polygonindex];
          polygonvertices = [];
          i = 0;
          while (i < numpolygonvertices) {
            polygonvertices.push(vertices[polygonVertices[arrayindex++]]);
            i++;
          }
          plane = planes[polygonPlaneIndexes[polygonindex]];
          shared = shareds[polygonSharedIndexes[polygonindex]];
          polygon = new Polygon(polygonvertices, shared, plane);
          polygons.push(polygon);
          polygonindex++;
        }
        csg = CSGBase.fromPolygons(polygons);
        csg.isCanonicalized = true;
        csg.isRetesselated = true;
        return csg;
      };

      CSGBase.prototype.toPolygons = function() {
        return this.polygons;
      };

      CSGBase.prototype.toString = function() {
        var result;
        result = "CSG solid:\n";
        this.polygons.map(function(p) {
          return result += p.toString();
        });
        return result;
      };

      CSGBase.prototype.toCompactBinary = function() {
        var child, children, csg, numVerticesPerPolygon, numplanes, numpolygons, numpolygonvertices, numshared, numvertices, p, planeData, planeindex, planemap, planes, planesArrayIndex, planetag, polygonPlaneIndexes, polygonSharedIndexes, polygonVertices, polygonVerticesIndex, polygonindex, result, sharedindex, sharedmap, shareds, sharedtag, vertexData, vertexmap, vertices, verticesArrayIndex, _i, _len, _ref;
        csg = this.canonicalize();
        numpolygons = csg.polygons.length;
        numpolygonvertices = 0;
        numvertices = 0;
        vertexmap = {};
        vertices = [];
        numplanes = 0;
        planemap = {};
        polygonindex = 0;
        planes = [];
        shareds = [];
        sharedmap = {};
        numshared = 0;
        csg.polygons.map(function(p) {
          var planetag, sharedtag;
          p.vertices.map(function(v) {
            var vertextag;
            ++numpolygonvertices;
            vertextag = v.getTag();
            if (!(vertextag in vertexmap)) {
              vertexmap[vertextag] = numvertices++;
              return vertices.push(v);
            }
          });
          planetag = p.plane.getTag();
          if (!(planetag in planemap)) {
            planemap[planetag] = numplanes++;
            planes.push(p.plane);
          }
          sharedtag = p.shared.getTag();
          if (!(sharedtag in sharedmap)) {
            sharedmap[sharedtag] = numshared++;
            return shareds.push(p.shared);
          }
        });
        numVerticesPerPolygon = new Uint32Array(numpolygons);
        polygonSharedIndexes = new Uint32Array(numpolygons);
        polygonVertices = new Uint32Array(numpolygonvertices);
        polygonPlaneIndexes = new Uint32Array(numpolygons);
        vertexData = new Float64Array(numvertices * 3);
        planeData = new Float64Array(numplanes * 4);
        polygonVerticesIndex = 0;
        polygonindex = 0;
        while (polygonindex < numpolygons) {
          p = csg.polygons[polygonindex];
          numVerticesPerPolygon[polygonindex] = p.vertices.length;
          p.vertices.map(function(v) {
            var vertexindex, vertextag;
            vertextag = v.getTag();
            vertexindex = vertexmap[vertextag];
            return polygonVertices[polygonVerticesIndex++] = vertexindex;
          });
          planetag = p.plane.getTag();
          planeindex = planemap[planetag];
          polygonPlaneIndexes[polygonindex] = planeindex;
          sharedtag = p.shared.getTag();
          sharedindex = sharedmap[sharedtag];
          polygonSharedIndexes[polygonindex] = sharedindex;
          ++polygonindex;
        }
        verticesArrayIndex = 0;
        vertices.map(function(v) {
          var pos;
          pos = v.pos;
          vertexData[verticesArrayIndex++] = pos._x;
          vertexData[verticesArrayIndex++] = pos._y;
          return vertexData[verticesArrayIndex++] = pos._z;
        });
        planesArrayIndex = 0;
        planes.map(function(p) {
          var normal;
          normal = p.normal;
          planeData[planesArrayIndex++] = normal._x;
          planeData[planesArrayIndex++] = normal._y;
          planeData[planesArrayIndex++] = normal._z;
          return planeData[planesArrayIndex++] = p.w;
        });
        children = [];
        if (csg.children != null) {
          _ref = csg.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            children.push(child.toCompactBinary());
          }
        }
        result = {
          "class": "CSG",
          realClass: this.__proto__.constructor.name,
          uid: this.uid,
          numPolygons: numpolygons,
          numVerticesPerPolygon: numVerticesPerPolygon,
          polygonPlaneIndexes: polygonPlaneIndexes,
          polygonSharedIndexes: polygonSharedIndexes,
          polygonVertices: polygonVertices,
          vertexData: vertexData,
          planeData: planeData,
          shared: shareds,
          children: children
        };
        return result;
      };

      CSGBase.prototype.toPointCloud = function(cuberadius) {
        var csg, cube, pos, result, vertexmap, vertextag;
        csg = this.reTesselate();
        result = new CSGBase();
        vertexmap = {};
        csg.polygons.map(function(polygon) {
          return polygon.vertices.map(function(vertex) {
            return vertexmap[vertex.getTag()] = vertex.pos;
          });
        });
        for (vertextag in vertexmap) {
          pos = vertexmap[vertextag];
          cube = cube({
            center: pos,
            radius: cuberadius
          });
          result = result.unionSub(cube, false, false);
        }
        result = result.reTesselate();
        return result;
      };

      CSGBase.prototype.union = function(csg) {
        var csgs, i, islast;
        if (csg instanceof Array) {
          csgs = csg;
        } else {
          csgs = [csg];
        }
        i = 0;
        while (i < csgs.length) {
          islast = i === (csgs.length - 1);
          this.unionSub(csgs[i], islast, islast);
          i++;
        }
        return this;
      };

      CSGBase.prototype.unionSub = function(csg, retesselate, canonicalize) {
        var a, b;
        if (!this.mayOverlap(csg)) {
          return this.unionForNonIntersecting(csg);
        } else {
          a = new Tree(this.polygons);
          b = new Tree(csg.polygons);
          a.clipTo(b, false);
          b.clipTo(a);
          b.invert();
          b.clipTo(a);
          b.invert();
          this.polygons = a.allPolygons().concat(b.allPolygons());
          this.properties = this.properties._merge(csg.properties);
          this.isCanonicalized = false;
          this.isRetesselated = false;
          if (retesselate) {
            this.reTesselate();
          }
          if (canonicalize) {
            this.canonicalize();
          }
          this.cachedBoundingBox = null;
          return this;
        }
      };

      CSGBase.prototype.unionForNonIntersecting = function(csg) {
        var newpolygons;
        newpolygons = this.polygons.concat(csg.polygons);
        this.polygons = newpolygons;
        this.properties = this.properties._merge(csg.properties);
        this.isCanonicalized = this.isCanonicalized && csg.isCanonicalized;
        this.isRetesselated = this.isRetesselated && csg.isRetesselated;
        this.cachedBoundingBox = null;
        return this;
      };

      CSGBase.prototype.subtract = function(csg) {
        var csgs, i, islast;
        csgs = void 0;
        if (csg instanceof Array) {
          csgs = csg;
        } else {
          csgs = [csg];
        }
        i = 0;
        while (i < csgs.length) {
          islast = i === (csgs.length - 1);
          this.subtractSub(csgs[i], islast, islast);
          i++;
        }
        return this;
      };

      CSGBase.prototype.subtractSub = function(csg, retesselate, canonicalize) {
        var a, b;
        a = new Tree(this.polygons);
        b = new Tree(csg.polygons);
        a.invert();
        a.clipTo(b);
        b.clipTo(a, true);
        a.addPolygons(b.allPolygons());
        a.invert();
        this.polygons = a.allPolygons();
        this.properties = this.properties._merge(csg.properties);
        this.isCanonicalized = false;
        this.isRetesselated = false;
        if (retesselate) {
          this.reTesselate();
        }
        if (canonicalize) {
          this.canonicalize();
        }
        this.cachedBoundingBox = null;
        return this;
      };

      CSGBase.prototype.intersect = function(csg) {
        var csgs, i, islast;
        csgs = void 0;
        if (csg instanceof Array) {
          csgs = csg;
        } else {
          csgs = [csg];
        }
        i = 0;
        while (i < csgs.length) {
          islast = i === (csgs.length - 1);
          this.intersectSub(csgs[i], islast, islast);
          i++;
        }
        return this;
      };

      CSGBase.prototype.intersectSub = function(csg, retesselate, canonicalize) {
        var a, b;
        a = new Tree(this.polygons);
        b = new Tree(csg.polygons);
        a.invert();
        b.clipTo(a);
        b.invert();
        a.clipTo(b);
        b.clipTo(a);
        a.addPolygons(b.allPolygons());
        a.invert();
        this.polygons = a.allPolygons();
        this.properties = this.properties._merge(csg.properties);
        this.isCanonicalized = false;
        this.isRetesselated = false;
        if (retesselate) {
          this.reTesselate();
        }
        if (canonicalize) {
          this.canonicalize();
        }
        this.cachedBoundingBox = null;
        return this;
      };

      CSGBase.prototype.inverse = function() {
        var flippedpolygons, polygon;
        flippedpolygons = (function() {
          var _i, _len, _ref, _results;
          _ref = this.polygons;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            polygon = _ref[_i];
            _results.push(polygon.flipped());
          }
          return _results;
        }).call(this);
        this.polygons = flippedpolygons;
        this.cachedBoundingBox = null;
        return this;
      };

      CSGBase.prototype.transform = function(matrix4x4) {
        var ismirror, newpolygons, transformedplanes, transformedvertices;
        ismirror = matrix4x4.isMirroring();
        transformedvertices = {};
        transformedplanes = {};
        newpolygons = this.polygons.map(function(p) {
          var newplane, newvertices, plane, planetag;
          newplane = void 0;
          plane = p.plane;
          planetag = plane.getTag();
          if (planetag in transformedplanes) {
            newplane = transformedplanes[planetag];
          } else {
            newplane = plane.transform(matrix4x4);
            transformedplanes[planetag] = newplane;
          }
          newvertices = p.vertices.map(function(v) {
            var newvertex, vertextag;
            newvertex = void 0;
            vertextag = v.getTag();
            if (vertextag in transformedvertices) {
              newvertex = transformedvertices[vertextag];
            } else {
              newvertex = v.transform(matrix4x4);
              transformedvertices[vertextag] = newvertex;
            }
            return newvertex;
          });
          if (ismirror) {
            newvertices.reverse();
          }
          return new Polygon(newvertices, p.shared, newplane);
        });
        this.polygons = newpolygons;
        this.properties = this.properties._transform(matrix4x4);
        this.cachedBoundingBox = null;
        return this;
      };

      CSGBase.prototype.expand = function(radius, resolution) {
        var result;
        result = this.expandedShell(radius, resolution, true);
        result = result.reTesselate();
        this.polygons = result.polygons;
        this.isRetesselated = result.isRetesselated;
        this.isCanonicalized = result.isCanonicalized;
        return this;
      };

      CSGBase.prototype.contract = function(radius, resolution) {
        var expandedshell, result;
        expandedshell = this.expandedShell(radius, resolution, false);
        result = this.subtract(expandedshell);
        result = result.reTesselate();
        result.properties = this.properties;
        return result;
      };

      CSGBase.prototype.expandedShell = function(radius, resolution, unionWithThis) {
        var angle, angles, bestzaxis, bestzaxisorthogonality, co, cross, crosslength, csg, cylinder, endfacevertices, endpoint, extrudePolygon, i, normal, numangles, p, p1, p2, polygon, polygons, polygonvertices, prevangle, prevp1, prevp2, result, si, skip, sphere, startfacevertices, startpoint, vertexmap, vertexobj, vertexpair, vertexpairs, vertextag, vertextagpair, xaxis, xbase, yaxis, ybase, zaxis, zbase, _i, _j, _k, _ref;
        csg = this.reTesselate();
        result = void 0;
        if (unionWithThis) {
          result = csg;
        } else {
          result = new CSGBase();
        }
        extrudePolygon = function(polygon) {
          var extrudedface, extrudevector, translatedpolygon;
          extrudevector = polygon.plane.normal.unit().times(2 * radius);
          translatedpolygon = polygon.translate(extrudevector.times(-0.5));
          extrudedface = translatedpolygon.extrude(extrudevector);
          extrudedface = CSGBase.fromPolygons(extrudedface);
          return result = result.unionSub(extrudedface, false, false);
        };
        polygons = (function() {
          var _i, _len, _ref, _results;
          _ref = csg.polygons;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            polygon = _ref[_i];
            _results.push(extrudePolygon(polygon));
          }
          return _results;
        })();
        csg.polygons = polygons;
        vertexpairs = {};
        csg.polygons.map(function(polygon) {
          var i, numvertices, obj, prevvertex, prevvertextag, vertex, vertextag, vertextagpair, _i, _results;
          numvertices = polygon.vertices.length;
          prevvertex = polygon.vertices[numvertices - 1];
          prevvertextag = prevvertex.getTag();
          _results = [];
          for (i = _i = 0; 0 <= numvertices ? _i < numvertices : _i > numvertices; i = 0 <= numvertices ? ++_i : --_i) {
            vertex = polygon.vertices[i];
            vertextag = vertex.getTag();
            vertextagpair = void 0;
            if (vertextag < prevvertextag) {
              vertextagpair = vertextag + "-" + prevvertextag;
            } else {
              vertextagpair = prevvertextag + "-" + vertextag;
            }
            obj = void 0;
            if (vertextagpair in vertexpairs) {
              obj = vertexpairs[vertextagpair];
            } else {
              obj = {
                v1: prevvertex,
                v2: vertex,
                planenormals: []
              };
              vertexpairs[vertextagpair] = obj;
            }
            obj.planenormals.push(polygon.plane.normal);
            prevvertextag = vertextag;
            _results.push(prevvertex = vertex);
          }
          return _results;
        });
        for (vertextagpair in vertexpairs) {
          vertexpair = vertexpairs[vertextagpair];
          startpoint = vertexpair.v1.pos;
          endpoint = vertexpair.v2.pos;
          zbase = endpoint.minus(startpoint).unit();
          xbase = vertexpair.planenormals[0].unit();
          ybase = xbase.cross(zbase);
          angles = [];
          for (i = _i = 0; 0 <= resolution ? _i < resolution : _i > resolution; i = 0 <= resolution ? ++_i : --_i) {
            angle = i * Math.PI * 2 / resolution;
            angles.push(angle);
          }
          vertexpair.planenormals.map(function(planenormal) {
            var co, si;
            si = ybase.dot(planenormal);
            co = xbase.dot(planenormal);
            angle = Math.atan2(si, co);
            if (angle < 0) {
              angle += Math.PI * 2;
            }
            angles.push(angle);
            angle = Math.atan2(-si, -co);
            if (angle < 0) {
              angle += Math.PI * 2;
            }
            return angles.push(angle);
          });
          angles = angles.sort(function(a, b) {
            return a - b;
          });
          numangles = angles.length;
          prevp1 = void 0;
          prevp2 = void 0;
          startfacevertices = [];
          endfacevertices = [];
          polygons = [];
          prevangle = void 0;
          for (i = _j = -1; -1 <= numangles ? _j < numangles : _j > numangles; i = -1 <= numangles ? ++_j : --_j) {
            angle = angles[(i < 0 ? i + numangles : i)];
            si = Math.sin(angle);
            co = Math.cos(angle);
            p = xbase.times(co * radius).plus(ybase.times(si * radius));
            p1 = startpoint.plus(p);
            p2 = endpoint.plus(p);
            skip = false;
            if (i >= 0) {
              if (p1.distanceTo(prevp1) < 1e-5) {
                skip = true;
              }
            }
            if (!skip) {
              if (i >= 0) {
                startfacevertices.push(new Vertex(p1));
                endfacevertices.push(new Vertex(p2));
                polygonvertices = [new Vertex(prevp2), new Vertex(p2), new Vertex(p1), new Vertex(prevp1)];
                polygon = new Polygon(polygonvertices);
                polygons.push(polygon);
              }
              prevp1 = p1;
              prevp2 = p2;
            }
          }
          endfacevertices.reverse();
          polygons.push(new Polygon(startfacevertices));
          polygons.push(new Polygon(endfacevertices));
          cylinder = CSGBase.fromPolygons(polygons);
          result = result.unionSub(cylinder, false, false);
        }
        vertexmap = {};
        csg.polygons.map(function(polygon) {
          return polygon.vertices.map(function(vertex) {
            var obj, vertextag;
            vertextag = vertex.getTag();
            obj = void 0;
            if (vertextag in vertexmap) {
              obj = vertexmap[vertextag];
            } else {
              obj = {
                pos: vertex.pos,
                normals: []
              };
              vertexmap[vertextag] = obj;
            }
            return obj.normals.push(polygon.plane.normal);
          });
        });
        for (vertextag in vertexmap) {
          vertexobj = vertexmap[vertextag];
          xaxis = vertexobj.normals[0].unit();
          bestzaxis = null;
          bestzaxisorthogonality = 0;
          for (i = _k = 1, _ref = vertexobj.normals.length; 1 <= _ref ? _k < _ref : _k > _ref; i = 1 <= _ref ? ++_k : --_k) {
            normal = vertexobj.normals[i].unit();
            cross = xaxis.cross(normal);
            crosslength = cross.length();
            if (crosslength > 0.05) {
              if (crosslength > bestzaxisorthogonality) {
                bestzaxisorthogonality = crosslength;
                bestzaxis = normal;
              }
            }
          }
          if (!bestzaxis) {
            bestzaxis = xaxis.randomNonParallelVector();
          }
          yaxis = xaxis.cross(bestzaxis).unit();
          zaxis = yaxis.cross(xaxis);
          sphere = sphereUtil({
            center: vertexobj.pos,
            radius: radius,
            resolution: resolution,
            axes: [xaxis, yaxis, zaxis]
          });
          result = result.unionSub(sphere, false, false);
        }
        return result;
      };

      CSGBase.prototype.canonicalize = function() {
        var factory;
        if (this.isCanonicalized) {
          return this;
        } else {
          factory = new FuzzyCSGFactory();
          this.polygons = factory.getCSGPolygons(this);
          this.isCanonicalized = true;
          return this;
        }
      };

      CSGBase.prototype.reTesselate = function() {
        var destpolygons, planetag, polygonsPerPlane, retesselayedpolygons, sourcepolygons;
        if (this.isRetesselated) {
          return this;
        } else {
          this.canonicalize();
          polygonsPerPlane = {};
          this.polygons.map(function(polygon) {
            var planetag, sharedtag;
            planetag = polygon.plane.getTag();
            sharedtag = polygon.shared.getTag();
            planetag += "/" + sharedtag;
            if (!(planetag in polygonsPerPlane)) {
              polygonsPerPlane[planetag] = [];
            }
            return polygonsPerPlane[planetag].push(polygon);
          });
          destpolygons = [];
          for (planetag in polygonsPerPlane) {
            sourcepolygons = polygonsPerPlane[planetag];
            if (sourcepolygons.length < 2) {
              destpolygons = destpolygons.concat(sourcepolygons);
            } else {
              retesselayedpolygons = [];
              reTesselateCoplanarPolygons(sourcepolygons, retesselayedpolygons);
              destpolygons = destpolygons.concat(retesselayedpolygons);
            }
          }
          this.polygons = destpolygons;
          this.isRetesselated = true;
          this.isCanonicalized = false;
          this.canonicalize();
          return this;
        }
      };

      CSGBase.prototype.getBounds = function() {
        var getMinMaxPoints, i, maxpoint, minpoint, polygon, polygons, _i, _len;
        if (!this.cachedBoundingBox) {
          minpoint = new Vector3D(0, 0, 0);
          maxpoint = new Vector3D(0, 0, 0);
          polygons = this.polygons;
          getMinMaxPoints = (function(_this) {
            return function(polygon, i) {
              var bounds;
              bounds = polygon.boundingBox();
              if (i === 0) {
                minpoint = bounds[0];
                return maxpoint = bounds[1];
              } else {
                minpoint = minpoint.min(bounds[0]);
                return maxpoint = maxpoint.max(bounds[1]);
              }
            };
          })(this);
          for (i = _i = 0, _len = polygons.length; _i < _len; i = ++_i) {
            polygon = polygons[i];
            getMinMaxPoints(polygon, i);
          }
          this.cachedBoundingBox = [minpoint, maxpoint];
        }
        return this.cachedBoundingBox;
      };

      CSGBase.prototype.mayOverlap = function(csg) {
        var mybounds, otherbounds;
        if ((this.polygons.length === 0) || (csg.polygons.length === 0)) {
          return false;
        } else {
          mybounds = this.getBounds();
          otherbounds = csg.getBounds();
          if (mybounds[1].x < otherbounds[0].x) {
            return false;
          }
          if (mybounds[0].x > otherbounds[1].x) {
            return false;
          }
          if (mybounds[1].y < otherbounds[0].y) {
            return false;
          }
          if (mybounds[0].y > otherbounds[1].y) {
            return false;
          }
          if (mybounds[1].z < otherbounds[0].z) {
            return false;
          }
          if (mybounds[0].z > otherbounds[1].z) {
            return false;
          }
          return true;
        }
      };

      CSGBase.prototype.cutByPlane = function(plane, cutTop) {
        var cube, getMaxDistance, maxdistance, orthobasis, planecenter, polygon, vertices, _i, _len, _ref;
        if (cutTop == null) {
          cutTop = true;
        }
        if (this.polygons.length === 0) {
          return this;
        }
        if (!cutTop) {
          plane.flipped();
        }
        planecenter = plane.normal.times(plane.w);
        maxdistance = 0;
        getMaxDistance = (function(_this) {
          return function(polygon) {
            var distance, vertex, _i, _len, _ref, _results;
            _ref = polygon.vertices;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              vertex = _ref[_i];
              distance = vertex.pos.distanceToSquared(planecenter);
              if (distance > maxdistance) {
                _results.push(maxdistance = distance);
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          };
        })(this);
        _ref = this.polygons;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          polygon = _ref[_i];
          getMaxDistance(polygon);
        }
        maxdistance = Math.sqrt(maxdistance);
        maxdistance *= 1.01;
        vertices = [];
        orthobasis = new OrthoNormalBasis(plane);
        vertices.push(new Vertex(orthobasis.to3D(new Vector2D(maxdistance, -maxdistance))));
        vertices.push(new Vertex(orthobasis.to3D(new Vector2D(-maxdistance, -maxdistance))));
        vertices.push(new Vertex(orthobasis.to3D(new Vector2D(-maxdistance, maxdistance))));
        vertices.push(new Vertex(orthobasis.to3D(new Vector2D(maxdistance, maxdistance))));
        polygon = new Polygon(vertices, null, plane.flipped());
        cube = CSGBase.fromPolygons(polygon.extrude(plane.normal.times(-maxdistance)));
        this.intersect(cube);
        return this;
      };

      CSGBase.prototype.connectTo = function(myConnector, otherConnector, mirror, normalrotation) {
        var matrix;
        matrix = myConnector.getTransformationTo(otherConnector, mirror, normalrotation);
        return this.transform(matrix);
      };

      CSGBase.prototype.setShared = function(shared) {
        var polygons;
        polygons = this.polygons.map(function(p) {
          return new Polygon(p.vertices, shared, p.plane);
        });
        this.polygons = polygons;
        return this;
      };

      CSGBase.prototype.color = function(rgba) {
        var newshared;
        if (rgba.length < 4) {
          rgba[3] = 1;
        }
        newshared = new PolygonShared([rgba[0], rgba[1], rgba[2], rgba[3]]);
        return this.setShared(newshared);
      };

      CSGBase.prototype.getTransformationToFlatLying = function() {
        var besttransformation, bounds, csg, dotz, isbetter, isfirst, maxdotz, minheight, plane, planeconnector, planemap, planetag, pointonplane, transformation, transformedcsg, translation, xorthogonality, xvector, yorthogonality, yvector, z0connectorx, z0connectory, zheight, zvector;
        if (this.polygons.length === 0) {
          return new Matrix4x4();
        } else {
          csg = this.canonicalize();
          planemap = {};
          csg.polygons.map(function(polygon) {
            return planemap[polygon.plane.getTag()] = polygon.plane;
          });
          xvector = new Vector3D(1, 0, 0);
          yvector = new Vector3D(0, 1, 0);
          zvector = new Vector3D(0, 0, 1);
          z0connectorx = new Connector([0, 0, 0], [0, 0, -1], xvector);
          z0connectory = new Connector([0, 0, 0], [0, 0, -1], yvector);
          isfirst = true;
          minheight = 0;
          maxdotz = 0;
          besttransformation = void 0;
          for (planetag in planemap) {
            plane = planemap[planetag];
            pointonplane = plane.normal.times(plane.w);
            transformation = void 0;
            xorthogonality = plane.normal.cross(xvector).length();
            yorthogonality = plane.normal.cross(yvector).length();
            if (xorthogonality > yorthogonality) {
              planeconnector = new Connector(pointonplane, plane.normal, xvector);
              transformation = planeconnector.getTransformationTo(z0connectorx, false, 0);
            } else {
              planeconnector = new Connector(pointonplane, plane.normal, yvector);
              transformation = planeconnector.getTransformationTo(z0connectory, false, 0);
            }
            transformedcsg = csg.transform(transformation);
            dotz = -plane.normal.dot(zvector);
            bounds = transformedcsg.getBounds();
            zheight = bounds[1].z - bounds[0].z;
            isbetter = isfirst;
            if (!isbetter) {
              if (zheight < minheight) {
                isbetter = true;
              } else {
                if (zheight === minheight) {
                  if (dotz > maxdotz) {
                    isbetter = true;
                  }
                }
              }
            }
            if (isbetter) {
              translation = [-0.5 * (bounds[1].x + bounds[0].x), -0.5 * (bounds[1].y + bounds[0].y), -bounds[0].z];
              transformation = transformation.multiply(Matrix4x4.translation(translation));
              minheight = zheight;
              maxdotz = dotz;
              besttransformation = transformation;
            }
            isfirst = false;
          }
          return besttransformation;
        }
      };

      CSGBase.prototype.lieFlat = function() {
        var transformation;
        transformation = this.getTransformationToFlatLying();
        return this.transform(transformation);
      };

      CSGBase.prototype.projectToOrthoNormalBasis = function(orthobasis) {
        var cags, result;
        cags = [];
        this.polygons.map(function(polygon) {
          var cag;
          cag = polygon.projectToOrthoNormalBasis(orthobasis);
          if (cag.sides.length > 0) {
            return cags.push(cag);
          }
        });
        result = new CAGBase().union(cags);
        return result;
      };

      CSGBase.prototype.sectionCut = function(orthobasis) {
        var cut3d, plane1, plane2;
        plane1 = orthobasis.plane;
        plane2 = orthobasis.plane.flipped();
        plane1 = new Plane(plane1.normal, plane1.w + 1e-4);
        plane2 = new Plane(plane2.normal, plane2.w + 1e-4);
        cut3d = this.cutByPlane(plane1);
        cut3d = cut3d.cutByPlane(plane2);
        return cut3d.projectToOrthoNormalBasis(orthobasis);
      };

      CSGBase.prototype.fixTJunctions = function() {
        var addSide, ar, checkpos, closestpoint, csg, deleteSide, direction, directionindex, distancesquared, donesomething, donewithside, endpos, endvertex, endvertextag, i, idx, insertionvertextag, insertionvertextagindex, matchingside, matchingsideendvertex, matchingsideendvertextag, matchingsideindex, matchingsides, matchingsidestartvertex, matchingsidestartvertextag, matchingsidetag, newcsg, newpolygon, newsidetag1, newsidetag2, newvertices, nextvertex, nextvertexindex, nextvertextag, numvertices, polygon, polygonindex, polygons, reversesidetag, sidemap, sidemapisempty, sideobj, sideobjs, sidestocheck, sidetag, sidetagtocheck, startpos, startvertex, startvertextag, t, vertex, vertexindex, vertextag, vertextag2sideend, vertextag2sidestart, _i, _j, _ref;
        idx = void 0;
        csg = this.clone().canonicalize();
        sidemap = {};
        polygonindex = 0;
        while (polygonindex < csg.polygons.length) {
          polygon = csg.polygons[polygonindex];
          numvertices = polygon.vertices.length;
          if (numvertices >= 3) {
            vertex = polygon.vertices[0];
            vertextag = vertex.getTag();
            vertexindex = 0;
            while (vertexindex < numvertices) {
              nextvertexindex = vertexindex + 1;
              if (nextvertexindex === numvertices) {
                nextvertexindex = 0;
              }
              nextvertex = polygon.vertices[nextvertexindex];
              nextvertextag = nextvertex.getTag();
              sidetag = vertextag + "/" + nextvertextag;
              reversesidetag = nextvertextag + "/" + vertextag;
              if (reversesidetag in sidemap) {
                ar = sidemap[reversesidetag];
                ar.splice(-1, 1);
                if (ar.length === 0) {
                  delete sidemap[reversesidetag];
                }
              } else {
                sideobj = {
                  vertex0: vertex,
                  vertex1: nextvertex,
                  polygonindex: polygonindex
                };
                if (!(sidetag in sidemap)) {
                  sidemap[sidetag] = [sideobj];
                } else {
                  sidemap[sidetag].push(sideobj);
                }
              }
              vertex = nextvertex;
              vertextag = nextvertextag;
              vertexindex++;
            }
          }
          polygonindex++;
        }
        vertextag2sidestart = {};
        vertextag2sideend = {};
        sidestocheck = {};
        sidemapisempty = true;
        for (sidetag in sidemap) {
          sidemapisempty = false;
          sidestocheck[sidetag] = true;
          sidemap[sidetag].map(function(sideobj) {
            var endtag, starttag;
            starttag = sideobj.vertex0.getTag();
            endtag = sideobj.vertex1.getTag();
            if (starttag in vertextag2sidestart) {
              vertextag2sidestart[starttag].push(sidetag);
            } else {
              vertextag2sidestart[starttag] = [sidetag];
            }
            if (endtag in vertextag2sideend) {
              return vertextag2sideend[endtag].push(sidetag);
            } else {
              return vertextag2sideend[endtag] = [sidetag];
            }
          });
        }
        if (!sidemapisempty) {
          addSide = function(vertex0, vertex1, polygonindex) {
            var endtag, newsideobj, newsidetag, starttag;
            starttag = vertex0.getTag();
            endtag = vertex1.getTag();
            if (starttag === endtag) {
              throw new Error("Assertion failed");
            }
            newsidetag = starttag + "/" + endtag;
            reversesidetag = endtag + "/" + starttag;
            if (reversesidetag in sidemap) {
              deleteSide(vertex1, vertex0, null);
              return null;
            }
            newsideobj = {
              vertex0: vertex0,
              vertex1: vertex1,
              polygonindex: polygonindex
            };
            if (!(newsidetag in sidemap)) {
              sidemap[newsidetag] = [newsideobj];
            } else {
              sidemap[newsidetag].push(newsideobj);
            }
            if (starttag in vertextag2sidestart) {
              vertextag2sidestart[starttag].push(newsidetag);
            } else {
              vertextag2sidestart[starttag] = [newsidetag];
            }
            if (endtag in vertextag2sideend) {
              vertextag2sideend[endtag].push(newsidetag);
            } else {
              vertextag2sideend[endtag] = [newsidetag];
            }
            return newsidetag;
          };
          deleteSide = function(vertex0, vertex1, polygonindex) {
            var endtag, i, sideobjs, starttag, _i, _ref;
            starttag = vertex0.getTag();
            endtag = vertex1.getTag();
            sidetag = starttag + "/" + endtag;
            if (!(sidetag in sidemap)) {
              throw new Error("Assertion failed");
            }
            idx = -1;
            sideobjs = sidemap[sidetag];
            for (i = _i = 0, _ref = sideobjs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
              sideobj = sideobjs[i];
              if (sideobj.vertex0 !== vertex0) {
                continue;
              }
              if (sideobj.vertex1 !== vertex1) {
                continue;
              }
              if (polygonindex != null) {
                if (sideobj.polygonindex !== polygonindex) {
                  continue;
                }
              }
              idx = i;
              break;
            }
            if (idx < 0) {
              throw new Error("Assertion failed");
            }
            sideobjs.splice(idx, 1);
            if (sideobjs.length === 0) {
              delete sidemap[sidetag];
            }
            idx = vertextag2sidestart[starttag].indexOf(sidetag);
            if (idx < 0) {
              throw new Error("Assertion failed");
            }
            vertextag2sidestart[starttag].splice(idx, 1);
            if (vertextag2sidestart[starttag].length === 0) {
              delete vertextag2sidestart[starttag];
            }
            idx = vertextag2sideend[endtag].indexOf(sidetag);
            if (idx < 0) {
              throw new Error("Assertion failed");
            }
            vertextag2sideend[endtag].splice(idx, 1);
            if (vertextag2sideend[endtag].length === 0) {
              return delete vertextag2sideend[endtag];
            }
          };
          polygons = csg.polygons.slice(0);
          while (true) {
            sidemapisempty = true;
            for (sidetag in sidemap) {
              sidemapisempty = false;
              sidestocheck[sidetag] = true;
            }
            if (sidemapisempty) {
              break;
            }
            donesomething = false;
            while (true) {
              sidetagtocheck = null;
              for (sidetag in sidestocheck) {
                sidetagtocheck = sidetag;
                break;
              }
              if (sidetagtocheck === null) {
                break;
              }
              donewithside = true;
              if (sidetagtocheck in sidemap) {
                sideobjs = sidemap[sidetagtocheck];
                if (sideobjs.length === 0) {
                  throw new Error("Assertion failed");
                }
                sideobj = sideobjs[0];
                directionindex = 0;
                for (directionindex = _i = 0; _i < 2; directionindex = ++_i) {
                  startvertex = (directionindex === 0 ? sideobj.vertex0 : sideobj.vertex1);
                  endvertex = (directionindex === 0 ? sideobj.vertex1 : sideobj.vertex0);
                  startvertextag = startvertex.getTag();
                  endvertextag = endvertex.getTag();
                  matchingsides = [];
                  if (directionindex === 0) {
                    if (startvertextag in vertextag2sideend) {
                      matchingsides = vertextag2sideend[startvertextag];
                    }
                  } else {
                    if (startvertextag in vertextag2sidestart) {
                      matchingsides = vertextag2sidestart[startvertextag];
                    }
                  }
                  for (matchingsideindex = _j = 0, _ref = matchingsides.length; 0 <= _ref ? _j < _ref : _j > _ref; matchingsideindex = 0 <= _ref ? ++_j : --_j) {
                    matchingsidetag = matchingsides[matchingsideindex];
                    matchingside = sidemap[matchingsidetag][0];
                    matchingsidestartvertex = (directionindex === 0 ? matchingside.vertex0 : matchingside.vertex1);
                    matchingsideendvertex = (directionindex === 0 ? matchingside.vertex1 : matchingside.vertex0);
                    matchingsidestartvertextag = matchingsidestartvertex.getTag();
                    matchingsideendvertextag = matchingsideendvertex.getTag();
                    if (matchingsideendvertextag !== startvertextag) {
                      throw new Error("Assertion failed");
                    }
                    if (matchingsidestartvertextag === endvertextag) {
                      deleteSide(startvertex, endvertex, null);
                      deleteSide(endvertex, startvertex, null);
                      donewithside = false;
                      directionindex = 2;
                      donesomething = true;
                      break;
                    } else {
                      startpos = startvertex.pos;
                      endpos = endvertex.pos;
                      checkpos = matchingsidestartvertex.pos;
                      direction = checkpos.minus(startpos);
                      t = endpos.minus(startpos).dot(direction) / direction.dot(direction);
                      if ((t > 0) && (t < 1)) {
                        closestpoint = startpos.plus(direction.times(t));
                        distancesquared = closestpoint.distanceToSquared(endpos);
                        if (distancesquared < 1e-10) {
                          polygonindex = matchingside.polygonindex;
                          polygon = polygons[polygonindex];
                          insertionvertextag = matchingside.vertex1.getTag();
                          insertionvertextagindex = -1;
                          i = 0;
                          while (i < polygon.vertices.length) {
                            if (polygon.vertices[i].getTag() === insertionvertextag) {
                              insertionvertextagindex = i;
                              break;
                            }
                            i++;
                          }
                          if (insertionvertextagindex < 0) {
                            throw new Error("Assertion failed");
                          }
                          newvertices = polygon.vertices.slice(0);
                          newvertices.splice(insertionvertextagindex, 0, endvertex);
                          newpolygon = new Polygon(newvertices, polygon.shared);
                          polygons[polygonindex] = newpolygon;
                          deleteSide(matchingside.vertex0, matchingside.vertex1, polygonindex);
                          newsidetag1 = addSide(matchingside.vertex0, endvertex, polygonindex);
                          newsidetag2 = addSide(endvertex, matchingside.vertex1, polygonindex);
                          if (newsidetag1 !== null) {
                            sidestocheck[newsidetag1] = true;
                          }
                          if (newsidetag2 !== null) {
                            sidestocheck[newsidetag2] = true;
                          }
                          donewithside = false;
                          directionindex = 2;
                          donesomething = true;
                          break;
                        }
                      }
                    }
                  }
                }
              }
              if (donewithside) {
                delete sidestocheck[sidetag];
              }
            }
            if (!donesomething) {
              break;
            }
          }
          newcsg = CSGBase.fromPolygons(polygons);
          newcsg.properties = csg.properties;
          newcsg.isCanonicalized = true;
          newcsg.isRetesselated = true;
          csg = newcsg;
        }
        sidemapisempty = true;
        for (sidetag in sidemap) {
          sidemapisempty = false;
          break;
        }
        if (!sidemapisempty) {
          throw new Error("!sidemapisempty");
        }
        return csg;
      };

      return CSGBase;

    })(TransformBase);
    sphereUtil = function(options) {
      var angle, center, cospitch, cylinderpoint, pitch, polygons, prevcospitch, prevcylinderpoint, prevsinpitch, qresolution, radius, resolution, result, sinpitch, slice1, slice2, vertices, xvector, yvector, zvector;
      options = options || {};
      center = parseOptionAs3DVector(options, "center", [0, 0, 0]);
      radius = parseOptionAsFloat(options, "radius", 1);
      resolution = parseOptionAsInt(options, "resolution", CSGBase.defaultResolution3D);
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
      result = CSGBase.fromPolygons(polygons);
      result.properties.sphere = new Properties();
      result.properties.sphere.center = new Vector3D(center);
      result.properties.sphere.facepoint = center.plus(xvector);
      return result;
    };
    CAGBase = (function(_super) {
      __extends(CAGBase, _super);

      function CAGBase(options) {
        this.clear = __bind(this.clear, this);
        this.remove = __bind(this.remove, this);
        this.add = __bind(this.add, this);
        CAGBase.__super__.constructor.call(this, options);
        this.sides = [];
        this.isCanonicalized = false;
        this.uid = guid();
        this.parent = null;
        this.children = [];
      }

      CAGBase.prototype.add = function() {
        var obj, objectsToAdd, _i, _len, _results;
        objectsToAdd = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _results = [];
        for (_i = 0, _len = objectsToAdd.length; _i < _len; _i++) {
          obj = objectsToAdd[_i];
          obj.position = obj.position.plus(this.position);
          if (obj.parent != null) {
            obj.parent.remove(obj);
          }
          obj.parent = this;
          _results.push(this.children.push(obj));
        }
        return _results;
      };

      CAGBase.prototype.remove = function() {
        var child, childrenToRemove, index, _i, _len, _results;
        childrenToRemove = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _results = [];
        for (_i = 0, _len = childrenToRemove.length; _i < _len; _i++) {
          child = childrenToRemove[_i];
          index = this.children.indexOf(child);
          if (index !== -1) {
            child.parent = null;
            _results.push(this.children.splice(index, 1));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      CAGBase.prototype.clear = function() {
        var child, i, _i, _ref;
        for (i = _i = _ref = this.children.length - 1; _i > 0; i = _i += -1) {
          child = this.children[i];
          this.remove(child);
        }
        return this.children = [];
      };

      CAGBase.prototype.clone = function() {
        var key, newInstance, tmp, _clone;
        _clone = function(obj) {
          var flags, key, newInstance;
          if ((obj == null) || typeof obj !== 'object') {
            return obj;
          }
          if (obj instanceof Date) {
            return new Date(obj.getTime());
          }
          if (obj instanceof RegExp) {
            flags = '';
            if (obj.global != null) {
              flags += 'g';
            }
            if (obj.ignoreCase != null) {
              flags += 'i';
            }
            if (obj.multiline != null) {
              flags += 'm';
            }
            if (obj.sticky != null) {
              flags += 'y';
            }
            return new RegExp(obj.source, flags);
          }
          newInstance = new obj.constructor();
          for (key in obj) {
            newInstance[key] = _clone(obj[key]);
          }
          return newInstance;
        };
        newInstance = new this.constructor();
        tmp = CAGBase.fromSides(this.sides);
        newInstance.sides = tmp.sides;
        newInstance.isCanonicalized = this.isCanonicalized;
        for (key in this) {
          if (key !== "polygons" && key !== "isCanonicalized" && key !== "isRetesselated" && key !== "constructor" && key !== "children" && key !== "uid" && key !== "parent") {
            if (this.hasOwnProperty(key)) {
              newInstance[key] = _clone(this[key]);
            }
          }
        }
        return newInstance;
      };

      CAGBase.fromSides = function(sides) {
        var cag;
        cag = new CAGBase();
        cag.sides = sides;
        return cag;
      };

      CAGBase.fromPoints = function(points) {
        var area, numpoints, prevpoint, prevvertex, result, sides;
        numpoints = points.length;
        if (numpoints < 3) {
          throw new Error("CAG shape needs at least 3 points");
        }
        sides = [];
        prevpoint = new Vector2D(points[numpoints - 1]);
        prevvertex = new Vertex2D(prevpoint);
        points.map(function(p) {
          var point, side, vertex;
          point = new Vector2D(p);
          vertex = new Vertex2D(point);
          side = new Side(prevvertex, vertex);
          sides.push(side);
          return prevvertex = vertex;
        });
        result = CAGBase.fromSides(sides);
        if (result.isSelfIntersecting()) {
          throw new Error("Polygon is self intersecting!");
        }
        area = result.area();
        if (Math.abs(area) < 1e-5) {
          throw new Error("Degenerate polygon!");
        }
        if (area < 0) {
          result = result.flipped();
        }
        result.canonicalize();
        return result;
      };

      CAGBase.fromPointsNoCheck = function(points) {
        var prevpoint, prevvertex, sides;
        sides = [];
        prevpoint = new Vector2D(points[points.length - 1]);
        prevvertex = new Vertex2D(prevpoint);
        points.map(function(p) {
          var point, side, vertex;
          point = new Vector2D(p);
          vertex = new Vertex2D(point);
          side = new Side(prevvertex, vertex);
          sides.push(side);
          return prevvertex = vertex;
        });
        return CAGBase.fromSides(sides);
      };

      CAGBase.fromFakeCSG = function(csg) {
        var sides;
        sides = csg.polygons.map(function(p) {
          return Side.fromFakePolygon(p);
        });
        return CAGBase.fromSides(sides);
      };

      CAGBase.fromCompactBinary = function(bin) {
        var arrayindex, cag, numsides, numvertices, pos, side, sideindex, sides, vertex, vertexData, vertexindex, vertexindex0, vertexindex1, vertices, x, y;
        if (bin["class"] !== "CAG") {
          throw new Error("Not a CAG");
        }
        vertices = [];
        vertexData = bin.vertexData;
        numvertices = vertexData.length / 2;
        arrayindex = 0;
        vertexindex = 0;
        while (vertexindex < numvertices) {
          x = vertexData[arrayindex++];
          y = vertexData[arrayindex++];
          pos = new Vector2D(x, y);
          vertex = new Vertex2D(pos);
          vertices.push(vertex);
          vertexindex++;
        }
        sides = [];
        numsides = bin.sideVertexIndices.length / 2;
        arrayindex = 0;
        sideindex = 0;
        while (sideindex < numsides) {
          vertexindex0 = bin.sideVertexIndices[arrayindex++];
          vertexindex1 = bin.sideVertexIndices[arrayindex++];
          side = new Side(vertices[vertexindex0], vertices[vertexindex1]);
          sides.push(side);
          sideindex++;
        }
        cag = CAGBase.fromSides(sides);
        cag.isCanonicalized = true;
        return cag;
      };

      CAGBase.prototype.toString = function() {
        var result;
        result = "CAG (" + this.sides.length + " sides):\n";
        this.sides.map(function(side) {
          return result += "  " + side.toString() + "\n";
        });
        return result;
      };

      CAGBase.prototype.toCSG = function(z0, z1) {
        var polygons;
        polygons = this.sides.map(function(side) {
          return side.toPolygon3D(z0, z1);
        });
        return CSGBase.fromPolygons(polygons);
      };

      CAGBase.prototype.toDebugString1 = function() {
        var str;
        this.sides.sort(function(a, b) {
          return a.vertex0.pos.x - b.vertex0.pos.x;
        });
        str = "";
        this.sides.map(function(side) {
          return str += "(" + side.vertex0.pos.x + "," + side.vertex0.pos.y + ") - (" + side.vertex1.pos.x + "," + side.vertex1.pos.y + ")\n";
        });
        return str;
      };

      CAGBase.prototype.toDebugString = function() {
        var str;
        str = "CAGBase.fromSides([\n";
        this.sides.map(function(side) {
          return str += "  new Side(new Vertex2D(new Vector2D(" + side.vertex0.pos.x + "," + side.vertex0.pos.y + ")), new Vertex2D(new Vector2D(" + side.vertex1.pos.x + "," + side.vertex1.pos.y + "))),\n";
        });
        str += "]);\n";
        return str;
      };

      CAGBase.prototype.toCompactBinary = function() {
        var cag, child, children, numsides, numvertices, result, sideVertexIndices, sidevertexindicesindex, vertexData, vertexmap, vertices, verticesArrayIndex, _i, _len, _ref;
        cag = this.canonicalize();
        numsides = cag.sides.length;
        vertexmap = {};
        vertices = [];
        numvertices = 0;
        sideVertexIndices = new Uint32Array(2 * numsides);
        sidevertexindicesindex = 0;
        cag.sides.map(function(side) {
          return [side.vertex0, side.vertex1].map(function(v) {
            var vertexindex, vertextag;
            vertextag = v.getTag();
            vertexindex = void 0;
            if (!(vertextag in vertexmap)) {
              vertexindex = numvertices++;
              vertexmap[vertextag] = vertexindex;
              vertices.push(v);
            } else {
              vertexindex = vertexmap[vertextag];
            }
            return sideVertexIndices[sidevertexindicesindex++] = vertexindex;
          });
        });
        vertexData = new Float64Array(numvertices * 2);
        verticesArrayIndex = 0;
        vertices.map(function(v) {
          var pos;
          pos = v.pos;
          vertexData[verticesArrayIndex++] = pos._x;
          return vertexData[verticesArrayIndex++] = pos._y;
        });
        children = [];
        if (cag.children != null) {
          _ref = cag.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            children.push(child.toCompactBinary());
          }
        }
        result = {
          "class": "CAG",
          realClass: this.__proto__.constructor.name,
          children: children,
          sideVertexIndices: sideVertexIndices,
          vertexData: vertexData
        };
        return result;
      };

      CAGBase.prototype.toDxf = function(blobbuilder) {
        var paths;
        paths = this.getOutlinePaths();
        return CAGBase.PathsToDxf(paths, blobbuilder);
      };

      CAGBase.prototype.union = function(cag) {
        var cags, r;
        cags = void 0;
        if (cag instanceof Array) {
          cags = cag;
        } else {
          cags = [cag];
        }
        r = this.toCSG(-1, 1);
        cags.map(function(cag) {
          return r.unionSub(cag.toCSG(-1, 1), false, false);
        });
        r.reTesselate();
        r.canonicalize();
        cag = CAGBase.fromFakeCSG(r);
        this.sides = cag.sides;
        this.isCanonicalized = cag.isCanonicalized;
        return this;
      };

      CAGBase.prototype.subtract = function(cag) {
        var cags, r;
        cags = void 0;
        if (cag instanceof Array) {
          cags = cag;
        } else {
          cags = [cag];
        }
        r = this.toCSG(-1, 1);
        cags.map(function(cag) {
          return r.subtractSub(cag.toCSG(-1, 1), false, false);
        });
        r.reTesselate();
        r.canonicalize();
        r = CAGBase.fromFakeCSG(r);
        r.canonicalize();
        this.sides = r.sides;
        this.isCanonicalized = cag.isCanonicalized;
        return this;
      };

      CAGBase.prototype.intersect = function(cag) {
        var cags, r;
        cags = void 0;
        if (cag instanceof Array) {
          cags = cag;
        } else {
          cags = [cag];
        }
        r = this.toCSG(-1, 1);
        cags.map(function(cag) {
          return r.intersectSub(cag.toCSG(-1, 1), false, false);
        });
        r.reTesselate();
        r.canonicalize();
        r = CAGBase.fromFakeCSG(r);
        r.canonicalize();
        this.sides = r.sides;
        this.isCanonicalized = cag.isCanonicalized;
        return this;
      };

      CAGBase.prototype.transform = function(matrix4x4) {
        var ismirror, newsides;
        ismirror = matrix4x4.isMirroring();
        newsides = this.sides.map(function(side) {
          return side.transform(matrix4x4);
        });
        this.sides = newsides;
        if (ismirror) {
          this.flipped();
        }
        return this;
      };

      CAGBase.prototype.area = function() {
        var polygonArea;
        polygonArea = 0;
        this.sides.map(function(side) {
          return polygonArea += side.vertex0.pos.cross(side.vertex1.pos);
        });
        polygonArea *= 0.5;
        return polygonArea;
      };

      CAGBase.prototype.flipped = function() {
        var newsides;
        newsides = this.sides.map(function(side) {
          return side.flipped();
        });

        /*
        newsides.reverse()
        CAGBase.fromSides newsides
         */
        this.sides = newsides;
        this.sides.reverse();
        return this;
      };

      CAGBase.prototype.getBounds = function() {
        var maxpoint, minpoint;
        minpoint = void 0;
        if (this.sides.length === 0) {
          minpoint = new Vector2D(0, 0);
        } else {
          minpoint = this.sides[0].vertex0.pos;
        }
        maxpoint = minpoint;
        this.sides.map(function(side) {
          minpoint = minpoint.min(side.vertex0.pos);
          minpoint = minpoint.min(side.vertex1.pos);
          maxpoint = maxpoint.max(side.vertex0.pos);
          return maxpoint = maxpoint.max(side.vertex1.pos);
        });
        return [minpoint, maxpoint];
      };

      CAGBase.prototype.isSelfIntersecting = function() {
        var i, ii, numsides, side0, side1;
        numsides = this.sides.length;
        i = 0;
        while (i < numsides) {
          side0 = this.sides[i];
          ii = i + 1;
          while (ii < numsides) {
            side1 = this.sides[ii];
            if (CAGBase.linesIntersect(side0.vertex0.pos, side0.vertex1.pos, side1.vertex0.pos, side1.vertex1.pos)) {
              return true;
            }
            ii++;
          }
          i++;
        }
        return false;
      };

      CAGBase.prototype.expandedShell = function(radius, resolution) {
        var angle, angle1, angle2, cag, cags, end1, end2, fullcircle, m, newcag, numsteps, pcenter, point, pointmap, points, result, step, t, tag;
        resolution = resolution || 8;
        if (resolution < 4) {
          resolution = 4;
        }
        cags = [];
        pointmap = {};
        cag = this.canonicalize();
        cag.sides.map(function(side) {
          var d, dl, newcag, normal, p1, p2, shellpoints, step, tag, _results;
          d = side.vertex1.pos.minus(side.vertex0.pos);
          dl = d.length();
          if (dl > 1e-5) {
            d = d.times(1.0 / dl);
            normal = d.normal().times(radius);
            shellpoints = [side.vertex1.pos.plus(normal), side.vertex1.pos.minus(normal), side.vertex0.pos.minus(normal), side.vertex0.pos.plus(normal)];
            newcag = CAGBase.fromPoints(shellpoints);
            cags.push(newcag);
            step = 0;
            _results = [];
            while (step < 2) {
              p1 = (step === 0 ? side.vertex0.pos : side.vertex1.pos);
              p2 = (step === 0 ? side.vertex1.pos : side.vertex0.pos);
              tag = p1.x + " " + p1.y;
              if (!(tag in pointmap)) {
                pointmap[tag] = [];
              }
              pointmap[tag].push({
                p1: p1,
                p2: p2
              });
              _results.push(step++);
            }
            return _results;
          }
        });
        for (tag in pointmap) {
          m = pointmap[tag];
          angle1 = void 0;
          angle2 = void 0;
          pcenter = m[0].p1;
          if (m.length === 2) {
            end1 = m[0].p2;
            end2 = m[1].p2;
            angle1 = end1.minus(pcenter).angleDegrees();
            angle2 = end2.minus(pcenter).angleDegrees();
            if (angle2 < angle1) {
              angle2 += 360;
            }
            if (angle2 >= (angle1 + 360)) {
              angle2 -= 360;
            }
            if (angle2 < angle1 + 180) {
              t = angle2;
              angle2 = angle1 + 360;
              angle1 = t;
            }
            angle1 += 90;
            angle2 -= 90;
          } else {
            angle1 = 0;
            angle2 = 360;
          }
          fullcircle = angle2 > angle1 + 359.999;
          if (fullcircle) {
            angle1 = 0;
            angle2 = 360;
          }
          if (angle2 > (angle1 + 1e-5)) {
            points = [];
            if (!fullcircle) {
              points.push(pcenter);
            }
            numsteps = Math.round(resolution * (angle2 - angle1) / 360);
            if (numsteps < 1) {
              numsteps = 1;
            }
            step = 0;
            while (step <= numsteps) {
              angle = angle1 + step / numsteps * (angle2 - angle1);
              if (step === numsteps) {
                angle = angle2;
              }
              point = pcenter.plus(Vector2D.fromAngleDegrees(angle).times(radius));
              if ((!fullcircle) || (step > 0)) {
                points.push(point);
              }
              step++;
            }
            newcag = CAGBase.fromPointsNoCheck(points);
            cags.push(newcag);
          }
        }
        result = new CAGBase();
        result = result.union(cags);
        return result;
      };

      CAGBase.prototype.expand = function(radius, resolution) {
        this.union(this.expandedShell(radius, resolution));
        return this;
      };

      CAGBase.prototype.contract = function(radius, resolution) {
        this.subtract(this.expandedShell(radius, resolution));
        return this;
      };

      CAGBase.prototype.extrude = function(options) {
        var angle, bounds, csgplane, csgshell, flip, newpolygons, numsides, offsetvector, p1, p2, prevside, prevstepz, prevtransformedcag, sideindex, step, stepfraction, stepz, thisside, transformedcag, translatevector, twistangle, twiststeps;
        if (this.sides.length === 0) {
          return new CSGBase();
        }
        offsetvector = parseOptionAs3DVector(options, "offset", [0, 0, 1]);
        twistangle = parseOptionAsFloat(options, "twist", 0);
        twiststeps = parseOptionAsInt(options, "slices", 10);
        if (twistangle === 0) {
          twiststeps = 1;
        }
        if (twiststeps < 1) {
          twiststeps = 1;
        }
        newpolygons = [];
        prevtransformedcag = void 0;
        prevstepz = void 0;
        step = 0;
        while (step <= twiststeps) {
          stepfraction = step / twiststeps;
          transformedcag = this.clone();
          angle = twistangle * stepfraction;
          if (angle !== 0) {
            transformedcag = transformedcag.rotateZ(angle);
          }
          translatevector = new Vector2D(offsetvector.x, offsetvector.y).times(stepfraction);
          transformedcag = transformedcag.translate(translatevector);
          bounds = transformedcag.getBounds();
          bounds[0] = bounds[0].minus(new Vector2D(1, 1));
          bounds[1] = bounds[1].plus(new Vector2D(1, 1));
          stepz = offsetvector.z * stepfraction;
          if ((step === 0) || (step === twiststeps)) {
            csgshell = transformedcag.toCSG(stepz - 1, stepz + 1);
            csgplane = CSGBase.fromPolygons([new Polygon([new Vertex(new Vector3D(bounds[0].x, bounds[0].y, stepz)), new Vertex(new Vector3D(bounds[1].x, bounds[0].y, stepz)), new Vertex(new Vector3D(bounds[1].x, bounds[1].y, stepz)), new Vertex(new Vector3D(bounds[0].x, bounds[1].y, stepz))])]);
            flip = step === 0;
            if (offsetvector.z < 0) {
              flip = !flip;
            }
            if (flip) {
              csgplane.inverse();
            }
            csgplane.intersect(csgshell);
            csgplane.polygons.map(function(polygon) {
              if (Math.abs(polygon.plane.normal.z) > 0.99) {
                return newpolygons.push(polygon);
              }
            });
          }
          if (step > 0) {
            numsides = transformedcag.sides.length;
            sideindex = 0;
            while (sideindex < numsides) {
              thisside = transformedcag.sides[sideindex];
              prevside = prevtransformedcag.sides[sideindex];
              p1 = new Polygon([new Vertex(thisside.vertex1.pos.toVector3D(stepz)), new Vertex(thisside.vertex0.pos.toVector3D(stepz)), new Vertex(prevside.vertex0.pos.toVector3D(prevstepz))]);
              p2 = new Polygon([new Vertex(thisside.vertex1.pos.toVector3D(stepz)), new Vertex(prevside.vertex0.pos.toVector3D(prevstepz)), new Vertex(prevside.vertex1.pos.toVector3D(prevstepz))]);
              if (offsetvector.z < 0) {
                p1 = p1.flipped();
                p2 = p2.flipped();
              }
              newpolygons.push(p1);
              newpolygons.push(p2);
              sideindex++;
            }
          }
          prevtransformedcag = transformedcag;
          prevstepz = stepz;
          step++;
        }
        return CSGBase.fromPolygons(newpolygons);
      };

      CAGBase.prototype.check = function() {
        var area, count, errors, ertxt, pointcount, tag;
        errors = [];
        if (this.isSelfIntersecting()) {
          errors.push("Self intersects");
        }
        pointcount = {};
        this.sides.map(function(side) {
          var mappoint;
          mappoint = function(p) {
            var tag;
            tag = p.x + " " + p.y;
            if (!(tag in pointcount)) {
              pointcount[tag] = 0;
            }
            return pointcount[tag]++;
          };
          mappoint(side.vertex0.pos);
          return mappoint(side.vertex1.pos);
        });
        for (tag in pointcount) {
          count = pointcount[tag];
          if (count & 1) {
            errors.push("Uneven number of sides (" + count + ") for point " + tag);
          }
        }
        area = this.area();
        if (area < 1e-5) {
          errors.push("Area is " + area);
        }
        if (errors.length > 0) {
          ertxt = "";
          errors.map(function(err) {
            return ertxt += err + "\n";
          });
          throw new Error(ertxt);
        }
      };

      CAGBase.prototype.canonicalize = function() {
        var factory;
        if (this.isCanonicalized) {
          return this;
        } else {
          factory = new FuzzyCAGFactory();
          this.polygons = factory.getCAGSides(this);
          this.isCanonicalized = true;
          return this;
        }
      };

      CAGBase.prototype.getOutlinePaths = function() {
        var aVertexTag, angle, angledif, bestangle, cag, connectedVertexPoints, nextpossiblesidetag, nextpossiblesidetags, nextsideindex, nextsidetag, nextvertextag, path, paths, possibleside, sideTagToSideMap, sideindex, sidesForThisVertex, sidetag, startVertexTagToSideTagMap, startsidetag, startvertextag, thisangle, thisside;
        cag = this.canonicalize();
        sideTagToSideMap = {};
        startVertexTagToSideTagMap = {};
        cag.sides.map(function(side) {
          var sidetag, startvertextag;
          sidetag = side.getTag();
          sideTagToSideMap[sidetag] = side;
          startvertextag = side.vertex0.getTag();
          if (!(startvertextag in startVertexTagToSideTagMap)) {
            startVertexTagToSideTagMap[startvertextag] = [];
          }
          return startVertexTagToSideTagMap[startvertextag].push(sidetag);
        });
        paths = [];
        while (true) {
          startsidetag = null;
          for (aVertexTag in startVertexTagToSideTagMap) {
            sidesForThisVertex = startVertexTagToSideTagMap[aVertexTag];
            startsidetag = sidesForThisVertex[0];
            sidesForThisVertex.splice(0, 1);
            if (sidesForThisVertex.length === 0) {
              delete startVertexTagToSideTagMap[aVertexTag];
            }
            break;
          }
          if (startsidetag === null) {
            break;
          }
          connectedVertexPoints = [];
          sidetag = startsidetag;
          thisside = sideTagToSideMap[sidetag];
          startvertextag = thisside.vertex0.getTag();
          while (true) {
            connectedVertexPoints.push(thisside.vertex0.pos);
            nextvertextag = thisside.vertex1.getTag();
            if (nextvertextag === startvertextag) {
              break;
            }
            if (!(nextvertextag in startVertexTagToSideTagMap)) {
              throw new Error("Area is not closed!");
            }
            nextpossiblesidetags = startVertexTagToSideTagMap[nextvertextag];
            nextsideindex = -1;
            if (nextpossiblesidetags.length === 1) {
              nextsideindex = 0;
            } else {
              bestangle = null;
              thisangle = thisside.direction().angleDegrees();
              sideindex = 0;
              while (sideindex < nextpossiblesidetags.length) {
                nextpossiblesidetag = nextpossiblesidetags[sideindex];
                possibleside = sideTagToSideMap[nextpossiblesidetag];
                angle = possibleside.direction().angleDegrees();
                angledif = angle - thisangle;
                if (angledif < -180) {
                  angledif += 360;
                }
                if (angledif >= 180) {
                  angledif -= 360;
                }
                if ((nextsideindex < 0) || (angledif > bestangle)) {
                  nextsideindex = sideindex;
                  bestangle = angledif;
                }
                sideindex++;
              }
            }
            nextsidetag = nextpossiblesidetags[nextsideindex];
            nextpossiblesidetags.splice(nextsideindex, 1);
            if (nextpossiblesidetags.length === 0) {
              delete startVertexTagToSideTagMap[nextvertextag];
            }
            thisside = sideTagToSideMap[nextsidetag];
          }
          path = new Path2D(connectedVertexPoints, true);
          paths.push(path);
        }
        return paths;
      };

      CAGBase.linesIntersect = function(p0start, p0end, p1start, p1end) {
        var alphas, d, d0, d1;
        if (p0end.equals(p1start) || p1end.equals(p0start)) {
          d = p1end.minus(p1start).unit().plus(p0end.minus(p0start).unit()).length();
          if (d < 1e-5) {
            return true;
          }
        } else {
          d0 = p0end.minus(p0start);
          d1 = p1end.minus(p1start);
          if (Math.abs(d0.cross(d1)) < 1e-9) {
            return false;
          }
          alphas = solve2Linear(-d0.x, d1.x, -d0.y, d1.y, p0start.x - p1start.x, p0start.y - p1start.y);
          if ((alphas[0] > 1e-6) && (alphas[0] < 0.999999) && (alphas[1] > 1e-5) && (alphas[1] < 0.999999)) {
            return true;
          }
        }
        return false;
      };

      CAGBase.PathsToDxf = function(paths, blobbuilder) {
        var str;
        str = "999\nDXF generated by OpenJsCad\n  0\nSECTION\n  2\nENTITIES\n";
        blobbuilder.append(str);
        paths.map(function(path) {
          var numpoints_closed, point, pointindex, pointindexwrapped;
          numpoints_closed = path.points.length + (path.closed ? 1 : 0);
          str = "  0\nLWPOLYLINE\n  90\n" + numpoints_closed + "\n  70\n" + (path.closed ? 1 : 0) + "\n";
          pointindex = 0;
          while (pointindex < numpoints_closed) {
            pointindexwrapped = pointindex;
            if (pointindexwrapped >= path.points.length) {
              pointindexwrapped -= path.points.length;
            }
            point = path.points[pointindexwrapped];
            str += " 10\n" + point.x + "\n 20\n" + point.y + "\n 30\n0.0\n";
            pointindex++;
          }
          return blobbuilder.append(str);
        });
        str = "  0\nENDSEC\n  0\nEOF\n";
        return blobbuilder.append(str);
      };

      return CAGBase;

    })(TransformBase);
    rootAssembly = new CSGBase();

    /* 
    class Assembly extends csg.CSGBase
          constructor:()->
            super
     */
    return {
      "CSGBase": CSGBase,
      "CAGBase": CAGBase,
      "rootAssembly": rootAssembly
    };
  });

}).call(this);
