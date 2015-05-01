(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var GitHubStoreSettings;
    return GitHubStoreSettings = (function(_super) {
      __extends(GitHubStoreSettings, _super);

      GitHubStoreSettings.prototype.idAttribute = 'name';

      GitHubStoreSettings.prototype.defaults = {
        name: "Gists",
        title: "Gist integration",
        configured: false
      };

      function GitHubStoreSettings(options) {
        GitHubStoreSettings.__super__.constructor.call(this, options);
      }

      return GitHubStoreSettings;

    })(Backbone.Model);
  });

}).call(this);
