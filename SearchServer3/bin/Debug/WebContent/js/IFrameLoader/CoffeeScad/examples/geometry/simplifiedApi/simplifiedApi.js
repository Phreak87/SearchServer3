(function() {
  var circle2, cube1, cylinder1, greenSphere, rectangle1, redCube, sphere1;

  cube1 = cube({
    size: 10,
    center: [-25, -25, 0]
  });

  sphere1 = sphere({
    r: 10
  });

  cylinder1 = cylinder({
    r: 10,
    h: 20,
    center: [0, 30, 0]
  });

  circle2 = circle({
    r: 10,
    center: 10
  });

  rectangle1 = rectangle({
    size: 10,
    center: [-20, 30]
  });

  redCube = cube({
    size: 30,
    center: [-50, -50, 0]
  }).color([1, 0, 0]);

  greenSphere = sphere({
    r: 20,
    center: -50,
    50: 50
  }, redCube).color([0, 1, 0]);

}).call(this);
