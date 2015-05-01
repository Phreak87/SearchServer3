(function() {
  define(function(require) {
    var OrbitControls, THREE;
    THREE = require('three');

    /*
    @author qiao / https://github.com/qiao
    @author mrdoob / http://mrdoob.com
    @author alteredq / http://alteredqualia.com/
    @author WestLangley / https://github.com/WestLangley
     */
    OrbitControls = function(object, domElement) {
      var EPS, PIXELS_PER_ROUND, STATE, changeEvent, getAutoRotationAngle, getZoomScale, lastPosition, onMouseDown, onMouseMove, onMouseUp, onMouseWheel, panEnd, panStart, phiDelta, rotateDelta, rotateEnd, rotateStart, scale, scope, state, thetaDelta, zoomDelta, zoomEnd, zoomStart;
      this.object = object;
      this.domElement = (domElement !== undefined ? domElement : document);
      this.target = new THREE.Vector3();
      this.eye = new THREE.Vector3();
      this.userZoom = true;
      this.userZoomSpeed = 1.0;
      this.userRotate = true;
      this.userRotateSpeed = 1.0;
      this.autoRotate = false;
      this.autoRotateSpeed = 2.0;
      this.minPolarAngle = 0;
      this.maxPolarAngle = Math.PI;
      this.minDistance = 0;
      this.maxDistance = Infinity;
      scope = this;
      EPS = 0.000001;
      PIXELS_PER_ROUND = 1800;
      rotateStart = new THREE.Vector2();
      rotateEnd = new THREE.Vector2();
      rotateDelta = new THREE.Vector2();
      zoomStart = new THREE.Vector2();
      zoomEnd = new THREE.Vector2();
      zoomDelta = new THREE.Vector2();
      panStart = new THREE.Vector2();
      panEnd = new THREE.Vector2();
      phiDelta = 0;
      thetaDelta = 0;
      scale = 1;
      lastPosition = new THREE.Vector3();
      STATE = {
        NONE: -1,
        ROTATE: 0,
        ZOOM: 1,
        PAN: 2
      };
      state = STATE.NONE;
      changeEvent = {
        type: "change"
      };
      this.rotateLeft = function(angle) {
        if (angle === undefined) {
          angle = getAutoRotationAngle();
        }
        return thetaDelta -= angle;
      };
      this.rotateRight = function(angle) {
        if (angle === undefined) {
          angle = getAutoRotationAngle();
        }
        return thetaDelta += angle;
      };
      this.rotateUp = function(angle) {
        if (angle === undefined) {
          angle = getAutoRotationAngle();
        }
        return phiDelta -= angle;
      };
      this.rotateDown = function(angle) {
        if (angle === undefined) {
          angle = getAutoRotationAngle();
        }
        return phiDelta += angle;
      };
      this.zoomIn = function(zoomScale) {
        if (zoomScale === undefined) {
          zoomScale = getZoomScale();
        }
        return scale /= zoomScale;
      };
      this.zoomOut = function(zoomScale) {
        if (zoomScale === undefined) {
          zoomScale = getZoomScale();
        }
        return scale *= zoomScale;
      };
      this.zoomCamera = function() {
        var offset, position, radius;
        position = this.object.position;
        offset = position.clone().sub(this.target);
        radius = offset.length() * scale;
        radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));
        this.eye.multiplyScalar(radius);
        return scale = 1.0;
      };
      this.rotateCamera = function() {
        var offset, phi, position, theta;
        position = this.object.position;
        offset = position.clone().sub(this.target);
        theta = Math.atan2(offset.x, offset.y);
        phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.y * offset.y), offset.z);
        theta += thetaDelta;
        phi += phiDelta;
        phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));
        phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));
        offset.x = Math.sin(phi) * Math.sin(theta);
        offset.z = Math.cos(phi);
        offset.y = Math.sin(phi) * Math.cos(theta);
        this.eye = offset;
        thetaDelta = 0;
        phiDelta = 0;
        this.theta = theta;
        return this.phi = phi;
      };
      this.panCamera = function() {
        var cameraUpVector, eyeVector, leftVector, mouseChange, pan, panVector, upVector, vLeft, vUp;
        mouseChange = panEnd.clone().sub(panStart);
        if (mouseChange.lengthSq()) {
          mouseChange.multiplyScalar(this.panSpeed);
          eyeVector = this.object.position.clone().sub(this.target);
          cameraUpVector = this.object.up.clone();
          leftVector = eyeVector.clone().cross(cameraUpVector);
          upVector = eyeVector.clone().cross(leftVector);
          vLeft = leftVector.normalize().multiplyScalar(mouseChange.x);
          vUp = upVector.normalize().multiplyScalar(-mouseChange.y);
          panVector = new THREE.Vector3().addVectors(vLeft, vUp);
          pan = panVector;
          this.object.position.add(pan);
          this.target.add(pan);
          return panStart = panEnd;
        }
      };
      this.update = (function(_this) {
        return function() {
          if (!_this.noRotate) {
            _this.rotateCamera();
          }
          if (!_this.noZoom) {
            _this.zoomCamera();
          }
          if (!_this.noPan) {
            _this.panCamera();
          }
          _this.object.position.addVectors(_this.target, _this.eye);
          _this.object.lookAt(_this.target);
          if (lastPosition.distanceToSquared(_this.object.position) > 0) {
            _this.dispatchEvent(changeEvent);
            return lastPosition.copy(_this.object.position);
          }
        };
      })(this);
      this.zoomInOn = (function(_this) {
        return function(object) {
          return _this.target = object.position.clone();
        };
      })(this);
      getAutoRotationAngle = function() {
        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
      };
      getZoomScale = function() {
        return Math.pow(0.95, scope.userZoomSpeed);
      };
      onMouseDown = function(event) {
        if (!scope.userRotate) {
          return;
        }
        event.preventDefault();
        if (event.button === 0) {
          state = STATE.ROTATE;
          rotateStart.set(event.clientX, event.clientY);
        } else if (event.button === 2) {
          state = STATE.PAN;
          panStart = panEnd = new THREE.Vector2(event.clientX, event.clientY);
        } else if (event.button === 1) {
          state = STATE.ZOOM;
          zoomStart.set(event.clientX, event.clientY);
        }
        document.addEventListener("mousemove", onMouseMove, false);
        return document.addEventListener("mouseup", onMouseUp, false);
      };
      onMouseMove = function(event) {
        event.preventDefault();
        if (state === STATE.ROTATE) {
          rotateEnd.set(event.clientX, event.clientY);
          rotateDelta.subVectors(rotateEnd, rotateStart);
          scope.rotateLeft(2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed * -1);
          scope.rotateUp(2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed);
          return rotateStart.copy(rotateEnd);
        } else if (state === STATE.ZOOM) {
          zoomEnd.set(event.clientX, event.clientY);
          zoomDelta.subVectors(zoomEnd, zoomStart);
          if (zoomDelta.y > 0) {
            scope.zoomIn();
          } else {
            scope.zoomOut();
          }
          return zoomStart.copy(zoomEnd);
        } else if (state === STATE.PAN) {
          return panEnd = new THREE.Vector2(event.clientX, event.clientY);
        }
      };
      onMouseUp = function(event) {
        if (!scope.userRotate) {
          return;
        }
        document.removeEventListener("mousemove", onMouseMove, false);
        document.removeEventListener("mouseup", onMouseUp, false);
        return state = STATE.NONE;
      };
      onMouseWheel = function(event) {
        var delta;
        if (!scope.userZoom) {
          return;
        }
        delta = 0;
        if (event.wheelDelta) {
          delta = event.wheelDelta;
        } else {
          if (event.detail) {
            delta = -event.detail;
          }
        }
        if (delta > 0) {
          return scope.zoomOut();
        } else {
          return scope.zoomIn();
        }
      };
      this.domElement.addEventListener("contextmenu", (function(event) {
        return event.preventDefault();
      }), false);
      this.domElement.addEventListener("mousedown", onMouseDown, false);
      this.domElement.addEventListener("mousewheel", onMouseWheel, false);
      return this.domElement.addEventListener("DOMMouseScroll", onMouseWheel, false);
    };
    OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
    return OrbitControls;
  });

}).call(this);
