(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, ExampleEditorSettings;
    Backbone = require('backbone');
    ExampleEditorSettings = (function(_super) {
      __extends(ExampleEditorSettings, _super);

      ExampleEditorSettings.prototype.idAttribute = 'name';

      ExampleEditorSettings.prototype.defaults = {
        name: "ExampleEditor",
        title: "Example Editor"
      };

      function ExampleEditorSettings(options) {
        ExampleEditorSettings.__super__.constructor.call(this, options);
      }

      return ExampleEditorSettings;

    })(Backbone.Model);
    return ExampleEditorSettings;
  });

}).call(this);
