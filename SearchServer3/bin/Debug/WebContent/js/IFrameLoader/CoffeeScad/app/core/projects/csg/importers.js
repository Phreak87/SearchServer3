(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var Polygon, StlDecoder, Vector3D, Vertex, maths;
    maths = require('./maths');
    Vertex = maths.Vertex;
    Vector3D = maths.Vector2D;
    Polygon = maths.Polygon;
    return StlDecoder = (function() {
      function StlDecoder() {
        this["import"] = __bind(this["import"], this);
        this.headerLength = 80;
        this.dataType = null;
      }

      StlDecoder.prototype["import"] = function(data) {};

      StlDecoder.prototype.bin2str = function(buf) {
        var array_buffer, i, str;
        array_buffer = new Uint8Array(buf);
        str = "";
        i = 0;
        while (i < buf.byteLength) {
          str += String.fromCharCode(array_buffer[i]);
          i++;
        }
        return str;
      };

      StlDecoder.prototype.isASCII = function(buf) {
        var dv, i, str;
        dv = new DataView(buf);
        str = "";
        i = 0;
        while (i < 5) {
          str += String.fromCharCode(dv.getUint8(i, true));
          i++;
        }
        return str.toLowerCase() === "solid";
      };

      StlDecoder.prototype.parse = function(buf) {
        var str;
        if (this.isASCII(buf)) {
          str = this.bin2str(buf);
          return this.parseASCII(str);
        } else {
          return this.parseBinary(buf);
        }
      };

      StlDecoder.prototype.parseASCII = function(data) {
        var csgNormal, csgPlane, csgPolygons, csgVertices, normal, patternFace, patternNormal, patternVertex, result, text;
        csgPolygons = [];
        patternFace = /facet([\s\S]*?)endfacet/g;
        result = void 0;
        while ((result = patternFace.exec(data)) != null) {
          text = result[0];
          csgVertices = [];
          patternNormal = /normal[\s]+([-+]?[0-9]+\.?[0-9]*([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+/g;
          while ((result = patternNormal.exec(text)) != null) {
            normal = new Vector3D(parseFloat(result[1]), parseFloat(result[3]), parseFloat(result[5]));
          }
          patternVertex = /vertex[\s]+([-+]?[0-9]+\.?[0-9]*([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+[\s]+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)+/g;
          while ((result = patternVertex.exec(text)) != null) {
            csgVertices.push(new Vertex(new Vector3D(parseFloat(result[1]), parseFloat(result[3]), parseFloat(result[5]))));
          }
          csgNormal = new Vector3D(normal);
          csgPlane = new Plane(csgNormal, 1);
          csgPolygons.push(new Polygon(csgVertices, null, csgPlane));
        }
        return csgPolygons;
      };

      StlDecoder.prototype.parseBinary = function(buf) {
        var csgPlane, csgPolygons, csgVertices, dataOffset, dv, dvTriangleCount, faceLength, headerLength, i, le, len, normal, numTriangles, v;
        csgPolygons = [];
        headerLength = 80;
        dataOffset = 84;
        faceLength = 12 * 4 + 2;
        le = true;
        dvTriangleCount = new DataView(buf, headerLength, 4);
        numTriangles = dvTriangleCount.getUint32(0, le);
        i = 0;
        while (i < numTriangles) {
          dv = new DataView(buf, dataOffset + i * faceLength, faceLength);
          normal = new Vector3D(dv.getFloat32(0, le), dv.getFloat32(4, le), dv.getFloat32(8, le));
          v = 3;
          csgVertices = [];
          while (v < 12) {
            csgVertices.push(new Vertex(new Vector3D(dv.getFloat32(v * 4, le), dv.getFloat32((v + 1) * 4, le), dv.getFloat32((v + 2) * 4, le))));
            v += 3;
          }
          len = csgVertices.length;
          csgPlane = new Plane(normal, 1);
          csgPolygons.push(new Polygon(csgVertices, null, csgPlane));
          i++;
        }
        return csgPolygons;
      };

      return StlDecoder;

    })();
  });

}).call(this);
