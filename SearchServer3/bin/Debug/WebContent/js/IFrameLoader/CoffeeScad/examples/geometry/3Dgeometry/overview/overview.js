(function() {
  var cubeTest, cylinderTest, sphereTest;

  cubeTest = new Cube({
    size: 20
  });

  cubeTest = new Cube({
    size: 20,
    center: [-10, 10, -10]
  });

  cubeTest = new Cube({
    size: 20,
    center: [-10, -10, false]
  });

  cubeTest = new Cube({
    size: 20,
    center: [true, true, false]
  });

  sphereTest = new Sphere();

  sphereTest = new Sphere({
    r: 10,
    $fn: 18
  });

  sphereTest = new Sphere({
    d: 10,
    $fn: 18
  });

  sphereTest = new Sphere({
    d: 20,
    $fn: 18,
    center: false
  });

  sphereTest = new Sphere({
    d: 20,
    $fn: 18,
    center: [10, 10, 10]
  });

  cylinderTest = new Cylinder({
    r: 10,
    $fn: 18,
    h: 25
  });

  cylinderTest = new Cylinder({
    d: 20,
    $fn: 18,
    h: 25
  });

  cylinderTest = new Cylinder({
    d: 20,
    $fn: 18,
    h: -25,
    center: [false, 50, false]
  });

  cylinderTest = new Cylinder({
    d: 20,
    $fn: 18,
    h: 25,
    center: [10, 10, 10]
  });

  cylinderTest = new Cylinder({
    d: 20,
    $fn: 25,
    h: 35,
    center: [-45, 20, false],
    rounded: true
  });

  assembly.add(cubeTest);

}).call(this);
