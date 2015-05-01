(function() {
  var blueCube, cube, greenCube, redCube;

  cube = new Cube({
    size: 20
  }).color([0.9, 0.5, 0.1]);

  greenCube = cube.clone().translate([30, 0, 0]);

  greenCube.color([0.2, 0.8, 0.2]);

  redCube = cube.clone().rotate([45, 45, 45]).translate(40);

  redCube.color([1, 0, 0]);

  blueCube = cube.clone().scale([3, 1, 1]);

  blueCube.translate([-40, -30, 0]);

  blueCube.color([0, 0, 1]);

  assembly.add(cube);

  assembly.add(greenCube);

  assembly.add(redCube);

  assembly.add(blueCube);

}).call(this);
