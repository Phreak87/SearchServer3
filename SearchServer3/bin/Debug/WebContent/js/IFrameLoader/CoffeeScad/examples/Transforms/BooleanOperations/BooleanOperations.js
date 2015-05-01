(function() {
  var cube, cube2, cylinder, sphere;

  cube = new Cube({
    size: 20
  }).color([0.9, 0.5, 0.1]);

  cylinder = new Cylinder({
    r: 5,
    h: 20,
    center: false
  });

  cylinder.color([0.9, 0.1, 0.3, 1]);

  sphere = new Sphere({
    r: 25
  });

  sphere.color([0, 0.5, 0.8, 1]);

  cube2 = new Cube({
    size: 10
  });

  cube.union(cube2);

  cube.subtract(cylinder);

  cube.intersect(sphere);

  assembly.add(cube);

}).call(this);
