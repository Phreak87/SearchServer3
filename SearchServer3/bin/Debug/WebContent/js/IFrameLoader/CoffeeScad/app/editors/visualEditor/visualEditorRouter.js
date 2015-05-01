(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, VisualEditorRouter, marionette, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    VisualEditorRouter = (function(_super) {
      __extends(VisualEditorRouter, _super);

      function VisualEditorRouter(options) {
        this.setController = __bind(this.setController, this);
        VisualEditorRouter.__super__.constructor.call(this, options);
        this.setController(options.controller);
      }

      VisualEditorRouter.prototype.setController = function(controller) {
        var methodName, route, _ref, _results;
        this.controller = controller;
        _ref = this.appRoutes;
        _results = [];
        for (route in _ref) {
          methodName = _ref[route];
          _results.push(vent.bind(route, this.controller[methodName]));
        }
        return _results;
      };

      return VisualEditorRouter;

    })(Backbone.Marionette.AppRouter);
    return VisualEditorRouter;
  });

}).call(this);
