(function() {
  var cube, cubeSize;

  cubeSize = 20;

  cube = new Cube({
    size: cubeSize
  }).color([0.9, 0.5, 0.1]);

  assembly.add(cube);

  log.level = log.DEBUG;

  log.debug("cubeSize: " + cubeSize);

}).call(this);
