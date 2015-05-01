(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, $ui, DialogLayout, boostrap, dialogTemplate, marionette;
    $ = require('jquery');
    $ui = require('jquery_ui');
    boostrap = require('bootstrap');
    marionette = require('marionette');
    dialogTemplate = require("text!./dialog.tmpl");
    DialogLayout = (function(_super) {
      __extends(DialogLayout, _super);

      DialogLayout.prototype.template = dialogTemplate;

      DialogLayout.prototype.regions = {
        contentRegion: '#contentContainer'
      };

      function DialogLayout(options) {
        options = options || {};
        DialogLayout.__super__.constructor.call(this, options);
      }

      return DialogLayout;

    })(Backbone.Marionette.Layout);
    return DialogLayout;
  });

}).call(this);
