(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var DropBoxStoreSettings;
    return DropBoxStoreSettings = (function(_super) {
      __extends(DropBoxStoreSettings, _super);

      DropBoxStoreSettings.prototype.idAttribute = 'name';

      DropBoxStoreSettings.prototype.defaults = {
        name: "DropBoxStore",
        title: "DropBox Store",
        configured: false
      };

      function DropBoxStoreSettings(options) {
        DropBoxStoreSettings.__super__.constructor.call(this, options);
        this.dropBoxStorage = require('./dropboxStorage');
      }

      DropBoxStoreSettings.prototype.login = function() {
        return this.dropBoxStorage.authentificate();
      };

      return DropBoxStoreSettings;

    })(Backbone.Model);
  });

}).call(this);
