(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, ContextMenu, bootstrap, contextMenu, marionette;
    $ = require('jquery');
    bootstrap = require('bootstrap');
    contextMenu = require('contextMenu');
    marionette = require('marionette');
    ContextMenu = (function(_super) {
      __extends(ContextMenu, _super);

      ContextMenu.prototype.el = "#none";

      function ContextMenu(options) {
        this.showMenu = __bind(this.showMenu, this);
        var elName, _ref;
        options = options || {};
        elName = (_ref = options.elName) != null ? _ref : "contextMenu";
        this.makeEl(elName);
        options.el = "#" + elName;
        ContextMenu.__super__.constructor.call(this, options);
        _.bindAll(this);
        this.on("view:show", this.showMenu, this);
      }

      ContextMenu.prototype.makeEl = function(elName) {
        if ($("#" + elName).length === 0) {
          return $('<div/>', {
            id: elName
          }).appendTo('body');
        }
      };

      ContextMenu.prototype.getEl = function(selector) {
        var $el;
        $el = $(selector);
        $el.on("hidden", this.close);
        return $el;
      };

      ContextMenu.prototype.showMenu = function(view) {
        view.on("close", this.hideMenu, this);
        return this.$el.contextmenu();
      };

      ContextMenu.prototype.hideMenu = function() {
        this.$el.remove();
        return this.trigger("closed");
      };

      return ContextMenu;

    })(Backbone.Marionette.Region);
    return ContextMenu;
  });

}).call(this);
