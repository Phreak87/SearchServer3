(function() {
  define(function(require) {
    var CAGBase, CAGfromCompactBinary, CSGBase, CSGfromCompactBinary, Plane, Polygon, PolygonShared, Side, Vector2D, Vector3D, Vertex, Vertex2D, base, fromCompactBinary, maths;
    base = require('./csgBase');
    CSGBase = base.CSGBase;
    CAGBase = base.CAGBase;
    maths = require('./maths');
    Plane = maths.Plane;
    Vector3D = maths.Vector3D;
    Vector2D = maths.Vector2D;
    Vertex = maths.Vertex;
    Vertex2D = maths.Vertex;
    Polygon = maths.Polygon;
    PolygonShared = maths.PolygonShared;
    Side = maths.Side;
    CSGfromCompactBinary = function(bin) {
      var arrayindex, child, csg, i, normal, numVerticesPerPolygon, numplanes, numpolygons, numpolygonvertices, numvertices, plane, planeData, planeindex, planes, polygon, polygonPlaneIndexes, polygonSharedIndexes, polygonVertices, polygonindex, polygons, polygonvertices, pos, shared, shareds, vertex, vertexData, vertexindex, vertices, w, x, y, z, _i, _len, _ref;
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
        return PolygonShared.fromObject(shared);
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
      csg.realClassName = bin.realClass;
      csg.uid = bin.uid;
      csg.children = [];
      _ref = bin.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        csg.children.push(fromCompactBinary(child));
      }
      return csg;
    };
    CAGfromCompactBinary = function(bin) {
      var arrayindex, cag, child, numsides, numvertices, pos, side, sideindex, sides, vertex, vertexData, vertexindex, vertexindex0, vertexindex1, vertices, x, y, _i, _len, _ref;
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
      cag.children = [];
      _ref = bin.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        cag.children.push(fromCompactBinary(child));
      }
      return cag;
    };
    fromCompactBinary = function(bin) {
      if (bin["class"] === "CSG") {
        return CSGfromCompactBinary(bin);
      } else if (bin["class"] === "CAG") {
        return CAGfromCompactBinary(bin);
      } else {
        throw new Error("Not a CSG or a CAG");
      }
    };
    return {
      "CSGfromCompactBinary": CSGfromCompactBinary,
      "CAGfromCompactBinary": CAGfromCompactBinary,
      "fromCompactBinary": fromCompactBinary
    };
  });

}).call(this);
