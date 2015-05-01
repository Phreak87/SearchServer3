(function() {
  define(function(require) {
    var THREE, colorInvertShader, depthExtractShader, depthExtractShaderOld, outlineShader, outlineShader_;
    THREE = require('three');
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
    depthExtractShaderOld = {
      uniforms: {
        "tDiffuse": {
          type: "t",
          value: null
        }
      },
      vertexShader: "varying vec2 vUv;\nvoid main() {\n    vUv = vec2( uv.x, uv.y );\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
      fragmentShader: "vec4 pack (float depth)\n{\n  const vec4 c_bias = vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);\n \n  float r = depth;\n  float g = fract(r * 255.0);\n  float b = fract(g * 255.0);\n  float a = fract(b * 255.0);\n  vec4 color = vec4(r, g, b, a);\n \n  return color - (color.yzww * c_bias);\n}\n\nvoid main()\n{\n  const float c_LinearDepthConstant = 1.0 / (1.0 - 30.0);\n  float linearDepth = length(v_vPosition) * c_LinearDepthConstant;\n \n  gl_FragColor = pack(linearDepth);\n}\n"
    };
    depthExtractShader = {
      uniforms: {
        "tDiffuse": {
          type: "t",
          value: null
        },
        "tDepth": {
          type: "t",
          value: null
        },
        "size": {
          type: "v2",
          value: new THREE.Vector2(512, 512)
        },
        "cameraNear": {
          type: "f",
          value: 1
        },
        "cameraFar": {
          type: "f",
          value: 100
        }
      },
      vertexShader: "varying vec2 vUv;\nvoid main() \n{\n    vUv = vec2( uv.x, uv.y );\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
      fragmentShader: "    uniform sampler2D tDiffuse;\n    uniform sampler2D tDepth;\n    \n    varying vec2 vUv;\n    uniform float cameraNear;\n    uniform float cameraFar;\n    uniform vec2 size;// texture width, height\n    \n    \n    float cameraFarPlusNear = cameraFar + cameraNear;\n    float cameraFarMinusNear = cameraFar - cameraNear;\n    float cameraCoef = 2.0 * cameraNear;\n    \n    float unpackDepth( const in vec4 rgba_depth ) \n    {\n      const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n      float depth = dot( rgba_depth, bit_shift );\n      return depth;\n    }\n    \n    float readDepth( const in vec2 coord ) \n    {\n      return cameraCoef / ( cameraFarPlusNear - unpackDepth( texture2D( tDiffuse, coord ) ) * cameraFarMinusNear );\n    }\n    /*\n    float compareDepths( const in float depth1, const in float depth2, inout int far ) \n    {\n      float garea = 2.0;                         // gauss bell width\n      float diff = ( depth1 - depth2 ) * 100.0; // depth difference (0-100)\n\n      // reduce left bell width to avoid self-shadowing\n\n      if ( diff < gDisplace ){\n        garea = diffArea;\n      } else {\n       far = 1;\n      }\n\n      float dd = diff - gDisplace;\n      float gauss = pow( EULER, -2.0 * dd * dd / ( garea * garea ) );\n      return gauss;\n    }*/\n    \n     void main()\n    {\n      float depth = readDepth( vUv );\n      float depthClampled = clamp( depth, 0.0, 1.0 );\n      \n      gl_FragColor = vec4(depthClampled, depthClampled, depthClampled,1);\n    }\n    "
    };
    outlineShader_ = (function(_this) {
      return function() {
        var outline, testMaterial;
        outline = {
          uniforms: {
            "linewidth": {
              type: "f",
              value: 0.3
            }
          },
          vertex_shader: ["uniform float linewidth;", "void main() {", "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "vec4 displacement = vec4( normalize( normalMatrix * normal ) * linewidth, 0.0 ) + mvPosition;", "gl_Position = projectionMatrix * displacement;", "}"].join("\n"),
          fragment_shader: ["void main() {", "gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );", "}"].join("\n")
        };
        testMaterial = new THREE.ShaderMaterial({
          uniforms: outline.uniforms,
          vertexShader: outline.vertexShader,
          fragmentShader: outline.fragmentShader,
          color: 0x0000FF,
          transparent: false
        });
        return testMaterial;
      };
    })(this);
    outlineShader = (function(_this) {
      return function() {
        var fragmentShader, testMaterial, vertexShader;
        vertexShader = "void main(){" + "float offset = 2.0;" + "vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );" + "gl_Position = projectionMatrix * pos;" + "}\n";
        fragmentShader = "void main(){" + "gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );" + "}\n";
        console.log("THREE.ShaderLib", THREE.ShaderLib);
        testMaterial = new THREE.ShaderMaterial({
          uniforms: THREE.ShaderLib['basic'].uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          color: 0x0000FF,
          transparent: false
        });
        return testMaterial;
      };
    })(this);
    return {
      "colorInvertShader": colorInvertShader,
      "depthExtractShader": depthExtractShader
    };
  });

}).call(this);
