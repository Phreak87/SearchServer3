(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, GeometryEditorSettings, backbone_nested;
    Backbone = require('backbone');
    backbone_nested = require('backbone_nested');
    GeometryEditorSettings = (function(_super) {
      __extends(GeometryEditorSettings, _super);


      /*
      All settings for the code editor are stored within this class
       */

      GeometryEditorSettings.prototype.idAttribute = 'name';

      GeometryEditorSettings.prototype.defaults = {
        name: "GeometryEditor",
        title: "Geometry editor"
      };

      function GeometryEditorSettings(options) {
        GeometryEditorSettings.__super__.constructor.call(this, options);
      }

      return GeometryEditorSettings;

    })(Backbone.NestedModel);
    return GeometryEditorSettings;
  });

}).call(this);
