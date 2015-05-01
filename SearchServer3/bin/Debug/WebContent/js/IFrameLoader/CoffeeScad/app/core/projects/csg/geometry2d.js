(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var CAGBase, Circle, Rectangle, Side, Vector2D, Vertex, Vertex2D, base, defaultResolution2D, extras, globals, maths, parseCenter, parseOptionAs2DVector, parseOptionAsFloat, parseOptionAsInt, parseOptionAsLocations, utils;
    globals = require('./globals');
    base = require('./csgBase');
    CAGBase = base.CAGBase;
    maths = require('./maths');
    Vertex = maths.Vertex;
    Vertex2D = maths.Vertex2D;
    Vector2D = maths.Vector2D;
    Side = maths.Side;
    globals = require('./globals');
    defaultResolution2D = globals.defaultResolution2D;
    utils = require('./utils');
    parseOptionAsLocations = utils.parseOptionAsLocations;
    parseOptionAs2DVector = utils.parseOptionAs2DVector;
    parseOptionAsFloat = utils.parseOptionAsFloat;
    parseOptionAsInt = utils.parseOptionAsInt;
    parseCenter = utils.parseCenter;
    extras = require('./extras');

    /*2D shapes */
    Circle = (function(_super) {
      __extends(Circle, _super);

      function Circle(options) {
        var center, defaults, diameter, hasRadius, i, point, prevvertex, radians, radius, resolution, sides, vertex;
        options = options || {};
        if ("r" in options) {
          hasRadius = true;
        }
        defaults = {
          r: 1,
          d: 2,
          center: [0, 0],
          $fn: globals.defaultResolution2D
        };
        Circle.__super__.constructor.call(this, options);
        diameter = parseOptionAsFloat(options, "d", defaults["d"]);
        radius = diameter / 2;
        if (hasRadius) {
          radius = parseOptionAsFloat(options, "r", radius);
        }
        center = parseCenter(options, "center", defaults["center"], defaults["center"], Vector2D);
        resolution = parseOptionAsInt(options, "$fn", defaults["$fn"]);
        sides = [];
        prevvertex = void 0;
        i = 0;
        while (i <= resolution) {
          radians = 2 * Math.PI * i / resolution;
          point = Vector2D.fromAngleRadians(radians).times(radius).plus(center);
          vertex = new Vertex2D(point);
          if (i > 0) {
            sides.push(new Side(prevvertex, vertex));
          }
          prevvertex = vertex;
          i++;
        }
        this.sides = sides;
      }

      return Circle;

    })(CAGBase);
    Rectangle = (function(_super) {
      __extends(Rectangle, _super);

      function Rectangle(options) {
        var bX, bY, backFlag, c, center, chosenIndices, corner, cornerRadius, cornerResolution, corners, defaults, frontFlag, halfSize, i, index, insetVector, j, leftFlag, points, r, rCornerPositions, result, rightFlag, sSwap, sign, size, subCenter, subShapes, validCorners, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1, _ref2;
        options = options || {};
        defaults = {
          size: [1, 1],
          center: [0, 0],
          cr: 0,
          $fn: 0,
          corners: ["all"]
        };
        Rectangle.__super__.constructor.call(this, options);
        size = parseOptionAs2DVector(options, "size", defaults["size"]);
        center = parseCenter(options, "center", size.dividedBy(2), defaults["center"], Vector2D);
        corners = parseOptionAsLocations(options, "corners", defaults["corners"]);
        cornerRadius = parseOptionAsFloat(options, "cr", defaults["cr"]);
        cornerResolution = parseOptionAsInt(options, "$fn", defaults["$fn"]);
        if (cornerRadius === 0 || cornerResolution === 0) {
          halfSize = size.dividedBy(2);
          sSwap = new Vector2D(halfSize.x, -halfSize.y);
          points = [center.plus(halfSize), center.plus(sSwap), center.minus(halfSize), center.minus(sSwap)];
          result = CAGBase.fromPoints(points);
          this.sides = result.sides;
        } else if (cornerRadius > 0 && cornerResolution > 0) {
          sign = function(p1, p2, p3) {
            return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
          };
          chosenIndices = [];
          validCorners = parseInt(corners, 2) & (parseInt("001111", 2));
          backFlag = 0x1;
          frontFlag = 0x2;
          rightFlag = parseInt("100", 2);
          leftFlag = parseInt("1000", 2);
          if (validCorners & frontFlag) {
            if (validCorners & leftFlag) {
              chosenIndices.push(3);
            }
            if (validCorners & rightFlag) {
              chosenIndices.push(1);
            }
          }
          if (validCorners & backFlag) {
            if (validCorners & leftFlag) {
              chosenIndices.push(2);
            }
            if (validCorners & rightFlag) {
              chosenIndices.push(0);
            }
          }
          subShapes = [];
          rCornerPositions = [];
          _ref = [-1, 1];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _ref1 = [-1, 1];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              j = _ref1[_j];
              subCenter = new Vector2D(i * size.x / 2, j * size.y / 2).plus(center);
              rCornerPositions.push(subCenter);
            }
          }
          for (i = _k = 0, _ref2 = rCornerPositions.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
            r = new Rectangle({
              size: cornerRadius,
              center: true
            });
            corner = rCornerPositions[i];
            bX = corner.x > center.x ? +1 : -1;
            bY = corner.y > center.y ? +1 : -1;
            insetVector = corner.minus(new Vector2D(bX, bY).times(cornerRadius / 2));
            r.translate(insetVector);
            subShapes.push(r);
          }
          for (_l = 0, _len2 = chosenIndices.length; _l < _len2; _l++) {
            index = chosenIndices[_l];
            corner = rCornerPositions[index];
            bX = corner.x > center.x ? +1 : -1;
            bY = corner.y > center.y ? +1 : -1;
            insetVector = corner.minus(new Vector2D(bX, bY).times(cornerRadius));
            c = new Circle({
              r: cornerRadius,
              $fn: cornerResolution,
              center: true
            });
            c.translate(insetVector);
            subShapes[index] = c;
          }

          /* 
          result = new CAGBase()
          for shape in subShapes
            result.union(shape)
           */
          result = extras.hull(subShapes);
          this.sides = result.sides;
        }
      }

      return Rectangle;

    })(CAGBase);
    return {
      "Rectangle": Rectangle,
      "Circle": Circle
    };
  });

}).call(this);
