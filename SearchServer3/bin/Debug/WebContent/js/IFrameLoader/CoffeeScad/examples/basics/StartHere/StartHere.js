(function() {
  var cube, sphere;

  cube = new Cube({
    size: 42
  });

  assembly.add(cube);

  sphere = new Sphere({
    r: 42
  });

  cube.add(sphere);

}).call(this);
