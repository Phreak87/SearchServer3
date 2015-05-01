(function() {
  define(function(require) {
    var $, Backbone, Wreqr, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    Wreqr = require('wreqr');
    return new Backbone.Wreqr.RequestResponse();
  });

}).call(this);
