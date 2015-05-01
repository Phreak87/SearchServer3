(function() {
  define(function(require) {
    var ModuleRegistry;
    return ModuleRegistry = (function() {
      function ModuleRegistry() {
        this.modules = [];
      }

      ModuleRegistry.prototype.registerSubApp = function(module) {};

      return ModuleRegistry;

    })();
  });

}).call(this);
