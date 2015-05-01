(function() {
  var edgeHighlightPass, edgeHighlightShader;

  edgeHighlightShader = {
    uniforms: {
      "tDiffuse": {
        type: "t",
        value: null
      },
      "tDepth": {
        type: "t",
        value: null
      },
      "tNormal": {
        type: "t",
        value: null
      }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\n    vUv = vec2( uv.x, uv.y );\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "       uniform sampler2D tDiffuse;\n       varying vec2 vUv;\n\n       void main() {\n           vec4 srcColor = texture2D( tDiffuse, vUv );\n           vec4 endColor = vec4(1.0, 1.0, 1.0, 1.0)- srcColor * 200.0;\n           if(endColor[0]<0.3)\n           {\n             endColor[3]=1.0;\n           }\n           else\n           {\n             endColor[3]=0.0;\n           }\n           gl_FragColor = endColor;//vec4(1.0, 1.0, 1.0, 1.0)- srcColor * 200.0 ;\n       }"
  };

  edgeHighlightPass = new THREE.ShaderPass(edgeHighlightShader);

}).call(this);
