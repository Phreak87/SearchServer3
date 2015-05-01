(function() {
  var MyObject, OtherObject,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MyObject = (function() {
    function MyObject(size) {
      this.size = size;
    }

    return MyObject;

  })();

  OtherObject = (function(_super) {
    __extends(OtherObject, _super);

    function OtherObject(size) {
      OtherObject.__super__.constructor.call(this, size);
    }

    return OtherObject;

  })(MyObject);

}).call(this);
