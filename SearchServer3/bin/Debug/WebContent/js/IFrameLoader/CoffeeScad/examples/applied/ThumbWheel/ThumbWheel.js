(function() {
  var ThumbWheel, thumbWheel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ThumbWheel = (function(_super) {
    __extends(ThumbWheel, _super);

    function ThumbWheel(options) {
      var angleA, angleARadians, base, distance_to_knobbles, get_sideC, hex, hub, i, knobble, knobble_seperation, nuttrap, scallop, _i, _ref;
      this.defaults = {
        total_radius: 30,
        base_height: 4,
        knobbles_num: 5,
        knobbles_radius: 5,
        knobbles_height: 5,
        centerhole_radius: 1.55,
        centerhex_radus: 3.1,
        centerhex_height: 2,
        centerhub_height: 4,
        centerhub_radius: 4
      };
      options = this.injectOptions(this.defaults, options);
      ThumbWheel.__super__.constructor.call(this, options);
      distance_to_knobbles = this.total_radius - this.knobbles_radius;
      angleA = 360 / this.knobbles_num;
      angleARadians = angleA * (3.14159265359 / 180);
      get_sideC = function(side_a, side_b, angle_A) {
        return Math.sqrt(Math.pow(side_a, 2) + Math.pow(side_b, 2) - 2 * side_a * side_b * Math.cos(angle_A));
      };
      hub = new Cylinder({
        h: this.centerhub_height,
        r: this.centerhub_radius,
        center: [0, 0, this.centerhub_height / 2]
      });
      hex = new Cylinder({
        h: this.centerhex_height,
        r: this.centerhex_radus,
        center: [0, 0, this.centerhub_height - this.centerhex_height / 2],
        $fn: 6
      });
      nuttrap = new Cylinder({
        h: this.centerhub_height,
        r: this.centerhole_radius,
        center: [0, 0, this.centerhub_height / 2]
      });
      nuttrap = nuttrap.union(hex);
      base = new Cylinder({
        h: this.base_height,
        r: distance_to_knobbles,
        center: [0, 0, this.base_height / 2]
      });
      knobble = new Cylinder({
        h: this.knobbles_height,
        r: this.knobbles_radius,
        center: [0, distance_to_knobbles, this.knobbles_height / 2]
      });
      knobble_seperation = get_sideC(distance_to_knobbles, distance_to_knobbles, angleARadians);
      scallop = new Cylinder({
        h: this.base_height,
        r: (knobble_seperation - this.knobbles_radius) / 2,
        center: [0, distance_to_knobbles, this.base_height / 2]
      });
      scallop = scallop.rotate([0, 0, angleA / 2]);
      base.union(hub);
      base.subtract(nuttrap);
      i = 0;
      while (i < this.knobbles_num) {
        base.subtract(scallop.clone().rotate([0, 0, angleA * i]));
        i++;
      }
      for (i = _i = 0, _ref = this.knobbles_num; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        base.union(knobble.clone().rotate([0, 0, angleA * i]));
      }
      this.union(base).color([0.7, 0.2, 0.1]);
    }

    return ThumbWheel;

  })(Part);

  thumbWheel = new ThumbWheel({
    knobbles_num: 6
  });

  assembly.add(thumbWheel);

}).call(this);
