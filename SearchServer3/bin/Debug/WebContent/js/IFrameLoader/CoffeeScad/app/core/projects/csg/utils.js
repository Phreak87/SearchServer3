(function() {
  var __hasProp = {}.hasOwnProperty;

  define(function(require) {
    var FuzzyCAGFactory, FuzzyCSGFactory, FuzzyFactory, Line2D, OrthoNormalBasis, Polygon, Side, Vector2D, Vector3D, Vertex, extend, globals, insertSorted, interpolateBetween2DPointsForY, maths, merge, parseCenter, parseOption, parseOptionAs2DVector, parseOptionAs3DVector, parseOptionAsBool, parseOptionAsFloat, parseOptionAsInt, parseOptionAsLocations, parseOptions, reTesselateCoplanarPolygons;
    globals = require('./globals');
    maths = require('./maths');
    Vector2D = maths.Vector2D;
    Vector3D = maths.Vector3D;
    Vertex = maths.Vertex;
    Line2D = maths.Line2D;
    OrthoNormalBasis = maths.OrthoNormalBasis;
    Polygon = maths.Polygon;
    Side = maths.Side;
    merge = function(options, overrides) {
      return extend(extend({}, options), overrides);
    };
    extend = function(object, properties) {
      var key, val;
      for (key in properties) {
        val = properties[key];
        object[key] = val;
      }
      return object;
    };
    parseOptions = function(options, defaults) {
      var index, indexToName, key, name, option, result, val, _i, _len;
      if (Object.getPrototypeOf(options) === Object.prototype) {
        options = merge(defaults, options);
      } else if (options instanceof Array) {
        indexToName = {};
        result = {};
        index = 0;
        for (key in defaults) {
          if (!__hasProp.call(defaults, key)) continue;
          val = defaults[key];
          indexToName[index] = key;
          result[key] = val;
          index++;
        }
        for (index = _i = 0, _len = options.length; _i < _len; index = ++_i) {
          option = options[index];
          if (option != null) {
            name = indexToName[index];
            result[name] = option;
          }
        }
        options = result;
      }
      return options;
    };
    parseOption = function(options, optionname, defaultvalue) {
      var result;
      result = defaultvalue;
      if (options) {
        if (optionname in options) {
          result = options[optionname];
        }
      }
      return result;
    };
    parseOptionAs3DVector = function(options, optionname, defaultValue, defaultValue2) {
      var doCenter, result;
      if (optionname in options) {
        if (options[optionname] === false || options[optionname] === true) {
          doCenter = parseOptionAsBool(options, optionname, false);
          if (doCenter) {
            options[optionname] = defaultValue;
          } else {
            options[optionname] = defaultValue2;
          }
        }
      }
      result = parseOption(options, optionname, defaultValue);
      result = new Vector3D(result);
      return result;
    };
    parseOptionAs2DVector = function(options, optionname, defaultValue, defaultValue2) {
      var doCenter, result;
      if (optionname in options) {
        if (options[optionname] === false || options[optionname] === true) {
          doCenter = parseOptionAsBool(options, optionname, false);
          if (doCenter) {
            options[optionname] = defaultValue;
          } else {
            options[optionname] = defaultValue2;
          }
        }
      }
      result = parseOption(options, optionname, defaultValue);
      result = new Vector2D(result);
      return result;
    };
    parseOptionAsFloat = function(options, optionname, defaultvalue) {
      var result;
      result = parseOption(options, optionname, defaultvalue);
      if (typeof result === "string") {
        result = Number(result);
      } else {
        if (typeof result !== "number") {
          throw new Error("Parameter " + optionname + " should be a number");
        }
      }
      return result;
    };
    parseOptionAsInt = function(options, optionname, defaultvalue) {
      var result;
      result = parseOption(options, optionname, defaultvalue);
      return Number(Math.floor(result));
    };
    parseOptionAsBool = function(options, optionname, defaultvalue) {
      var result;
      result = parseOption(options, optionname, defaultvalue);
      if (typeof result === "string") {
        if (result === "true") {
          result = true;
        }
        if (result === "false") {
          result = false;
        }
        if (result === 0) {
          result = false;
        }
      }
      result = !!result;
      return result;
    };
    parseOptionAsLocations = function(options, optionName, defaultValue) {
      var loc, location, locations, mapping, mapping_old, result, stuff, subStuff, _i, _j, _len, _len1;
      result = parseOption(options, optionName, defaultValue);
      mapping_old = {
        "top": globals.top,
        "bottom": globals.bottom,
        "left": globals.left,
        "right": globals.right,
        "front": globals.front,
        "back": globals.back
      };
      mapping = {
        "all": parseInt("111111", 2),
        "top": parseInt("101111", 2),
        "bottom": parseInt("011111", 2),
        "left": parseInt("111011", 2),
        "right": parseInt("110111", 2),
        "front": parseInt("111110", 2),
        "back": parseInt("111101", 2)
      };
      stuff = null;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        location = result[_i];
        location = location.replace(/^\s+|\s+$/g, "");
        locations = location.split(" ");
        subStuff = null;
        for (_j = 0, _len1 = locations.length; _j < _len1; _j++) {
          loc = locations[_j];
          loc = mapping[loc];
          if (subStuff == null) {
            subStuff = loc;
          } else {
            subStuff = subStuff & loc;
          }
        }
        if (stuff == null) {
          stuff = subStuff;
        } else {
          stuff = stuff | subStuff;
        }
      }
      return stuff.toString(2);
    };
    parseCenter = function(options, optionname, defaultValue, defaultValue2, vectorClass) {
      var centerOption, component, doCenter, index, newDefaultValue, newDefaultValue2, result, _i, _len;
      if (optionname in options) {
        centerOption = options[optionname];
        if (centerOption instanceof Array) {
          newDefaultValue = new vectorClass(defaultValue);
          newDefaultValue2 = new vectorClass(defaultValue2);
          for (index = _i = 0, _len = centerOption.length; _i < _len; index = ++_i) {
            component = centerOption[index];
            if (typeof component === 'boolean') {
              if (index === 0) {
                centerOption[index] = component === true ? newDefaultValue2.x : component === false ? newDefaultValue.x : centerOption[index];
              } else if (index === 1) {
                centerOption[index] = component === true ? newDefaultValue2.y : component === false ? newDefaultValue.y : centerOption[index];
              } else if (index === 2) {
                centerOption[index] = component === true ? newDefaultValue2.z : component === false ? newDefaultValue.z : centerOption[index];
              }
            }
          }
          options[optionname] = centerOption;
        } else {
          if (typeof centerOption === 'boolean') {
            doCenter = parseOptionAsBool(options, optionname, false);
            if (doCenter) {
              options[optionname] = defaultValue2;
            } else {
              options[optionname] = defaultValue;
            }
          }
        }
      }
      result = parseOption(options, optionname, defaultValue);
      result = new vectorClass(result);
      return result;
    };
    insertSorted = function(array, element, comparefunc) {
      var compareresult, leftbound, rightbound, testelement, testindex;
      leftbound = 0;
      rightbound = array.length;
      while (rightbound > leftbound) {
        testindex = Math.floor((leftbound + rightbound) / 2);
        testelement = array[testindex];
        compareresult = comparefunc(element, testelement);
        if (compareresult > 0) {
          leftbound = testindex + 1;
        } else {
          rightbound = testindex;
        }
      }
      return array.splice(leftbound, 0, element);
    };
    interpolateBetween2DPointsForY = function(point1, point2, y) {
      var f1, f2, result, t;
      f1 = y - point1.y;
      f2 = point2.y - point1.y;
      if (f2 < 0) {
        f1 = -f1;
        f2 = -f2;
      }
      t = void 0;
      if (f1 <= 0) {
        t = 0.0;
      } else if (f1 >= f2) {
        t = 1.0;
      } else if (f2 < 1e-10) {
        t = 0.5;
      } else {
        t = f1 / f2;
      }
      result = point1.x + t * (point2.x - point1.x);
      return result;
    };
    reTesselateCoplanarPolygons = function(sourcepolygons, destpolygons) {
      var EPS, activepolygon, activepolygon_key, activepolygonindex, activepolygons, bottomleft, bottomright, d1, d2, i, ii, leftlinecontinues, leftlineisconvex, matchedindexes, maxindex, maxy, middleycoordinate, minindex, miny, newactivepolygon, newleftvertexindex, newoutpolygonrow, newrightvertexindex, newy, nextleftvertexindex, nextrightvertexindex, nextycoordinate, numpolygons, numvertices, orthobasis, outpolygon, plane, points2d, poly3d, polygon, polygonindex, polygonindex_key, polygonindexeswithcorner, polygontopvertexindexes, polygonvertices2d, pos2d, prevcontinuedindexes, prevoutpolygon, prevoutpolygonrow, prevpolygon, rightlinecontinues, rightlineisconvex, shared, startingpolygonindexes, thispolygon, topleft, topleftvertexindex, topright, toprightvertexindex, topvertexindex, topy2polygonindexes, vertices2d, vertices3d, x, xcoordinatebins, y, ycoordinate, ycoordinateBinningFactor, ycoordinate_as_string, ycoordinatebin, ycoordinatebins, ycoordinates, ycoordinatetopolygonindexes, yindex, _results;
      EPS = 1e-5;
      numpolygons = sourcepolygons.length;
      if (numpolygons > 0) {
        plane = sourcepolygons[0].plane;
        shared = sourcepolygons[0].shared;
        orthobasis = new OrthoNormalBasis(plane);
        polygonvertices2d = [];
        polygontopvertexindexes = [];
        topy2polygonindexes = {};
        ycoordinatetopolygonindexes = {};
        xcoordinatebins = {};
        ycoordinatebins = {};
        ycoordinateBinningFactor = 1.0 / EPS * 10;
        polygonindex = 0;
        while (polygonindex < numpolygons) {
          poly3d = sourcepolygons[polygonindex];
          vertices2d = [];
          numvertices = poly3d.vertices.length;
          minindex = -1;
          if (numvertices > 0) {
            miny = void 0;
            maxy = void 0;
            maxindex = void 0;
            i = 0;
            while (i < numvertices) {
              pos2d = orthobasis.to2D(poly3d.vertices[i].pos);
              ycoordinatebin = Math.floor(pos2d.y * ycoordinateBinningFactor);
              newy = void 0;
              if (ycoordinatebin in ycoordinatebins) {
                newy = ycoordinatebins[ycoordinatebin];
              } else if (ycoordinatebin + 1 in ycoordinatebins) {
                newy = ycoordinatebins[ycoordinatebin + 1];
              } else if (ycoordinatebin - 1 in ycoordinatebins) {
                newy = ycoordinatebins[ycoordinatebin - 1];
              } else {
                newy = pos2d.y;
                ycoordinatebins[ycoordinatebin] = pos2d.y;
              }
              pos2d = new Vector2D(pos2d.x, newy);
              vertices2d.push(pos2d);
              y = pos2d.y;
              if ((i === 0) || (y < miny)) {
                miny = y;
                minindex = i;
              }
              if ((i === 0) || (y > maxy)) {
                maxy = y;
                maxindex = i;
              }
              if (!(y in ycoordinatetopolygonindexes)) {
                ycoordinatetopolygonindexes[y] = {};
              }
              ycoordinatetopolygonindexes[y][polygonindex] = true;
              i++;
            }
            if (miny >= maxy) {
              vertices2d = [];
            } else {
              if (!(miny in topy2polygonindexes)) {
                topy2polygonindexes[miny] = [];
              }
              topy2polygonindexes[miny].push(polygonindex);
            }
          }
          vertices2d.reverse();
          minindex = numvertices - minindex - 1;
          polygonvertices2d.push(vertices2d);
          polygontopvertexindexes.push(minindex);
          polygonindex++;
        }
        ycoordinates = [];
        for (ycoordinate in ycoordinatetopolygonindexes) {
          ycoordinates.push(ycoordinate);
        }
        ycoordinates.sort(function(a, b) {
          return a - b;
        });
        activepolygons = [];
        prevoutpolygonrow = [];
        yindex = 0;
        _results = [];
        while (yindex < ycoordinates.length) {
          newoutpolygonrow = [];
          ycoordinate_as_string = ycoordinates[yindex];
          ycoordinate = Number(ycoordinate_as_string);
          polygonindexeswithcorner = ycoordinatetopolygonindexes[ycoordinate_as_string];
          activepolygonindex = 0;
          while (activepolygonindex < activepolygons.length) {
            activepolygon = activepolygons[activepolygonindex];
            polygonindex = activepolygon.polygonindex;
            if (polygonindexeswithcorner[polygonindex]) {
              vertices2d = polygonvertices2d[polygonindex];
              numvertices = vertices2d.length;
              newleftvertexindex = activepolygon.leftvertexindex;
              newrightvertexindex = activepolygon.rightvertexindex;
              while (true) {
                nextleftvertexindex = newleftvertexindex + 1;
                if (nextleftvertexindex >= numvertices) {
                  nextleftvertexindex = 0;
                }
                if (vertices2d[nextleftvertexindex].y !== ycoordinate) {
                  break;
                }
                newleftvertexindex = nextleftvertexindex;
              }
              nextrightvertexindex = newrightvertexindex - 1;
              if (nextrightvertexindex < 0) {
                nextrightvertexindex = numvertices - 1;
              }
              if (vertices2d[nextrightvertexindex].y === ycoordinate) {
                newrightvertexindex = nextrightvertexindex;
              }
              if ((newleftvertexindex !== activepolygon.leftvertexindex) && (newleftvertexindex === newrightvertexindex)) {
                activepolygons.splice(activepolygonindex, 1);
                --activepolygonindex;
              } else {
                activepolygon.leftvertexindex = newleftvertexindex;
                activepolygon.rightvertexindex = newrightvertexindex;
                activepolygon.topleft = vertices2d[newleftvertexindex];
                activepolygon.topright = vertices2d[newrightvertexindex];
                nextleftvertexindex = newleftvertexindex + 1;
                if (nextleftvertexindex >= numvertices) {
                  nextleftvertexindex = 0;
                }
                activepolygon.bottomleft = vertices2d[nextleftvertexindex];
                nextrightvertexindex = newrightvertexindex - 1;
                if (nextrightvertexindex < 0) {
                  nextrightvertexindex = numvertices - 1;
                }
                activepolygon.bottomright = vertices2d[nextrightvertexindex];
              }
            }
            ++activepolygonindex;
          }
          nextycoordinate = void 0;
          if (yindex >= ycoordinates.length - 1) {
            activepolygons = [];
            nextycoordinate = null;
          } else {
            nextycoordinate = Number(ycoordinates[yindex + 1]);
            middleycoordinate = 0.5 * (ycoordinate + nextycoordinate);
            startingpolygonindexes = topy2polygonindexes[ycoordinate_as_string];
            for (polygonindex_key in startingpolygonindexes) {
              polygonindex = startingpolygonindexes[polygonindex_key];
              vertices2d = polygonvertices2d[polygonindex];
              numvertices = vertices2d.length;
              topvertexindex = polygontopvertexindexes[polygonindex];
              topleftvertexindex = topvertexindex;
              while (true) {
                i = topleftvertexindex + 1;
                if (i >= numvertices) {
                  i = 0;
                }
                if (vertices2d[i].y !== ycoordinate) {
                  break;
                }
                if (i === topvertexindex) {
                  break;
                }
                topleftvertexindex = i;
              }
              toprightvertexindex = topvertexindex;
              while (true) {
                i = toprightvertexindex - 1;
                if (i < 0) {
                  i = numvertices - 1;
                }
                if (vertices2d[i].y !== ycoordinate) {
                  break;
                }
                if (i === topleftvertexindex) {
                  break;
                }
                toprightvertexindex = i;
              }
              nextleftvertexindex = topleftvertexindex + 1;
              if (nextleftvertexindex >= numvertices) {
                nextleftvertexindex = 0;
              }
              nextrightvertexindex = toprightvertexindex - 1;
              if (nextrightvertexindex < 0) {
                nextrightvertexindex = numvertices - 1;
              }
              newactivepolygon = {
                polygonindex: polygonindex,
                leftvertexindex: topleftvertexindex,
                rightvertexindex: toprightvertexindex,
                topleft: vertices2d[topleftvertexindex],
                topright: vertices2d[toprightvertexindex],
                bottomleft: vertices2d[nextleftvertexindex],
                bottomright: vertices2d[nextrightvertexindex]
              };
              insertSorted(activepolygons, newactivepolygon, function(el1, el2) {
                var x1, x2;
                x1 = interpolateBetween2DPointsForY(el1.topleft, el1.bottomleft, middleycoordinate);
                x2 = interpolateBetween2DPointsForY(el2.topleft, el2.bottomleft, middleycoordinate);
                if (x1 > x2) {
                  return 1;
                }
                if (x1 < x2) {
                  return -1;
                }
                return 0;
              });
            }
          }
          if (true) {
            for (activepolygon_key in activepolygons) {
              activepolygon = activepolygons[activepolygon_key];
              polygonindex = activepolygon.polygonindex;
              vertices2d = polygonvertices2d[polygonindex];
              numvertices = vertices2d.length;
              x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, ycoordinate);
              topleft = new Vector2D(x, ycoordinate);
              x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, ycoordinate);
              topright = new Vector2D(x, ycoordinate);
              x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, nextycoordinate);
              bottomleft = new Vector2D(x, nextycoordinate);
              x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, nextycoordinate);
              bottomright = new Vector2D(x, nextycoordinate);
              outpolygon = {
                topleft: topleft,
                topright: topright,
                bottomleft: bottomleft,
                bottomright: bottomright,
                leftline: Line2D.fromPoints(topleft, bottomleft),
                rightline: Line2D.fromPoints(bottomright, topright)
              };
              if (newoutpolygonrow.length > 0) {
                prevoutpolygon = newoutpolygonrow[newoutpolygonrow.length - 1];
                d1 = outpolygon.topleft.distanceTo(prevoutpolygon.topright);
                d2 = outpolygon.bottomleft.distanceTo(prevoutpolygon.bottomright);
                if ((d1 < EPS) && (d2 < EPS)) {
                  outpolygon.topleft = prevoutpolygon.topleft;
                  outpolygon.leftline = prevoutpolygon.leftline;
                  outpolygon.bottomleft = prevoutpolygon.bottomleft;
                  newoutpolygonrow.splice(newoutpolygonrow.length - 1, 1);
                }
              }
              newoutpolygonrow.push(outpolygon);
            }
            if (yindex > 0) {
              prevcontinuedindexes = {};
              matchedindexes = {};
              i = 0;
              while (i < newoutpolygonrow.length) {
                thispolygon = newoutpolygonrow[i];
                ii = 0;
                while (ii < prevoutpolygonrow.length) {
                  if (!matchedindexes[ii]) {
                    prevpolygon = prevoutpolygonrow[ii];
                    if (prevpolygon.bottomleft.distanceTo(thispolygon.topleft) < EPS) {
                      if (prevpolygon.bottomright.distanceTo(thispolygon.topright) < EPS) {
                        matchedindexes[ii] = true;
                        d1 = thispolygon.leftline.direction().x - prevpolygon.leftline.direction().x;
                        d2 = thispolygon.rightline.direction().x - prevpolygon.rightline.direction().x;
                        leftlinecontinues = Math.abs(d1) < EPS;
                        rightlinecontinues = Math.abs(d2) < EPS;
                        leftlineisconvex = leftlinecontinues || (d1 >= 0);
                        rightlineisconvex = rightlinecontinues || (d2 >= 0);
                        if (leftlineisconvex && rightlineisconvex) {
                          thispolygon.outpolygon = prevpolygon.outpolygon;
                          thispolygon.leftlinecontinues = leftlinecontinues;
                          thispolygon.rightlinecontinues = rightlinecontinues;
                          prevcontinuedindexes[ii] = true;
                        }
                        break;
                      }
                    }
                  }
                  ii++;
                }
                i++;
              }
              ii = 0;
              while (ii < prevoutpolygonrow.length) {
                if (!prevcontinuedindexes[ii]) {
                  prevpolygon = prevoutpolygonrow[ii];
                  prevpolygon.outpolygon.rightpoints.push(prevpolygon.bottomright);
                  if (prevpolygon.bottomright.distanceTo(prevpolygon.bottomleft) > EPS) {
                    prevpolygon.outpolygon.leftpoints.push(prevpolygon.bottomleft);
                  }
                  prevpolygon.outpolygon.leftpoints.reverse();
                  points2d = prevpolygon.outpolygon.rightpoints.concat(prevpolygon.outpolygon.leftpoints);
                  vertices3d = [];
                  points2d.map(function(point2d) {
                    var point3d, vertex3d;
                    point3d = orthobasis.to3D(point2d);
                    vertex3d = new Vertex(point3d);
                    return vertices3d.push(vertex3d);
                  });
                  polygon = new Polygon(vertices3d, shared, plane);
                  destpolygons.push(polygon);
                }
                ii++;
              }
            }
            i = 0;
            while (i < newoutpolygonrow.length) {
              thispolygon = newoutpolygonrow[i];
              if (!thispolygon.outpolygon) {
                thispolygon.outpolygon = {
                  leftpoints: [],
                  rightpoints: []
                };
                thispolygon.outpolygon.leftpoints.push(thispolygon.topleft);
                if (thispolygon.topleft.distanceTo(thispolygon.topright) > EPS) {
                  thispolygon.outpolygon.rightpoints.push(thispolygon.topright);
                }
              } else {
                if (!thispolygon.leftlinecontinues) {
                  thispolygon.outpolygon.leftpoints.push(thispolygon.topleft);
                }
                if (!thispolygon.rightlinecontinues) {
                  thispolygon.outpolygon.rightpoints.push(thispolygon.topright);
                }
              }
              i++;
            }
            prevoutpolygonrow = newoutpolygonrow;
          }
          _results.push(yindex++);
        }
        return _results;
      }
    };
    FuzzyFactory = (function() {
      function FuzzyFactory(numdimensions, tolerance) {
        var i, lookuptable;
        lookuptable = [];
        i = 0;
        while (i < numdimensions) {
          lookuptable.push({});
          i++;
        }
        this.lookuptable = lookuptable;
        this.nextElementId = 1;
        this.multiplier = 1.0 / tolerance;
        this.objectTable = {};
      }

      FuzzyFactory.prototype.lookupOrCreate = function(els, creatorCallback) {
        var dimension, elementLookupTable, key, object, value, valueMultiplied, valueQuantized1, valueQuantized2;
        object = void 0;
        key = this.lookupKey(els);
        if (key === null) {
          object = creatorCallback(els);
          key = this.nextElementId++;
          this.objectTable[key] = object;
          dimension = 0;
          while (dimension < els.length) {
            elementLookupTable = this.lookuptable[dimension];
            value = els[dimension];
            valueMultiplied = value * this.multiplier;
            valueQuantized1 = Math.floor(valueMultiplied);
            valueQuantized2 = Math.ceil(valueMultiplied);
            FuzzyFactory.insertKey(key, elementLookupTable, valueQuantized1);
            FuzzyFactory.insertKey(key, elementLookupTable, valueQuantized2);
            dimension++;
          }
        } else {
          object = this.objectTable[key];
        }
        return object;
      };

      FuzzyFactory.prototype.lookupKey = function(els) {
        var dimension, elementLookupTable, key, keyset, value, valueQuantized;
        keyset = {};
        dimension = 0;
        while (dimension < els.length) {
          elementLookupTable = this.lookuptable[dimension];
          value = els[dimension];
          valueQuantized = Math.round(value * this.multiplier);
          valueQuantized += "";
          if (valueQuantized in elementLookupTable) {
            if (dimension === 0) {
              keyset = elementLookupTable[valueQuantized];
            } else {
              keyset = FuzzyFactory.intersectSets(keyset, elementLookupTable[valueQuantized]);
            }
          } else {
            return null;
          }
          if (FuzzyFactory.isEmptySet(keyset)) {
            return null;
          }
          dimension++;
        }
        for (key in keyset) {
          return key;
        }
        return null;
      };

      FuzzyFactory.prototype.lookupKeySetForDimension = function(dimension, value) {
        var elementLookupTable, result, valueMultiplied, valueQuantized;
        result = void 0;
        elementLookupTable = this.lookuptable[dimension];
        valueMultiplied = value * this.multiplier;
        valueQuantized = Math.floor(value * this.multiplier);
        if (valueQuantized in elementLookupTable) {
          result = elementLookupTable[valueQuantized];
        } else {
          result = {};
        }
        return result;
      };

      FuzzyFactory.insertKey = function(key, lookuptable, quantizedvalue) {
        var newset;
        if (quantizedvalue in lookuptable) {
          return lookuptable[quantizedvalue][key] = true;
        } else {
          newset = {};
          newset[key] = true;
          return lookuptable[quantizedvalue] = newset;
        }
      };

      FuzzyFactory.isEmptySet = function(obj) {
        var key;
        for (key in obj) {
          return false;
        }
        return true;
      };

      FuzzyFactory.intersectSets = function(set1, set2) {
        var key, result;
        result = {};
        for (key in set1) {
          if (key in set2) {
            result[key] = true;
          }
        }
        return result;
      };

      FuzzyFactory.joinSets = function(set1, set2) {
        var key, result;
        result = {};
        for (key in set1) {
          result[key] = true;
        }
        for (key in set2) {
          result[key] = true;
        }
        return result;
      };

      return FuzzyFactory;

    })();
    FuzzyCSGFactory = (function() {
      function FuzzyCSGFactory() {
        this.vertexfactory = new FuzzyFactory(3, 1e-5);
        this.planefactory = new FuzzyFactory(4, 1e-5);
        this.polygonsharedfactory = {};
      }

      FuzzyCSGFactory.prototype.getPolygonShared = function(sourceshared) {
        var hash;
        hash = sourceshared.getHash();
        if (hash in this.polygonsharedfactory) {
          return this.polygonsharedfactory[hash];
        } else {
          this.polygonsharedfactory[hash] = sourceshared;
          return sourceshared;
        }
      };

      FuzzyCSGFactory.prototype.getVertex = function(sourcevertex) {
        var elements, result;
        elements = [sourcevertex.pos._x, sourcevertex.pos._y, sourcevertex.pos._z];
        result = this.vertexfactory.lookupOrCreate(elements, function(els) {
          return sourcevertex;
        });
        return result;
      };

      FuzzyCSGFactory.prototype.getPlane = function(sourceplane) {
        var elements, result;
        elements = [sourceplane.normal._x, sourceplane.normal._y, sourceplane.normal._z, sourceplane.w];
        result = this.planefactory.lookupOrCreate(elements, function(els) {
          return sourceplane;
        });
        return result;
      };

      FuzzyCSGFactory.prototype.getPolygon = function(sourcepolygon) {
        var newplane, newshared, newvertices, vertex;
        newplane = this.getPlane(sourcepolygon.plane);
        newshared = this.getPolygonShared(sourcepolygon.shared);
        newvertices = (function() {
          var _i, _len, _ref, _results;
          _ref = sourcepolygon.vertices;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            vertex = _ref[_i];
            _results.push(this.getVertex(vertex));
          }
          return _results;
        }).call(this);
        return new Polygon(newvertices, newshared, newplane);
      };

      FuzzyCSGFactory.prototype.getCSG = function(sourceCsg) {
        var newpolygons, _this;
        _this = this;
        newpolygons = sourceCsg.polygons.map(function(polygon) {
          return _this.getPolygon(polygon);
        });
        return CSGBase.fromPolygons(newpolygons);
      };

      FuzzyCSGFactory.prototype.getCSGPolygons = function(sourceCsg) {
        var newpolygons, polygon;
        return newpolygons = (function() {
          var _i, _len, _ref, _results;
          _ref = sourceCsg.polygons;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            polygon = _ref[_i];
            _results.push(this.getPolygon(polygon));
          }
          return _results;
        }).call(this);
      };

      return FuzzyCSGFactory;

    })();
    FuzzyCAGFactory = (function() {
      function FuzzyCAGFactory() {
        this.vertexfactory = new FuzzyFactory(2, 1e-5);
      }

      FuzzyCAGFactory.prototype.getVertex = function(sourcevertex) {
        var elements, result;
        elements = [sourcevertex.pos._x, sourcevertex.pos._y];
        result = this.vertexfactory.lookupOrCreate(elements, function(els) {
          return sourcevertex;
        });
        return result;
      };

      FuzzyCAGFactory.prototype.getSide = function(sourceside) {
        var vertex0, vertex1;
        vertex0 = this.getVertex(sourceside.vertex0);
        vertex1 = this.getVertex(sourceside.vertex1);
        return new Side(vertex0, vertex1);
      };

      FuzzyCAGFactory.prototype.getCAG = function(sourcecag) {
        var newsides, _this;
        _this = this;
        newsides = sourcecag.sides.map(function(side) {
          return _this.getSide(side);
        });
        return CAGBase.fromSides(newsides);
      };

      FuzzyCAGFactory.prototype.getCAGSides = function(sourceCag) {
        var newsides, _this;
        _this = this;
        newsides = sourceCag.sides.map(function(side) {
          return _this.getSide(side);
        });
        return newsides;
      };

      return FuzzyCAGFactory;

    })();
    return {
      "parseOption": parseOption,
      "parseOptions": parseOptions,
      "parseOptionAs3DVector": parseOptionAs3DVector,
      "parseOptionAs2DVector": parseOptionAs2DVector,
      "parseOptionAsFloat": parseOptionAsFloat,
      "parseOptionAsInt": parseOptionAsInt,
      "parseOptionAsBool": parseOptionAsBool,
      "parseOptionAsLocations": parseOptionAsLocations,
      "parseCenter": parseCenter,
      "insertSorted": insertSorted,
      "interpolateBetween2DPointsForY": interpolateBetween2DPointsForY,
      "reTesselateCoplanarPolygons": reTesselateCoplanarPolygons,
      "FuzzyFactory": FuzzyFactory,
      "FuzzyCSGFactory": FuzzyCSGFactory,
      "FuzzyCAGFactory": FuzzyCAGFactory,
      "merge": merge,
      "extend": extend
    };
  });

}).call(this);
