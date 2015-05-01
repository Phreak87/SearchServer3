(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, CustomOrbitControls, OrbitControls, THREE, TrackballControls, VisualEditorView, combo_cam, contextMenuTemplate, detector, helpers, marionette, outlineShader, reqRes, requestAnimationFrame, stats, threedView_template, utils, vent;
    $ = require('jquery');
    marionette = require('marionette');
    require('bootstrap');
    THREE = require('three');
    combo_cam = require('combo_cam');
    detector = require('detector');
    stats = require('stats');
    utils = require('utils');
    OrbitControls = require('./orbitControls');
    CustomOrbitControls = require('./customOrbitControls');
    TrackballControls = require('./trackballControls');
    reqRes = require('core/messaging/appReqRes');
    vent = require('core/messaging/appVent');
    threedView_template = require("text!./visualEditorView.tmpl");
    requestAnimationFrame = require('core/utils/anim');
    THREE.CSG = require('core/projects/csg/csg.Three');
    helpers = require('./helpers');
    contextMenuTemplate = require("text!./contextMenu.tmpl");
    require("ThreeCSGV2");
    outlineShader = require('./shaders');
    VisualEditorView = (function(_super) {
      __extends(VisualEditorView, _super);

      VisualEditorView.prototype.template = threedView_template;

      VisualEditorView.prototype.ui = {
        renderBlock: "#glArea",
        glOverlayBlock: "#glOverlay",
        overlayDiv: "#overlay"
      };

      VisualEditorView.prototype.events = {
        'contextmenu': 'rightclick'
      };

      function VisualEditorView(options, settings) {
        this._updateAssemblyVisualAttrs = __bind(this._updateAssemblyVisualAttrs, this);
        this._importGeom = __bind(this._importGeom, this);
        this.fromCsg = __bind(this.fromCsg, this);
        this.outLinePass2 = __bind(this.outLinePass2, this);
        this.outLinePass1 = __bind(this.outLinePass1, this);
        this.outLinePasses = __bind(this.outLinePasses, this);
        this.bla = __bind(this.bla, this);
        this.animate = __bind(this.animate, this);
        this._render = __bind(this._render, this);
        this.onDomRefresh = __bind(this.onDomRefresh, this);
        this.onRender = __bind(this.onRender, this);
        this.onResize = __bind(this.onResize, this);
        this.addCage = __bind(this.addCage, this);
        this.removeGrid = __bind(this.removeGrid, this);
        this.addGrid = __bind(this.addGrid, this);
        this.setBgColor = __bind(this.setBgColor, this);
        this.setupView = __bind(this.setupView, this);
        this.setupLights = __bind(this.setupLights, this);
        this.configure = __bind(this.configure, this);
        this.init = __bind(this.init, this);
        this.settingsChanged = __bind(this.settingsChanged, this);
        this.projectCompileFailed = __bind(this.projectCompileFailed, this);
        this.projectCompiled = __bind(this.projectCompiled, this);
        this.selectObj = __bind(this.selectObj, this);
        this.rightclick = __bind(this.rightclick, this);
        this.makeScreeshot = __bind(this.makeScreeshot, this);
        VisualEditorView.__super__.constructor.call(this, options);
        this.vent = vent;
        this.settings = options.settings;
        this.stats = new stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '30px';
        this.stats.domElement.style.zIndex = 100;
        this.settings.on("change", this.settingsChanged);
        this.model.on("compiled", this.projectCompiled);
        this.model.on("compile:error", this.projectCompileFailed);
        reqRes.addHandler("project:getScreenshot", (function(_this) {
          return function() {
            return _this.makeScreeshot();
          };
        })(this));
        this.defaultCameraPosition = new THREE.Vector3(100, 100, 200);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.init();
      }

      VisualEditorView.prototype.makeScreeshot = function(width, height) {
        var canvas, ctx, d, img, imgAsDataURL, srcImg;
        if (width == null) {
          width = 300;
        }
        if (height == null) {
          height = 300;
        }
        srcImg = this.renderer.domElement.toDataURL("image/png");
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
        d = $.Deferred();
        imgAsDataURL = null;
        img = new Image();
        img.onload = (function(_this) {
          return function() {
            ctx.drawImage(img, 0, 0, width, height);
            imgAsDataURL = canvas.toDataURL("image/png");
            return d.resolve(imgAsDataURL);
          };
        })(this);
        img.src = srcImg;
        return d;
      };

      VisualEditorView.prototype.rightclick = function(ev) {
        "used either for selection or context menu";
        var x, y;
        normalizeEvent(ev);
        x = ev.offsetX;
        y = ev.offsetY;
        this.selectObj(x, y);

        /*
        {ContextMenuRegion,ContextMenu} = require "views/contextMenuView"
        @contextMenu = new ContextMenu()
        @contextMenuRegion.show @contextMenu
         */
        ev.preventDefault();
        return false;
      };

      VisualEditorView.prototype.selectObj = function(mouseX, mouseY) {
        var intersects, newMat, raycaster, unselect, v;
        v = new THREE.Vector3((mouseX / this.width) * 2 - 1, -(mouseY / this.height) * 2 + 1, 0.5);
        this.projector.unprojectVector(v, this.camera);
        raycaster = new THREE.Raycaster(this.camera.position, v.sub(this.camera.position).normalize());
        intersects = raycaster.intersectObjects(this.scene.children, true);
        unselect = (function(_this) {
          return function() {
            if (_this.current != null) {
              _this.current.selected = false;
              _this.current.material = _this.current.origMaterial;
              if (_this.current.cage != null) {
                _this.current.remove(_this.current.cage);
                _this.current.cage = null;
              }
              return _this.current = null;
            }
          };
        })(this);
        if (this.current != null) {
          unselect();
        }
        if (intersects != null) {
          if (intersects.length > 0) {
            if (intersects[0].object.name !== "workplane") {
              this.current = intersects[0].object;
              newMat = new THREE.MeshLambertMaterial({
                color: 0xCC0000
              });
              this.current.origMaterial = this.current.material;
              this.current.material = newMat;
              this.addCage(this.current);
              this.camera.lookAt(this.current.position.clone());
              this.controls.zoomInOn(this.current);
              this._render();
            }
          }
        }
        return this._render();
      };

      VisualEditorView.prototype.switchModel = function(newModel) {
        this.scene.remove(this.mesh);
        try {
          this.scene.remove(this.current.cageView);
          this.current = null;
        } catch (_error) {}
        this.model = newModel;
        this.model.on("compiled", this.projectCompiled);
        return this.fromCsg(this.model);
      };

      VisualEditorView.prototype.projectCompiled = function(res) {
        return this.fromCsg(res);
      };

      VisualEditorView.prototype.projectCompileFailed = function() {
        if (this.assembly != null) {
          this.scene.remove(this.assembly);
          this.assembly = null;
        }
        return this._render();
      };

      VisualEditorView.prototype.settingsChanged = function(settings, value) {
        var error, key, offset, tgt, val, _ref;
        _ref = this.settings.changedAttributes();
        for (key in _ref) {
          val = _ref[key];
          switch (key) {
            case "bgColor":
              this.setBgColor();
              break;
            case "bgColor2":
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
                this._updateAssemblyVisualAttrs();
                this._render();
                this.renderer.shadowMapAutoUpdate = false;
                if (this.settings.get("showGrid")) {
                  this.removeGrid();
                  this.addGrid();
                }
              } else {
                this.renderer.shadowMapAutoUpdate = true;
                this._updateAssemblyVisualAttrs();
                this._render();
                if (this.settings.get("showGrid")) {
                  this.removeGrid();
                  this.addGrid();
                }
              }
              break;
            case "selfShadows":
              this._updateAssemblyVisualAttrs();
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
            case "wireframe":
              this._updateAssemblyVisualAttrs();
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
              break;
            case 'textColor':
              if (this.axes != null) {
                this.removeAxes();
                this.addAxes();
              }
              break;
            case 'showConnectors':
              if (val) {
                this.assembly.traverse(function(object) {
                  console.log("pouet");
                  console.log(object);
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

      VisualEditorView.prototype.init = function() {
        var BlendShader, DotScreenPass, EdgeShader, EdgeShader2, EffectComposer, FAR, FXAAShader, NEAR, VignetteShader, colorInvertPass, colorInvertShader, copyPass, depthPass, depthTextureShader, dotScreenPass, dpr, edgeDetectPass, edgeDetectPass2, overlayRenderPass, renderPass, renderTargetParameters, target, vignettePass;
        EffectComposer = require('EffectComposer');
        DotScreenPass = require('DotScreenPass');
        FXAAShader = require('FXAAShader');
        EdgeShader2 = require('EdgeShader2');
        EdgeShader = require('EdgeShader');
        VignetteShader = require('VignetteShader');
        BlendShader = require('BlendShader');
        this.renderer = null;
        this.configure(this.settings);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapAutoUpdate = true;
        this.projector = new THREE.Projector();
        this.setupScene();
        this.setupOverlayScene();
        this.setBgColor();
        if (this.settings.get("shadows")) {
          this.renderer.shadowMapAutoUpdate = this.settings.get("shadows");
        }
        if (this.settings.get("showGrid")) {
          this.addGrid();
        }
        if (this.settings.get("showAxes")) {
          this.addAxes();
        }
        if (this.settings.get("projection") === "orthographic") {
          this.camera.toOrthographic();
          this.camera.setZoom(6);
        } else {

        }
        if (this.mesh != null) {
          this.mesh.material.wireframe = this.settings.get("wireframe");
        }
        dpr = 1;
        if (window.devicePixelRatio === !void 0) {
          dpr = window.devicePixelRatio;
        }
        renderPass = new THREE.RenderPass(this.scene, this.camera);
        overlayRenderPass = new THREE.RenderPass(this.overlayScene, this.overlayCamera);
        copyPass = new THREE.ShaderPass(THREE.CopyShader);
        dotScreenPass = new THREE.ShaderPass(THREE.DotScreenShader);
        this.fxAAPass = new THREE.ShaderPass(THREE.FXAAShader);
        this.fxAAPass.uniforms['resolution'].value.set(1 / (this.width * dpr), 1 / (this.height * dpr));
        edgeDetectPass = new THREE.ShaderPass(THREE.EdgeShader);
        edgeDetectPass2 = new THREE.ShaderPass(THREE.EdgeShader2);
        vignettePass = new THREE.ShaderPass(THREE.VignetteShader);

        /*
        @composer = new THREE.EffectComposer( @renderer )
        @composer.setSize(@width * dpr, @height * dpr);
        @composer.addPass(renderPass)
        @composer.addPass(@fxAAPass)
        @composer.addPass(edgeDetectPass)
        @composer.addPass(edgeDetectPass2)
         *@composer.addPass(copyPass)
         *@composer.addPass(dotScreenPass)
        @composer.addPass(vignettePass)
         */
        NEAR = 0.1;
        FAR = 100.0;
        depthTextureShader = {
          uniforms: {
            "tDiffuse": {
              type: "t",
              value: 0,
              texture: null
            },
            "tDepth": {
              type: "t",
              value: 1,
              texture: null
            },
            "cameraNear": {
              type: "f",
              value: 1.0
            },
            "cameraFar": {
              type: "f",
              value: 100.0
            },
            "fogNear": {
              type: "f",
              value: NEAR
            },
            "fogFar": {
              type: "f",
              value: FAR
            }
          },
          vertexShader: "uniform float cameraNear;\nuniform float cameraFar;\n\nvarying vec2 vUv;\nvarying float depth;\n\nvoid main() {\n    vUv = vec2( uv.x, uv.y );\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n    vec4 position = modelViewMatrix * vec4( position, 1.0 );\n    depth =((position.z / position.w/100.0) + 1.0) * 0.1;\n    //depth = 1.0 - ((gl_Position.w - 1.0) / (150.0 - 1.0));\n}",
          fragmentShader: "       uniform sampler2D tDiffuse;\n       uniform sampler2D tDepth;\n       uniform float cameraNear;\n       uniform float cameraFar;\n       uniform float fogNear;\n       uniform float fogFar;\n       \n       varying vec2 vUv;\n       varying float depth;\n       \n       float cameraFarPlusNear = cameraFar + cameraNear;\n       float cameraFarMinusNear = cameraFar - cameraNear;\n       float cameraCoef = 2.0 * cameraNear;\n       \n       //Rgba depth\n       float unpackDepth( const in vec4 rgba_depth )\n       {\n         const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n         float depth = dot( rgba_depth, bit_shift );\n         return depth;\n       }\n       \n       float readDepth( const in vec2 coord )\n       {\n         return cameraCoef / ( cameraFarPlusNear - unpackDepth( texture2D( tDepth, coord ) ) * cameraFarMinusNear );\n       }\n\n       void main() {\n           vec4 srcColor = texture2D( tDiffuse, vUv );\n           //float depth = readDepth( vUv );\n           //vec3 endColor = vec3(depth);\n           gl_FragColor = vec4(depth,depth,depth, 1.0);\n       }"
        };
        depthPass = new THREE.ShaderPass(depthTextureShader);
        colorInvertShader = {
          uniforms: {
            "tDiffuse": {
              type: "t",
              value: null
            }
          },
          vertexShader: "varying vec2 vUv;\nvoid main() {\n    vUv = vec2( uv.x, uv.y );\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
          fragmentShader: "       uniform sampler2D tDiffuse;\n       varying vec2 vUv;\n\n       void main() {\n           vec4 srcColor = texture2D( tDiffuse, vUv );\n           vec4 endColor = vec4(1.0, 1.0, 1.0, 1.0)- srcColor * 200.0;\n           if(endColor[0]<0.3)\n           {\n             endColor[3]=1.0;\n           }\n           else\n           {\n             endColor[3]=0.0;\n           }\n           gl_FragColor = endColor;//vec4(1.0, 1.0, 1.0, 1.0)- srcColor * 200.0 ;\n       }"
        };
        renderTargetParameters = {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBFormat,
          stencilBufer: false
        };
        target = new THREE.WebGLRenderTarget(this.width, this.height, renderTargetParameters);
        colorInvertPass = new THREE.ShaderPass(colorInvertShader);
        this.edgeComposer = new THREE.EffectComposer(this.renderer, target);
        this.edgeComposer.setSize(this.width * dpr, this.height * dpr);
        this.edgeComposer.addPass(renderPass);
        this.edgeComposer.addPass(this.fxAAPass);
        this.edgeComposer.passes[this.edgeComposer.passes.length - 1].renderToScreen = true;

        /*
        finalshader = {
          uniforms: {
              tDiffuse: { type: "t", value: 0, texture: null }, # The base scene buffer
              tEdge: { type: "t", value: 1, texture: null } # The edge scene buffer
          },
         
          vertexShader: [
              "varying vec2 vUv;",
             
              "void main() {",
             
                  "vUv = vec2( uv.x, uv.y );",
                  "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
             
              "}"
          ].join("\n"),
           
          fragmentShader: [
              "uniform sampler2D tDiffuse;",
              "uniform sampler2D tEdge;",
             
              "varying vec2 vUv;",
             
              "void main() {",
             
                  "vec4 texel = texture2D( tDiffuse, vUv );",
                  "vec4 edge = texture2D( tEdge, vUv );",
                  "gl_FragColor = texel + vec4(1.0, 0.0, 0.0, 0.0) * edge;", # Blend the two buffers together (I colorized and intensified the glow at the same time)
             
              "}"
          ].join("\n")
        }
        
        finalshader.uniforms[ "tEdge" ].texture = @edgeComposer.renderTarget2
         
         * Prepare the base scene render pass
         
         * Prepare the additive blending pass
        finalPass = new THREE.ShaderPass( finalshader )
        finalPass.needsSwap = true
        
        renderTarget = new THREE.WebGLRenderTarget( @width, @height, renderTargetParameters )
        
        @composer = new THREE.EffectComposer( @renderer, renderTarget )
        @composer.setSize(@width * dpr, @height * dpr);
        @composer.addPass(renderPass)
        
         *Add all passes
        @composer.addPass( renderPass )
        @composer.addPass( finalPass )
        finalPass.renderToScreen = true
         */

        /*
        renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false }
        renderTarget = new THREE.WebGLRenderTarget( @width, @height, renderTargetParameters )
        @baseComposer= new THREE.EffectComposer( @renderer, renderTarget )
        @baseComposer.addPass( renderPass )
        
         *blend Composer runs the AdditiveBlendShader to combine the output of edgeComposer and baseComposer
        blendPass = new THREE.ShaderPass( THREE.BlendShader )
        blendPass.uniforms[ 'tDiffuse1' ].value = @baseComposer.renderTarget1
        blendPass.uniforms[ 'tDiffuse2' ].value = @edgeComposer.renderTarget2
        blendPass.uniforms[ 'mixRatio' ].value = 0.5
        
        @composer = new THREE.EffectComposer(@renderer )
        @composer.addPass( blendPass )
        blendPass.renderToScreen = true
        
         *@composer.passes[@composer.passes.length-1].renderToScreen = true
         */
        return this.setupView(this.settings.position);
      };

      VisualEditorView.prototype.configure = function(settings) {
        var renderer;
        if (settings.get("renderer")) {
          renderer = settings.get("renderer");
          if (renderer === "webgl") {
            if (detector.webgl) {
              console.log("Gl Renderer");
              this.renderer = new THREE.WebGLRenderer({
                clearColor: 0x363335,
                clearAlpha: 1,
                antialias: true,
                preserveDrawingBuffer: true
              });
              this.renderer.clear();
              this.renderer.setSize(this.width, this.height);
              this.renderer.autoClear = false;
              this.overlayRenderer = new THREE.WebGLRenderer({
                clearColor: 0x000000,
                clearAlpha: 0,
                antialias: true
              });
              return this.overlayRenderer.setSize(350, 250);
            } else if (!detector.webgl && !detector.canvas) {
              return console.log("No Webgl and no canvas (fallback) support, cannot render");
            } else if (!detector.webgl && detector.canvas) {
              this.renderer = new THREE.CanvasRenderer({
                clearColor: 0x00000000,
                clearAlpha: 0,
                antialias: true
              });
              this.renderer.clear();
              this.overlayRenderer = new THREE.CanvasRenderer({
                clearColor: 0x000000,
                clearAlpha: 0,
                antialias: true
              });
              this.overlayRenderer.setSize(350, 250);
              return this.renderer.setSize(this.width, this.height);
            } else {
              return console.log("No Webgl and no canvas (fallback) support, cannot render");
            }
          } else if (renderer === "canvas") {
            if (detector.canvas) {
              this.renderer = new THREE.CanvasRenderer({
                clearColor: 0x00000000,
                clearAlpha: 0,
                antialias: true
              });
              this.renderer.clear();
              this.overlayRenderer = new THREE.CanvasRenderer({
                clearColor: 0x000000,
                clearAlpha: 0,
                antialias: true
              });
              this.overlayRenderer.setSize(350, 250);
              return this.renderer.setSize(this.width, this.height);
            } else if (!detector.canvas) {
              return console.log("No canvas support, cannot render");
            }
          }
        }
      };

      VisualEditorView.prototype.setupScene = function() {
        var ASPECT, FAR, NEAR;
        this.viewAngle = 45;
        ASPECT = this.width / this.height;
        NEAR = 0.1;
        FAR = 10000;

        /* 
        @camera =
        new THREE.PerspectiveCamera(
            @viewAngle,
            ASPECT,
            NEAR,
            FAR)
         */
        this.camera = new THREE.CombinedCamera(this.width, this.height, this.viewAngle, NEAR, FAR, NEAR, FAR);
        this.camera.up = new THREE.Vector3(0, 0, 1);
        this.camera.position = this.defaultCameraPosition;
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);
        this.setupLights();
        return this.cameraHelper = new THREE.CameraHelper(this.camera);
      };

      VisualEditorView.prototype.testCSG = function() {
        var cube_bsp, cube_geometry, cube_mesh, mat, result, sphere_bsp, sphere_geometry, sphere_mesh, start_time, subtract_bsp;
        if (this.csgExperiment != null) {
          this.scene.remove(this.csgExperiment != null);
        }
        cube_geometry = new THREE.CubeGeometry(50, 50, 50, 1, 1, 1);
        cube_mesh = new THREE.Mesh(cube_geometry);
        mat = new THREE.MeshLambertMaterial({
          shading: THREE.SmoothShading
        });
        cube_geometry.computeVertexNormals();
        cube_mesh.material = mat;
        this.csgExperiment = cube_mesh;
        this.scene.add(this.csgExperiment);
        return;
        start_time = (new Date()).getTime();
        cube_geometry = new THREE.CubeGeometry(20, 20, 20);
        cube_mesh = new THREE.Mesh(cube_geometry);
        cube_mesh.position.x = 0;
        cube_bsp = new ThreeBSP(cube_mesh);
        sphere_geometry = new THREE.SphereGeometry(12, 30, 30);
        sphere_mesh = new THREE.Mesh(sphere_geometry);
        sphere_mesh.position.x = 0;
        sphere_mesh.rotation.y = Math.PI / 90;
        sphere_bsp = new ThreeBSP(sphere_mesh);
        subtract_bsp = cube_bsp.subtract(sphere_bsp);
        result = subtract_bsp.toMesh(new THREE.MeshLambertMaterial({
          shading: THREE.SmoothShading
        }));
        result.geometry.computeVertexNormals();
        if (this.renderer instanceof THREE.CanvasRenderer) {
          result.doubleSided = true;
          result.material.overdraw = true;
        }
        result.name = "toto";
        this.csgExperiment = result;
        this.scene.add(this.csgExperiment);
        return console.log('Example 1: ' + ((new Date()).getTime() - start_time) + 'ms');
      };

      VisualEditorView.prototype.setupOverlayScene = function() {
        var ASPECT, FAR, NEAR;
        ASPECT = 350 / 250;
        NEAR = 1;
        FAR = 10000;
        this.overlayCamera = new THREE.CombinedCamera(350, 250, this.viewAngle, NEAR, FAR, NEAR, FAR);
        this.overlayCamera.up = new THREE.Vector3(0, 0, 1);
        this.overlayScene = new THREE.Scene();
        return this.overlayScene.add(this.overlayCamera);
      };

      VisualEditorView.prototype.setupLights = function() {
        var ambientLight, pointLight, pointLight2, spotLight;
        pointLight = new THREE.PointLight(0x333333, 4);
        pointLight.position.x = -2500;
        pointLight.position.y = -2500;
        pointLight.position.z = 2200;
        pointLight2 = new THREE.PointLight(0x333333, 3);
        pointLight2.position.x = 2500;
        pointLight2.position.y = 2500;
        pointLight2.position.z = -5200;
        this.ambientColor = 0x253565;
        this.ambientColor = 0x354575;
        this.ambientColor = 0x455585;
        this.ambientColor = 0x565595;
        ambientLight = new THREE.AmbientLight(this.ambientColor);
        spotLight = new THREE.SpotLight(0xbbbbbb, 1.5);
        spotLight.position.x = 0;
        spotLight.position.y = 0;
        spotLight.position.z = 4000;
        spotLight.castShadow = true;
        this.light = spotLight;
        this.scene.add(ambientLight);
        this.scene.add(pointLight);
        this.scene.add(pointLight2);
        this.scene.add(spotLight);
        return this.camera.add(pointLight);
      };

      VisualEditorView.prototype.setupView = function(val) {
        var error, nPost, offset, resetCam;
        resetCam = (function(_this) {
          return function() {
            _this.camera.position.z = 0;
            _this.camera.position.y = 0;
            return _this.camera.position.x = 0;
          };
        })(this);
        switch (val) {
          case 'diagonal':
            this.camera.position = this.defaultCameraPosition;
            this.overlayCamera.position.x = 150;
            this.overlayCamera.position.y = 150;
            this.overlayCamera.position.z = 250;
            this.camera.lookAt(this.scene.position);
            this.overlayCamera.lookAt(this.overlayScene.position);
            break;
          case 'top':
            try {
              offset = this.camera.position.clone().sub(this.controls.target);
              nPost = new THREE.Vector3();
              nPost.z = offset.length();
              this.camera.position = nPost;
            } catch (_error) {
              error = _error;
              this.camera.position = new THREE.Vector3(0, 0, this.defaultCameraPosition.z);
            }
            this.overlayCamera.position = new THREE.Vector3(0, 0, 250);
            this.camera.lookAt(this.scene.position);
            this.overlayCamera.lookAt(this.overlayScene.position);
            break;
          case 'bottom':
            try {
              offset = this.camera.position.clone().sub(this.controls.target);
              nPost = new THREE.Vector3();
              nPost.z = -offset.length();
              this.camera.position = nPost;
            } catch (_error) {
              error = _error;
              this.camera.position = new THREE.Vector3(0, 0, -this.defaultCameraPosition.z);
            }
            this.overlayCamera.position = new THREE.Vector3(0, 0, -250);
            this.camera.lookAt(this.scene.position);
            this.overlayCamera.lookAt(this.overlayScene.position);
            break;
          case 'front':
            try {
              offset = this.camera.position.clone().sub(this.controls.target);
              nPost = new THREE.Vector3();
              nPost.y = -offset.length();
              this.camera.position = nPost;
            } catch (_error) {
              error = _error;
              this.camera.position = new THREE.Vector3(0, -this.defaultCameraPosition.y, 0);
            }
            this.overlayCamera.position = new THREE.Vector3(0, -250, 0);
            this.camera.lookAt(this.scene.position);
            this.overlayCamera.lookAt(this.overlayScene.position);
            break;
          case 'back':
            try {
              offset = this.camera.position.clone().sub(this.controls.target);
              nPost = new THREE.Vector3();
              nPost.y = offset.length();
              this.camera.position = nPost;
            } catch (_error) {
              error = _error;
              this.camera.position = new THREE.Vector3(0, this.defaultCameraPosition.y, 0);
            }
            this.overlayCamera.position = new THREE.Vector3(0, 250, 0);
            this.camera.lookAt(this.scene.position);
            this.overlayCamera.lookAt(this.overlayScene.position);
            break;
          case 'left':
            try {
              offset = this.camera.position.clone().sub(this.controls.target);
              nPost = new THREE.Vector3();
              nPost.x = offset.length();
              this.camera.position = nPost;
            } catch (_error) {
              error = _error;
              this.camera.position = new THREE.Vector3(this.defaultCameraPosition.x, 0, 0);
            }
            this.overlayCamera.position = new THREE.Vector3(250, 0, 0);
            this.camera.lookAt(this.scene.position);
            this.overlayCamera.lookAt(this.overlayScene.position);
            break;
          case 'right':
            try {
              offset = this.camera.position.clone().sub(this.controls.target);
              nPost = new THREE.Vector3();
              nPost.x = -offset.length();
              this.camera.position = nPost;
            } catch (_error) {
              error = _error;
              this.camera.position = new THREE.Vector3(-this.defaultCameraPosition.x, 0, 0);
            }
            this.overlayCamera.position = new THREE.Vector3(-250, 0, 0);
            this.camera.lookAt(this.scene.position);
            this.overlayCamera.lookAt(this.overlayScene.position);
        }
        return this._render();
      };

      VisualEditorView.prototype.setBgColor = function() {
        var bgColor1, bgColor2;
        console.log("setting bg color");
        bgColor1 = this.settings.get("bgColor");
        bgColor2 = this.settings.get("bgColor2");
        $("body").css("background-color", bgColor1);
        if (bgColor1 !== bgColor2) {
          $("body").css("background-image", "-moz-radial-gradient(center center, circle cover, " + bgColor1 + "," + bgColor2 + "  100%)");
          $("body").css("background-image", "-webkit-radial-gradient(center center, circle cover, " + bgColor1 + "," + bgColor2 + "  100%)");
          $("body").css("background-image", "-o-radial-gradient(center center, circle cover, " + bgColor1 + "," + bgColor2 + "  100%)");
          $("body").css("background-image", "-ms-radial-gradient(center center, circle cover, " + bgColor1 + "," + bgColor2 + "  100%)");
          $("body").css("background-image", "radial-gradient(center center, circle cover, " + bgColor1 + "," + bgColor2 + "  100%)");
          $("body").css("background-repeat", "no-repeat");
          return $("body").css("background-attachment", "fixed");
        } else {
          $("body").css("background-image", "");
          $("body").css("background-image", "");
          $("body").css("background-repeat", "");
          return $("body").css("background-attachment", "");
        }
      };

      VisualEditorView.prototype.addGrid = function() {

        /*
        Adds both grid & plane (for shadow casting), based on the parameters from the settings object
         */
        var gridColor, gridOpacity, gridSize, gridStep, gridText;
        if (!this.grid) {
          gridSize = this.settings.get("gridSize");
          gridStep = this.settings.get("gridStep");
          gridColor = this.settings.get("gridColor");
          gridOpacity = this.settings.get("gridOpacity");
          gridText = this.settings.get("gridText");
          this.grid = new helpers.Grid({
            size: gridSize,
            step: gridStep,
            color: gridColor,
            opacity: gridOpacity,
            addText: gridText,
            textColor: this.settings.get("textColor")
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
        helpersColor = this.settings.get("helpersColor");
        this.axes = new helpers.LabeledAxes({
          xColor: helpersColor,
          yColor: helpersColor,
          zColor: helpersColor,
          size: this.settings.get("gridSize") / 2,
          addLabels: false,
          addArrows: false
        });
        this.scene.add(this.axes);
        this.overlayAxes = new helpers.LabeledAxes({
          textColor: this.settings.get("textColor"),
          size: this.settings.get("axesSize")
        });
        return this.overlayScene.add(this.overlayAxes);
      };

      VisualEditorView.prototype.removeAxes = function() {
        this.scene.remove(this.axes);
        this.overlayScene.remove(this.overlayAxes);
        delete this.axes;
        return delete this.overlayAxes;
      };

      VisualEditorView.prototype.addCage = function(mesh) {
        return new helpers.BoundingCage({
          mesh: mesh,
          color: this.settings.get("helpersColor"),
          textColor: this.settings.get("textColor")
        });
      };

      VisualEditorView.prototype.setupPickerHelper = function() {
        var PI2, canvas, context, texture;
        canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        context = canvas.getContext('2d');
        PI2 = Math.PI * 2;
        context.beginPath();
        context.arc(0, 0, 1, 0, PI2, true);
        context.closePath();
        context.fill();
        context.fillText("X", 40, 40);
        texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        this.particleTexture = new THREE.Texture(canvas);
        this.particleTexture.needsUpdate = true;
        return this.particleMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          color: 0x000000
        });
      };

      VisualEditorView.prototype.onResize = function() {
        var dpr;
        this.width = window.innerWidth;
        this.height = window.innerHeight - 10;
        dpr = 1;
        if (window.devicePixelRatio === !void 0) {
          dpr = window.devicePixelRatio;
        }
        this.fxAAPass.uniforms['resolution'].value.set(1 / (this.width * dpr), 1 / (this.height * dpr));
        this.composer.setSize(this.width * dpr, this.height * dpr);
        this.camera.aspect = this.width / this.height;
        this.camera.setSize(this.width, this.height);
        this.renderer.setSize(this.width, this.height);
        this.camera.updateProjectionMatrix();
        return this._render();
      };

      VisualEditorView.prototype.onRender = function() {
        var container, container2;
        if (this.settings.get("showStats")) {
          this.ui.overlayDiv.append(this.stats.domElement);
        }
        this.width = $("#visual").width();
        this.height = window.innerHeight - 10;
        this.camera.aspect = this.width / this.height;
        this.camera.setSize(this.width, this.height);
        this.renderer.setSize(this.width, this.height);
        this.camera.updateProjectionMatrix();
        this._render();
        this.$el.resize(this.onResize);
        window.addEventListener('resize', this.onResize, false);
        container = $(this.ui.renderBlock);
        container.append(this.renderer.domElement);
        this.controls = new CustomOrbitControls(this.camera, this.el);
        this.controls.rotateSpeed = 1.8;
        this.controls.zoomSpeed = 4.2;
        this.controls.panSpeed = 0.8;
        this.controls.addEventListener('change', this._render);
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;
        container2 = $(this.ui.glOverlayBlock);
        container2.append(this.overlayRenderer.domElement);
        this.overlayControls = new CustomOrbitControls(this.overlayCamera, this.el);
        this.overlayControls.noPan = true;
        this.overlayControls.rotateSpeed = 1.8;
        this.overlayControls.zoomSpeed = 0;
        this.overlayControls.panSpeed = 0;
        this.overlayControls.userZoomSpeed = 0;
        return this.animate();
      };

      VisualEditorView.prototype.onDomRefresh = function() {};

      VisualEditorView.prototype._render = function() {
        THREE.EffectComposer.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        THREE.EffectComposer.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
        THREE.EffectComposer.scene = new THREE.Scene();
        THREE.EffectComposer.scene.add(THREE.EffectComposer.quad);
        return this.edgeComposer.render();

        /*
        @renderer.render(@scene, @camera)
        @overlayRenderer.render(@overlayScene, @overlayCamera)
        
        if @settings.get("showStats")
          @stats.update()
         *@cameraHelper.update()
         */
      };

      VisualEditorView.prototype.animate = function() {
        this.controls.update();
        this.overlayControls.update();
        return requestAnimationFrame(this.animate);
      };

      VisualEditorView.prototype.toCsgTest = function(mesh) {
        var csgResult;
        csgResult = THREE.CSG.toCSG(mesh);
        if (csgResult != null) {
          return console.log("CSG conversion result ok:");
        }
      };

      VisualEditorView.prototype.bla = function() {

        /*
        @rtTexture = new THREE.WebGLRenderTarget(@width, @height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } )
        vertexShader =
         """
         varying vec2 vUv;
        
        void main() {
        
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        
        }
         """
        fragShaderScreen = 
          """
        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        
        void main() {
        
          gl_FragColor = texture2D( tDiffuse, vUv );
        
        }"""
        
        materialScreen = new THREE.ShaderMaterial( {
            uniforms: { tDiffuse: { type: "t", value: rtTexture } },
            vertexShader: vertexShader,
            fragmentShader: fragShaderScreen,
            depthWrite: false
        
          } )
        material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, map: rtTexture } )
         */
      };

      VisualEditorView.prototype.outLinePasses = function() {};

      VisualEditorView.prototype.outLinePass1 = function() {
        var outlineComposer, outlinePass1, outlinePass1Target, renderTargetParameters;
        renderTargetParameters = {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBFormat,
          stencilBufer: false
        };
        outlinePass1Target = new THREE.WebGLRenderTarget(this.width, this.height, renderTargetParameters);
        outlinePass1 = new THREE.RenderPass(this.scene, this.camera);
        outlineComposer = new THREE.EffectComposer(this.renderer, outlinePass1Target);
        outlineComposer.addPass(outlinePass1);
        return outlineComposer.render();
      };

      VisualEditorView.prototype.outLinePass2 = function() {
        var outlineComposer, outlinePass2, outlinePass2Target, renderTargetParameters;
        renderTargetParameters = {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBFormat,
          stencilBufer: false
        };
        outlinePass2Target = new THREE.WebGLRenderTarget(this.width, this.height, renderTargetParameters);
        outlinePass2 = new THREE.RenderPass(this.scene, this.camera);
        outlineComposer = new THREE.EffectComposer(this.renderer, outlinePass2Target);
        outlineComposer.addPass(outlinePass2);
        return outlineComposer.render();
      };

      VisualEditorView.prototype.fromCsg = function() {

        /*
        @testCSG()
         *vertex normal to color
        normalShader=
          vertexShader :
            """
              varying vec3 vNormal;
              void main(){
                float offset = 2.0;
                vNormal = normal;
                vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );
                gl_Position = projectionMatrix * pos;
            }\n"""
            
          fragmentShader :
            """
            varying vec3 vNormal;
            void main()
            {
                float r = vNormal[0];//float(1)/ 
                float g = vNormal[1];
                float b = vNormal[2];
                gl_FragColor = vec4( r, g, b, 1.0 );
            }\n"""
        
        testMaterial = new THREE.ShaderMaterial
            uniforms: THREE.ShaderLib['basic'].uniforms,
            vertexShader: normalShader.vertexShader,
            fragmentShader: normalShader.fragmentShader,
            color: 0xFFFFFF
            transparent:false
        @csgExperiment.material = testMaterial
        return
         */
        var end, index, part, start, _ref;
        start = new Date().getTime();
        if (this.assembly != null) {
          this.scene.remove(this.assembly);
          this.current = null;
        }
        this.assembly = new THREE.Mesh(new THREE.Geometry());
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
        mesh.castShadow = this.settings.get("shadows");
        mesh.receiveShadow = this.settings.get("selfShadows") && this.settings.get("shadows");
        mesh.material.wireframe = this.settings.get("wireframe");
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

      VisualEditorView.prototype._updateAssemblyVisualAttrs = function() {
        var child, _i, _len, _ref, _results;
        if (this.assembly != null) {
          _ref = this.assembly.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            child.castShadow = this.settings.get("shadows");
            child.receiveShadow = this.settings.get("selfShadows") && this.settings.get("shadows");
            _results.push(child.material.wireframe = this.settings.get("wireframe"));
          }
          return _results;
        }
      };

      VisualEditorView.prototype._addIndicator = function(mesh) {
        var geometry, line, material;
        material = new THREE.LineDashedMaterial({
          color: 0xffaa00,
          dashSize: 3,
          gapSize: 1,
          linewidth: 2
        });
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z));
        geometry.vertices.push(new THREE.Vector3(150, 0, 150));
        geometry.vertices.push(new THREE.Vector3(150, 0, 157));
        geometry.vertices.push(new THREE.Vector3(150, 0, 160));
        line = new THREE.Line(geometry, material, THREE.LineStrip);
        return mesh.add(line);
      };

      VisualEditorView.prototype._addIndicator2 = function(mesh) {
        var cube, geometryCube, geometrySpline, hilbert3D, i, index, material, points, position, recursion, spline, subdivisions, _i, _ref;
        hilbert3D = function(center, side, iterations, v0, v1, v2, v3, v4, v5, v6, v7) {
          var half, tmp, vec, vec_s;
          half = side / 2;
          vec_s = [new THREE.Vector3(center.x - half, center.y + half, center.z - half), new THREE.Vector3(center.x - half, center.y + half, center.z + half), new THREE.Vector3(center.x - half, center.y - half, center.z + half), new THREE.Vector3(center.x - half, center.y - half, center.z - half), new THREE.Vector3(center.x + half, center.y - half, center.z - half), new THREE.Vector3(center.x + half, center.y - half, center.z + half), new THREE.Vector3(center.x + half, center.y + half, center.z + half), new THREE.Vector3(center.x + half, center.y + half, center.z - half)];
          vec = [vec_s[v0], vec_s[v1], vec_s[v2], vec_s[v3], vec_s[v4], vec_s[v5], vec_s[v6], vec_s[v7]];
          if (--iterations >= 0) {
            tmp = [];
            Array.prototype.push.apply(tmp, hilbert3D(vec[0], half, iterations, v0, v3, v4, v7, v6, v5, v2, v1));
            Array.prototype.push.apply(tmp, hilbert3D(vec[1], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3));
            Array.prototype.push.apply(tmp, hilbert3D(vec[2], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3));
            Array.prototype.push.apply(tmp, hilbert3D(vec[3], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5));
            Array.prototype.push.apply(tmp, hilbert3D(vec[4], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5));
            Array.prototype.push.apply(tmp, hilbert3D(vec[5], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7));
            Array.prototype.push.apply(tmp, hilbert3D(vec[6], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7));
            Array.prototype.push.apply(tmp, hilbert3D(vec[7], half, iterations, v6, v5, v2, v1, v0, v3, v4, v7));
            return tmp;
          }
          return vec;
        };
        cube = function(size) {
          var geometry, h;
          h = size * 0.5;
          geometry = new THREE.Geometry();
          geometry.vertices.push(new THREE.Vector3(-h, -h, -h));
          geometry.vertices.push(new THREE.Vector3(-h, h, -h));
          geometry.vertices.push(new THREE.Vector3(-h, h, -h));
          geometry.vertices.push(new THREE.Vector3(h, h, -h));
          geometry.vertices.push(new THREE.Vector3(h, h, -h));
          geometry.vertices.push(new THREE.Vector3(h, -h, -h));
          geometry.vertices.push(new THREE.Vector3(h, -h, -h));
          geometry.vertices.push(new THREE.Vector3(-h, -h, -h));
          geometry.vertices.push(new THREE.Vector3(-h, -h, h));
          geometry.vertices.push(new THREE.Vector3(-h, h, h));
          geometry.vertices.push(new THREE.Vector3(-h, h, h));
          geometry.vertices.push(new THREE.Vector3(h, h, h));
          geometry.vertices.push(new THREE.Vector3(h, h, h));
          geometry.vertices.push(new THREE.Vector3(h, -h, h));
          geometry.vertices.push(new THREE.Vector3(h, -h, h));
          geometry.vertices.push(new THREE.Vector3(-h, -h, h));
          geometry.vertices.push(new THREE.Vector3(-h, -h, -h));
          geometry.vertices.push(new THREE.Vector3(-h, -h, h));
          geometry.vertices.push(new THREE.Vector3(-h, h, -h));
          geometry.vertices.push(new THREE.Vector3(-h, h, h));
          geometry.vertices.push(new THREE.Vector3(h, h, -h));
          geometry.vertices.push(new THREE.Vector3(h, h, h));
          geometry.vertices.push(new THREE.Vector3(h, -h, -h));
          geometry.vertices.push(new THREE.Vector3(h, -h, h));
          return geometry;
        };
        subdivisions = 6;
        recursion = 1;
        points = hilbert3D(new THREE.Vector3(0, 0, 0), 25.0, recursion, 0, 1, 2, 3, 4, 5, 6, 7);
        spline = new THREE.Spline(points);
        geometrySpline = new THREE.Geometry();
        for (i = _i = 0, _ref = points.length * subdivisions; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          index = i / (points.length * subdivisions);
          position = spline.getPoint(index);
          geometrySpline.vertices[i] = new THREE.Vector3(position.x, position.y, position.z);
        }
        geometryCube = cube(350);
        geometryCube.computeLineDistances();
        geometrySpline.computeLineDistances();
        material = new THREE.LineDashedMaterial({
          color: 0xffaa00,
          dashSize: 3,
          gapSize: 1,
          linewidth: 2
        });
        cube = new THREE.Line(geometryCube, material, THREE.LinePieces);
        spline = new THREE.Line(geometrySpline, material, THREE.LinePieces);
        mesh.add(cube);
        return mesh.add(spline);
      };

      return VisualEditorView;

    })(Backbone.Marionette.ItemView);
    return VisualEditorView;
  });

}).call(this);
