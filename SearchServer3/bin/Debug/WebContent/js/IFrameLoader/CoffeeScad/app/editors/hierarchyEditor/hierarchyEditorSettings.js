(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, HierarchyEditorSettings;
    Backbone = require('backbone');
    HierarchyEditorSettings = (function(_super) {
      __extends(HierarchyEditorSettings, _super);

      HierarchyEditorSettings.prototype.idAttribute = 'name';

      HierarchyEditorSettings.prototype.defaults = {
        name: "HierarchyEditor",
        title: "Hierarchy Editor"
      };

      function HierarchyEditorSettings(options) {
        HierarchyEditorSettings.__super__.constructor.call(this, options);
      }

      return HierarchyEditorSettings;

    })(Backbone.Model);
    return HierarchyEditorSettings;
  });

}).call(this);
