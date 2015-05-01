(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var BoundCollectionView, BoundView, collectionBinder, marionette, modelBinder;
    marionette = require('marionette');
    modelBinder = require('modelbinder');
    collectionBinder = require('collectionbinder');
    BoundView = (function(_super) {
      __extends(BoundView, _super);

      function BoundView() {
        this.__modelBinder__ = new Backbone.ModelBinder();
        this.rebindModel();
      }

      BoundView.prototype.close = function() {
        return this.__modelBinder__.unbind();
      };

      BoundView.prototype.rebindModel = function() {
        return this.__modelBinder__.bind(this.model, this.$el, this.modelBindings);
      };

      BoundView.prototype.setModel = function(model) {
        this.model = model;
        return this.rebindModel();
      };

      return BoundView;

    })(Backbone.Marionette.ItemView);
    BoundCollectionView = (function(_super) {
      __extends(BoundCollectionView, _super);

      function BoundCollectionView(options) {
        var elManagerFactory;
        BoundCollectionView.__super__.constructor.call(this, options);
        elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(options.template, this.modelBindings);
        this.__collectionBinder__ = new Backbone.CollectionBinder(elManagerFactory);
        this.rebindCollection();
      }

      BoundCollectionView.prototype.rebindCollection = function() {
        return this.__collectionBinder__.bind(this.collection, this.$el);
      };

      BoundCollectionView.prototype.close = function() {
        return this.__collectionBinder__.unbind();
      };

      BoundCollectionView.prototype.getModelForEl = function(el) {
        return this.__collectionBinder__.getManagerForEl(el).getModel();
      };

      return BoundCollectionView;

    })(Backbone.Marionette.CollectionView);
    return {
      "BoundView": BoundView,
      "BoundCollectionView": BoundCollectionView
    };
  });

}).call(this);
