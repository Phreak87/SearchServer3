(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Command, LoadProjectCommand, vent;
    vent = require('core/messaging/appVent');
    Command = require('./command');
    LoadProjectCommand = (function(_super) {
      __extends(LoadProjectCommand, _super);

      function LoadProjectCommand() {
        return LoadProjectCommand.__super__.constructor.apply(this, arguments);
      }

      LoadProjectCommand.prototype.execute = function(params) {
        params = params || null;
        console.log("command : load project");
        return vent.trigger("project:load", params);
      };

      return LoadProjectCommand;

    })(Command);
    return LoadProjectCommand;
  });

}).call(this);
