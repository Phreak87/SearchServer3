(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, DummyView, dummyTmpl, marionette, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    dummyTmpl = require("text!./dummy.tmpl");
    DummyView = (function(_super) {
      __extends(DummyView, _super);

      function DummyView() {
        return DummyView.__super__.constructor.apply(this, arguments);
      }

      DummyView.prototype.template = dummyTmpl;

      return DummyView;

    })(Backbone.Marionette.ItemView);
    return DummyView;
  });

}).call(this);
