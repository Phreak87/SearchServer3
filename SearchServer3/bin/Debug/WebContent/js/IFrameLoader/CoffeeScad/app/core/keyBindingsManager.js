(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var KeyBindingsManager, vent;
    require('Mousetrap_global');
    vent = require('core/messaging/appVent');
    KeyBindingsManager = (function() {
      function KeyBindingsManager(options) {
        this.bindCommand = __bind(this.bindCommand, this);
        this.setup = __bind(this.setup, this);
        this._onSettingsChanged = __bind(this._onSettingsChanged, this);
        this._onAppSettingsChanged = __bind(this._onAppSettingsChanged, this);
        this.appSettings = options.appSettings || null;
        this.settings = this.appSettings.getByName("KeyBindings");
        this.vent = vent;
        console.log("bliblu", this.appSettings);
        this.commands = {
          "project:save": (function(_this) {
            return function() {
              return _this.vent.trigger("project:save");
            };
          })(this),
          "project:load": (function(_this) {
            return function() {
              return _this.vent.trigger("project:load");
            };
          })(this),
          "project:new": (function(_this) {
            return function() {
              return _this.vent.trigger("project:new");
            };
          })(this),
          "project:compile": (function(_this) {
            return function() {
              return _this.vent.trigger("project:compile");
            };
          })(this)
        };
        this.keybindings = {
          "project:new": 'alt+n',
          "project:load": 'mod+l',
          "project:save": 'mod+s',
          "project:compile": 'f4',
          "project:compile": 'alt+c'
        };
        this.appSettings.on("reset", this._onAppSettingsChanged);
      }

      KeyBindingsManager.prototype._onAppSettingsChanged = function(model, attributes) {
        this.settings = this.appSettings.getByName("KeyBindings");
        return this.settings.on("change", this._onSettingsChanged);
      };

      KeyBindingsManager.prototype._onSettingsChanged = function(settings, value) {
        var keybindings;
        keybindings = this.settings.get("bindings");
        return console.log("settings, keybindings", keybindings);
      };

      KeyBindingsManager.prototype.setup = function() {
        var command, commandToCall, keys, _results;
        _results = [];
        for (command in this.keybindings) {
          keys = this.keybindings[command];
          commandToCall = this.commands[command];
          _results.push((function(_this) {
            return function(keys, commandToCall) {
              return Mousetrap.bindGlobal(keys, function(e) {
                if (e.preventDefault) {
                  e.preventDefault();
                } else {
                  e.returnValue = false;
                }
                return commandToCall();
              });
            };
          })(this)(keys, commandToCall));
        }
        return _results;
      };

      KeyBindingsManager.prototype.bindCommand = function(command, keys) {
        var commandToCall;
        if (command === null) {
          return;
        }
        Mousetrap.unbind(keybindings[command]);
        this.keybindings[command] = keys;
        commandToCall = this.commands[command];
        return Mousetrap.bindGlobal(keys, (function(_this) {
          return function(e) {
            if (e.preventDefault) {
              e.preventDefault();
            } else {
              e.returnValue = false;
            }
            return commandToCall();
          };
        })(this));

        /*
        Mousetrap.bindGlobal 'alt+n', (e)=>
          if e.preventDefault
            e.preventDefault()
          else
             * internet explorer
            e.returnValue = false
          
          NewProjectCommand = require 'core/messaging/commands/newProjectCommand'
          newProjectCommand = new NewProjectCommand()
          newProjectCommand.execute()
        
        
        Mousetrap.bindGlobal 'mod+s', (e)=>
          if e.preventDefault
            e.preventDefault()
          else
             * internet explorer
            e.returnValue = false
          console.log "saving yeah"
          @vent.trigger("project:save")
          
        Mousetrap.bindGlobal 'ctrl+l', (e)=>
          if e.preventDefault
            e.preventDefault()
          else
             * internet explorer
            e.returnValue = false
          LoadProjectCommand = require 'core/messaging/commands/loadProjectCommand'
          loadProjectCommand = new LoadProjectCommand()
          loadProjectCommand.execute()
          
        Mousetrap.bindGlobal 'alt+c', (e)=>
          if e.preventDefault
            e.preventDefault()
          else
             * internet explorer
            e.returnValue = false
          console.log "compiling yeah"
          @vent.trigger("project:compile")
          
        Mousetrap.bindGlobal 'f4', (e)=>
          if e.preventDefault
            e.preventDefault()
          else
             * internet explorer
            e.returnValue = false
          console.log "compiling yeah"
          @vent.trigger("project:compile")
         */
      };

      return KeyBindingsManager;

    })();
    return KeyBindingsManager;
  });

}).call(this);
