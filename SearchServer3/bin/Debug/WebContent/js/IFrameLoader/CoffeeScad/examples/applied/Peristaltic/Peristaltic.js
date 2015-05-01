(function() {
  var motor, p;

  include("nema.coffee");

  include("pump.coffee");

  this.config = {
    explode: 1,
    layout: 0,
    lobes: 3,
    pipe_od: 5,
    pipe_id: 4,
    roller_outer: 12,
    wall_thickness: 10
  };

  p = new Pump(this.config);

  assembly.add(p);

  if (this.config.layout) {
    motor = new NemaMotor();
    motor.translate([0, 0, -motor.motorBody_len]);
    assembly.add(motor);
  }

}).call(this);
