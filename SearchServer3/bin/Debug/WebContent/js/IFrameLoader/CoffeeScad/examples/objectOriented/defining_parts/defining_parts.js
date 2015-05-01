(function() {
  var CoolHardware, CoolHardware2, CrucialPieceOfHardware, coolHardware, coolHardware1, coolHardware2,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CrucialPieceOfHardware = (function(_super) {
    __extends(CrucialPieceOfHardware, _super);

    function CrucialPieceOfHardware(options) {
      CrucialPieceOfHardware.__super__.constructor.call(this, options);
      this.cb = new Cube({
        size: 20
      });
      this.cb.color([0.1, 0.5, 0.8]);
      this.union(this.cb);
    }

    return CrucialPieceOfHardware;

  })(Part);

  CoolHardware = (function(_super) {
    __extends(CoolHardware, _super);

    function CoolHardware(options) {
      var defaults, _ref;
      defaults = {
        position: [0, 0, 0],
        thickness: 5,
        servoType: "HXT900"
      };
      _ref = options = merge(defaults, options), this.position = _ref.position, this.thickness = _ref.thickness, this.servo = _ref.servo;
      CoolHardware.__super__.constructor.call(this, options);
      this.cb = new Cube({
        size: [5, 10, this.thickness]
      });
      this.cb.color([0.1, 0.5, 0.8]);
      this.cb.translate(this.position);
      this.union(this.cb);
    }

    return CoolHardware;

  })(Part);

  CoolHardware2 = (function(_super) {
    __extends(CoolHardware2, _super);

    function CoolHardware2(options) {
      this.defaults = {
        position: [0, 0, 0],
        thickness: 5,
        servoType: "HXT900"
      };
      options = this.injectOptions(this.defaults, options);
      CoolHardware2.__super__.constructor.call(this, options);
      this.cb = new Cube({
        size: [5, 10, this.thickness]
      });
      this.cb.color([0.1, 0.5, 0.8]);
      this.cb.translate(this.position);
      this.union(this.cb);
    }

    return CoolHardware2;

  })(Part);

  coolHardware = new CoolHardware({
    thickness: 10
  });

  coolHardware1 = new CoolHardware();

  coolHardware2 = new CoolHardware2({
    thickness: 15
  });

  assembly.add(coolHardware);

  assembly.add(coolHardware1.translate([20, 20, 0]));

  assembly.add(coolHardware2.translate([-20, 20, 0]));

}).call(this);
