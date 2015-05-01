(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, BomExporterView, BomPartListView, bomExporterTemplate, marionette, modelBinder, reqRes, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    modelBinder = require('modelbinder');
    reqRes = require('core/messaging/appReqRes');
    bomExporterTemplate = require("text!./bomExporter.tmpl");
    BomPartListView = require('./bomPartsView');
    BomExporterView = (function(_super) {
      __extends(BomExporterView, _super);

      BomExporterView.prototype.template = bomExporterTemplate;

      BomExporterView.prototype.regions = {
        partsList: "#partsList"
      };

      BomExporterView.prototype.ui = {
        exportButton: "#bomExportBtn",
        fileNameinput: "#fileNameinput"
      };

      BomExporterView.prototype.events = {
        "click .exportBom": "onExport"
      };

      function BomExporterView(options) {
        this.onClose = __bind(this.onClose, this);
        BomExporterView.__super__.constructor.call(this, options);
        this.modelBinder = new Backbone.ModelBinder();
        this.bindings = {
          compiled: [
            {
              selector: '#bomExportBtn',
              elAttribute: 'disabled',
              converter: (function(_this) {
                return function() {
                  return !_this.model.isCompiled;
                };
              })(this)
            }
          ]
        };
      }

      BomExporterView.prototype.onExport = function() {
        var exportUrl, fileName;
        if (this.model.isCompiled) {
          exportUrl = reqRes.request("bomExportUrl");
          if (exportUrl !== null) {
            fileName = this.model.get("name");
            this.ui.exportButton.prop("download", "" + (this.ui.fileNameinput.val()));
            return this.ui.exportButton.prop("href", exportUrl);
          }
        }
      };

      BomExporterView.prototype.onRender = function() {
        var bomPartListView;
        this.modelBinder.bind(this.model, this.el, this.bindings);
        bomPartListView = new BomPartListView({
          collection: this.model.bom
        });
        return this.partsList.show(bomPartListView);
      };

      BomExporterView.prototype.onClose = function() {
        return this.modelBinder.unbind();
      };

      return BomExporterView;

    })(Backbone.Marionette.Layout);
    return BomExporterView;
  });

}).call(this);
