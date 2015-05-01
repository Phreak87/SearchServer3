(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, CodeEditorSettings, backbone_nested, buildProperties;
    Backbone = require('backbone');
    backbone_nested = require('backbone_nested');
    buildProperties = require('core/utils/buildProperties');
    CodeEditorSettings = (function(_super) {
      __extends(CodeEditorSettings, _super);


      /*
      All settings for the code editor are stored within this class
       */

      CodeEditorSettings.prototype.attributeNames = ['theme', 'startLine', 'undoDepth', 'fontSize', 'autoClose', 'highlightLine', 'showInvisibles', 'showIndentGuides', 'showGutter', 'doLint'];

      buildProperties(CodeEditorSettings);

      CodeEditorSettings.prototype.idAttribute = 'name';

      CodeEditorSettings.prototype.defaults = {
        name: "CodeEditor",
        title: "Code editor",
        theme: "solarized_dark",
        startLine: 1,
        undoDepth: 40,
        fontSize: 1,
        autoClose: true,
        highlightLine: true,
        showInvisibles: true,
        showIndentGuides: false,
        showGutter: true,
        doLint: true
      };

      function CodeEditorSettings(options) {
        CodeEditorSettings.__super__.constructor.call(this, options);
      }

      return CodeEditorSettings;

    })(Backbone.NestedModel);
    return CodeEditorSettings;
  });

}).call(this);
