(function() {
  define(function(require) {
    var THREE;
    THREE = require('three');
    THREE.CSG = {
      toCSG: function(three_model, offset, rotation) {
        var geometry, i, polygons, rotation_matrix, v, v_cor, vertices;
        i = void 0;
        geometry = void 0;
        offset = void 0;
        polygons = void 0;
        vertices = void 0;
        rotation_matrix = void 0;
        if (three_model instanceof THREE.Mesh) {
          geometry = three_model.geometry;
          offset = offset || three_model.position;
          rotation = rotation || three_model.rotation;
        } else if (three_model instanceof THREE.Geometry) {
          geometry = three_model;
          offset = offset || new THREE.Vector3(0, 0, 0);
          rotation = rotation || new THREE.Vector3(0, 0, 0);
        } else {
          throw "Model type not supported.";
        }
        rotation_matrix = new THREE.Matrix4().setRotationFromEuler(rotation);
        polygons = [];
        i = 0;
        while (i < geometry.faces.length) {
          if (geometry.faces[i] instanceof THREE.Face3) {
            vertices = [];
            v = rotation_matrix.multiplyVector3(geometry.vertices[geometry.faces[i].a].clone().addSelf(offset));
            v_cor = new CSG.Vector3D(v.x, v.y, v.z);
            vertices.push(new CSG.Vertex(v_cor, [geometry.faces[i].normal.x, geometry.faces[i].normal.y, geometry.faces[i].normal.z]));
            v = rotation_matrix.multiplyVector3(geometry.vertices[geometry.faces[i].b].clone().addSelf(offset));
            v_cor = new CSG.Vector3D(v.x, v.y, v.z);
            vertices.push(new CSG.Vertex(v_cor, [geometry.faces[i].normal.x, geometry.faces[i].normal.y, geometry.faces[i].normal.z]));
            v = rotation_matrix.multiplyVector3(geometry.vertices[geometry.faces[i].c].clone().addSelf(offset));
            v_cor = new CSG.Vector3D(v.x, v.y, v.z);
            vertices.push(new CSG.Vertex(v_cor, [geometry.faces[i].normal.x, geometry.faces[i].normal.y, geometry.faces[i].normal.z]));
            polygons.push(new CSG.Polygon(vertices));
          } else if (geometry.faces[i] instanceof THREE.Face4) {
            vertices = [];
            v = rotation_matrix.multiplyVector3(geometry.vertices[geometry.faces[i].a].clone().addSelf(offset));
            v_cor = new CSG.Vector3D(v.x, v.y, v.z);
            vertices.push(new CSG.Vertex(v_cor, [geometry.faces[i].normal.x, geometry.faces[i].normal.y, geometry.faces[i].normal.z]));
            v = rotation_matrix.multiplyVector3(geometry.vertices[geometry.faces[i].b].clone().addSelf(offset));
            v_cor = new CSG.Vector3D(v.x, v.y, v.z);
            vertices.push(new CSG.Vertex(v_cor, [geometry.faces[i].normal.x, geometry.faces[i].normal.y, geometry.faces[i].normal.z]));
            v = rotation_matrix.multiplyVector3(geometry.vertices[geometry.faces[i].d].clone().addSelf(offset));
            v_cor = new CSG.Vector3D(v.x, v.y, v.z);
            vertices.push(new CSG.Vertex(v_cor, [geometry.faces[i].normal.x, geometry.faces[i].normal.y, geometry.faces[i].normal.z]));
            polygons.push(new CSG.Polygon(vertices));
            vertices = [];
            v = rotation_matrix.multiplyVector3(geometry.vertices[geometry.faces[i].b].clone().addSelf(offset));
            v_cor = new CSG.Vector3D(v.x, v.y, v.z);
            vertices.push(new CSG.Vertex(v_cor, [geometry.faces[i].normal.x, geometry.faces[i].normal.y, geometry.faces[i].normal.z]));
            v = rotation_matrix.multiplyVector3(geometry.vertices[geometry.faces[i].c].clone().addSelf(offset));
            v_cor = new CSG.Vector3D(v.x, v.y, v.z);
            vertices.push(new CSG.Vertex(v_cor, [geometry.faces[i].normal.x, geometry.faces[i].normal.y, geometry.faces[i].normal.z]));
            v = rotation_matrix.multiplyVector3(geometry.vertices[geometry.faces[i].d].clone().addSelf(offset));
            v_cor = new CSG.Vector3D(v.x, v.y, v.z);
            vertices.push(new CSG.Vertex(v_cor, [geometry.faces[i].normal.x, geometry.faces[i].normal.y, geometry.faces[i].normal.z]));
            polygons.push(new CSG.Polygon(vertices));
          } else {
            throw "Model contains unsupported face.";
          }
          i++;
        }
        console.log("THREE.CSG toCSG done");
        return CSG.fromPolygons(polygons);
      },
      fromCSG: function(csg_model) {
        var color, connectors, end, face, faceNormal, fetchVertexIndex, found, i, i1, i2, i3, i4, index, j, opacity, polyVertices, polygon, polygonIndex, polygons, properties, rootPos, searchForConnectors, srcNormal, start, three_geometry, v, vertex, vertexIndex, verticesIndex, vindex, _i, _j, _k, _l, _len, _len1, _m, _ref, _ref1, _ref2;
        start = new Date().getTime();
        csg_model.canonicalize();
        csg_model.reTesselate();
        three_geometry = new THREE.Geometry();
        polygons = csg_model.toPolygons();
        properties = csg_model.properties;
        opacity = 1;
        rootPos = csg_model.position;
        verticesIndex = {};
        fetchVertexIndex = (function(_this) {
          return function(vertex, index) {
            var key, result, threeVertex, v, x, y, z, _ref;
            x = vertex.pos.x - rootPos.x;
            y = vertex.pos.y - rootPos.y;
            z = vertex.pos.z - rootPos.z;
            key = "" + x + "," + y + "," + z;
            if (!(key in verticesIndex)) {
              threeVertex = new THREE.Vector3(vertex.pos._x, vertex.pos._y, vertex.pos._z);
              result = [index, threeVertex];
              verticesIndex[key] = result;
              result = [index, threeVertex, false];
              return result;
            } else {
              _ref = verticesIndex[key], index = _ref[0], v = _ref[1];
              return [index, v, true];
            }
          };
        })(this);
        vertexIndex = 0;
        for (polygonIndex = _i = 0, _len = polygons.length; _i < _len; polygonIndex = ++_i) {
          polygon = polygons[polygonIndex];
          color = new THREE.Color(0xaaaaaa);
          try {
            color.r = polygon.shared.color[0];
            color.g = polygon.shared.color[1];
            color.b = polygon.shared.color[2];
            opacity = polygon.shared.color[3];
          } catch (_error) {}
          polyVertices = [];
          _ref = polygon.vertices;
          for (vindex = _j = 0, _len1 = _ref.length; _j < _len1; vindex = ++_j) {
            vertex = _ref[vindex];
            _ref1 = fetchVertexIndex(vertex, vertexIndex), index = _ref1[0], v = _ref1[1], found = _ref1[2];
            polyVertices.push(index);
            if (!found) {
              v = v.sub(rootPos);
              three_geometry.vertices.push(v);
              vertexIndex += 1;
            }
          }
          srcNormal = polygon.plane.normal;
          faceNormal = new THREE.Vector3(srcNormal.x, srcNormal.z, srcNormal.y);
          if (polygon.vertices.length === 4) {
            i1 = polyVertices[0];
            i2 = polyVertices[1];
            i3 = polyVertices[2];
            i4 = polyVertices[3];
            face = new THREE.Face4(i1, i2, i3, i4, faceNormal);
            for (i = _k = 0; _k <= 3; i = ++_k) {
              face.vertexColors[i] = color;
            }
            three_geometry.faces.push(face);
            three_geometry.faceVertexUvs[0].push(new THREE.Vector2());
          } else {
            for (i = _l = 2, _ref2 = polyVertices.length; 2 <= _ref2 ? _l < _ref2 : _l > _ref2; i = 2 <= _ref2 ? ++_l : --_l) {
              i1 = polyVertices[0];
              i2 = polyVertices[i - 1];
              i3 = polyVertices[i];
              face = new THREE.Face3(i1, i2, i3, faceNormal);
              for (j = _m = 0; _m < 3; j = ++_m) {
                face.vertexColors[j] = color;
              }
              three_geometry.faces.push(face);
              three_geometry.faceVertexUvs[0].push(new THREE.Vector2());
            }
          }
        }
        three_geometry.computeBoundingBox();
        three_geometry.computeCentroids();
        three_geometry.computeFaceNormals();
        three_geometry.computeBoundingSphere();
        connectors = [];
        searchForConnectors = function(obj) {
          var axisvector, connector, geometry, point, prop, _results;
          _results = [];
          for (index in obj) {
            prop = obj[index];
            if ((typeof prop) !== "function") {
              if (prop.constructor.name === "Connector") {
                connector = {};
                point = prop.point;
                axisvector = prop.axisvector;
                geometry = new THREE.CubeGeometry(10, 10, 10);
                geometry.basePoint = new THREE.Vector3(point.x, point.y, point.z);

                /*
                geometry = new THREE.Geometry()
                geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z))
                end = new THREE.Vector3(point.x+axisvector.x, point.y+axisvector.y, point.z+axisvector.z)
                end.multiplyScalar(3)
                geometry.vertices.push(end)
                 */
                connectors.push(geometry);
              }

              /*
              try
                if "point" of prop
                   *console.log "haspoint"
              catch error
               */
              _results.push(searchForConnectors(prop));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
        three_geometry.connectors = connectors;
        end = new Date().getTime();
        console.log("Conversion to three.geometry time: " + (end - start));
        three_geometry.tmpPos = new THREE.Vector3(csg_model.position.x, csg_model.position.y, csg_model.position.z);
        three_geometry.opacity = opacity;
        return three_geometry;
      },
      fromCSG_: function(csg_model) {
        var b, color, connectors, end, face, i, j, poly, polygons, properties, searchForConnectors, start, three_geometry, tmp, vertices;
        i = void 0;
        j = void 0;
        vertices = void 0;
        face = void 0;
        three_geometry = new THREE.Geometry();
        start = new Date().getTime();
        polygons = csg_model.toPolygons();
        end = new Date().getTime();
        console.log("Csg polygon fetch time: " + (end - start));
        properties = csg_model.properties;
        start = new Date().getTime();
        i = 0;
        while (i < polygons.length) {
          color = new THREE.Color(0xaaaaaa);
          try {
            poly = polygons[i];
            color.r = poly.shared.color[0];
            color.g = poly.shared.color[1];
            color.b = poly.shared.color[2];
          } catch (_error) {}
          vertices = [];
          j = 0;
          while (j < polygons[i].vertices.length) {
            vertices.push(this.getGeometryVertice(three_geometry, polygons[i].vertices[j].pos));
            j++;
          }
          if (vertices[0] === vertices[vertices.length - 1]) {
            vertices.pop();
          }
          j = 2;
          while (j < vertices.length) {
            tmp = new THREE.Vector3().copy(polygons[i].plane.normal);
            b = tmp[2];
            tmp[2] = tmp[1];
            tmp[1] = b;
            face = new THREE.Face3(vertices[0], vertices[j - 1], vertices[j], tmp);
            face.vertexColors[0] = color;
            face.vertexColors[1] = color;
            face.vertexColors[2] = color;
            three_geometry.faces.push(face);
            three_geometry.faceVertexUvs[0].push(new THREE.UV());
            j++;
          }
          i++;
        }
        end = new Date().getTime();
        console.log("Conversion to three.geometry time: " + (end - start));
        connectors = [];
        searchForConnectors = function(obj) {
          var axisvector, connector, geometry, index, point, prop, _results;
          _results = [];
          for (index in obj) {
            prop = obj[index];
            if ((typeof prop) !== "function") {
              if (prop.constructor.name === "Connector") {
                connector = {};
                point = prop.point;
                axisvector = prop.axisvector;
                geometry = new THREE.CubeGeometry(10, 10, 10);
                geometry.basePoint = new THREE.Vector3(point.x, point.y, point.z);

                /*
                geometry = new THREE.Geometry()
                geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z))
                end = new THREE.Vector3(point.x+axisvector.x, point.y+axisvector.y, point.z+axisvector.z)
                end.multiplyScalar(3)
                geometry.vertices.push(end)
                 */
                connectors.push(geometry);
              }

              /*
              try
                if "point" of prop
                   *console.log "haspoint"
              catch error
               */
              _results.push(searchForConnectors(prop));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
        return three_geometry;
      },
      getGeometryVertice: function(geometry, vertice_position) {
        var i;
        i = void 0;
        i = 0;
        while (i < geometry.vertices.length) {
          if (geometry.vertices[i].x === vertice_position.x && geometry.vertices[i].y === vertice_position.y && geometry.vertices[i].z === vertice_position.z) {
            return i;
          }
          i++;
        }
        geometry.vertices.push(new THREE.Vector3(vertice_position.x, vertice_position.y, vertice_position.z));
        return geometry.vertices.length - 1;
      }
    };
    return THREE.CSG;
  });

}).call(this);
