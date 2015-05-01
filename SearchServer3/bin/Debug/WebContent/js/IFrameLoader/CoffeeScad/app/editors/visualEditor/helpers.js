(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Arrow, BaseHelper, BoundingCage, Grid, LabeledAxes, SelectionHelper, THREE, captureScreen, computeVolume, enableHelpers, geometryToline, merge, toggleHelpers, updateVisuals, utils;
    THREE = require('three');
    utils = require('core/utils/utils');
    merge = utils.merge;
    BaseHelper = (function(_super) {
      __extends(BaseHelper, _super);

      function BaseHelper(options) {
        this.drawTextOnPlane = __bind(this.drawTextOnPlane, this);
        this.drawText = __bind(this.drawText, this);
        BaseHelper.__super__.constructor.call(this, options);
      }

      BaseHelper.prototype.drawText = function(text, displaySize, background, scale) {
        var borderThickness, canvas, context, fontSize, metrics, rect, sprite, spriteMaterial, textWidth, texture;
        fontSize = displaySize || 18;
        background = background || false;
        scale = scale || 1.0;
        canvas = document.createElement('canvas');
        borderThickness = 2;
        context = canvas.getContext('2d');
        context.font = "15px Arial";
        context.textAlign = 'center';
        context.fillStyle = this.textColor;
        context.fillStyle = "rgba(0, 0, 0, 1.0)";
        rect = function(ctx, x, y, w, h, r) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + w, y);
          ctx.lineTo(x + w, y + h);
          ctx.lineTo(x, y + h);
          ctx.lineTo(x, y);
          ctx.closePath();
          ctx.fill();
          return ctx.stroke();
        };
        if (background) {
          metrics = context.measureText(text);
          textWidth = metrics.width;
          context.fillStyle = "rgba(255, 255, 255, 0.55)";
          context.strokeStyle = "rgba(255,255,255,0.55)";
          rect(context, canvas.width / 2 - fontSize, canvas.height / 2 - fontSize, textWidth + borderThickness, fontSize * 1.4 + borderThickness, 6);
        }
        context.strokeStyle = this.textColor;
        context.strokeText(text, canvas.width / 2, canvas.height / 2);
        texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.5,
          useScreenCoordinates: false,
          scaleByViewport: false,
          color: 0xffffff
        });
        sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(100 * scale, 50 * scale, 1.0);
        return sprite;
      };

      BaseHelper.prototype.drawTextOnPlane = function(text, size) {
        var canvas, context, material, plane, texture;
        if (size == null) {
          size = 256;
        }
        canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        context = canvas.getContext('2d');
        context.font = "18px sans-serif";
        context.textAlign = 'center';
        context.fillStyle = this.textColor;
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        context.strokeStyle = this.textColor;
        context.strokeText(text, canvas.width / 2, canvas.height / 2);
        texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        texture.generateMipmaps = true;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          color: 0xffffff,
          alphaTest: 0.2
        });
        plane = new THREE.Mesh(new THREE.PlaneGeometry(size / 8, size / 8), material);
        plane.doubleSided = true;
        plane.overdraw = true;
        return plane;
      };

      return BaseHelper;

    })(THREE.Object3D);
    Arrow = (function(_super) {
      __extends(Arrow, _super);

      function Arrow(options) {
        var defaults, lineGeometry;
        Arrow.__super__.constructor.call(this, options);
        defaults = {
          direction: new THREE.Vector3(1, 0, 0),
          origin: new THREE.Vector3(0, 0, 0),
          length: 50,
          color: "#FF0000"
        };
        options = merge(defaults, options);
        this.direction = options.direction, this.origin = options.origin, this.length = options.length, this.color = options.color;
        lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(this.origin);
        lineGeometry.vertices.push(this.direction.setLength(this.length));
        this.line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({
          color: this.color
        }));
        this.add(this.line);
        this.arrowHeadRootPosition = this.origin.clone().add(this.direction);
        this.arrowHead = new THREE.Mesh(new THREE.CylinderGeometry(0, 1, 5, 10, 10, false), new THREE.MeshBasicMaterial({
          color: this.color
        }));
        this.arrowHead.position = this.arrowHeadRootPosition;
        this.add(this.arrowHead);
      }

      return Arrow;

    })(BaseHelper);
    LabeledAxes = (function(_super) {
      __extends(LabeledAxes, _super);

      function LabeledAxes(options) {
        this._buildAxes = __bind(this._buildAxes, this);
        var addArrows, addLabels, defaults, fontSize, s, scale;
        LabeledAxes.__super__.constructor.call(this, options);
        defaults = {
          size: 50,
          xColor: "0xFF7700",
          yColor: 0x77FF00,
          zColor: 0x0077FF,
          textColor: "#FFFFFF",
          addLabels: true,
          addArrows: true
        };
        options = merge(defaults, options);
        this.size = options.size, this.xColor = options.xColor, this.yColor = options.yColor, this.zColor = options.zColor, this.textColor = options.textColor, addLabels = options.addLabels, addArrows = options.addArrows;
        this.xColor = new THREE.Color().setHex(this.xColor);
        this.yColor = new THREE.Color().setHex(this.yColor);
        this.zColor = new THREE.Color().setHex(this.zColor);
        if (addLabels) {
          s = this.size * 1.1;
          fontSize = 18;
          scale = 0.008;
          this.xLabel = this.drawText("X", fontSize, false, scale);
          this.xLabel.position.set(s, 0, 0);
          this.yLabel = this.drawText("Y", fontSize, false, scale);
          this.yLabel.position.set(0, s, 0);
          this.zLabel = this.drawText("Z", fontSize, false, scale);
          this.zLabel.position.set(0, 0, s);
        }
        if (addArrows) {
          s = this.size / 1.25;
          this.xArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), s, this.xColor);
          this.yArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), s, this.yColor);
          this.zArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), s, this.zColor);
          this.add(this.xArrow);
          this.add(this.yArrow);
          this.add(this.zArrow);
        } else {
          this._buildAxes();
        }
        this.add(this.xLabel);
        this.add(this.yLabel);
        this.add(this.zLabel);
        this.name = "axes";
      }

      LabeledAxes.prototype._buildAxes = function() {
        var lineGeometryX, lineGeometryY, lineGeometryZ, xLine, yLine, zLine;
        lineGeometryX = new THREE.Geometry();
        lineGeometryX.vertices.push(new THREE.Vector3(-this.size, 0, 0));
        lineGeometryX.vertices.push(new THREE.Vector3(this.size, 0, 0));
        xLine = new THREE.Line(lineGeometryX, new THREE.LineBasicMaterial({
          color: this.xColor
        }));
        lineGeometryY = new THREE.Geometry();
        lineGeometryY.vertices.push(new THREE.Vector3(0, -this.size, 0));
        lineGeometryY.vertices.push(new THREE.Vector3(0, this.size, 0));
        yLine = new THREE.Line(lineGeometryY, new THREE.LineBasicMaterial({
          color: this.yColor
        }));
        lineGeometryZ = new THREE.Geometry();
        lineGeometryZ.vertices.push(new THREE.Vector3(0, 0, -this.size));
        lineGeometryZ.vertices.push(new THREE.Vector3(0, 0, this.size));
        zLine = new THREE.Line(lineGeometryZ, new THREE.LineBasicMaterial({
          color: this.zColor
        }));
        this.add(xLine);
        this.add(yLine);
        return this.add(zLine);
      };

      return LabeledAxes;

    })(BaseHelper);
    Grid = (function(_super) {
      __extends(Grid, _super);

      function Grid(options) {
        this.updateGridSize = __bind(this.updateGridSize, this);
        this.resize = __bind(this.resize, this);
        this.setTextLocation = __bind(this.setTextLocation, this);
        this.setTextColor = __bind(this.setTextColor, this);
        this.toggleText = __bind(this.toggleText, this);
        this.setColor = __bind(this.setColor, this);
        this.setOpacity = __bind(this.setOpacity, this);
        var defaults;
        Grid.__super__.constructor.call(this, options);
        defaults = {
          size: 1000,
          step: 100,
          color: 0xFFFFFF,
          opacity: 0.1,
          addText: true,
          textColor: "#FFFFFF",
          textLocation: "f",
          rootAssembly: null
        };
        options = merge(defaults, options);
        this.size = options.size, this.step = options.step, this.color = options.color, this.opacity = options.opacity, this.addText = options.addText, this.textColor = options.textColor, this.textLocation = options.textLocation, this.rootAssembly = options.rootAssembly;
        this.name = "grid";
        this._drawGrid();
      }

      Grid.prototype._drawGrid = function() {
        var gridGeometry, gridMaterial, i, mainGridZ, planeFragmentShader, planeGeometry, planeMaterial, subGridGeometry, subGridMaterial, subGridZ, _i, _j, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        mainGridZ = -0.05;
        gridGeometry = new THREE.Geometry();
        gridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.color),
          opacity: this.opacity,
          linewidth: 2,
          transparent: true
        });
        for (i = _i = _ref = -this.size / 2, _ref1 = this.size / 2, _ref2 = this.step; _ref2 > 0 ? _i <= _ref1 : _i >= _ref1; i = _i += _ref2) {
          gridGeometry.vertices.push(new THREE.Vector3(-this.size / 2, i, mainGridZ));
          gridGeometry.vertices.push(new THREE.Vector3(this.size / 2, i, mainGridZ));
          gridGeometry.vertices.push(new THREE.Vector3(i, -this.size / 2, mainGridZ));
          gridGeometry.vertices.push(new THREE.Vector3(i, this.size / 2, mainGridZ));
        }
        this.mainGrid = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);
        subGridZ = -0.05;
        subGridGeometry = new THREE.Geometry();
        subGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.color),
          opacity: this.opacity / 2,
          transparent: true
        });
        for (i = _j = _ref3 = -this.size / 2, _ref4 = this.size / 2, _ref5 = this.step / 10; _ref5 > 0 ? _j <= _ref4 : _j >= _ref4; i = _j += _ref5) {
          subGridGeometry.vertices.push(new THREE.Vector3(-this.size / 2, i, subGridZ));
          subGridGeometry.vertices.push(new THREE.Vector3(this.size / 2, i, subGridZ));
          subGridGeometry.vertices.push(new THREE.Vector3(i, -this.size / 2, subGridZ));
          subGridGeometry.vertices.push(new THREE.Vector3(i, this.size / 2, subGridZ));
        }
        this.subGrid = new THREE.Line(subGridGeometry, subGridMaterial, THREE.LinePieces);
        planeGeometry = new THREE.PlaneGeometry(-this.size, this.size, 5, 5);
        planeFragmentShader = ["uniform vec3 diffuse;", "uniform float opacity;", THREE.ShaderChunk["color_pars_fragment"], THREE.ShaderChunk["map_pars_fragment"], THREE.ShaderChunk["lightmap_pars_fragment"], THREE.ShaderChunk["envmap_pars_fragment"], THREE.ShaderChunk["fog_pars_fragment"], THREE.ShaderChunk["shadowmap_pars_fragment"], THREE.ShaderChunk["specularmap_pars_fragment"], "void main() {", "gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );", THREE.ShaderChunk["map_fragment"], THREE.ShaderChunk["alphatest_fragment"], THREE.ShaderChunk["specularmap_fragment"], THREE.ShaderChunk["lightmap_fragment"], THREE.ShaderChunk["color_fragment"], THREE.ShaderChunk["envmap_fragment"], THREE.ShaderChunk["shadowmap_fragment"], THREE.ShaderChunk["linear_to_gamma_fragment"], THREE.ShaderChunk["fog_fragment"], "gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 - shadowColor.x );", "}"].join("\n");
        planeMaterial = new THREE.ShaderMaterial({
          uniforms: THREE.ShaderLib['basic'].uniforms,
          vertexShader: THREE.ShaderLib['basic'].vertexShader,
          fragmentShader: planeFragmentShader,
          color: 0x0000FF,
          transparent: true
        });
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.rotation.x = Math.PI;
        this.plane.position.z = -0.3;
        this.plane.name = "workplane";
        this.plane.receiveShadow = true;
        this.add(this.mainGrid);
        this.add(this.subGrid);
        this.add(this.plane);
        return this._drawNumbering();
      };

      Grid.prototype._drawNumbering = function() {
        var i, label, sizeLabel, sizeLabel2, xLabelsLeft, xLabelsRight, yLabelsBack, yLabelsFront, _i, _j, _len, _ref, _ref1, _ref2, _ref3;
        if (this.labels != null) {
          this.mainGrid.remove(this.labels);
        }
        this.labels = new THREE.Object3D();
        xLabelsLeft = new THREE.Object3D();
        yLabelsFront = new THREE.Object3D();
        for (i = _i = _ref = -this.size / 2, _ref1 = this.size / 2, _ref2 = this.step; _ref2 > 0 ? _i <= _ref1 : _i >= _ref1; i = _i += _ref2) {
          sizeLabel = this.drawTextOnPlane("" + i, 32);
          sizeLabel2 = sizeLabel.clone();
          sizeLabel.rotation.z = Math.PI / 2;
          sizeLabel.position.set(i, this.size / 2, 0.1);
          xLabelsLeft.add(sizeLabel);
          if (this.textLocation === "center") {
            if (i !== 0) {
              sizeLabel2.position.set(this.size / 2, i, 0.1);
              sizeLabel2.rotation.z = Math.PI / 2;
              yLabelsFront.add(sizeLabel2);
            }
          } else {
            if (i !== this.size / 2 && i !== -this.size / 2) {
              sizeLabel2.position.set(this.size / 2, i, 0.1);
              sizeLabel2.rotation.z = Math.PI / 2;
              yLabelsFront.add(sizeLabel2);
            }
          }
        }
        if (this.textLocation === "center") {
          xLabelsLeft.translateY(-this.size / 2);
          yLabelsFront.translateX(-this.size / 2);
        } else {
          xLabelsRight = xLabelsLeft.clone().translateY(-this.size);
          yLabelsBack = yLabelsFront.clone().translateX(-this.size);
          this.labels.add(xLabelsRight);
          this.labels.add(yLabelsBack);
        }
        this.labels.add(xLabelsLeft);
        this.labels.add(yLabelsFront);
        _ref3 = this.labels.children;
        for (_j = 0, _len = _ref3.length; _j < _len; _j++) {
          label = _ref3[_j];
          label.visible = this.addText;
        }
        return this.mainGrid.add(this.labels);
      };

      Grid.prototype.setOpacity = function(opacity) {
        this.opacity = opacity;
        this.mainGrid.material.opacity = opacity;
        return this.subGrid.material.opacity = opacity;
      };

      Grid.prototype.setColor = function(color) {
        this.color = color;
        this.mainGrid.material.color = new THREE.Color().setHex(this.color);
        return this.subGrid.material.color = new THREE.Color().setHex(this.color);
      };

      Grid.prototype.toggleText = function(toggle) {
        var label, _i, _len, _ref, _results;
        this.addText = toggle;
        _ref = this.labels.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          label = _ref[_i];
          _results.push(label.visible = toggle);
        }
        return _results;
      };

      Grid.prototype.setTextColor = function(color) {
        this.textColor = color;
        return this._drawNumbering();
      };

      Grid.prototype.setTextLocation = function(location) {
        this.textLocation = location;
        return this._drawNumbering();
      };

      Grid.prototype.resize = function(size) {
        if (size !== this.size) {
          this.size = size;
          this.remove(this.mainGrid);
          this.remove(this.subGrid);
          this.remove(this.plane);
          return this._drawGrid();
        }
      };

      Grid.prototype.updateGridSize = function() {
        var max, maxX, maxY, min, minX, minY, size, subchild, _getBounds, _i, _len, _ref;
        minX = 99999;
        maxX = -99999;
        minY = 99999;
        maxY = -99999;
        _getBounds = (function(_this) {
          return function(mesh) {
            var bBox, subchild, _i, _len, _ref, _results;
            if (mesh instanceof THREE.Mesh) {
              mesh.geometry.computeBoundingBox();
              bBox = mesh.geometry.boundingBox;
              minX = Math.min(minX, bBox.min.x);
              maxX = Math.max(maxX, bBox.max.x);
              minY = Math.min(minY, bBox.min.y);
              maxY = Math.max(maxY, bBox.max.y);
              _ref = mesh.children;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                subchild = _ref[_i];
                _results.push(_getBounds(subchild));
              }
              return _results;
            }
          };
        })(this);
        if (this.rootAssembly != null) {
          _ref = this.rootAssembly.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            subchild = _ref[_i];
            if (subchild.name !== "renderSubs" && subchild.name !== "connectors") {
              _getBounds(subchild);
            }
          }
        }
        max = Math.max(Math.max(maxX, maxY), 100);
        min = Math.min(Math.min(minX, minY), -100);
        size = (Math.max(max, Math.abs(min))) * 2;
        size = Math.ceil(size / 10) * 10;
        if (size >= 200) {
          return this.resize(size);
        }
      };

      return Grid;

    })(BaseHelper);
    BoundingCage = (function(_super) {
      __extends(BoundingCage, _super);

      function BoundingCage(options) {
        var baseCubeGeom, baseOutline, bbox, cage, cageGeo, color, dashMaterial, defaults, delta, error, forceOverlay, height, heightArrow1, heightArrow2, heightArrowPos, heightLabel, heightLine, heightLine2, heightLineGeometry, heightLineGeometry2, labelSize, length, lengthArrow1, lengthArrow2, lengthArrowPos, lengthLabel, lengthLine, lengthLine2, lengthLineGeometry, lengthLineGeometry2, lineMat, mesh, middlePoint, v, width, widthArrow1, widthArrow2, widthArrowPos, widthLabel, widthLine, widthLine2, widthLineGeometry, widthLineGeometry2;
        BoundingCage.__super__.constructor.call(this, options);
        defaults = {
          mesh: null,
          color: 0xFFFFFF,
          textColor: "#FFFFFF",
          addLabels: true
        };
        options = merge(defaults, options);
        mesh = options.mesh, this.color = options.color, this.textColor = options.textColor, this.addLabels = options.addLabels;
        color = new THREE.Color().setHex(this.color);
        try {
          if (!mesh.geometry.boundingBox) {
            mesh.geometry.computeBoundingBox();
          }
          bbox = mesh.geometry.boundingBox;
          length = bbox.max.x - bbox.min.x;
          width = bbox.max.y - bbox.min.y;
          height = bbox.max.z - bbox.min.z;
          cageGeo = new THREE.CubeGeometry(length, width, height);
          v = function(x, y, z) {
            return new THREE.Vector3(x, y, z);
          };

          /*lineMat = new THREE.LineBasicMaterial
            color: helpersColor
            lineWidth: 2
           */
          lineMat = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            shading: THREE.FlatShading
          });
          cage = new THREE.Object3D();
          middlePoint = function(geometry) {
            var middle;
            middle = new THREE.Vector3();
            middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
            middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
            middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
            return middle;
          };
          delta = middlePoint(mesh.geometry);
          cage.position = delta;
          widthArrowPos = new THREE.Vector3(length / 2 + 10, 0, -height / 2);
          lengthArrowPos = new THREE.Vector3(0, width / 2 + 10, -height / 2);
          heightArrowPos = new THREE.Vector3(-length / 2 - 5, -width / 2 - 5, 0);
          if (this.addLabels) {
            labelSize = 24;
            widthLabel = this.drawText("" + (width.toFixed(2)), labelSize);
            widthLabel.position = widthArrowPos;
            lengthLabel = this.drawText("" + (length.toFixed(2)), labelSize);
            lengthLabel.position = lengthArrowPos;
            heightLabel = this.drawText("" + (height.toFixed(2)), labelSize);
            heightLabel.position = heightArrowPos;
            cage.add(widthLabel);
            cage.add(lengthLabel);
            cage.add(heightLabel);
            widthLabel.material.depthTest = false;
            widthLabel.material.depthWrite = false;
            widthLabel.material.side = THREE.FrontSide;
            lengthLabel.material.depthTest = false;
            lengthLabel.material.depthWrite = false;
            lengthLabel.material.side = THREE.FrontSide;
            heightLabel.material.depthTest = false;
            heightLabel.material.depthWrite = false;
            heightLabel.material.side = THREE.FrontSide;
          }
          forceOverlay = (function(_this) {
            return function(arrows, sideLines) {
              var arrow, line, _i, _j, _len, _len1, _results;
              for (_i = 0, _len = arrows.length; _i < _len; _i++) {
                arrow = arrows[_i];
                arrow.cone.material.side = THREE.FrontSide;
                arrow.line.material.side = THREE.FrontSide;
                arrow.line.material.depthTest = false;
                arrow.cone.material.depthTest = false;
                arrow.line.renderDepth = 1e20;
                arrow.cone.renderDepth = 1e20;
              }
              _results = [];
              for (_j = 0, _len1 = sideLines.length; _j < _len1; _j++) {
                line = sideLines[_j];
                line.material.side = THREE.FrontSide;
                line.material.depthTest = false;
                _results.push(line.renderDepth = 1e20);
              }
              return _results;
            };
          })(this);
          require('ArrowHelper2');
          widthArrow1 = new THREE.ArrowHelper2(new THREE.Vector3(0, -1, 0), widthArrowPos, width / 2, 0x000000);
          widthArrow2 = new THREE.ArrowHelper2(new THREE.Vector3(0, 1, 0), widthArrowPos, width / 2, 0x000000);
          widthLineGeometry = new THREE.Geometry();
          widthLineGeometry.vertices.push(new THREE.Vector3(length / 2, width / 2, -height / 2));
          widthLineGeometry.vertices.push(new THREE.Vector3(length / 2 + 10, width / 2, -height / 2));
          widthLine = new THREE.Line(widthLineGeometry, new THREE.LineBasicMaterial({
            color: 0x000000,
            depthTest: false,
            depthWrite: false,
            renderDepth: 1e20
          }));
          cage.add(widthLine);
          widthLineGeometry2 = new THREE.Geometry();
          widthLineGeometry2.vertices.push(new THREE.Vector3(length / 2, -width / 2, -height / 2));
          widthLineGeometry2.vertices.push(new THREE.Vector3(length / 2 + 10, -width / 2, -height / 2));
          widthLine2 = new THREE.Line(widthLineGeometry2, new THREE.LineBasicMaterial({
            color: 0x000000
          }));
          cage.add(widthLine2);
          forceOverlay([widthArrow1, widthArrow2], [widthLine, widthLine2]);
          lengthArrow1 = new THREE.ArrowHelper2(new THREE.Vector3(1, 0, 0), lengthArrowPos, length / 2, 0x000000);
          lengthArrow2 = new THREE.ArrowHelper2(new THREE.Vector3(-1, 0, 0), lengthArrowPos, length / 2, 0x000000);
          lengthLineGeometry = new THREE.Geometry();
          lengthLineGeometry.vertices.push(new THREE.Vector3(length / 2, width / 2, -height / 2));
          lengthLineGeometry.vertices.push(new THREE.Vector3(length / 2, width / 2 + 10, -height / 2));
          lengthLine = new THREE.Line(lengthLineGeometry, new THREE.LineBasicMaterial({
            color: 0x000000
          }));
          cage.add(lengthLine);
          lengthLineGeometry2 = new THREE.Geometry();
          lengthLineGeometry2.vertices.push(new THREE.Vector3(-length / 2, width / 2, -height / 2));
          lengthLineGeometry2.vertices.push(new THREE.Vector3(-length / 2, width / 2 + 10, -height / 2));
          lengthLine2 = new THREE.Line(lengthLineGeometry2, new THREE.LineBasicMaterial({
            color: 0x000000
          }));
          cage.add(lengthLine2);
          forceOverlay([lengthArrow1, lengthArrow2], [lengthLine, lengthLine2]);
          heightArrow1 = new THREE.ArrowHelper2(new THREE.Vector3(0, 0, 1), heightArrowPos, height / 2, 0x000000);
          heightArrow2 = new THREE.ArrowHelper2(new THREE.Vector3(0, 0, -1), heightArrowPos, height / 2, 0x000000);
          heightLineGeometry = new THREE.Geometry();
          heightLineGeometry.vertices.push(new THREE.Vector3(-length / 2, -width / 2, -height / 2));
          heightLineGeometry.vertices.push(new THREE.Vector3(-length / 2 - 5, -width / 2 - 5, -height / 2));
          heightLine = new THREE.Line(heightLineGeometry, new THREE.LineBasicMaterial({
            color: 0x000000
          }));
          heightLineGeometry2 = new THREE.Geometry();
          heightLineGeometry2.vertices.push(new THREE.Vector3(-length / 2, -width / 2, height / 2));
          heightLineGeometry2.vertices.push(new THREE.Vector3(-length / 2 - 5, -width / 2 - 5, height / 2));
          heightLine2 = new THREE.Line(heightLineGeometry2, new THREE.LineBasicMaterial({
            color: 0x000000
          }));
          forceOverlay([heightArrow1, heightArrow2], [heightLine, heightLine2]);
          cage.add(heightLine);
          cage.add(heightLine2);

          /*
          selectionAxis = new THREE.AxisHelper(Math.min(width,length, height))
          selectionAxis.material.depthTest = false
          selectionAxis.material.transparent = true
          selectionAxis.position = mesh.position
           */
          dashMaterial = new THREE.LineDashedMaterial({
            color: 0x000000,
            dashSize: 0.5,
            gapSize: 2,
            depthTest: false,
            linewidth: 2
          });
          baseCubeGeom = new THREE.CubeGeometry(length, width, 0);
          baseOutline = new THREE.Line(geometryToline(baseCubeGeom.clone()), dashMaterial, THREE.LinePieces);
          baseOutline.renderDepth = 1e20;
          baseOutline.position = new THREE.Vector3(delta.x, delta.y, -delta.z);
          cage.add(baseOutline);
          cage.name = "boundingCage";
          cage.add(widthArrow1);
          cage.add(widthArrow2);
          cage.add(lengthArrow1);
          cage.add(lengthArrow2);
          cage.add(heightArrow1);
          cage.add(heightArrow2);
          mesh.cage = cage;
          mesh.add(cage);
          computeVolume(mesh);
        } catch (_error) {
          error = _error;
        }
      }

      return BoundingCage;

    })(BaseHelper);
    SelectionHelper = (function(_super) {
      __extends(SelectionHelper, _super);

      function SelectionHelper(options) {
        this.highlightObjectAt = __bind(this.highlightObjectAt, this);
        this.selectObjectAt = __bind(this.selectObjectAt, this);
        this.isThereObjectAt = __bind(this.isThereObjectAt, this);
        this.get2DBB = __bind(this.get2DBB, this);
        this.getScreenCoords = __bind(this.getScreenCoords, this);
        this._get3DBB = __bind(this._get3DBB, this);
        this._unSelect = __bind(this._unSelect, this);
        this._onSelect = __bind(this._onSelect, this);
        this._unHover = __bind(this._unHover, this);
        this._onHover = __bind(this._onHover, this);
        var defaults;
        SelectionHelper.__super__.constructor.call(this, options);
        defaults = {
          hiearchyRoot: null,
          camera: null,
          viewWidth: 640,
          viewHeight: 480
        };
        options = merge(defaults, options);
        this.hiearchyRoot = options.hiearchyRoot, this.camera = options.camera, this.viewWidth = options.viewWidth, this.viewHeight = options.viewHeight;
        this.options = options;
        this.currentHover = null;
        this.currentSelect = null;
        this.selectionColor = 0xfffccc;
        this.projector = new THREE.Projector();
        this.addEventListener = THREE.EventDispatcher.prototype.addEventListener;
        this.hasEventListener = THREE.EventDispatcher.prototype.hasEventListener;
        this.removeEventListener = THREE.EventDispatcher.prototype.removeEventListener;
        this.dispatchEvent = THREE.EventDispatcher.prototype.dispatchEvent;
      }

      SelectionHelper.prototype._onHover = function(selection) {
        var outline, outlineMaterial;
        if (selection != null) {
          this.currentHover = selection;
          if (!(selection.hoverOutline != null) && !(selection.outline != null) && !(selection.name === "hoverOutline") && !(selection.name === "boundingCage") && !(selection.name === "selectOutline")) {
            selection.currentHoverHex = selection.material.color.getHex();
            selection.material.color.setHex(this.selectionColor);
            outlineMaterial = new THREE.MeshBasicMaterial({
              color: 0xffc200,
              side: THREE.BackSide
            });
            outline = new THREE.Mesh(selection.geometry.clone(), outlineMaterial);
            outline.scale.multiplyScalar(1.03);
            outline.name = "hoverOutline";
            selection.hoverOutline = outline;
            selection.add(outline);
          }
          return this.dispatchEvent({
            type: 'hoverIn',
            selection: selection
          });
        }
      };

      SelectionHelper.prototype._unHover = function() {
        if (this.currentHover) {
          if (this.currentHover.hoverOutline != null) {
            this.currentHover.material.color.setHex(this.currentHover.currentHoverHex);
            this.currentHover.remove(this.currentHover.hoverOutline);
            this.currentHover.hoverOutline = null;
          }
          this.currentHover = null;
          return this.dispatchEvent({
            type: 'hoverOut',
            selection: this.currentHover
          });
        }
      };

      SelectionHelper.prototype._onSelect = function(selection) {
        var outline, outlineMaterial;
        this._unHover();
        this.currentSelect = selection;
        new BoundingCage({
          mesh: selection,
          color: this.options.color,
          textColor: this.options.textColor
        });
        outlineMaterial = new THREE.MeshBasicMaterial({
          color: 0xffc200,
          side: THREE.BackSide
        });
        outline = new THREE.Mesh(selection.geometry.clone(), outlineMaterial);
        outline.name = "selectOutline";
        outline.scale.multiplyScalar(1.03);
        selection.outline = outline;
        selection.add(outline);
        return this.dispatchEvent({
          type: 'selected',
          selection: selection
        });
      };

      SelectionHelper.prototype._unSelect = function() {
        var selection;
        if (this.currentSelect) {
          selection = this.currentSelect;
          selection.remove(selection.cage);
          selection.remove(selection.outline);
          selection.cage = null;
          selection.outline = null;
          this.currentSelect = null;
          return this.dispatchEvent({
            type: 'unselected',
            selection: selection
          });
        }

        /*
              newMat = new  THREE.MeshLambertMaterial
                  color: 0xCC0000
              @currentHover.origMaterial = @currentHover.material
              @currentHover.material = newMat
         */
      };

      SelectionHelper.prototype._get3DBB = function(object) {
        if (object != null) {
          if (object.geometry != null) {
            if (object.geometry.boundingBox != null) {
              return object.geometry.boundingBox;
            } else {
              object.geometry.computeBoundingBox();
              return object.geometry.boundingBox;
            }
          }
        }
        return null;
      };

      SelectionHelper.prototype.getScreenCoords = function(object, width, height) {
        var result, vector;
        if (object != null) {
          vector = this.projector.projectVector(object.position.clone(), this.camera);
          result = new THREE.Vector2();
          result.x = Math.round(vector.x * (width / 2)) + width / 2;
          result.y = Math.round((0 - vector.y) * (height / 2)) + height / 2;
          return result;
        }
      };

      SelectionHelper.prototype.get2DBB = function(object, width, height) {
        var bbox3d, centerLeft, centerPercX, centerPercY, centerTop, max3d, maxLeft, maxPercX, maxPercY, maxTop, min3d, minLeft, minPercX, minPercY, minTop, objHeight, objLength, objWidth, pMax, pMin, pos, result;
        if (object != null) {
          bbox3d = this._get3DBB(object);
          min3d = bbox3d.min.clone();
          max3d = bbox3d.max.clone();
          objLength = bbox3d.max.x - bbox3d.min.x;
          objWidth = bbox3d.max.y - bbox3d.min.y;
          objHeight = bbox3d.max.z - bbox3d.min.z;
          pMin = this.projector.projectVector(min3d, this.camera);
          pMax = this.projector.projectVector(max3d, this.camera);
          minPercX = (pMin.x + 1) / 2;
          minPercY = (-pMin.y + 1) / 2;
          minLeft = minPercX * width;
          minTop = minPercY * height;
          maxPercX = (pMax.x + 1) / 2;
          maxPercY = (-pMax.y + 1) / 2;
          maxLeft = maxPercX * width;
          maxTop = maxPercY * height;
          pos = object.position.clone();
          pos = this.projector.projectVector(pos, this.camera);
          centerPercX = (pos.x + 1) / 2;
          centerPercY = (-pos.y + 1) / 2;
          centerLeft = centerPercX * width;
          centerTop = centerPercY * height;
          result = [centerLeft, centerTop, objLength, objWidth, objHeight];
          return result;
        }
      };

      SelectionHelper.prototype.isThereObjectAt = function(x, y) {
        var intersects, raycaster, v;
        v = new THREE.Vector3((x / this.viewWidth) * 2 - 1, -(y / this.viewHeight) * 2 + 1, 0.5);
        this.projector.unprojectVector(v, this.camera);
        raycaster = new THREE.Raycaster(this.camera.position, v.sub(this.camera.position).normalize());
        intersects = raycaster.intersectObjects(this.hiearchyRoot, true);
        if (intersects.length > 0) {
          return true;
        }
        return false;
      };

      SelectionHelper.prototype.selectObjectAt = function(x, y) {
        var intersects, raycaster, v;
        v = new THREE.Vector3((x / this.viewWidth) * 2 - 1, -(y / this.viewHeight) * 2 + 1, 0.5);
        this.projector.unprojectVector(v, this.camera);
        raycaster = new THREE.Raycaster(this.camera.position, v.sub(this.camera.position).normalize());
        intersects = raycaster.intersectObjects(this.hiearchyRoot, true);
        if (intersects.length > 0) {
          if (intersects[0].object !== this.currentSelect) {
            this._unSelect();
            this._onSelect(intersects[0].object);
            return this.currentSelect;
          }
        } else if (this.currentSelect != null) {
          return this.currentSelect;
        } else {
          return this._unSelect();
        }
      };

      SelectionHelper.prototype.highlightObjectAt = function(x, y) {
        var intersects, raycaster, v;
        v = new THREE.Vector3((x / this.viewWidth) * 2 - 1, -(y / this.viewHeight) * 2 + 1, 0.5);
        this.projector.unprojectVector(v, this.camera);
        raycaster = new THREE.Raycaster(this.camera.position, v.sub(this.camera.position).normalize());
        intersects = raycaster.intersectObjects(this.hiearchyRoot, true);
        if (intersects.length > 0) {
          if (intersects[0].object !== this.currentHover) {
            if (intersects[0].object.name !== "workplane") {
              this._unHover();
              return this._onHover(intersects[0].object);
            }
          }
        } else {
          return this._unHover();
        }
      };

      return SelectionHelper;

    })(BaseHelper);
    captureScreen = function(domElement, width, height) {
      var d, srcImg, _aspectResize;
      if (width == null) {
        width = 600;
      }
      if (height == null) {
        height = 600;
      }
      if (!domElement) {
        throw new Error("Cannot Do screeshot without canvas domElement");
      }
      srcImg = domElement.toDataURL("image/png");
      d = $.Deferred();
      _aspectResize = (function(_this) {
        return function(srcUrl, dstW, dstH) {

          /* 
          resize an image to another resolution while preserving aspect
               
          @param {String} srcUrl the url of the image to resize
          @param {Number} dstWidth the destination width of the image
          @param {Number} dstHeight the destination height of the image
          @param {Number} callback the callback to notify once completed with callback(newImageUrl)
           */
          var cpuScaleAspect, img, onLoad;
          cpuScaleAspect = function(maxW, maxH, curW, curH) {
            var ratio;
            ratio = curH / curW;
            if (curW >= maxW && ratio <= 1) {
              curW = maxW;
              curH = maxW * ratio;
            } else if (curH >= maxH) {
              curH = maxH;
              curW = maxH / ratio;
            }
            return {
              width: curW,
              height: curH
            };
          };
          onLoad = function() {
            var canvas, ctx, mimetype, newDataUrl, offsetX, offsetY, scaled;
            canvas = document.createElement('canvas');
            canvas.width = dstW;
            canvas.height = dstH;
            ctx = canvas.getContext('2d');
            scaled = cpuScaleAspect(canvas.width, canvas.height, img.width, img.height);
            offsetX = (canvas.width - scaled.width) / 2;
            offsetY = (canvas.height - scaled.height) / 2;
            ctx.drawImage(img, offsetX, offsetY, scaled.width, scaled.height);
            mimetype = "image/png";
            newDataUrl = canvas.toDataURL(mimetype);
            return d.resolve(newDataUrl);
          };
          img = new Image();
          img.onload = onLoad;

          /*.onload = ()=> 
            ctx.drawImage(img, 0,0,width, height)
            imgAsDataURL = canvas.toDataURL("image/png")
            d.resolve(imgAsDataURL)
           */
          return img.src = srcUrl;
        };
      })(this);
      _aspectResize(srcImg, width, height);
      return d;
    };
    geometryToline = function(geo) {
      var a, b, c, d, face, geometry, i, vertices, _i, _ref;
      geometry = new THREE.Geometry();
      vertices = geometry.vertices;
      for (i = _i = 0, _ref = geo.faces.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        face = geo.faces[i];
        if (face instanceof THREE.Face3) {
          a = geo.vertices[face.a].clone();
          b = geo.vertices[face.b].clone();
          c = geo.vertices[face.c].clone();
          vertices.push(a, b, b, c, c, a);
        } else if (face instanceof THREE.Face4) {
          a = geo.vertices[face.a].clone();
          b = geo.vertices[face.b].clone();
          c = geo.vertices[face.c].clone();
          d = geo.vertices[face.d].clone();
          vertices.push(a, b, b, c, c, d, d, a);
        }
      }
      geometry.computeLineDistances();
      return geometry;
    };
    computeVolume = function(mesh) {
      var a, b, c, face, geometry, pv, pv1, pv2, volume, _i, _len, _ref;
      geometry = null;
      if (mesh instanceof THREE.Mesh) {
        geometry = mesh.geometry;
      } else if (mesh instanceof THREE.Geometry) {
        geometry = mesh;
      } else {
        throw "Please provide either a mesh or a geometry for volume calculation";
      }
      if (!(mesh.volume != null)) {
        console.log("Computing Volume");
        volume = 0;
        _ref = geometry.faces;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          face = _ref[_i];
          if (face instanceof THREE.Face4) {
            a = geometry.vertices[face.a];
            b = geometry.vertices[face.b];
            c = geometry.vertices[face.c];
            pv1 = a.x * b.y * c.z + a.y * b.z * c.x + a.z * b.x * c.y - a.x * b.z * c.y - a.y * b.x * c.z - a.z * b.y * c.x;
            a = geometry.vertices[face.a];
            b = geometry.vertices[face.c];
            c = geometry.vertices[face.d];
            pv2 = a.x * b.y * c.z + a.y * b.z * c.x + a.z * b.x * c.y - a.x * b.z * c.y - a.y * b.x * c.z - a.z * b.y * c.x;
            volume += pv1 + pv2;
          } else if (face instanceof THREE.Face3) {
            a = geometry.vertices[face.a];
            b = geometry.vertices[face.b];
            c = geometry.vertices[face.c];
            pv = a.x * b.y * c.z + a.y * b.z * c.x + a.z * b.x * c.y - a.x * b.z * c.y - a.y * b.x * c.z - a.z * b.y * c.x;
            volume += pv;
          }
        }
        volume = volume / 6;
        mesh.volume = volume;
      } else {
        volume = mesh.volume;
      }
      console.log("volume is: " + volume);
      return volume;
    };
    toggleHelpers = function(rootAssembly) {
      var child, originalStates, _hideHelpers, _i, _len, _ref;
      originalStates = {};
      _hideHelpers = (function(_this) {
        return function(child, hide) {
          var subchild, _i, _len, _ref, _results;
          if (hide != null) {
            if (hide) {
              originalStates[child] = child.visible;
              child.visible = false;
            }
          } else {
            if (child.name === "boundingCage" || child.name === "grid" || child.name === "hoverOutline" || child.name === "selectOutline" || child.name === "axes") {
              originalStates[child] = child.visible;
              child.visible = false;
              hide = true;
            }
          }
          _ref = child.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            subchild = _ref[_i];
            _results.push(_hideHelpers(subchild, hide));
          }
          return _results;
        };
      })(this);
      if (rootAssembly != null) {
        _ref = rootAssembly.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _hideHelpers(child);
        }
      }
      return originalStates;
    };
    enableHelpers = function(rootAssembly, originalStates) {
      var child, _enableHelpers, _i, _len, _ref, _results;
      _enableHelpers = (function(_this) {
        return function(child) {
          var subchild, _i, _len, _ref, _results;
          if (child in originalStates) {
            child.visible = originalStates[child];
            _ref = child.children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              subchild = _ref[_i];
              _results.push(_enableHelpers(subchild));
            }
            return _results;
          }
        };
      })(this);
      if (rootAssembly != null) {
        _ref = rootAssembly.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(_enableHelpers(child));
        }
        return _results;
      }
    };
    updateVisuals = function(rootAssembly, settings) {
      var applyStyle, child, removeRenderHelpers, _i, _len, _ref, _results;
      console.log("applying visual style to " + rootAssembly);
      removeRenderHelpers = (function(_this) {
        return function(child) {
          if (child.renderSubElementsHelper != null) {
            child.remove(child.renderSubElementsHelper);
            return child.renderSubElementsHelper = null;
          }
        };
      })(this);
      applyStyle = (function(_this) {
        return function(child) {
          var basicMaterial1, dashMaterial, geom, obj2, obj3, obj4, renderSubElementsHelper, subchild, wireFrameMaterial, _i, _len, _ref, _results;
          child.castShadow = settings.shadows;
          child.receiveShadow = settings.selfShadows && settings.shadows;
          if (child.material != null) {
            child.material.vertexColors = THREE.VertexColors;
          }
          switch (settings.objectViewMode) {
            case "shaded":
              removeRenderHelpers(child);
              if (child.material != null) {
                child.material.wireframe = false;
              }
              break;
            case "wireframe":
              removeRenderHelpers(child);
              if (child.material != null) {
                child.material.wireframe = true;
              }
              break;
            case "structural":
              if (child.material != null) {
                child.material.wireframe = false;
              }
              if (child.geometry != null) {
                removeRenderHelpers(child);
                basicMaterial1 = new THREE.MeshBasicMaterial({
                  color: 0xccccdd,
                  side: THREE.DoubleSide,
                  depthTest: true,
                  polygonOffset: true,
                  polygonOffsetFactor: 1,
                  polygonOffsetUnits: 1
                });
                dashMaterial = new THREE.LineDashedMaterial({
                  color: 0x000000,
                  dashSize: 2,
                  gapSize: 3,
                  depthTest: false,
                  polygonOffset: true,
                  polygonOffsetFactor: 1,
                  polygonOffsetUnits: 1
                });
                wireFrameMaterial = new THREE.MeshBasicMaterial({
                  color: 0x000000,
                  depthTest: true,
                  polygonOffset: true,
                  polygonOffsetFactor: 1,
                  polygonOffsetUnits: 1,
                  wireframe: true
                });
                renderSubElementsHelper = new THREE.Object3D();
                renderSubElementsHelper.name = "renderSubs";
                geom = child.geometry;
                obj2 = new THREE.Mesh(geom.clone(), basicMaterial1);
                obj3 = new THREE.Line(geometryToline(geom.clone()), dashMaterial, THREE.LinePieces);
                obj4 = new THREE.Mesh(geom.clone(), wireFrameMaterial);
                renderSubElementsHelper.add(obj2);
                renderSubElementsHelper.add(obj3);
                renderSubElementsHelper.add(obj4);
                child.add(renderSubElementsHelper);
                child.renderSubElementsHelper = renderSubElementsHelper;
              }
          }
          _ref = child.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            subchild = _ref[_i];
            if (subchild.name !== "renderSubs" && subchild.name !== "connectors") {
              _results.push(applyStyle(subchild));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this);
      if (rootAssembly != null) {
        _ref = rootAssembly.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(applyStyle(child));
        }
        return _results;
      }
    };
    return {
      "LabeledAxes": LabeledAxes,
      "Arrow": Arrow,
      "Grid": Grid,
      "BoundingCage": BoundingCage,
      "SelectionHelper": SelectionHelper,
      "captureScreen": captureScreen,
      "geometryToline": geometryToline,
      "toggleHelpers": toggleHelpers,
      "enableHelpers": enableHelpers,
      "updateVisuals": updateVisuals
    };
  });

}).call(this);
