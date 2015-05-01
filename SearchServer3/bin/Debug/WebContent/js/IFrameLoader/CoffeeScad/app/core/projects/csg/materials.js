(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var BaseMaterial, Material;
    Material = (function() {
      function Material(options) {
        var defaults;
        defaults = {
          color: [1, 1, 1]
        };
        this.color = defaults.color;
      }

      return Material;

    })();
    BaseMaterial = (function(_super) {
      __extends(BaseMaterial, _super);

      function BaseMaterial(options) {
        BaseMaterial.__super__.constructor.call(this, options);
      }

      return BaseMaterial;

    })(Material);
    return {
      "Material": Material,
      "BaseMaterial": BaseMaterial
    };
  });

}).call(this);
