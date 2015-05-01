(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, BomPartListView, BomPartView, bomPartTemplate, bomPartsListTemplate, marionette, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    bomPartTemplate = require("text!./bomPart.tmpl");
    bomPartsListTemplate = require("text!./bomPartList.tmpl");
    BomPartView = (function(_super) {
      __extends(BomPartView, _super);

      BomPartView.prototype.template = bomPartTemplate;

      BomPartView.prototype.tagName = 'tr';

      BomPartView.prototype.events = {
        "input #quantity": "onQuantityChange"
      };

      function BomPartView(options) {
        BomPartView.__super__.constructor.call(this, options);
      }

      BomPartView.prototype.onQuantityChange = function(ev) {
        var newQuantity;
        newQuantity = ev.target.value;
        return this.model.set("quantity", newQuantity);
      };

      return BomPartView;

    })(Backbone.Marionette.ItemView);
    BomPartListView = (function(_super) {
      __extends(BomPartListView, _super);

      BomPartListView.prototype.template = bomPartsListTemplate;

      BomPartListView.prototype.tagName = 'table';

      BomPartListView.prototype.className = 'table table-condensed table-bordered';

      BomPartListView.prototype.itemView = BomPartView;

      function BomPartListView(options) {
        BomPartListView.__super__.constructor.call(this, options);
      }

      return BomPartListView;

    })(Backbone.Marionette.CompositeView);
    return BomPartListView;
  });

}).call(this);
