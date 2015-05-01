(function() {
  var cube1, cube2, cube3, cube4, cube5;

  cube1 = new Cube({
    size: 20
  });

  cube2 = new Cube({
    size: 20
  }).color([0, 1, 0, 0.75]);

  cube3 = new Cube({
    size: [10, 15, 5],
    center: true
  });

  cube4 = new Cube({
    size: [10, 15, 5],
    center: [true, true, false]
  });

  cube5 = new Cube({
    size: [10, 15, 5],
    center: [5, 5, false]
  });

  assembly.add(cube1);

}).call(this);
