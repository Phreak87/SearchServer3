(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, CustomOrbitControls, ObjectExport, ObjectParser, OrbitControls, RenderManager, Shaders, THREE, VisualEditorView, combo_cam, detector, dndMixin, helpers, includeMixin, marionette, reqRes, requestAnimationFrame, stats, threedView_template, transformControls, utils, vent;
    $ = require('jquery');
    marionette = require('marionette');
    require('bootstrap');
    THREE = require('three');
    combo_cam = require('combo_cam');
    detector = require('detector');
    stats = require('stats');
    utils = require('utils');
    reqRes = require('core/messaging/appReqRes');
    vent = require('core/messaging/appVent');
    require('backbone_mousetrap');
    OrbitControls = require('OrbitControls');
    CustomOrbitControls = require('./controls/customOrbitControls');
    transformControls = require('transformControls');
    Shaders = require('./shaders/shaders');
    helpers = require('./helpers');
    RenderManager = require('RenderManager');
    ObjectExport = require('ObjectExport');
    ObjectParser = require('ObjectParser');
    threedView_template = require("text!./visualEditorView.tmpl");
    requestAnimationFrame = require('core/utils/anim');
    THREE.CSG = require('core/projects/csg/csg.Three');
    includeMixin = require('core/utils/mixins/mixins');
    dndMixin = require('core/utils/mixins/dragAndDropRecieverMixin');

    /*
       keyboardEvents: 
        'command+shift+t': 'totoPouet'
        'control+shift+t': 'totoPouet'
        'control+t': 'totoPouet'
        'control+e': 'totoPouet'
        'shift+e': 'totoPouet'
        'ctrl+s': 'totoPouet'
     */
    VisualEditorView = (function(_super) {
      __extends(VisualEditorView, _super);

      VisualEditorView.prototype.el = $("#visual");

      VisualEditorView.include(dndMixin);

      VisualEditorView.prototype.template = threedView_template;

      VisualEditorView.prototype.ui = {
        renderBlock: "#glArea",
        glOverlayBlock: "#glOverlay",
        overlayDiv: "#overlay"
      };

      VisualEditorView.prototype.events = {
        "mousedown": "_onSelectAttempt",
        "contextmenu": "_onRightclick",
        "mousemove": "_onMouseMove",
        "resize:stop": "onResizeStop",
        "resize": "onResizeStop",
        "mousedown .switchProjection": "switchProjection",
        "mousedown .toggleGrid": "toggleGrid",
        "mousedown .toggleAxes": "toggleAxes",
        "mousedown .toggleAutoRotate": "toggleAutoRotate",
        "mousedown .toggleOutlines": "toggleOutlines",
        "mousedown .switchViewType": "switchViewType"
      };

      VisualEditorView.prototype.totoPouet = function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
        return console.log("oh yeah , keyboard");
      };

      function VisualEditorView(options, settings) {
        this._importGeom = __bind(this._importGeom, this);
        this.fromCsg = __bind(this.fromCsg, this);
        this.animate = __bind(this.animate, this);
        this._renderOverlay = __bind(this._renderOverlay, this);
        this._render = __bind(this._render, this);
        this.onDomRefresh = __bind(this.onDomRefresh, this);
        this.onResizeStop = __bind(this.onResizeStop, this);
        this.onResize = __bind(this.onResize, this);
        this._computeViewSize = __bind(this._computeViewSize, this);
        this.removeGrid = __bind(this.removeGrid, this);
        this.addGrid = __bind(this.addGrid, this);
        this.setBgColor = __bind(this.setBgColor, this);
        this._onProjectCompileFailed = __bind(this._onProjectCompileFailed, this);
        this._onProjectCompiled = __bind(this._onProjectCompiled, this);
        this.switchViewType = __bind(this.switchViewType, this);
        this.toggleOutlines = __bind(this.toggleOutlines, this);
        this.toggleAutoRotate = __bind(this.toggleAutoRotate, this);
        this.toggleAxes = __bind(this.toggleAxes, this);
        this.toggleGrid = __bind(this.toggleGrid, this);
        this._onControlsChange = __bind(this._onControlsChange, this);
        this._onRightclick = __bind(this._onRightclick, this);
        this._onSelectAttempt = __bind(this._onSelectAttempt, this);
        this.onObjectHover = __bind(this.onObjectHover, this);
        this.onObjectUnSelected = __bind(this.onObjectUnSelected, this);
        this.onObjectSelected = __bind(this.onObjectSelected, this);
        this.makeScreenshot = __bind(this.makeScreenshot, this);
        this.blablabla = __bind(this.blablabla, this);
        this.reloadAssembly = __bind(this.reloadAssembly, this);
        this.settingsChanged = __bind(this.settingsChanged, this);
        this._setupEventBindings = __bind(this._setupEventBindings, this);
        this.setupView = __bind(this.setupView, this);
        this.setupContextMenu = __bind(this.setupContextMenu, this);
        this.setupPostProcess = __bind(this.setupPostProcess, this);
        this.setupRenderers = __bind(this.setupRenderers, this);
        this.init = __bind(this.init, this);
        VisualEditorView.__super__.constructor.call(this, options);
        this.vent = vent;
        this.settings = options.settings;
        this.settings.on("change", this.settingsChanged);
        this._setupEventBindings();
        reqRes.addHandler("project:getScreenshot", (function(_this) {
          return function() {
            return _this.makeScreenshot();
          };
        })(this));
        this.renderer = null;
        this.overlayRenderer = null;
        this.selectionHelper = null;
        this.defaultCameraPosition = new THREE.Vector3(100, 100, 200);
        this.width = 320;
        this.height = 240;
        this.resUpscaler = 1;
        this.dpr = 1;
        this.hRes = 320;
        this.vRes = 240;
        this.noControlChange = false;
        this.stats = new stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '30px';
        this.stats.domElement.style.zIndex = 100;
      }

      VisualEditorView.prototype.init = function() {
        this.renderManager = new THREE.Extras.RenderManager(this.renderer);
        this.setupRenderers(this.settings);
        this.setupScenes();
        this.setupPostProcess();
        this.selectionHelper = new helpers.SelectionHelper({
          camera: this.camera,
          color: 0x000000,
          textColor: this.settings.textColor
        });
        this.selectionHelper.addEventListener('selected', this.onObjectSelected);
        this.selectionHelper.addEventListener('unselected', this.onObjectUnSelected);
        this.selectionHelper.addEventListener('hoverIn', this.onObjectHover);
        this.selectionHelper.addEventListener('hoverOut', this.onObjectHover);
        if (this.settings.shadows) {
          this.renderer.shadowMapAutoUpdate = this.settings.shadows;
        }
        if (this.settings.showGrid) {
          this.addGrid();
        }
        if (this.settings.showAxes) {
          this.addAxes();
        }
        this.setBgColor();
        return this.setupView(this.settings.position);
      };

      VisualEditorView.prototype.setupRenderers = function(settings) {
        var getValidRenderer, renderer;
        getValidRenderer = function(settings) {
          var renderer;
          renderer = settings.renderer;
          if (!detector.webgl && !detector.canvas) {
            throw new Error("No Webgl and no canvas (fallback) support, cannot render");
          }
          if (renderer === "webgl") {
            if (detector.webgl) {
              return renderer;
            } else if (!detector.webgl && detector.canvas) {
              return "canvas";
            }
          }
          if (renderer === "canvas") {
            if (detector.canvas) {
              return renderer;
            }
          }
        };
        renderer = getValidRenderer(settings);
        console.log("" + renderer + " renderer");
        if (renderer === "webgl") {
          this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true
          });
          this.renderer.setSize(this.width, this.height);
          this.renderer.clear();
          this.renderer.setClearColor(0x00000000, 0);
          this.renderer.shadowMapEnabled = true;
          this.renderer.shadowMapAutoUpdate = true;
          this.renderer.shadowMapSoft = true;
          this.overlayRenderer = new THREE.WebGLRenderer({
            antialias: true
          });
          this.overlayRenderer.setSize(350, 250);
          return this.overlayRenderer.setClearColor(0x00000000, 0);
        } else if (renderer === "canvas") {
          this.renderer = new THREE.CanvasRenderer({
            antialias: true
          });
          this.renderer.setSize(this.width, this.height);
          this.renderer.clear();
          this.overlayRenderer = new THREE.CanvasRenderer({
            clearColor: 0x000000,
            clearAlpha: 0,
            antialias: true
          });
          this.overlayRenderer.setSize(350, 250);
          return this.overlayRenderer.setClearColor(0x00000000, 0);
        }
      };

      VisualEditorView.prototype.setupScenes = function() {
        this.scene = require('./scenes/main');
        this.renderManager.add("main", this.scene, this.camera);
        this.setupScene();
        return this.setupOverlayScene();
      };

      VisualEditorView.prototype.setupScene = function() {
        var ASPECT;
        this.viewAngle = 40;
        ASPECT = this.width / this.height;
        this.NEAR = 1;
        this.FAR = 10000;
        this.camera = new THREE.CombinedCamera(this.width, this.height, this.viewAngle, this.NEAR, this.FAR, this.NEAR, this.FAR);
        this.camera.up = new THREE.Vector3(0, 0, 1);
        this.camera.position.copy(this.defaultCameraPosition);
        this.camera.defaultPosition.copy(this.defaultCameraPosition);
        this.scene.add(this.camera);
        return this.cameraHelper = new THREE.CameraHelper(this.camera);
      };

      VisualEditorView.prototype.setupOverlayScene = function() {
        var FAR, NEAR;
        NEAR = 0.1;
        FAR = 1000;
        this.overlayCamera = new THREE.CombinedCamera(350 / 2, 250 / 2, this.viewAngle, NEAR, FAR, NEAR, FAR);
        this.overlayCamera.position.copy(new THREE.Vector3(150, 150, 250));
        this.overlayCamera.defaultPosition.copy(new THREE.Vector3(150, 150, 250));
        this.overlayCamera.up = new THREE.Vector3(0, 0, 1);
        this.overlayCamera.toOrthographic();
        this.overlayScene = new THREE.Scene();
        return this.overlayScene.add(this.overlayCamera);
      };

      VisualEditorView.prototype.setupPostProcess = function() {
        var AdditiveBlendShader, BlendShader, BrightnessContrastShader, DotScreenPass, EdgeShader, EdgeShader2, EdgeShader3, EffectComposer, FXAAShader, VignetteShader, composerResolutionMultiplier, contrastPass, copyPass, depthPass, effectBlend, normalPass, renderPass, renderTarget, renderTargetParameters, resolutionBase, resolutionMultiplier, vignettePass;
        if (this.renderer instanceof THREE.WebGLRenderer) {
          EffectComposer = require('EffectComposer');
          DotScreenPass = require('DotScreenPass');
          FXAAShader = require('FXAAShader');
          EdgeShader2 = require('EdgeShader2');
          EdgeShader = require('EdgeShader');
          VignetteShader = require('VignetteShader');
          BlendShader = require('BlendShader');
          BrightnessContrastShader = require('BrightnessContrastShader');
          AdditiveBlendShader = require('AdditiveBlendShader');
          EdgeShader3 = require('EdgeShader3');
          resolutionBase = 1;
          resolutionMultiplier = 1.5;
          this.fxaaResolutionMultiplier = resolutionBase / resolutionMultiplier;
          composerResolutionMultiplier = resolutionBase * resolutionMultiplier;
          renderPass = new THREE.RenderPass(this.scene, this.camera);
          copyPass = new THREE.ShaderPass(THREE.CopyShader);
          this.edgeDetectPass3 = new THREE.ShaderPass(THREE.EdgeShader3);
          contrastPass = new THREE.ShaderPass(THREE.BrightnessContrastShader);
          contrastPass.uniforms['contrast'].value = 0.5;
          contrastPass.uniforms['brightness'].value = -0.4;
          vignettePass = new THREE.ShaderPass(THREE.VignetteShader);
          vignettePass.uniforms["offset"].value = 0.4;
          vignettePass.uniforms["darkness"].value = 5;
          this.hRes = this.width * this.dpr * this.resUpscaler;
          this.vRes = this.height * this.dpr * this.resUpscaler;
          this.fxAAPass = new THREE.ShaderPass(THREE.FXAAShader);
          this.fxAAPass.uniforms['resolution'].value.set(1 / this.hRes, 1 / this.vRes);
          this.edgeDetectPass3.uniforms['aspect'].value = new THREE.Vector2(this.width, this.height);
          this.depthTarget = new THREE.WebGLRenderTarget(this.width, this.height, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBFormat
          });
          this.depthMaterial = new THREE.MeshDepthMaterial();
          depthPass = new THREE.RenderPass(this.scene, this.camera, this.depthMaterial);
          this.depthComposer = new THREE.EffectComposer(this.renderer, this.depthTarget);
          this.depthComposer.setSize(this.hRes, this.vRes);
          this.depthComposer.addPass(depthPass);
          this.depthComposer.addPass(this.edgeDetectPass3);
          this.depthComposer.addPass(copyPass);
          this.normalTarget = new THREE.WebGLRenderTarget(this.width, this.height, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBFormat
          });
          this.normalMaterial = new THREE.MeshNormalMaterial();
          normalPass = new THREE.RenderPass(this.scene, this.camera, this.normalMaterial);
          this.normalComposer = new THREE.EffectComposer(this.renderer, this.normalTarget);
          this.normalComposer.setSize(this.hRes, this.vRes);
          this.normalComposer.addPass(normalPass);
          this.normalComposer.addPass(this.edgeDetectPass3);
          this.normalComposer.addPass(copyPass);
          renderTargetParameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            stencilBuffer: false
          };
          renderTarget = new THREE.WebGLRenderTarget(this.width, this.height, renderTargetParameters);
          this.finalComposer = new THREE.EffectComposer(this.renderer, renderTarget);
          this.finalComposer.setSize(this.hRes, this.vRes);
          this.finalComposer.addPass(renderPass);
          effectBlend = new THREE.ShaderPass(THREE.AdditiveBlendShader, "tDiffuse1");
          effectBlend.uniforms['tDiffuse2'].value = this.normalComposer.renderTarget2;
          effectBlend.uniforms['tDiffuse3'].value = this.depthComposer.renderTarget2;
          this.finalComposer.addPass(effectBlend);
          return this.finalComposer.passes[this.finalComposer.passes.length - 1].renderToScreen = true;
        }
      };

      VisualEditorView.prototype.setupContextMenu = function() {
        var contextMenu, generatorTest, language, visitor;
        contextMenu = require('contextMenu');
        generatorTest = require("./generators/generatorGeometry");
        language = "coffee";
        visitor = new generatorTest.CoffeeSCadVisitor();
        switch (language) {
          case "coffee":
            visitor = new generatorTest.CoffeeSCadVisitor();
            break;
          case "jscad":
            visitor = new generatorTest.OpenJSCadVisitor();
            break;
          case "scad":
            visitor = new generatorTest.OpenSCadVisitor();
        }
        return this.$el.contextmenu({
          target: '#context-menu',
          before: (function(_this) {
            return function() {
              if (_this.noControlChange) {
                _this.controls.disable();
                return true;
              }
              return false;
            };
          })(this),
          onItem: (function(_this) {
            return function(e, element) {
              var line, mesh, meshCode, objectType, visitResult;
              visitResult = "";
              mesh = null;
              objectType = $(element).attr("data-value");
              switch (objectType) {
                case "Cube":
                  mesh = generatorTest.cubeGenerator();
                  break;
                case "Sphere":
                  mesh = generatorTest.sphereGenerator();
                  break;
                case "Cylinder":
                  mesh = generatorTest.cylinderGenerator();
              }
              if (_this.assembly == null) {
                _this.assembly = new THREE.Object3D();
                _this.assembly.name = "assembly";
              }
              if (mesh != null) {
                _this.assembly.add(mesh);
                visitResult = visitor.visit(mesh);
                _this._render();
                meshCode = "\nassembly.add(" + visitResult + ")";
                line = _this.model.injectContent(meshCode);
                mesh.meta = mesh.meta || {};
                mesh.meta.startIndex = line;
                mesh.meta.blockLength = meshCode.length;
                mesh.meta.code = meshCode;
                return console.log("mesh.meta", mesh.meta);
              }
            };
          })(this),
          after: (function(_this) {
            return function() {
              _this.controls.enable();
              _this.noControlChange = false;
              _this.contextMenuRequested = false;
              return false;
            };
          })(this)
        });
      };

      VisualEditorView.prototype.setupView = function(val) {
        var error, offset;
        if (this.settings.projection === "orthographic") {
          this.camera.toOrthographic();
        }
        switch (val) {
          case 'diagonal':
            this.camera.toDiagonalView();
            this.overlayCamera.toDiagonalView();
            break;
          case 'top':
            this.camera.toTopView();
            this.overlayCamera.toTopView();
            break;
          case 'bottom':
            this.camera.toBottomView();
            this.overlayCamera.toBottomView();
            break;
          case 'front':
            this.camera.toFrontView();
            this.overlayCamera.toFrontView();
            break;
          case 'back':
            this.camera.toBackView();
            this.overlayCamera.toBackView();
            break;
          case 'left':
            this.camera.toLeftView();
            this.overlayCamera.toLeftView();
            break;
          case 'right':
            this.camera.toRightView();
            this.overlayCamera.toRightView();
            break;
          case 'center':
            try {
              offset = new THREE.Vector3().sub(this.camera.target.clone());
              this.camera.position.addSelf(offset);
            } catch (_error) {
              error = _error;
              console.log("error " + error + " ");
            }
        }
        this.settings.position = "";
        if (this.initialized) {
          return this._render();
        }
      };

      VisualEditorView.prototype._setupEventBindings = function() {
        this.model.on("compiled", this._onProjectCompiled);
        return this.model.on("compile:error", this._onProjectCompileFailed);
      };

      VisualEditorView.prototype.settingsChanged = function(settings, value) {
        var error, key, offset, shadowResolution, tgt, val, _ref;
        _ref = this.settings.changedAttributes();
        for (key in _ref) {
          val = _ref[key];
          switch (key) {
            case "bgColor":
              this.setBgColor();
              break;
            case "renderer":
              delete this.renderer;
              this.init();
              this.fromCsg(this.model);
              this.render();
              break;
            case "showGrid":
              if (val) {
                this.addGrid();
              } else {
                this.removeGrid();
              }
              break;
            case "gridSize":
              if (this.grid != null) {
                this.removeGrid();
                this.addGrid();
              }
              break;
            case "gridStep":
              if (this.grid != null) {
                this.removeGrid();
                this.addGrid();
              }
              break;
            case "gridColor":
              if (this.grid != null) {
                this.grid.setColor(val);
              }
              break;
            case "gridOpacity":
              if (this.grid != null) {
                this.grid.setOpacity(val);
              }
              break;
            case "gridText":
              this.grid.toggleText(val);
              break;
            case "gridNumberingPosition":
              this.grid.setTextLocation(val);
              break;
            case "showAxes":
              if (val) {
                this.addAxes();
              } else {
                this.removeAxes();
              }
              break;
            case "axesSize":
              this.removeAxes();
              this.addAxes();
              break;
            case "shadows":
              if (!val) {
                this.renderer.clearTarget(this.light.shadowMap);
                helpers.updateVisuals(this.assembly, this.settings);
                this._render();
                this.renderer.shadowMapAutoUpdate = false;
                if (this.settings.showGrid) {
                  this.removeGrid();
                  this.addGrid();
                }
              } else {
                this.renderer.shadowMapAutoUpdate = true;
                helpers.updateVisuals(this.assembly, this.settings);
                this._render();
                if (this.settings.showGrid) {
                  this.removeGrid();
                  this.addGrid();
                }
              }
              break;
            case "shadowResolution":
              shadowResolution = parseInt(val.split("x")[0]);
              this.light.shadowMapWidth = shadowResolution;
              this.light.shadowMapHeight = shadowResolution;
              if (this.settings.shadows) {
                this.renderer.shadowMapAutoUpdate = true;
                helpers.updateVisuals(this.assembly, this.settings);
                this._render();
                if (this.settings.showGrid) {
                  this.removeGrid();
                  this.addGrid();
                }
              }
              break;
            case "objectOutline":
              console.log("objectOutline", val);
              if (val) {
                this.settings.objectOutline = val;
                if (detector.webgl) {
                  this.fxAAPass.uniforms['resolution'].value.set(1 / this.hRes, 1 / this.vRes);
                  this.normalComposer.setSize(this.hRes, this.vRes);
                  this.depthComposer.setSize(this.hRes, this.vRes);
                  this.finalComposer.setSize(this.hRes, this.vRes);
                } else {
                  this.settings.objectOutline = false;
                }
              }
              this._render();
              break;
            case "selfShadows":
              helpers.updateVisuals(this.assembly, this.settings);
              this._render();
              break;
            case "showStats":
              if (val) {
                this.ui.overlayDiv.append(this.stats.domElement);
              } else {
                $(this.stats.domElement).remove();
              }
              break;
            case "projection":
              if (val === "orthographic") {
                this.camera.toOrthographic();
              } else {
                this.camera.toPerspective();
                this.camera.setZoom(1);
              }
              break;
            case "position":
              this.setupView(val);
              break;
            case "autoRotate":
              this.controls.autoRotate = val;
              this.overlayControls.autoRotate = val;
              break;
            case "objectViewMode":
              helpers.updateVisuals(this.assembly, this.settings);
              this._render();
              break;
            case 'center':
              try {
                tgt = this.controls.target;
                offset = new THREE.Vector3().sub(this.controls.target.clone());
                this.controls.target.addSelf(offset);
                this.camera.position.addSelf(offset);
              } catch (_error) {
                error = _error;
                console.log("error " + error + " in center");
              }
              this.camera.lookAt(this.scene.position);
              break;
            case 'helpersColor':
              if (this.axes != null) {
                this.removeAxes();
                this.addAxes();
              }
              if (this.grid != null) {
                this.grid.setColor(val);
              }
              break;
            case 'textColor':
              if (this.axes != null) {
                this.removeAxes();
                this.addAxes();
              }
              if (this.grid != null) {
                this.grid.setTextColor(val);
              }
              break;
            case 'showConnectors':
              if (val) {
                this.assembly.traverse(function(object) {
                  if (object.name === "connectors") {
                    return object.visible = true;
                  }
                });
              } else {
                this.assembly.traverse(function(object) {
                  console.log("pouet");
                  console.log(object);
                  if (object.name === "connectors") {
                    return object.visible = false;
                  }
                });
              }
          }
        }
        return this._render();
      };

      VisualEditorView.prototype.reloadAssembly = function() {
        var loader, reloadedAssembly;
        reloadedAssembly = this.model.rootFolder.get(".assembly");
        console.log("reloadedAssembly", reloadedAssembly);
        if (reloadedAssembly != null) {
          reloadedAssembly = JSON.parse(reloadedAssembly.content);
          loader = new THREE.ObjectParser();
          this.assembly = loader.parse(reloadedAssembly);
          console.log("parse Result", this.assembly);
          this.scene.add(this.assembly);
          helpers.updateVisuals(this.assembly, this.settings);
          return this._render();
        }
      };

      VisualEditorView.prototype.blablabla = function() {
        var dup;
        if (this.assembly != null) {
          this.tmpScene.remove(this.assembly);
          dup = this.assembly.clone();
          this.tmpScene.add(dup);
          this.tmpScene.assembly = dup;
          this.tmpScene.add(this.scene.lights);
        }
        return helpers.toggleHelpers(this.tmpScene.assembly);
      };

      VisualEditorView.prototype.makeScreenshot = function(width, height) {
        if (width == null) {
          width = 600;
        }
        if (height == null) {
          height = 600;
        }
        return helpers.captureScreen(this.renderer.domElement, width, height);
      };

      VisualEditorView.prototype.onObjectSelected = function(selectionInfo) {
        var centerLeft, centerTop, height, infoText, length, screenCoords, width, _ref;
        _ref = this.selectionHelper.get2DBB(selectionInfo.selection, this.width, this.height), centerLeft = _ref[0], centerTop = _ref[1], length = _ref[2], width = _ref[3], height = _ref[4];
        $("#testOverlay2").removeClass("hide");
        $("#testOverlay2").css("left", centerLeft + this.$el.offset().left);
        $("#testOverlay2").css('top', (centerTop - $("#testOverlay2").height() / 2) + 'px');
        screenCoords = this.selectionHelper.getScreenCoords(selectionInfo.selection, this.width, this.height);
        $("#testOverlay2").css("left", screenCoords.x + this.$el.offset().left);
        $("#testOverlay2").css('top', (screenCoords.y - $("#testOverlay2").height() / 2) + 'px');
        infoText = "" + this.selectionHelper.currentSelect.name;
        $("#testOverlay2").html("<span>" + infoText + " <a class=\"toto\"><i class=\"icon-exclamation-sign\"></a></span>");
        $(".toto").click((function(_this) {
          return function() {
            var htmlStuff, volume;
            volume = _this.selectionHelper.currentSelect.volume || 0;
            htmlStuff = "<span>" + infoText + " <br>Volume:" + volume + " <a class=\"toto\"><i class=\"icon-exclamation-sign\"></a></span>";
            return $("#testOverlay2").html(htmlStuff);
          };
        })(this));
        return this._render();
      };

      VisualEditorView.prototype.onObjectUnSelected = function(selectionInfo) {
        $("#testOverlay2").addClass("hide");
        return this._render();
      };

      VisualEditorView.prototype.onObjectHover = function() {
        return this._render();
      };

      VisualEditorView.prototype._onSelectAttempt = function(ev) {
        "used either for selection or context menu";
        var hiearchyRoot, selected, x, y;
        normalizeEvent(ev);
        x = ev.offsetX;
        y = ev.offsetY;
        hiearchyRoot = this.assembly != null ? this.assembly.children : this.scene.children;
        this.selectionHelper.hiearchyRoot = hiearchyRoot;
        this.selectionHelper.viewWidth = this.width;
        this.selectionHelper.viewHeight = this.height;
        selected = this.selectionHelper.selectObjectAt(x, y);

        /*
        selectionChange = false
        if selected?
          if @currentSelection?
            if @currentSelection != selected
              selectionChange = true
          else 
            selectionChange = true
             
        if selectionChange
          if @currentSelection?
            controls = @currentSelection.controls
            if controls?
              controls.detatch(@currentSelection)
              controls.removeEventListener( 'change', @_render)
              @scene.remove(controls.gizmo)
              controls = null
              @currentSelection = null
          
          @currentSelection = selected        
          controls = new THREE.TransformControls(@camera, @renderer.domElement)
          console.log controls
          controls.addEventListener( 'change', @_render );
          controls.attatch( selected );
          controls.scale = 0.65;
          @scene.add( controls.gizmo );
          selected.controls = controls
        
        @_render()
         */
        ev.preventDefault();
        return false;
      };

      VisualEditorView.prototype._onRightclick = function(ev) {
        var x, y;
        normalizeEvent(ev);
        x = ev.offsetX;
        y = ev.offsetY;
        if (!this.selectionHelper.isThereObjectAt(x, y)) {
          this.selectionHelper._unSelect();
        }
        return this.contextMenuRequested = true;
      };

      VisualEditorView.prototype._onMouseMove = function(ev) {
        var hiearchyRoot, x, y;
        normalizeEvent(ev);
        x = ev.offsetX;
        y = ev.offsetY;
        hiearchyRoot = this.assembly != null ? this.assembly.children : this.scene.children;
        this.selectionHelper.hiearchyRoot = hiearchyRoot;
        this.selectionHelper.viewWidth = this.width;
        this.selectionHelper.viewHeight = this.height;
        return this.selectionHelper.highlightObjectAt(x, y);
      };

      VisualEditorView.prototype._onControlsChange = function(ev) {
        return this.noControlChange = false;

        /*
        if @controlChangeTimeOut?
          clearTimeout(@controlChangeTimeOut)
        @controlChangeTimeOut = null  
        @controlChangeTimeOut = setTimeout ( =>
          @noControlChange = true
          if @contextMenuRequested?
            if @contextMenuRequested
              @setupContextMenu()
              
        ), 600
        return false
         */
      };

      VisualEditorView.prototype.switchProjection = function(ev) {
        var projection;
        projection = this.settings.projection;
        if (projection === "perspective") {
          this.settings.projection = "orthographic";
          $(ev.target).addClass("uicon-off");
        } else {
          this.settings.projection = "perspective";
          $(ev.target).removeClass("uicon-off");
        }
        return false;
      };

      VisualEditorView.prototype.toggleGrid = function(ev) {
        var toggled;
        toggled = this.settings.showGrid;
        if (toggled) {
          this.settings.showGrid = false;
          $(ev.target).addClass("uicon-off");
        } else {
          this.settings.showGrid = true;
          $(ev.target).removeClass("uicon-off");
        }
        return false;
      };

      VisualEditorView.prototype.toggleAxes = function(ev) {
        var toggled;
        toggled = this.settings.showAxes;
        if (toggled) {
          this.settings.showAxes = false;
          $(ev.target).addClass("uicon-off");
        } else {
          this.settings.showAxes = true;
          $(ev.target).removeClass("uicon-off");
        }
        return false;
      };

      VisualEditorView.prototype.toggleAutoRotate = function(ev) {
        var toggled;
        toggled = this.settings.autoRotate;
        if (toggled) {
          this.settings.autoRotate = false;
          $(ev.target).addClass("uicon-off");
        } else {
          this.settings.autoRotate = true;
          $(ev.target).removeClass("uicon-off");
        }
        return false;
      };

      VisualEditorView.prototype.toggleOutlines = function(ev) {
        var toggled;
        toggled = this.settings.objectOutline;
        if (toggled) {
          this.settings.objectOutline = false;
          $(ev.target).addClass("uicon-off");
        } else {
          this.settings.objectOutline = true;
          $(ev.target).removeClass("uicon-off");
        }
        return false;
      };

      VisualEditorView.prototype.switchViewType = function(ev) {
        var myClass, viewType;
        myClass = $(ev.currentTarget).attr("class");
        myClass = myClass.replace("switchViewType", '');
        viewType = myClass.replace(/\s/g, '');
        viewType = viewType.split('-').pop();
        console.log(viewType);
        return this.settings.position = viewType;
      };

      VisualEditorView.prototype._onProjectCompiled = function(res) {
        this.selectionHelper._unSelect();
        this.fromCsg(res);
        this.grid.rootAssembly = this.assembly;
        return this.grid.updateGridSize();
      };

      VisualEditorView.prototype._onProjectCompileFailed = function() {
        if (this.assembly != null) {
          this.scene.remove(this.assembly);
          this.assembly = null;
        }
        return this._render();
      };

      VisualEditorView.prototype.switchModel = function(newModel) {
        this.model.off("compiled", this._onProjectCompiled);
        this.model.off("compile:error", this._onProjectCompileFailed);
        if (this.assembly != null) {
          this.scene.remove(this.assembly);
          this.current = null;
        }
        this.model = newModel;
        this.selectionHelper._unSelect();
        this._setupEventBindings();
        this._render();
        return this.reloadAssembly();
      };

      VisualEditorView.prototype.setBgColor = function() {
        var alpha, bgColor, color, _HexTO0x;
        bgColor = this.settings.bgColor;
        $("body").css("background-color", bgColor);
        _HexTO0x = function(c) {
          var hex;
          hex = parseInt("0x" + c.split('#').pop(), 16);
          return hex;
        };
        color = _HexTO0x(bgColor);
        alpha = this.renderer.getClearAlpha != null ? this.renderer.getClearAlpha() : 1;
        alpha = 1;
        return this.renderer.setClearColor(color, alpha);
      };

      VisualEditorView.prototype.addGrid = function() {

        /*
        Adds both grid & plane (for shadow casting), based on the parameters from the settings object
         */
        var gridColor, gridOpacity, gridSize, gridStep, gridText;
        if (!this.grid) {
          gridSize = this.settings.gridSize;
          gridStep = this.settings.gridStep;
          gridColor = this.settings.gridColor;
          gridOpacity = this.settings.gridOpacity;
          gridText = this.settings.gridText;
          this.grid = new helpers.Grid({
            size: gridSize,
            step: gridStep,
            color: gridColor,
            opacity: gridOpacity,
            addText: gridText,
            textColor: this.settings.textColor
          });
          return this.scene.add(this.grid);
        }
      };

      VisualEditorView.prototype.removeGrid = function() {
        if (this.grid) {
          this.scene.remove(this.grid);
          return delete this.grid;
        }
      };

      VisualEditorView.prototype.addAxes = function() {
        var helpersColor;
        helpersColor = this.settings.helpersColor;
        this.axes = new helpers.LabeledAxes({
          xColor: helpersColor,
          yColor: helpersColor,
          zColor: helpersColor,
          size: this.settings.gridSize / 2,
          addLabels: false,
          addArrows: false
        });
        this.scene.add(this.axes);
        this.overlayAxes = new helpers.LabeledAxes({
          textColor: this.settings.textColor,
          size: 100
        });
        return this.overlayScene.add(this.overlayAxes);
      };

      VisualEditorView.prototype.removeAxes = function() {
        this.scene.remove(this.axes);
        this.overlayScene.remove(this.overlayAxes);
        delete this.axes;
        return delete this.overlayAxes;
      };

      VisualEditorView.prototype._computeViewSize = function() {
        var eastWidth, westWidth;
        this.height = window.innerHeight - ($("#header").height());
        if (window.devicePixelRatio != null) {
          this.dpr = window.devicePixelRatio;
        }
        if (this.initialized == null) {
          westWidth = $("#_dockZoneWest").width();
          eastWidth = $("#_dockZoneEast").width();
          this.width = window.innerWidth - (westWidth + eastWidth);
        } else {
          westWidth = $("#_dockZoneWest").width();
          eastWidth = $("#_dockZoneEast").width();
          this.width = window.innerWidth - (westWidth + eastWidth);
        }
        this.dpr = 1;
        this.hRes = this.width * this.dpr * this.resUpscaler;
        return this.vRes = this.height * this.dpr * this.resUpscaler;
      };

      VisualEditorView.prototype.onResize = function() {
        this._computeViewSize();
        this.camera.aspect = this.width / this.height;
        this.camera.setSize(this.width, this.height);
        this.renderer.setSize(this.hRes, this.vRes);
        this.camera.updateProjectionMatrix();
        if (this.renderer instanceof THREE.WebGLRenderer && this.settings.objectOutline === true) {
          this.edgeDetectPass3.uniforms['aspect'].value = new THREE.Vector2(this.width, this.height);
          this.fxAAPass.uniforms['resolution'].value.set(1 / this.hRes, 1 / this.vRes);
          this.normalComposer.setSize(this.hRes, this.vRes);
          this.depthComposer.setSize(this.hRes, this.vRes);
          this.finalComposer.setSize(this.hRes, this.vRes);
        }
        return this._render();
      };

      VisualEditorView.prototype.onResizeStop = function() {
        return this.onResize();
      };

      VisualEditorView.prototype.onDomRefresh = function() {
        var container, container2;
        this._computeViewSize();
        this.init();
        if (this.settings.showStats) {
          this.ui.overlayDiv.append(this.stats.domElement);
        }
        this.camera.aspect = this.width / this.height;
        this.camera.setSize(this.width, this.height);
        this.renderer.setSize(this.width, this.height);
        this.camera.updateProjectionMatrix();
        this.$el.resize(this.onResize);
        window.addEventListener('resize', this.onResize, false);
        container = $(this.ui.renderBlock);
        container.append(this.renderer.domElement);
        this.renderer.domElement.setAttribute("id", "3dView");
        this.controls = new THREE.OrbitControls(this.camera, this.el);
        this.controls.staticMoving = true;
        this.controls.userPanSpeed = 3.0;
        this.controls.autoRotate = this.settings.autoRotate;
        this.controls.autoRotateSpeed = 4.0;
        this.controls.addEventListener('change', this._onControlsChange);
        container2 = $(this.ui.glOverlayBlock);
        container2.append(this.overlayRenderer.domElement);
        this.overlayControls = new THREE.OrbitControls(this.overlayCamera, this.el);
        this.overlayControls.userPan = false;
        this.overlayControls.userZoom = false;
        this.overlayControls.userPanSpeed = 0;
        this.overlayControls.userZoomSpeed = 0;
        this.overlayControls.autoRotate = this.settings.autoRotate;
        this.overlayControls.autoRotateSpeed = 4.0;
        this.initialized = true;
        return this.animate();
      };

      VisualEditorView.prototype._render = function() {
        var originalStates;
        if (this.renderer instanceof THREE.WebGLRenderer && this.settings.objectOutline === true) {
          THREE.EffectComposer.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
          THREE.EffectComposer.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
          THREE.EffectComposer.scene = new THREE.Scene();
          THREE.EffectComposer.scene.add(THREE.EffectComposer.quad);
          originalStates = helpers.toggleHelpers(this.scene);
          this.depthComposer.render();
          this.normalComposer.render();
          helpers.enableHelpers(this.scene, originalStates);
          this.finalComposer.passes[this.finalComposer.passes.length - 1].uniforms['tDiffuse2'].value = this.normalComposer.renderTarget2;
          this.finalComposer.passes[this.finalComposer.passes.length - 1].uniforms['tDiffuse3'].value = this.depthComposer.renderTarget2;
          this.finalComposer.render();
        } else {
          this.renderer.render(this.scene, this.camera);
        }
        if (this.settings.showStats) {
          return this.stats.update();
        }
      };

      VisualEditorView.prototype._renderOverlay = function() {
        return this.overlayRenderer.render(this.overlayScene, this.overlayCamera);
      };

      VisualEditorView.prototype.animate = function() {
        var blaZoom;
        this.controls.update();
        this.overlayControls.update();
        blaZoom = Math.pow(0.95, this.controls.userZoomSpeed);
        this._render();
        this._renderOverlay();
        return requestAnimationFrame(this.animate);
      };

      VisualEditorView.prototype.fromCsg = function() {
        var end, exported, exporter, index, part, start, _ref;
        start = new Date().getTime();
        if (this.assembly != null) {
          this.scene.remove(this.assembly);
          this.current = null;
        }
        this.assembly = new THREE.Object3D();
        this.assembly.name = "assembly";
        if (this.model.rootAssembly.children != null) {
          _ref = this.model.rootAssembly.children;
          for (index in _ref) {
            part = _ref[index];
            this._importGeom(part, this.assembly);
          }
        }
        this.scene.add(this.assembly);
        end = new Date().getTime();
        console.log("Csg visualization time: " + (end - start));
        helpers.updateVisuals(this.assembly, this.settings);
        exporter = new THREE.ObjectExporter();
        exported = exporter.parse(this.assembly);
        exported = JSON.stringify(exported);
        if (!this.model.rootFolder.get(".assembly")) {
          this.model.addFile({
            name: ".assembly",
            content: exported
          });
        } else {
          this.model.rootFolder.get(".assembly").content = exported;
        }
        return this._render();
      };

      VisualEditorView.prototype._importGeom = function(csgObj, rootObj) {
        var child, conn, connectorMesh, geom, i, index, mat, mesh, opacity, shine, spec, _ref, _ref1, _results;
        geom = THREE.CSG.fromCSG(csgObj);
        shine = 1500;
        spec = 1000;
        opacity = geom.opacity;
        if (this.renderer instanceof THREE.CanvasRenderer) {
          mat = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF
          });
          mat.overdraw = true;
        } else {
          mat = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            shading: THREE.SmoothShading,
            shininess: shine,
            specular: spec,
            metal: false,
            vertexColors: THREE.VertexColors
          });
          mat.opacity = opacity;
          mat.ambient = mat.color;
          mat.transparent = opacity < 1;
        }
        mesh = new THREE.Mesh(geom, mat);
        mesh.position = geom.tmpPos;
        delete geom.tmpPos;
        mesh.castShadow = this.settings.shadows;
        mesh.receiveShadow = this.settings.selfShadows && this.settings.shadows;
        mesh.material.wireframe = this.settings.wireframe;
        mesh.name = csgObj.constructor.name;
        if (this.renderer instanceof THREE.CanvasRenderer) {
          mesh.doubleSided = true;
        }
        _ref = geom.connectors;
        for (i in _ref) {
          conn = _ref[i];

          /*
          mat =  new THREE.LineBasicMaterial({color: 0xff0000})
          line = new THREE.Line(conn, mat)
          @mesh.add line
           */
          mat = new THREE.MeshLambertMaterial({
            color: 0xff0000
          });
          connectorMesh = new THREE.Mesh(conn, mat);
          connectorMesh.name = "connectors";
          connectorMesh.position = conn.basePoint;
          if (this.settings.get('showConnectors') === false) {
            connectorMesh.visible = false;
          }
          mesh.add(connectorMesh);
        }
        rootObj.add(mesh);
        if (csgObj.children != null) {
          _ref1 = csgObj.children;
          _results = [];
          for (index in _ref1) {
            child = _ref1[index];
            _results.push(this._importGeom(child, mesh));
          }
          return _results;
        }
      };

      return VisualEditorView;

    })(Backbone.Marionette.ItemView);
    return VisualEditorView;
  });

}).call(this);
