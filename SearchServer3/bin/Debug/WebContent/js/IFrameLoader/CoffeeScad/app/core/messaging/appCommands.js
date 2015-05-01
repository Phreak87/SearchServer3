(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Commands, commands, marionette;
    marionette = require('marionette');

    /*
    @vent.bind("downloadStlRequest", stlexport)#COMMAND
    @vent.bind("fileSaveRequest", saveProject)#COMMAND
    @vent.bind("fileLoadRequest", loadProject)#COMMAND
    @vent.bind("fileDeleteRequest", deleteProject)#COMMAND
    @vent.bind("editorShowRequest", showEditor)#COMMAND
     */
    "Exploring backbone marionettes' commands";
    Commands = (function(_super) {
      __extends(Commands, _super);

      function Commands(options) {
        Commands.__super__.constructor.call(this, options);
      }

      return Commands;

    })(Backbone.Wreqr.Commands);
    commands = new Commands();
    commands.addHandler("foo", function() {
      return console.log("the foo command was executed");
    });
    return commands;
  });

}).call(this);
