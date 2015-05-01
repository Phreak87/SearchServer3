(function() {
  var __slice = [].slice;

  define(function(require) {
    var Marionette, include;
    Marionette = require('marionette');
    include = function() {
      var key, mixin, mixins, value, _i, _len, _ref;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (!(mixins && mixins.length > 0)) {
        throw new Error('include(mixins...) requires at least one mixin');
      }
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        for (key in mixin) {
          value = mixin[key];
          if (key !== 'included') {
            this.prototype[key] = value;
          }
        }
        if ((_ref = mixin.included) != null) {
          _ref.apply(this);
        }
      }
      return this;
    };
    Backbone.Model.include = Backbone.Collection.include = include;
    Backbone.View.include = Backbone.Router.include = include;
    Backbone.Marionette.ItemView.include = Backbone.Marionette.CollectionView.include = include;
    Backbone.Marionette.CompositeView.include = Backbone.Marionette.View.include = include;
    return include;
  });

}).call(this);
