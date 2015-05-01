(function() {
  define(function(require) {
    var Command, marionette, vent;
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    Command = (function() {
      function Command() {}

      Command.prototype.execute = function(params) {
        params = params || null;
        return vent.trigger("dummyCommand", params);
      };

      return Command;

    })();
    return Command;
  });

}).call(this);
