(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, StlExporterView, marionette, modelBinder, reqRes, stlExporterTemplate, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    modelBinder = require('modelbinder');
    reqRes = require('core/messaging/appReqRes');
    stlExporterTemplate = require("text!./stlExporter.tmpl");
    StlExporterView = (function(_super) {
      __extends(StlExporterView, _super);

      StlExporterView.prototype.template = stlExporterTemplate;

      StlExporterView.prototype.ui = {
        fileNameinput: "#fileNameinput",
        exportButton: "#stlExportBtn"
      };

      StlExporterView.prototype.events = {
        "click #stlExportBtn": "onExport"
      };

      function StlExporterView(options) {
        this.onClose = __bind(this.onClose, this);
        StlExporterView.__super__.constructor.call(this, options);
        this.modelBinder = new Backbone.ModelBinder();
        this.bindings = {
          compiled: [
            {
              selector: '#stlExportBtn',
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

      StlExporterView.prototype.onExport = function() {
        var exportBlobUrl;
        if (!this.ui.exportButton.attr('disabled')) {
          exportBlobUrl = reqRes.request("stlexportBlobUrl");
          if (exportBlobUrl !== null) {
            this.ui.exportButton.prop("download", "" + (this.ui.fileNameinput.val()));
            return this.ui.exportButton.prop("href", exportBlobUrl);
          }
        }
      };

      StlExporterView.prototype.onRender = function() {
        return this.modelBinder.bind(this.model, this.el, this.bindings);
      };

      StlExporterView.prototype.onClose = function() {
        return this.modelBinder.unbind();
      };

      return StlExporterView;

    })(Backbone.Marionette.ItemView);
    return StlExporterView;
  });

}).call(this);
