(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, ContextMenu, boostrap, contextMenuTemplate, marionette, _;
    $ = require('jquery');
    _ = require('underscore');
    boostrap = require('bootstrap');
    marionette = require('marionette');
    contextMenuTemplate = require("text!templates/contextMenu.tmpl");
    ContextMenu = (function(_super) {
      __extends(ContextMenu, _super);

      ContextMenu.prototype.template = contextMenuTemplate;

      function ContextMenu(options) {
        ContextMenu.__super__.constructor.call(this, options);
      }

      return ContextMenu;

    })(Backbone.Marionette.ItemView);
    return ContextMenuView;
  });

}).call(this);
