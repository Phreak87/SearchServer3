(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, ToolBarView, jquery_layout, jquery_ui, marionette, toolBarTemplate, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    jquery_layout = require('jquery_layout');
    jquery_ui = require('jquery_ui');
    vent = require('core/messaging/appVent');
    toolBarTemplate = require("text!./toolBarView.tmpl");
    ToolBarView = (function(_super) {
      __extends(ToolBarView, _super);

      ToolBarView.prototype.template = toolBarTemplate;

      ToolBarView.prototype.serializeData = function() {
        return null;
      };

      ToolBarView.prototype.events = {
        "click .newFile": "onNewFile"
      };

      function ToolBarView(options) {
        ToolBarView.__super__.constructor.call(this, options);
      }

      ToolBarView.prototype.onNewFile = function() {
        console.log("adding new file");
        $('.newFile').popover({
          content: '<div><div><input type="text" value="file.coffee"></input></div></div> ',
          template: '<div class="popover" style="height:45px"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title" style="display: none"></h3><div class="popover-content"><p></p></div></div></div>'
        });
        return $('.newFile').popover({
          show: true
        });
      };

      return ToolBarView;

    })(Backbone.Marionette.ItemView);
    return ToolBarView;
  });

}).call(this);
