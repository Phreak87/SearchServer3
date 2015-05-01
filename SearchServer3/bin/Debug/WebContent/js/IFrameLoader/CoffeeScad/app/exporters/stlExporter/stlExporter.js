(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var ModalRegion, Project, StlExporter, StlExporterView, marionette, reqRes, utils, vent;
    utils = require("core/utils/utils");
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    Project = require('core/projects/project');
    ModalRegion = require('core/utils/modalRegion');
    StlExporterView = require('./stlExporterView');
    StlExporter = (function(_super) {
      __extends(StlExporter, _super);


      /*
      Exports the given csg tree to the stl file format (binary only for now)
       */

      function StlExporter(options) {
        this["export"] = __bind(this["export"], this);
        this._onExportRequest = __bind(this._onExportRequest, this);
        this.reset = __bind(this.reset, this);
        this.stop = __bind(this.stop, this);
        this.onStart = __bind(this.onStart, this);
        StlExporter.__super__.constructor.call(this, options);
        this.started = false;
        this.vent = vent;
        this.mimeType = "application/sla";
        this.on("start", this.onStart);
        this.vent.on("project:loaded", this.reset);
        this.vent.on("project:created", this.reset);
      }

      StlExporter.prototype.start = function(options) {
        var _ref;
        this.project = (_ref = options.project) != null ? _ref : new Project();
        reqRes.addHandler("stlexportBlobUrl", (function(_this) {
          return function() {
            return _this._onExportRequest();
          };
        })(this));
        this.trigger("initialize:before", options);
        this.initCallbacks.run(options, this);
        this.trigger("initialize:after", options);
        return this.trigger("start", options);
      };

      StlExporter.prototype.onStart = function() {
        var modReg, stlExporterView;
        stlExporterView = new StlExporterView({
          model: this.project
        });
        modReg = new ModalRegion({
          elName: "exporter"
        });
        modReg.on("closed", this.stop);
        return modReg.show(stlExporterView);
      };

      StlExporter.prototype.stop = function() {
        return console.log("closing stl exporter");
      };

      StlExporter.prototype.reset = function(newProject) {
        return this.project = newProject;
      };

      StlExporter.prototype._onExportRequest = function() {
        var blobUrl;
        blobUrl = this["export"](this.project.rootAssembly);
        return blobUrl;
      };

      StlExporter.prototype["export"] = function(csgObject, mergeAll) {
        var blob, data, error, errorMsg, mergedObj, part, windowURL, _i, _len, _ref;
        if (mergeAll == null) {
          mergeAll = true;
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
            data = this._generateBinary();
            blob = new Blob(data, {
              type: this.mimeType
            });
          } catch (_error) {
            error = _error;
            errorMsg = "Failed to generate stl blob data: " + error;
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
          this.vent.trigger("stlExport:error", error);
          return null;
        }
      };

      StlExporter.prototype._generateBinary = function() {
        var ar1, arindex, attribDataArray, blobData, buffer, headerarray, i, index, int32buffer, int8buffer, normal, numtriangles, numvertices, polygon, pos, v, vertexDataArray, vv, _i, _j, _k, _ref, _ref1;
        blobData = [];
        buffer = new ArrayBuffer(4);
        int32buffer = new Int32Array(buffer, 0, 1);
        int8buffer = new Int8Array(buffer, 0, 4);
        int32buffer[0] = 0x11223344;
        if (int8buffer[0] !== 0x44) {
          throw new Error("Binary STL output is currently only supported on little-endian (Intel) processors");
        }
        numtriangles = 0;
        this.currentObject.polygons.map(function(p) {
          var numvertices, thisnumtriangles;
          numvertices = p.vertices.length;
          thisnumtriangles = numvertices >= 3 ? numvertices - 2 : 0;
          return numtriangles += thisnumtriangles;
        });
        headerarray = new Uint8Array(80);
        for (i = _i = 0; _i < 80; i = ++_i) {
          headerarray[i] = 65;
        }
        blobData.push(headerarray);
        ar1 = new Uint32Array(1);
        ar1[0] = numtriangles;
        blobData.push(ar1);
        _ref = this.currentObject.polygons;
        for (index in _ref) {
          polygon = _ref[index];
          numvertices = polygon.vertices.length;
          for (i = _j = 0, _ref1 = numvertices - 2; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            vertexDataArray = new Float32Array(12);
            normal = polygon.plane.normal;
            vertexDataArray[0] = normal._x;
            vertexDataArray[1] = normal._y;
            vertexDataArray[2] = normal._z;
            arindex = 3;
            for (v = _k = 0; _k < 3; v = ++_k) {
              vv = v + (v > 0 ? i : 0);
              pos = polygon.vertices[vv].pos;
              vertexDataArray[arindex++] = pos._x;
              vertexDataArray[arindex++] = pos._y;
              vertexDataArray[arindex++] = pos._z;
            }
            attribDataArray = new Uint16Array(1);
            attribDataArray[0] = 0;
            blobData.push(vertexDataArray);
            blobData.push(attribDataArray);
          }
        }
        return blobData;
      };

      return StlExporter;

    })(Backbone.Marionette.Application);
    return StlExporter;

    /*
    generateOutputFileFileSystem: ()-> 
      
      window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem
      if(!window.requestFileSystem)
      {
        throw new Error("Your browser does not support the HTML5 FileSystem API. Please try the Chrome browser instead.")
      }
      // create a random directory name:
      dirname = "OpenJsCadOutput1_"+parseInt(Math.random()*1000000000, 10)+"."+extension
      extension = @extensionForCurrentObject()
      filename = @filename+"."+extension
      that = this
      window.requestFileSystem(TEMPORARY, 20*1024*1024, function(fs){
          fs.root.getDirectory(dirname, {create: true, exclusive: true}, function(dirEntry) {
              that.outputFileDirEntry = dirEntry
              dirEntry.getFile(filename, {create: true, exclusive: true}, function(fileEntry) {
                   fileEntry.createWriter(function(fileWriter) {
                      fileWriter.onwriteend = function(e) {
                        that.hasOutputFile = true
                        that.downloadOutputFileLink.href = fileEntry.toURL()
                        that.downloadOutputFileLink.type = that.mimeTypeForCurrentObject() 
                        that.downloadOutputFileLink.innerHTML = that.downloadLinkTextForCurrentObject()
                        that.enableItems()
                        if(that.onchange) that.onchange()
                      }
                      fileWriter.onerror = function(e) {
                        throw new Error('Write failed: ' + e.toString())
                      }
                      blob = that.currentObjectToBlob()
                      fileWriter.write(blob)                
                    }, 
                    function(fileerror){OpenJsCad.FileSystemApiErrorHandler(fileerror, "createWriter")} 
                  )
                },
                function(fileerror){OpenJsCad.FileSystemApiErrorHandler(fileerror, "getFile('"+filename+"')")} 
              )
            },
            function(fileerror){OpenJsCad.FileSystemApiErrorHandler(fileerror, "getDirectory('"+dirname+"')")} 
          )         
        }, 
        function(fileerror){OpenJsCad.FileSystemApiErrorHandler(fileerror, "requestFileSystem")}
      )
     */
  });

}).call(this);
