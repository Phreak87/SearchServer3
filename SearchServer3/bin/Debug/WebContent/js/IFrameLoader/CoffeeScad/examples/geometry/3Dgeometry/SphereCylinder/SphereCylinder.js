(function() {
  var shape1, shape2, shape3, shape4, shape5, shape6;

  shape1 = new Sphere({
    r: 20
  });

  shape2 = new Sphere({
    r: 20,
    $fn: 32
  });

  shape3 = new Cylinder({
    r: 15,
    h: 10,
    $fn: 32
  });

  shape4 = new Cylinder({
    r: 15,
    h: 10,
    $fn: 6,
    center: [20, 20, false]
  });

  shape5 = new Cylinder({
    r1: 20,
    r2: 5,
    h: 30
  });

  shape6 = new Cylinder({
    d: 20,
    h: 10
  });

  assembly.add(shape6);

}).call(this);
