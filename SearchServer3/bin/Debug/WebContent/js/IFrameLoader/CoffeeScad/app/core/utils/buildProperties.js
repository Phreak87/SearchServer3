(function() {
  define(function(require) {
    var buildProperties;
    buildProperties = function(func) {
      var attr, buildGetter, buildSetter, _i, _len, _ref, _results;
      buildGetter = function(name) {
        return function() {
          return this.get(name);
        };
      };
      buildSetter = function(name) {
        return function(value) {
          return this.set(name, value);
        };
      };
      _ref = func.prototype.attributeNames;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        _results.push(Object.defineProperty(func.prototype, attr, {
          get: buildGetter(attr),
          set: buildSetter(attr)
        }));
      }
      return _results;
    };
    return buildProperties;
  });

}).call(this);
