(function() {
  define(function(require) {
    var CAGBase, Side, base, defaultResolution2D, distance, findFarthestPoint, getLeftAndRighSets, globals, hullSet, intersect, maths, parseOptionAs2DVector, parseOptionAsFloat, parseOptionAsInt, pointLocation, quickHull2d, quickHullSub3, removeFromArray, removePoints, rotate, scale, sign, subtract, translate, union, utils;
    base = require('./csgBase');
    CAGBase = base.CAGBase;
    maths = require('./maths');
    Side = maths.Side;
    globals = require('./globals');
    defaultResolution2D = globals.defaultResolution2D;
    utils = require('./utils');
    parseOptionAs2DVector = utils.parseOptionAs2DVector;
    parseOptionAsFloat = utils.parseOptionAsFloat;
    parseOptionAsInt = utils.parseOptionAsInt;
    union = function(csg) {
      var csgs, i, result, _i, _ref;
      csgs = void 0;
      if (csg instanceof Array) {
        csgs = csg;
        result = csgs[0];
        for (i = _i = 1, _ref = csgs.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
          result.union(csgs[i]);
        }
        return result;
      } else {
        return csg;
      }
    };
    subtract = function(csg) {
      var csgs, i, result, _i, _ref;
      csgs = void 0;
      if (csg instanceof Array) {
        csgs = csg;
        result = csgs[0];
        for (i = _i = 1, _ref = csgs.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
          result.subtract(csgs[i]);
        }
        return result;
      } else {
        return csg;
      }
    };
    intersect = function(csg) {
      var csgs, i, result, _i, _ref;
      csgs = void 0;
      if (csg instanceof Array) {
        csgs = csg;
        result = csgs[0];
        for (i = _i = 1, _ref = csgs.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
          result.intersect(csgs[i]);
        }
        return result;
      } else {
        return csg;
      }
    };
    translate = function(v, csg) {
      var csgs, _i, _len;
      csgs = void 0;
      if (csg instanceof Array) {
        csgs = csg;
      } else {
        csgs = [csg];
      }
      for (_i = 0, _len = csgs.length; _i < _len; _i++) {
        csg = csgs[_i];
        csg.translate(v);
      }
      return csgs;
    };
    rotate = function(degrees, rotationCenter, csg) {
      var csgs, _i, _len;
      csgs = void 0;
      if (csg instanceof Array) {
        csgs = csg;
      } else {
        csgs = [csg];
      }
      for (_i = 0, _len = csgs.length; _i < _len; _i++) {
        csg = csgs[_i];
        csg.rotate(degrees, rotationCenter);
      }
      return csgs;
    };
    scale = function(f, csg) {
      var csgs, _i, _len;
      csgs = void 0;
      if (csg instanceof Array) {
        csgs = csg;
      } else {
        csgs = [csg];
      }
      for (_i = 0, _len = csgs.length; _i < _len; _i++) {
        csg = csgs[_i];
        csg.scale(f);
      }
      return csgs;
    };

    /*    
    isLeft=(a, b, c)->
       return ((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0
    
    pointLineDist2 = (pt, lineStart, lineEnd)->
      sqr = (x) ->
        x * x
      dist2 = (v, w) ->
        sqr(v.x - w.x) + sqr(v.y - w.y)
      distToSegmentSquared = (p, v, w) ->
        l2 = dist2(v, w)
        return dist2(p, v)  if l2 is 0
        t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2
        return dist2(p, v)  if t < 0
        return dist2(p, w)  if t > 1
        dist2 p,
          x: v.x + t * (w.x - v.x)
          y: v.y + t * (w.y - v.y)
      
      return   distToSegmentSquared(pt, lineStart, lineEnd)
         *Math.sqrt distToSegmentSquared
    
    pointLineDist_old = (pt, lineStart, lineEnd)->
      tmpVect = lineEnd.minus(lineStart)
      tmpVect2 = pt.minus(lineStart)
      
      numer =  tmpVect2.dot(tmpVect)
      if (numer <= 0.0)
        point = lineStart
        return pt.minus(point).length()#lineStart
      denom = tmpVect.dot(tmpVect)
      if (numer >= denom)
        point = lineEnd
        return pt.minus(point).length()
         *return 0#lineEnd
      
      point = lineStart.plus(tmpVect.times(numer/denom))
      return pt.minus(point).length()
     
    pointLineDist = (pt, lineStart, lineEnd)->
      vY = lineEnd.x-lineStart.x
      vX = lineEnd.y-lineStart.y
      return (vX * (pt.x - lineStart.x) + vY * (pt.y - lineStart.y))
      
    pointInTriangle = (pt, v1, v2, v3)->
      b1 = sign(pt, v1, v2) < 0.0
      b2 = sign(pt, v2, v3) < 0.0
      b3 = sign(pt, v3, v1) < 0.0
      return ((b1 == b2) and (b2 == b3))
      
    findFarthestPointAndFilter=(points, minPoint, maxPoint)->
       *console.log " "
       *console.log "min #{minPoint}, max #{maxPoint}"
       *max distance search and removal of points on line
      maxDist = -Infinity
      maxDistPoint = null
      filteredPoints = []
      
      for point in points
        dist = pointLineDist2(point, minPoint, maxPoint)
         *console.log "point: #{point} dist: #{dist} maxdist#{maxDist} "
        if dist>0
          filteredPoints.push(point)
        else
          continue
        if dist > maxDist
          maxDist = dist
          maxDistPoint = point
       *console.log "resultPoints #{filteredPoints}"
      return [maxDistPoint,filteredPoints]
     */
    sign = function(p1, p2, p3) {
      return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    };
    removeFromArray = function(array, element) {
      var index;
      index = array.indexOf(element);
      array.splice(index, 1);
      return array;
    };

    /*FROM THIS POINT ON, implem 3 of quickHULL */
    distance = function(A, B, C) {
      var ABx, ABy, num;
      ABx = B.x - A.x;
      ABy = B.y - A.y;
      num = ABx * (A.y - C.y) - ABy * (A.x - C.x);
      if (num < 0) {
        num = -num;
      }
      return num;
    };
    pointLocation = function(A, B, P) {
      var cp1;
      cp1 = (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x);
      if (cp1 > 0) {
        return 1;
      }
      return -1;
    };
    findFarthestPoint = function(points, minPoint, maxPoint) {
      var dist, maxDist, maxDistPoint, point, _i, _len;
      maxDist = -Infinity;
      maxDistPoint = null;
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        dist = distance(point, minPoint, maxPoint);
        if (dist > maxDist) {
          maxDist = dist;
          maxDistPoint = point;
        }
      }
      return maxDistPoint;
    };
    removePoints = function(points, maxDistPoint, minPoint, maxPoint) {
      var i, point, result, toRemove, _i, _ref;
      result = points.slice(0);
      toRemove = [];
      for (i = _i = _ref = result.length - 1; _i >= 0; i = _i += -1) {
        point = result[i];
        if (pointInTriangle(point, maxDistPoint, minPoint, maxPoint)) {
          toRemove.push(point);
          result = removeFromArray(result, point);
        }
      }
      return result;
    };
    getLeftAndRighSets = function(points, minPoint, maxPoint) {
      var cross, leftSet, point, rightSet, _i, _len;
      rightSet = [];
      leftSet = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        cross = sign(point, minPoint, maxPoint);
        if (cross < 0) {
          leftSet.push(point);
        } else if (cross > 0) {
          rightSet.push(point);
        }
      }
      return [leftSet, rightSet];
    };
    quickHullSub3 = function(points) {
      var convexHull, leftSet, maxPoint, minPoint, point, rightSet, _i, _len, _ref;
      convexHull = [];
      if (points.length < 3) {
        return points;
      }
      minPoint = {
        x: +Infinity,
        y: 0
      };
      maxPoint = {
        x: -Infinity,
        y: 0
      };
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        if (point.x < minPoint.x) {
          minPoint = point;
        }
        if (point.x > maxPoint.x) {
          maxPoint = point;
        }
      }
      convexHull.push(minPoint);
      convexHull.push(maxPoint);
      removeFromArray(points, minPoint);
      removeFromArray(points, maxPoint);
      _ref = getLeftAndRighSets(points, minPoint, maxPoint), rightSet = _ref[0], leftSet = _ref[1];
      hullSet(minPoint, maxPoint, rightSet, convexHull);
      hullSet(maxPoint, minPoint, leftSet, convexHull);
      return convexHull;
    };
    hullSet = function(minPoint, maxPoint, set, hull) {
      var furthestPoint, insertPosition, leftSet, leftSet2, p, rightSet, rightSet2, _ref, _ref1;
      insertPosition = hull.indexOf(maxPoint);
      if (set.length === 0) {
        return;
      }
      if (set.length === 1) {
        p = set[0];
        removeFromArray(set, p);
        hull.splice(insertPosition, 0, p);
        return;
      }
      furthestPoint = findFarthestPoint(set, minPoint, maxPoint);
      hull.splice(insertPosition, 0, furthestPoint);
      _ref = getLeftAndRighSets(set, minPoint, furthestPoint), rightSet = _ref[0], leftSet = _ref[1];
      _ref1 = getLeftAndRighSets(set, furthestPoint, maxPoint), rightSet2 = _ref1[0], leftSet2 = _ref1[1];
      hullSet(minPoint, furthestPoint, rightSet, hull);
      return hullSet(furthestPoint, maxPoint, rightSet2, hull);
    };
    quickHull2d = function(cag) {
      var cags, hullPoints, points, posExists, posIndex, result;
      cags = void 0;
      if (cag instanceof Array) {
        cags = cag;
      } else {
        cags = [cag];
      }
      points = [];
      posIndex = [];
      posExists = function(pos) {
        var index;
        index = "" + pos._x + ";" + pos._y;
        if (posIndex.indexOf(index) === -1) {
          posIndex.push(index);
          return false;
        }
        return true;
      };
      cags.map(function(cag) {
        var side, v0Pos, v1Pos, _i, _len, _ref, _results;
        _ref = cag.sides;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          side = _ref[_i];
          v0Pos = side.vertex0.pos;
          v1Pos = side.vertex1.pos;
          if (!posExists(v0Pos)) {
            points.push(v0Pos);
          }
          if (!posExists(v1Pos)) {
            _results.push(points.push(v1Pos));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
      hullPoints = quickHullSub3(points);
      result = CAGBase.fromPoints(hullPoints);
      return result;
    };
    return {
      "hull": quickHull2d,
      "union": union,
      "subtract": subtract,
      "intersect": intersect,
      "translate": translate,
      "rotate": rotate,
      "scale": scale
    };
  });

}).call(this);
