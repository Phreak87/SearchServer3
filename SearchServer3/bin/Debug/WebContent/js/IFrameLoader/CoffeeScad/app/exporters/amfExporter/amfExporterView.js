(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, AmfExporterView, amfExporterTemplate, marionette, modelBinder, reqRes, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    modelBinder = require('modelbinder');
    reqRes = require('core/messaging/appReqRes');
    amfExporterTemplate = require("text!./amfExporter.tmpl");
    AmfExporterView = (function(_super) {
      __extends(AmfExporterView, _super);

      AmfExporterView.prototype.template = amfExporterTemplate;

      AmfExporterView.prototype.ui = {
        fileNameinput: "#fileNameinput",
        exportButton: "#amfExportBtn"
      };

      AmfExporterView.prototype.events = {
        "mousedown #amfExportBtn": "onExport"
      };

      function AmfExporterView(options) {
        this.onClose = __bind(this.onClose, this);
        AmfExporterView.__super__.constructor.call(this, options);
        this.modelBinder = new Backbone.ModelBinder();
        this.bindings = {
          compiled: [
            {
              selector: '#amfExportBtn',
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

      AmfExporterView.prototype.onExport = function() {
        var exportBlobUrl;
        if (!this.ui.exportButton.attr('disabled')) {
          exportBlobUrl = reqRes.request("amfexportBlobUrl");
          if (exportBlobUrl !== null) {
            this.ui.exportButton.prop("download", "" + (this.ui.fileNameinput.val()));
            return this.ui.exportButton.prop("href", exportBlobUrl);
          }
        }
      };

      AmfExporterView.prototype.onRender = function() {
        return this.modelBinder.bind(this.model, this.el, this.bindings);
      };

      AmfExporterView.prototype.onClose = function() {
        return this.modelBinder.unbind();
      };

      return AmfExporterView;

    })(Backbone.Marionette.ItemView);
    return AmfExporterView;
  });

}).call(this);
