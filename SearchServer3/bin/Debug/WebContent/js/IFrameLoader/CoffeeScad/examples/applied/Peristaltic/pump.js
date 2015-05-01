(function() {
  var Base, Base_assembly, Caphead, Coupling, Half_rotor, Lower_rotor, Nut, Pipe_form, Pump, Roller, Roller_print, Rotor_assembly, Shroud, Upper_rotor,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Pump = (function(_super) {
    __extends(Pump, _super);

    function Pump(options) {
      var b, ba, co, lr, pif, ra, rp, ur;
      this.defaults = {
        lobes: 5,
        pipe_od: 5,
        pipe_id: 4,
        pump_radius: 50,
        res: 50,
        clearance: 1,
        base_thickness: 5,
        wall_thickness: 5,
        rotor_thickness: 20,
        bolt_diameter: 3,
        bolt_length: 20,
        roller_outer: 12,
        roller_inner: 3,
        roller_thickness: 10,
        explode: 0,
        layout: 1
      };
      options = this.injectOptions(this.defaults, options);
      Pump.__super__.constructor.call(this, options);
      if (this.layout) {
        b = new Base_assembly(options);
        b.translate([0, 0, this.rotor_thickness * this.explode]);
        ra = new Rotor_assembly(options);
        ra.color([0.4, 0.0, 0.4]);
        ra.translate([0, 0, this.base_thickness + this.clearance]);
        ra.translate([0, 0, this.rotor_thickness * 3 * this.explode]);
        co = new Coupling(options);
        co.color([0.6, 0.6, 0.6]);
        co.translate([0, 0, this.base_thickness + this.clearance]);
        co.translate([0, 0, this.rotor_thickness * 2 * this.explode]);
        pif = new Pipe_form(options);
        pif.translate([0, 0, this.base_thickness + this.clearance]);
        this.add(pif);
        this.add(b);
        this.add(ra);
        this.add(co);
      } else {
        this.explode = 0;
        ba = new Base(options);
        lr = new Lower_rotor(options);
        ur = new Upper_rotor(options);
        co = new Coupling(options);
        rp = new Roller_print(options);
        ba.translate([-this.wall_thickness, -this.wall_thickness, 0]);
        co.translate([-this.wall_thickness, -this.wall_thickness, 0]);
        lr.translate([0, this.pump_radius + this.clearance, 0]);
        ur.translate([this.pump_radius + this.clearance, 0, 0]);
        rp.translate([this.pump_radius + this.clearance, this.pump_radius + this.clearance, 0]);
        this.union(ba);
        this.union(lr);
        this.union(ur);
        this.union(co);
        this.union(rp);
        this.color([0.5, 0.5, 0.5]);
        this.translate([-this.pump_radius / 2, -this.pump_radius / 2, 0]);
      }
    }

    return Pump;

  })(Part);

  Base_assembly = (function(_super) {
    __extends(Base_assembly, _super);

    function Base_assembly(options) {
      var b, bolt1, bolt2, bolt3, bolt4;
      this.defaults = {
        bolt_spacing: 15.5,
        pilot_hole: 11
      };
      options = this.injectOptions(this.defaults, options);
      Base_assembly.__super__.constructor.call(this, options);
      b = new Base(options);
      this.add(b);
      bolt1 = new Caphead({
        m: 3,
        bolt_length: 10
      });
      bolt1.translate([0, 0, this.base_thickness - 1.25 * this.bolt_diameter]);
      bolt1.translate([0, 0, this.base_thickness * 3 * this.explode]);
      bolt2 = bolt1.clone();
      bolt3 = bolt1.clone();
      bolt4 = bolt1.clone();
      bolt1.translate([this.bolt_spacing, this.bolt_spacing, 0]);
      bolt2.translate([-this.bolt_spacing, this.bolt_spacing, 0]);
      bolt3.translate([this.bolt_spacing, -this.bolt_spacing, 0]);
      bolt4.translate([-this.bolt_spacing, -this.bolt_spacing, 0]);
      this.add(bolt1);
      this.add(bolt2);
      this.add(bolt3);
      this.add(bolt4);
    }

    return Base_assembly;

  })(Part);

  Base = (function(_super) {
    __extends(Base, _super);

    function Base(options) {
      var base_block, block, bolt_hole1, bolt_hole2, bolt_hole3, bolt_hole4, pilot, sh;
      this.defaults = {
        bolt_spacing: 15.5,
        pilot_hole: 11
      };
      options = this.injectOptions(this.defaults, options);
      Base.__super__.constructor.call(this, options);
      block = new Cylinder({
        $fn: this.res,
        d: this.pump_radius + this.wall_thickness + 2 * this.clearance,
        h: this.base_thickness
      });
      base_block = new Cube({
        size: [this.pump_radius + this.wall_thickness + 2 * this.clearance, this.pump_radius / 2 + this.wall_thickness, this.base_thickness],
        center: [true, false, false]
      });
      block.union(base_block);
      bolt_hole1 = new Caphead({
        m: 3,
        bolt_length: 10
      }).cutout;
      bolt_hole1.translate([0, 0, this.base_thickness - 1.25 * this.bolt_diameter]);
      bolt_hole2 = bolt_hole1.clone();
      bolt_hole3 = bolt_hole1.clone();
      bolt_hole4 = bolt_hole1.clone();
      bolt_hole1.translate([this.bolt_spacing, this.bolt_spacing, 0]);
      bolt_hole2.translate([-this.bolt_spacing, this.bolt_spacing, 0]);
      bolt_hole3.translate([this.bolt_spacing, -this.bolt_spacing, 0]);
      bolt_hole4.translate([-this.bolt_spacing, -this.bolt_spacing, 0]);
      block.subtract(bolt_hole1);
      block.subtract(bolt_hole2);
      block.subtract(bolt_hole3);
      block.subtract(bolt_hole4);
      pilot = new Cylinder({
        r: this.pilot_hole,
        h: this.base_thickness * 2
      });
      block.subtract(pilot);
      sh = new Shroud(options);
      block.union(sh);
      this.union(block);
    }

    return Base;

  })(Part);

  Pipe_form = (function(_super) {
    __extends(Pipe_form, _super);

    function Pipe_form(options) {
      var flat_pipe, flat_pipe_in, open_pipe, open_pipe_in;
      this.defaults = {};
      options = this.injectOptions(this.defaults, options);
      Pipe_form.__super__.constructor.call(this, options);
      open_pipe = new Cylinder({
        d: this.pump_radius - 0.1,
        h: this.pipe_od
      });
      open_pipe_in = new Cylinder({
        d: this.pump_radius - 2 * this.pipe_od,
        h: this.pipe_od
      });
      open_pipe.subtract(open_pipe_in);
      open_pipe.color([0, 0, 1, 0.77]);
      open_pipe.translate([0, 0, (this.rotor_thickness / 2) - this.pipe_od / 2]);
      open_pipe.translate([0, 0, this.rotor_thickness * 4 * this.explode]);
      this.flat_pipe_size = Math.PI * this.pipe_od / 2;
      flat_pipe = new Cylinder({
        d: this.pump_radius,
        h: this.flat_pipe_size
      });
      flat_pipe_in = new Cylinder({
        d: this.pump_radius - 2 * (this.pipe_od - this.pipe_id),
        h: this.flat_pipe_size
      });
      flat_pipe.subtract(flat_pipe_in);
      flat_pipe.color([0, 1, 0, 0.77]);
      flat_pipe.translate([0, 0, (this.rotor_thickness / 2) - this.flat_pipe_size / 2]);
      flat_pipe.translate([0, 0, this.rotor_thickness * 4 * this.explode]);
      this.add(open_pipe);
      this.add(flat_pipe);
    }

    return Pipe_form;

  })(Part);

  Shroud = (function(_super) {
    __extends(Shroud, _super);

    function Shroud(options) {
      var block, bolt_hole, inner, outer, pipe_base, pipe_base2, pipe_slot;
      this.defaults = {
        height: 30
      };
      options = this.injectOptions(this.defaults, options);
      Shroud.__super__.constructor.call(this, options);
      outer = new Cylinder({
        $fn: this.res,
        d: this.pump_radius + this.wall_thickness,
        h: this.rotor_thickness
      });
      inner = new Cylinder({
        $fn: this.res,
        d: this.pump_radius,
        h: this.rotor_thickness + 0.1
      });
      block = new Cube({
        size: [this.pump_radius + this.wall_thickness, this.pump_radius / 2 + this.wall_thickness, this.rotor_thickness],
        center: [true, false, false]
      });
      pipe_base = new Cylinder({
        d: this.pipe_od,
        h: this.pump_radius
      });
      pipe_slot = new Cube({
        size: [this.pipe_od, this.rotor_thickness, this.pump_radius],
        center: [true, false, false]
      });
      pipe_base.union(pipe_slot);
      pipe_base.rotate([-90, 180, 0]);
      pipe_base2 = pipe_base.clone();
      pipe_base.translate([this.pump_radius / 2 - this.pipe_od / 2, 0, this.clearance + this.pipe_od * 2]);
      pipe_base2.translate([-this.pump_radius / 2 + this.pipe_od / 2, 0, this.clearance + this.pipe_od * 2]);
      bolt_hole = new Cylinder({
        d: this.bolt_diameter,
        h: this.rotor_thickness / 2
      });
      outer.union(block);
      outer.subtract(pipe_base);
      outer.subtract(pipe_base2);
      outer.subtract(inner);
      outer.translate([0, 0, this.base_thickness]);
      this.union(outer);
    }

    return Shroud;

  })(Part);

  Rotor_assembly = (function(_super) {
    __extends(Rotor_assembly, _super);

    function Rotor_assembly(options) {
      var b, be, bo, i, lr, n, upr, _i, _ref;
      this.defaults = {
        rotor_radius: 20,
        height: 30
      };
      options = this.injectOptions(this.defaults, options);
      Rotor_assembly.__super__.constructor.call(this, options);
      be = new Roller(options);
      lr = new Lower_rotor(options);
      this.add(lr);
      this.pipe_flat = this.pipe_od - this.pipe_id;
      this.bearing_offset = (this.pump_radius / 2) - (be.roller_outer / 2) - this.pipe_flat;
      for (i = _i = 0, _ref = this.lobes; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        b = new Roller(options);
        b.translate([(this.pump_radius / 2) - (be.roller_outer / 2) - this.pipe_flat, 0, this.rotor_thickness / 2 - b.roller_thickness / 2]);
        b.translate([0, 0, this.rotor_thickness * this.explode]);
        b.rotate([0, 0, (360 / this.lobes) * i]);
        this.add(b);
        n = new Nut({
          m: this.bolt_diameter
        });
        n.translate([this.bearing_offset, 0, 0]);
        n.translate([0, 0, this.rotor_thickness * -0.8 * this.explode]);
        n.rotate([0, 0, (360 / this.lobes) * i]);
        this.add(n);
        bo = new Caphead({
          m: this.bolt_diameter,
          bolt_length: this.bolt_length
        });
        bo.translate([this.bearing_offset, 0, this.rotor_thickness]);
        bo.translate([0, 0, this.rotor_thickness * 3.5 * this.explode]);
        bo.rotate([0, 0, (360 / this.lobes) * i]);
        this.add(bo);
      }
      upr = new Upper_rotor(options);
      upr.rotate([180, 0, 0]);
      upr.translate([0, 0, this.rotor_thickness]);
      upr.translate([0, 0, 2 * this.rotor_thickness * this.explode]);
      this.add(upr);
    }

    return Rotor_assembly;

  })(Part);

  Half_rotor = (function(_super) {
    __extends(Half_rotor, _super);

    function Half_rotor(options) {
      var be, bolt_hole, bolt_support, hole, i, rotor, _i, _ref;
      this.defaults = {
        rotor_radius: 20,
        height: 30
      };
      options = this.injectOptions(this.defaults, options);
      Half_rotor.__super__.constructor.call(this, options);
      be = new Roller(options);
      this.pipe_flat = this.pipe_od - this.pipe_id;
      this.bearing_offset = (this.pump_radius / 2) - (be.roller_outer / 2) - this.pipe_flat;
      rotor = new Cylinder({
        $fn: this.res,
        r: this.pump_radius / 2 - this.pipe_od - 2 * this.clearance,
        h: this.rotor_thickness * 0.5
      });
      for (i = _i = 0, _ref = this.lobes; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        bolt_support = new Cylinder({
          d: this.bolt_diameter * 2.5,
          h: this.rotor_thickness / 2
        });
        bolt_support.translate([this.bearing_offset, 0, 0]);
        bolt_support.rotate([0, 0, (360 / this.lobes) * i]);
        rotor.union(bolt_support);
        bolt_hole = new Cylinder({
          d: this.bolt_diameter,
          h: this.rotor_thickness / 2
        });
        bolt_hole.translate([this.bearing_offset, 0, 0]);
        bolt_hole.rotate([0, 0, (360 / this.lobes) * i]);
        rotor.subtract(bolt_hole);
        hole = new Cylinder({
          d: be.roller_outer + this.clearance,
          h: be.roller_thickness
        });
        hole.translate([this.bearing_offset, 0, this.rotor_thickness * 0.5 - be.roller_thickness * 0.5 - this.clearance]);
        hole.rotate([0, 0, (360 / this.lobes) * i]);
        rotor.subtract(hole);
      }
      this.union(rotor);
    }

    return Half_rotor;

  })(Part);

  Lower_rotor = (function(_super) {
    __extends(Lower_rotor, _super);

    function Lower_rotor(options) {
      var be, co, i, n, rotor, _i, _ref;
      this.defaults = {
        rotor_radius: 20,
        height: 30
      };
      options = this.injectOptions(this.defaults, options);
      Lower_rotor.__super__.constructor.call(this, options);
      co = new Coupling(options).cutout;
      rotor = new Half_rotor(options);
      rotor.subtract(co);
      be = new Roller(options);
      this.pipe_flat = this.pipe_od - this.pipe_id;
      this.bearing_offset = (this.pump_radius / 2) - (be.roller_outer / 2) - this.pipe_flat;
      for (i = _i = 0, _ref = this.lobes; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        n = new Nut({
          m: this.bolt_diameter
        }).cutout;
        n.translate([this.bearing_offset, 0, 0]);
        n.rotate([0, 0, (360 / this.lobes) * i]);
        rotor.subtract(n);
      }
      this.union(rotor);
    }

    return Lower_rotor;

  })(Part);

  Upper_rotor = (function(_super) {
    __extends(Upper_rotor, _super);

    function Upper_rotor(options) {
      var co, rotor;
      this.defaults = {
        rotor_radius: 20,
        height: 30
      };
      options = this.injectOptions(this.defaults, options);
      Upper_rotor.__super__.constructor.call(this, options);
      co = new Coupling(options).cutout;
      co.rotate([180, 0, 0]);
      co.translate([0, 0, this.rotor_thickness]);
      rotor = new Half_rotor(options);
      rotor.subtract(co);
      this.union(rotor);
    }

    return Upper_rotor;

  })(Part);

  Coupling = (function(_super) {
    __extends(Coupling, _super);

    function Coupling(options) {
      var bot, coup, sub_shaft;
      this.defaults = {
        bot_rad: 8,
        top_rad: 4,
        sides: 6,
        shaft: 5,
        shaft_len: 16
      };
      options = this.injectOptions(this.defaults, options);
      Coupling.__super__.constructor.call(this, options);
      coup = new Cylinder({
        $fn: this.sides,
        h: this.rotor_thickness,
        r1: this.bot_rad,
        r2: this.top_rad
      });
      bot = new Cylinder({
        r: this.bot_rad,
        h: this.base_thickness
      });
      coup.union(bot);
      this.cutout = coup.clone();
      sub_shaft = new Cylinder({
        d: this.shaft,
        h: this.shaft_len
      });
      coup.subtract(sub_shaft);
      this.union(coup);
    }

    return Coupling;

  })(Part);

  Nut = (function(_super) {
    __extends(Nut, _super);

    function Nut(options) {
      var center, nut_inner, nut_outer;
      this.defaults = {
        m: 3
      };
      options = this.injectOptions(this.defaults, options);
      Nut.__super__.constructor.call(this, options);
      nut_outer = new Cylinder({
        $fn: 6,
        h: this.m * 0.8,
        d: 1.8 * this.m
      });
      this.cutout = nut_outer.clone();
      nut_inner = new Cylinder({
        d: this.m,
        h: 2 * this.m
      }, center = [true, true, true]);
      nut_outer.subtract(nut_inner);
      nut_outer.color([0.4, 0.4, 0.4]);
      this.union(nut_outer);
    }

    return Nut;

  })(Part);

  Caphead = (function(_super) {
    __extends(Caphead, _super);

    function Caphead(options) {
      var head, head_height, hex, shaft;
      this.defaults = {
        m: 3,
        bolt_length: 20
      };
      options = this.injectOptions(this.defaults, options);
      Caphead.__super__.constructor.call(this, options);
      shaft = new Cylinder({
        d: this.m,
        h: this.bolt_length
      });
      shaft.translate([0, 0, -this.bolt_length]);
      head_height = 1.25 * this.m;
      head = new Cylinder({
        d: 1.5 * this.m,
        h: head_height
      });
      shaft.union(head);
      this.cutout = shaft.clone();
      hex = new Cylinder({
        $fn: 6,
        h: this.m,
        d: 0.8 * this.m
      });
      hex.translate([0, 0, 0.25 * this.m]);
      shaft.subtract(hex);
      shaft.color([0.4, 0.4, 0.4]);
      this.union(shaft);
    }

    return Caphead;

  })(Part);

  Roller = (function(_super) {
    __extends(Roller, _super);

    function Roller(options) {
      var i, o;
      this.defaults = {
        roller_outer: 12,
        roller_inner: 3,
        roller_thickness: 10
      };
      options = this.injectOptions(this.defaults, options);
      Roller.__super__.constructor.call(this, options);
      o = new Cylinder({
        r: this.roller_outer / 2,
        h: this.roller_thickness
      });
      i = new Cylinder({
        r: this.roller_inner / 2,
        h: this.roller_thickness * 2
      });
      o.subtract(i);
      o.color([0.4, 0.4, 0.4]);
      this.union(o);
    }

    return Roller;

  })(Part);

  Roller_print = (function(_super) {
    __extends(Roller_print, _super);

    function Roller_print(options) {
      var i, r, _i, _ref;
      this.defaults = {
        spacing: 3
      };
      options = this.injectOptions(this.defaults, options);
      Roller_print.__super__.constructor.call(this, options);
      for (i = _i = 0, _ref = this.lobes; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        r = new Roller(options);
        r.translate([this.roller_outer + 2 * this.clearance, 0, 0]);
        r.rotate([0, 0, (360 / this.lobes) * i]);
        this.union(r);
      }
    }

    return Roller_print;

  })(Part);

}).call(this);
