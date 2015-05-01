(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Command, NewProjectCommand, marionette, vent;
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    Command = require('./command');
    NewProjectCommand = (function(_super) {
      __extends(NewProjectCommand, _super);

      function NewProjectCommand() {
        return NewProjectCommand.__super__.constructor.apply(this, arguments);
      }

      NewProjectCommand.prototype.execute = function(params) {
        params = params || null;
        console.log("command : create project");
        return vent.trigger("project:new", params);
      };

      return NewProjectCommand;

    })(Command);
    return NewProjectCommand;
  });

}).call(this);
