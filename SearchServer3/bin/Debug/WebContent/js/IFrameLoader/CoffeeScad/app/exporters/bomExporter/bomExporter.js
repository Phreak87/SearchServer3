(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var BomExporter, BomExporterView, ModalRegion, Project, marionette, reqRes, utils, vent;
    utils = require("core/utils/utils");
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    Project = require('core/projects/project');
    ModalRegion = require('core/utils/modalRegion');
    BomExporterView = require('./bomExporterView');
    BomExporter = (function(_super) {
      __extends(BomExporter, _super);


      /*
      exports the given projects' bom (BILL of material) as a json file
       */

      function BomExporter(options) {
        this["export"] = __bind(this["export"], this);
        this.onStart = __bind(this.onStart, this);
        this.start = __bind(this.start, this);
        BomExporter.__super__.constructor.call(this, options);
        this.mimeType = "application/sla";
        this.on("start", this.onStart);
      }

      BomExporter.prototype.start = function(options) {
        var _ref;
        this.project = (_ref = options.project) != null ? _ref : new Project();
        reqRes.addHandler("bomExportUrl", (function(_this) {
          return function() {
            var blobUrl, error;
            try {
              blobUrl = _this["export"](_this.project);
              return blobUrl;
            } catch (_error) {
              error = _error;
              return null;
            }
          };
        })(this));
        this.trigger("initialize:before", options);
        this.initCallbacks.run(options, this);
        this.trigger("initialize:after", options);
        return this.trigger("start", options);
      };

      BomExporter.prototype.onStart = function() {
        var bomExporterView, modReg;
        bomExporterView = new BomExporterView({
          model: this.project
        });
        modReg = new ModalRegion({
          elName: "exporter",
          large: true
        });
        modReg.on("closed", this.stop);
        return modReg.show(bomExporterView);
      };

      BomExporter.prototype.stop = function() {
        console.log("closing bom exporter");
        if (!this._isInitialized) {
          return;
        }
        this._isInitialized = false;
        Marionette.triggerMethod.call(this, "before:stop");
        _.each(this.submodules, function(mod) {
          return mod.stop();
        });
        this._finalizerCallbacks.run();
        this._initializerCallbacks.reset();
        this._finalizerCallbacks.reset();
        return Marionette.triggerMethod.call(this, "stop");
      };

      BomExporter.prototype["export"] = function(project) {
        var error, exportUrl, jsonResult;
        try {
          jsonResult = project.bom.toJSON();
          jsonResult = encodeURIComponent(JSON.stringify(jsonResult));
        } catch (_error) {
          error = _error;
          console.log("Failed to generate bom data url: " + error);
        }
        exportUrl = "data:text/json;charset=utf-8," + jsonResult;
        if (!exportUrl) {
          throw new Error("createing object url failed");
        }
        return exportUrl;
      };

      return BomExporter;

    })(Backbone.Marionette.Application);
    return BomExporter;
  });

}).call(this);
