(function() {
  define(function(require) {
    var $, Backbone, CoffeeScadApp, app, marionette, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    marionette = require('marionette');
    CoffeeScadApp = require('coffeescad.app');
    app = new CoffeeScadApp();

    /*return _.extend app,
      module: (additionalProps)->
        return _.extend
          Views: {}
          additionalProps
     */
    return app;
  });

}).call(this);
