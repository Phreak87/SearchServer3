(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var $, GeometryEditorSettingsForm, GeometryEditorSettingsView, boostrap, forms, marionette, _;
    $ = require('jquery');
    _ = require('underscore');
    boostrap = require('bootstrap');
    marionette = require('marionette');
    forms = require('backbone-forms');
    GeometryEditorSettingsForm = (function(_super) {
      __extends(GeometryEditorSettingsForm, _super);

      function GeometryEditorSettingsForm(options) {
        GeometryEditorSettingsForm.__super__.constructor.call(this, options);
      }

      return GeometryEditorSettingsForm;

    })(Backbone.Form);
    GeometryEditorSettingsView = (function(_super) {
      __extends(GeometryEditorSettingsView, _super);

      function GeometryEditorSettingsView(options) {
        this.render = __bind(this.render, this);
        GeometryEditorSettingsView.__super__.constructor.call(this, options);
        this.wrappedForm = new GeometryEditorSettingsForm({
          model: this.model
        });
      }

      GeometryEditorSettingsView.prototype.render = function() {
        var tmp;
        tmp = this.wrappedForm.render();
        this.$el.append(tmp.el);
        this.$el.addClass("tab-pane");
        this.$el.addClass("fade");
        this.$el.attr('id', this.model.get("name"));
        return this.el;
      };

      return GeometryEditorSettingsView;

    })(Backbone.Marionette.ItemView);
    return GeometryEditorSettingsView;
  });

}).call(this);
