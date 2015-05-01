(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, GeneralSettings, KeyBindings, LocalStorage, Settings, buildProperties, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    LocalStorage = require('localstorage');
    buildProperties = require('core/utils/buildProperties');
    Settings = (function(_super) {
      __extends(Settings, _super);

      Settings.prototype.localStorage = new Backbone.LocalStorage("Settings");

      function Settings(options) {
        this.getByName = __bind(this.getByName, this);
        this.onReset = __bind(this.onReset, this);
        this.clear = __bind(this.clear, this);
        this.parse = __bind(this.parse, this);
        this.save = __bind(this.save, this);
        Settings.__super__.constructor.call(this, options);
        this.settingNames = new Object();
        this.bind("reset", this.onReset);
        this.registerSettingClass("General", GeneralSettings);
        this.registerSettingClass("KeyBindings", KeyBindings);
      }

      Settings.prototype.save = function() {
        return this.each(function(model) {
          return model.save();
        });
      };

      Settings.prototype.registerSettingClass = function(settingName, settingClass) {
        this.settingNames[settingName] = settingClass;
        this.add(new settingClass());
        return this;
      };

      Settings.prototype.parse = function(response) {
        var error, i, v;
        for (i in response) {
          v = response[i];
          try {
            response[i] = new this.settingNames[v.name](v);
          } catch (_error) {
            error = _error;
            console.log("failed to parse setting: " + error);
          }
        }
        return response;
      };

      Settings.prototype.clear = function() {
        return this.each(function(model) {
          return model.destroy();
        });
      };

      Settings.prototype.onReset = function() {
        var index, settingClass, subSetting, _ref, _results;
        if (this.models.length === 0) {
          _ref = this.settingNames;
          _results = [];
          for (index in _ref) {
            settingClass = _ref[index];
            subSetting = new settingClass();
            _results.push(this.add(subSetting));
          }
          return _results;
        }

        /*
        console.log "collection reset" 
        console.log @
        console.log "_____________"
         */
      };

      Settings.prototype.getByName = function(name) {
        "Return a specific sub setting by name";
        var result;
        result = this.filter(function(setting) {
          return setting.get('name') === name;
        });
        return result[0];
      };

      return Settings;

    })(Backbone.Collection);
    GeneralSettings = (function(_super) {
      __extends(GeneralSettings, _super);

      GeneralSettings.prototype.attributeNames = ['name', 'csgCompileMode', 'csgCompileDelay', 'csgBackgroundProcessing', 'displayEventNotifications', 'autoReloadLastProject', 'autoSave', 'autoSaveFrequency'];

      buildProperties(GeneralSettings);

      GeneralSettings.prototype.idAttribute = 'name';

      GeneralSettings.prototype.defaults = {
        name: "General",
        title: "General",
        csgCompileMode: "onCodeChange",
        csgCompileDelay: 1.0,
        csgBackgroundProcessing: false,
        autoReloadLastProject: false,
        autoSave: false,
        autoSaveFrequency: 30,
        language: "english",
        theme: "default",
        displayEventNotifications: true
      };

      function GeneralSettings(options) {
        GeneralSettings.__super__.constructor.call(this, options);
      }

      return GeneralSettings;

    })(Backbone.Model);
    KeyBindings = (function(_super) {
      __extends(KeyBindings, _super);

      KeyBindings.prototype.idAttribute = 'name';

      KeyBindings.prototype.defaults = {
        name: "KeyBindings",
        title: "Key Bindings",
        bindings: {
          "project:new": 'alt+n',
          "project:load": 'mod+l',
          "project:save": 'mod+s',
          "project:compile": 'f4',
          "project:compile": 'alt+c'
        }
      };

      function KeyBindings(options) {
        KeyBindings.__super__.constructor.call(this, options);
      }

      return KeyBindings;

    })(Backbone.Model);
    return Settings;
  });

}).call(this);
