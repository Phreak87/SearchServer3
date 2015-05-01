(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var AmfExporter, AmfExporterView, ModalRegion, Project, XMLWriter, marionette, reqRes, utils, vent;
    utils = require("core/utils/utils");
    marionette = require('marionette');
    XMLWriter = require('XMLWriter');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    Project = require('core/projects/project');
    ModalRegion = require('core/utils/modalRegion');
    AmfExporterView = require('./amfExporterView');
    AmfExporter = (function(_super) {
      __extends(AmfExporter, _super);


      /*
      Exports the given csg tree to the amf file format (stl successor with multi material support etc)
      see: http://en.wikipedia.org/wiki/Additive_Manufacturing_File_Format
       */

      function AmfExporter(options) {
        this._preProcessCSG = __bind(this._preProcessCSG, this);
        this["export"] = __bind(this["export"], this);
        this.onStart = __bind(this.onStart, this);
        AmfExporter.__super__.constructor.call(this, options);
        this.vent = vent;
        this.mimeType = "application/sla";
        this.on("start", this.onStart);
      }

      AmfExporter.prototype.start = function(options) {
        var _ref;
        this.project = (_ref = options.project) != null ? _ref : new Project();
        reqRes.addHandler("amfexportBlobUrl", (function(_this) {
          return function() {
            var blobUrl;
            blobUrl = _this["export"](_this.project.rootAssembly);
            return blobUrl;
          };
        })(this));
        this.trigger("initialize:before", options);
        this.initCallbacks.run(options, this);
        this.trigger("initialize:after", options);
        return this.trigger("start", options);
      };

      AmfExporter.prototype.onStart = function() {
        var amfExporterView, modReg;
        amfExporterView = new AmfExporterView({
          model: this.project
        });
        modReg = new ModalRegion({
          elName: "exporter"
        });
        modReg.on("closed", this.stop);
        return modReg.show(amfExporterView);
      };

      AmfExporter.prototype.stop = function() {
        return console.log("closing amf exporter");
      };

      AmfExporter.prototype["export"] = function(csgObject, mergeAll) {
        var blob, data, error, errorMsg, mergedObj, part, windowURL, _i, _len, _ref;
        if (mergeAll == null) {
          mergeAll = false;
        }
        try {
          try {
            if (mergeAll) {
              mergedObj = csgObject.clone();
              _ref = csgObject.children;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                part = _ref[_i];
                mergedObj.union(part);
              }
              this.csgObject = mergedObj;
            } else {
              this.csgObject = csgObject;
            }
          } catch (_error) {
            error = _error;
            errorMsg = "Failed to merge csgObject children with error: " + error;
            console.log(errorMsg);
            throw new Error(errorMsg);
          }
          this.currentObject = null;
          try {
            this.currentObject = this.csgObject.fixTJunctions();
            data = this._generateAmf();
            blob = new Blob([data], {
              type: this.mimeType
            });
          } catch (_error) {
            error = _error;
            errorMsg = "Failed to generate amf blob data: " + error;
            console.log(errorMsg);
            console.log(error.stack);
            throw new Error(errorMsg);
          }
          windowURL = utils.getWindowURL();
          this.outputFileBlobUrl = windowURL.createObjectURL(blob);
          if (!this.outputFileBlobUrl) {
            throw new Error("createObjectURL() failed");
          }
          return this.outputFileBlobUrl;
        } catch (_error) {
          error = _error;
          this.vent.trigger("amfExport:error", error);
          return null;
        }
      };

      AmfExporter.prototype._generateAmf = function() {
        var amfXml, index, part, processedCSG, unit, xw, _i, _len, _ref;
        console.log("I want to generate AMF");
        unit = "milimeter";
        xw = new XMLWriter('UTF-8', '1.0');
        xw.writeStartDocument();
        xw.writeStartElement("amf");
        xw.writeAttributeString("unit", unit);
        xw.writeStartElement("materials");
        xw.writeEndElement();
        processedCSG = this._preProcessCSG(this.csgObject);
        _ref = this.csgObject.children;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          part = _ref[index];
          xw.writeStartElement("object");
          xw.writeAttributeString("id", index);
          xw.writeStartElement("mesh");
          xw.writeStartElement("volume");
          xw.writeStartElement("triangle");
          xw.writeElementString("v1", "0");
          xw.writeEndElement();
          this._writeColorNode(xw, part);
          xw.writeEndElement();
          xw.writeStartElement("vertices");
          this._writeVertexNode(xw, parent);
          xw.writeEndElement();
          xw.writeEndElement();
          xw.writeEndElement();
        }
        xw.writeEndElement();
        xw.writeEndDocument();
        console.log("AMF");
        amfXml = xw.flush();
        xw.close();
        console.log(amfXml);
        return amfXml;

        /* 
        <?xml version="1.0" encoding="UTF-8"?>
        <amf unit="millimeter">
          <object id="0">
            <mesh>
              <vertices>
                <vertex>
                  <coordinates>
                    <x>0</x>
                    <y>1.32</y>
                    <z>3.715</z>
                  </coordinates>
                </vertex>
                ...
              </vertices>
              <volume>
                <triangle>
                  <v1>0</v1>
                  <v2>1</v2>
                  <v3>3</v3>
                </triangle>
                ...
              </volume>
            </mesh>
          </object>
        </amf>
         */
      };

      AmfExporter.prototype._preProcessCSG = function(csg) {
        var flatHierarchy, parse;
        flatHierarchy = [];
        parse = (function(_this) {
          return function(csg) {
            var child, elem, _i, _len, _ref, _results;
            _ref = csg.children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              elem = _this._preProcessCSGInner(child);
              flatHierarchy.push(elem);
              _results.push(parse(child));
            }
            return _results;
          };
        })(this);
        parse(csg);
        console.log(flatHierarchy);
        return flatHierarchy;
      };

      AmfExporter.prototype._preProcessCSGInner = function(csg) {
        var color, face, faceNormal, fetchVertexIndex, found, i, i1, i2, i3, index, j, polyVertices, polygon, polygonIndex, polygons, remapped, srcNormal, v, vertex, vertexIndex, verticesIndex, vindex, _i, _j, _k, _l, _len, _len1, _ref, _ref1, _ref2;
        polygons = csg.toPolygons();
        remapped = {
          faces: [],
          vertices: []
        };
        verticesIndex = {};
        fetchVertexIndex = (function(_this) {
          return function(vertex, index) {
            var key, result, sVertex, v, x, y, z, _ref;
            x = vertex.pos.x;
            y = vertex.pos.y;
            z = vertex.pos.z;
            key = "" + x + "," + y + "," + z;
            if (!(key in verticesIndex)) {
              sVertex = {
                x: x,
                y: y,
                z: z
              };
              result = [index, sVertex];
              verticesIndex[key] = result;
              result = [index, sVertex, false];
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
          color = {
            r: 1,
            g: 1,
            b: 1,
            a: 1
          };
          try {
            color.r = polygon.shared.color[0];
            color.g = polygon.shared.color[1];
            color.b = polygon.shared.color[2];
          } catch (_error) {}
          polyVertices = [];
          _ref = polygon.vertices;
          for (vindex = _j = 0, _len1 = _ref.length; _j < _len1; vindex = ++_j) {
            vertex = _ref[vindex];
            _ref1 = fetchVertexIndex(vertex, vertexIndex), index = _ref1[0], v = _ref1[1], found = _ref1[2];
            polyVertices.push(index);
            if (!found) {
              remapped.vertices.push(v);
              vertexIndex += 1;
            }
          }
          srcNormal = polygon.plane.normal;
          faceNormal = {
            x: srcNormal.x,
            y: srcNormal.z,
            z: srcNormal.y
          };
          for (i = _k = 2, _ref2 = polyVertices.length; 2 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 2 <= _ref2 ? ++_k : --_k) {
            i1 = polyVertices[0];
            i2 = polyVertices[i - 1];
            i3 = polyVertices[i];
            face = {
              index1: i1,
              index2: i2,
              index3: i3,
              normal: faceNormal,
              vertexColors: [4]
            };
            for (j = _l = 0; _l < 3; j = ++_l) {
              face.vertexColors[j] = color;
            }
            remapped.faces.push(face);
          }
        }
        return remapped;
      };

      AmfExporter.prototype._writeColorNode = function(xw, element) {
        xw.writeStartElement("color");
        xw.writeElementString("r", String(element.material.color[0]));
        xw.writeElementString("g", String(element.material.color[1]));
        xw.writeElementString("b", String(element.material.color[2]));
        xw.writeElementString("a", "0");
        return xw.writeEndElement();
      };

      AmfExporter.prototype._writeVertices = function(xw, vertices) {};

      AmfExporter.prototype._writeVertexNode = function(xw, vertex) {
        xw.writeStartElement("vertex");
        xw.writeStartElement("coordinates");
        xw.writeElementString("x", "25");
        xw.writeEndElement();
        return xw.writeEndElement();
      };

      AmfExporter.prototype._writeTriangleNode = function(xw, triangle) {
        xw.writeStartElement("triangle");
        xw.writeElementString("v1", "0");
        return xw.writeEndElement();
      };

      return AmfExporter;

    })(Backbone.Marionette.Application);
    return AmfExporter;
  });

}).call(this);
