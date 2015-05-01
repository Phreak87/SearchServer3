(function() {
  var NemaMotor,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NemaMotor = (function(_super) {
    __extends(NemaMotor, _super);

    function NemaMotor(options) {
      var motor, motorBody_base, motorBody_center, motorBody_mountPlate, motorBody_squaresub_in, motorBody_squaresub_out, motorBody_sub, mountingholes, pilotRing, pilotRing_sub, shaft, shaftsub;
      this.defaults = {
        motorBody_len: 47.5,
        shaft_len: 22,
        shaft_flat: 2,
        motorBody_baselen: 9,
        motorBody_centlen: 31,
        shaft_radius: 2.5,
        motorBody_width: 42,
        motorBody_dradius: 27,
        motorBody_dradiuscent: 25,
        pilotRing_radius: 11,
        pilotRing_height: 2,
        mountingholes_fromcent: 15.5,
        mountingholes_radius: 1.5,
        mountingholes_depth: 4.5
      };
      options = this.injectOptions(this.defaults, options);
      NemaMotor.__super__.constructor.call(this, options);
      shaftsub = new Cube({
        size: [this.shaft_radius * 2, this.shaft_radius * 2, this.shaft_len],
        center: [true, false, false]
      }).translate([0, this.shaft_flat, this.motorBody_len + this.pilotRing_height]);
      shaft = new Cylinder({
        h: this.shaft_len,
        r: this.shaft_radius,
        center: [true, true, this.motorBody_len + this.pilotRing_radius]
      }).color([0.85, 0.85, 1]).subtract(shaftsub);
      motorBody_squaresub_in = new Cube({
        size: [this.motorBody_width, this.motorBody_width, this.motorBody_len],
        center: [true, true, false]
      });
      motorBody_squaresub_out = new Cube({
        size: [this.motorBody_dradius * 2, this.motorBody_dradius * 2, this.motorBody_len],
        center: [true, true, false]
      });
      motorBody_sub = motorBody_squaresub_out.subtract(motorBody_squaresub_in);
      motorBody_center = new Cylinder({
        r: this.motorBody_dradiuscent,
        h: this.motorBody_centlen,
        center: [true, true, false]
      }).translate([0, 0, this.motorBody_baselen]).subtract(motorBody_sub);
      motorBody_center.color([0.1, 0.1, 0.05]);
      motorBody_base = new Cylinder({
        r: this.motorBody_dradius,
        h: this.motorBody_baselen,
        center: [true, true, false]
      }).subtract(motorBody_sub);
      motorBody_base.color([0.6, 0.6, 1]);
      pilotRing_sub = new Cylinder({
        h: this.pilotRing_height,
        r: this.shaft_radius * 1.5,
        center: [true, true, this.motorBody_len]
      });
      pilotRing = new Cylinder({
        h: this.pilotRing_height,
        r: this.pilotRing_radius,
        center: [true, true, this.motorBody_len]
      }).subtract(pilotRing_sub).color([0.5, 0.5, 0.6]);
      motorBody_mountPlate = new Cylinder({
        r: this.motorBody_dradius,
        h: this.motorBody_len - (this.motorBody_baselen + this.motorBody_centlen),
        center: [true, true, false]
      }).translate([0, 0, this.motorBody_baselen + this.motorBody_centlen]);
      motorBody_mountPlate.subtract(motorBody_sub).union(pilotRing);
      motorBody_mountPlate.color([0.6, 0.6, 1]);
      mountingholes = new Cylinder({
        h: this.mountingholes_depth,
        r: this.mountingholes_radius,
        center: [true, true, this.motorBody_len - (this.mountingholes_depth / 2)]
      });
      motorBody_mountPlate = motorBody_mountPlate.subtract(mountingholes.clone().translate([this.mountingholes_fromcent, this.mountingholes_fromcent, 0]));
      motorBody_mountPlate = motorBody_mountPlate.subtract(mountingholes.clone().translate([-this.mountingholes_fromcent, this.mountingholes_fromcent, 0]));
      motorBody_mountPlate = motorBody_mountPlate.subtract(mountingholes.clone().translate([this.mountingholes_fromcent, -this.mountingholes_fromcent, 0]));
      motorBody_mountPlate = motorBody_mountPlate.subtract(mountingholes.clone().translate([-this.mountingholes_fromcent, -this.mountingholes_fromcent, 0]));
      motor = motorBody_center.union([motorBody_base, motorBody_mountPlate, shaft]);
      this.union(motor);
    }

    return NemaMotor;

  })(Part);

}).call(this);
