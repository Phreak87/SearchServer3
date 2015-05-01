(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, MenuController, marionette, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    marionette = require('marionette');
    return MenuController = (function(_super) {
      __extends(MenuController, _super);

      function MenuController(options) {
        this.stuff = options.stuff;
      }

      MenuController.prototype.doStuff = function() {
        return this.trigger("stuff:done", this.stuff);
      };

      MenuController.mainMenuView.on("project:new:mouseup", function() {});

      MenuController.mainMenuView.on("file:new:mouseup", function() {
        return MenuController.newProject();
      });

      MenuController.mainMenuView.on("file:save:mouseup", function() {
        if (MenuController.project.isNew2()) {
          MenuController.modView = new SaveView;
          return MenuController.modal.show(MenuController.modView);
        } else {
          console.log("save existing");
          return MenuController.vent.trigger("fileSaveRequest", MenuController.project.get("name"));
        }
      });

      MenuController.mainMenuView.on("file:saveas:mouseup", function() {
        MenuController.modView = new SaveView;
        return MenuController.modal.show(MenuController.modView);
      });

      MenuController.mainMenuView.on("file:load:mouseup", function() {
        MenuController.modView = new LoadView({
          collection: MenuController.lib
        });
        return MenuController.modal.show(MenuController.modView);
      });

      MenuController.mainMenuView.on("settings:mouseup", function() {
        MenuController.modView = new SettingsView({
          model: MenuController.settings
        });
        return MenuController.modal.show(MenuController.modView);
      });

      return MenuController;

    })(Backbone.Marionette.Controller);
  });

}).call(this);
