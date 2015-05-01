(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var CAGBase, CoffeeScript, CsgProcessor, csg, reqRes, utils;
    reqRes = require('core/messaging/appReqRes');
    utils = require("core/utils/utils");
    CoffeeScript = require('CoffeeScript');
    csg = require('./csg');
    CAGBase = csg.CAGBase;
    CsgProcessor = (function() {
      function CsgProcessor() {
        this._prepareScriptSync = __bind(this._prepareScriptSync, this);
        this._prepareScriptASync = __bind(this._prepareScriptASync, this);
        this._convertResultsTo3dSolid = __bind(this._convertResultsTo3dSolid, this);
        this.rebuildSolid = __bind(this.rebuildSolid, this);
      }

      CsgProcessor.prototype.construtor = function() {
        this.async = false;
        return this.debug = false;
      };

      CsgProcessor.prototype.processScript = function(script, async, params, callback) {
        if (async == null) {
          async = false;
        }
        this.script = script;
        this.async = async;
        this.params = params;
        this.callback = callback;
        return this.rebuildSolid();
      };

      CsgProcessor.prototype.rebuildSolid = function() {
        var error, lineOffset;
        console.log("Using background rebuild:" + this.async);
        this.processing = true;
        try {
          if (this.async) {
            this._prepareScriptASync();
            this.parseScriptASync(this.script, this.params);
          } else {
            this._prepareScriptSync();
            this.parseScriptSync(this.script, this.params);
          }
          return this.processing = false;
        } catch (_error) {
          error = _error;
          if (error.location != null) {
            if (this.async) {
              lineOffset = -11;
            } else {
              lineOffset = -15;
            }
            error.location.first_line = error.location.first_line + lineOffset;
          }
          this.callback(null, null, null, error);
          return this.processing = false;
        }
      };

      CsgProcessor.prototype._convertResultsTo3dSolid = function(baseAssembly) {
        var child, extruded, i, newChildren, oChild, _i, _j, _k, _len, _len1, _ref, _ref1, _results;
        newChildren = [];
        _ref = baseAssembly.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          this._convertResultsTo3dSolid(child);
          if (child instanceof CAGBase) {
            extruded = child.extrude({
              offset: [0, 0, 1]
            });
            console.log(child.children);
            for (i = _j = _ref1 = child.children.length - 1; _j >= 0; i = _j += -1) {
              oChild = child.children[i];
              extruded.add(oChild);
            }
            newChildren.push(extruded);
          } else {
            newChildren.push(child);
          }
        }
        baseAssembly.clear();
        _results = [];
        for (_k = 0, _len1 = newChildren.length; _k < _len1; _k++) {
          child = newChildren[_k];
          console.log("adding", child, "to end result");
          _results.push(baseAssembly.add(child));
        }
        return _results;
      };

      CsgProcessor.prototype._prepareScriptASync = function() {
        this.script = "{rootAssembly, BaseMaterial,CAGBase,CSGBase,circle,Circle,Connector,cube,Cube,cylinder,Cylinder,extend,Line2D,Line3D,log,Material,Matrix4x4,\nmerge, OrthoNormalBasis,Part,Path2D,Plane,Polygon,PolygonShared,Properties, rectangle,Rectangle,\nSide, sphere, Sphere,Vector2D,Vector3D,\nVertex,Vertex2D,classRegistry,hull,intersect, otherRegistry,register,rotate,\n   scale, solve2Linear,subtract,translate,union}=csg\n\n#clear rootAssembly\nrootAssembly.clear()\n\nassembly = rootAssembly\n\n#include script\n" + this.script + "\n";
        return this.script = CoffeeScript.compile(this.script, {
          bare: true
        });
      };

      CsgProcessor.prototype._prepareScriptSync = function() {
        this.script = "{rootAssembly, BaseMaterial,CAGBase,CSGBase,circle,Circle,Connector,cube,Cube,cylinder,Cylinder,extend,Line2D,Line3D,log,Material,Matrix4x4,\nmerge, OrthoNormalBasis,Part,Path2D,Plane,Polygon,PolygonShared,Properties, rectangle,Rectangle,\nSide, sphere, Sphere,Vector2D,Vector3D,\nVertex,Vertex2D,classRegistry,hull,intersect, otherRegistry,register,rotate,\n   scale, solve2Linear,subtract,translate,union}=csg\n\n#clear log entries\nlog.entries = []\n#clear rootAssembly\nrootAssembly.clear()\n\nassembly = rootAssembly\n\n#include script\n" + this.script + "\n#return results as an object for cleaness\nreturn result = {\"rootAssembly\":rootAssembly,\"partRegistry\":classRegistry, \"logEntries\":log.entries}\n";
        return this.script = CoffeeScript.compile(this.script, {
          bare: true
        });
      };

      CsgProcessor.prototype.parseScriptSync = function(script, params) {
        var f, logEntries, partRegistry, result, rootAssembly, workerscript;
        workerscript = script;
        if (this.debug) {
          workerscript += "//Debugging;\n";
          workerscript += "debugger;\n";
        }
        partRegistry = {};
        logEntries = [];
        f = new Function("partRegistry", "logEntries", "csg", "params", workerscript);
        result = f(partRegistry, logEntries, csg, params);
        rootAssembly = result.rootAssembly, partRegistry = result.partRegistry, logEntries = result.logEntries;
        console.log("RootAssembly", rootAssembly);
        this._convertResultsTo3dSolid(rootAssembly);
        return this.callback(rootAssembly, partRegistry, logEntries);
      };

      CsgProcessor.prototype.parseScriptASync = function(script, params) {
        var blobURL, rootUrl, worker, workerScript;
        rootUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
        rootUrl = rootUrl.replace('index.html', '');
        console.log("rootUrl " + rootUrl);
        params = JSON.stringify(params);
        workerScript = "var rootUrl = \"" + rootUrl + "\";\nvar params = " + params + ";\nimportScripts(rootUrl + '/assets/js/libs/require.min.js');\ncsg = null;\nrequire(\n  {baseUrl: rootUrl +\"/app\"},[\"require\",\"core/projects/csg/csg\"],\n  function(require,csg){\n      try\n      {\n        //params = JSON.parse(params)\n        " + script + "\n        var result_compact = rootAssembly.toCompactBinary()\n        postMessage({cmd: 'rendered', rootAssembly: result_compact, partRegistry:classRegistry,'logEntries':log.entries});\n      }\n      catch(error)\n      {\n        postMessage({cmd: 'error', err: {msg:error.message, lineNumber:error.lineNumber,stack:error.stack} });\n      }\n      \n});";

        /*
        onmessage = function(e) 
        { 
              var data = e.data;
              if(data == 'render')
              {
                try
                {
                   *{script}
                  var result_compact = assembly.toCompactBinary()
                  postMessage({cmd: 'rendered', rootAssembly: result_compact, partRegistry:classRegistry});
                }
                catch(error)
                {
                  postMessage({cmd: 'error', err: {msg:error.message, lineNumber:error.lineNumber,stack:error.stack} });
                }
              }
              if(data == 'stop')
              {
                postMessage('msg from worker: I WILL STOP'); 
              }
              if(data == 'msg')
              {
                 //postMessage({txt: "Got", cmd:"log"});
              }
        }
         */
        blobURL = utils.textToBlobUrl(workerScript);
        worker = new Worker(blobURL);
        worker.onmessage = (function(_this) {
          return function(e) {
            var converters, err, error, logEntries, partRegistry, rootAssembly;
            if (e.data) {
              if (e.data.cmd === 'rendered') {
                logEntries = e.data.logEntries;
                converters = require('./converters');
                rootAssembly = converters.fromCompactBinary(e.data.rootAssembly);
                _this._convertResultsTo3dSolid(rootAssembly);
                partRegistry = e.data.partRegistry;
                return _this.callback(rootAssembly, partRegistry, logEntries);
              } else if (e.data.cmd === "error") {
                err = e.data.err;
                error = new Error(err.msg);
                error.lineNumber = err.lineNumber;
                error.stack = err.stack;
                return _this.callback(null, null, null, error);
              } else if (e.data.cmd === "log") {
                return console.log(e.data.txt);
              }
            }
          };
        })(this);
        worker.onerror = (function(_this) {
          return function(error) {
            var errtxt;
            errtxt = "Error in line " + error.lineno + ": " + error.message;
            return _this.callback(null, null, null, errtxt);
          };
        })(this);
        worker.postMessage("render");
      };

      return CsgProcessor;

    })();

    /* 
      createParamControls: ->
         *@parameterstable.innerHTML = ""
        @paramControls = []
        paramControls = []
        tablerows = []
        for i in [0..@paramDefinitions.length]
          errorprefix = "Error in parameter definition #"+(i+1)+": "
          paramdef = @.paramDefinitions[i]
          if !('name' in paramdef) then throw new Error(errorprefix + "Should include a 'name' parameter")
          type = "text"
          type = if 'type' in paramdef then paramdef.type
    
          if( (type != "text") && (type != "int") && (type != "float") && (type != "choice") )
            throw new Error(errorprefix + "Unknown parameter type '"+type+"'")
          control = null
          if( (type == "text") || (type == "int") || (type == "float") )
            control = document.createElement("input")
            control.type = "text"
            if('default' in paramdef)
              control.value = paramdef.default
            else
              if( (type == "int") || (type == "float") )
                control.value = "0"
              else
                control.value = ""
          else if(type == "choice")
            if !('values' in paramdef) then throw new Error(errorprefix + "Should include a 'values' parameter") 
            control = document.createElement("select")
            values = paramdef.values
            captions=null
            if 'captions' in paramdef
              captions = paramdef.captions;
              if captions.length != values.length then throw new Error(errorprefix + "'captions' and 'values' should have the same number of items")
            else
              captions = values
            selectedindex = 0
            for valueindex in [0..values.length]
              option = document.createElement("option")
              option.value = values[valueindex]
              option.text = captions[valueindex]
              control.add(option)
              if 'default' in paramdef
                if paramdef.default == values[valueindex]
    
                  selectedindex = valueindex
                  
            if values.length > 0
              control.selectedIndex = selectedindex
    
          paramControls.push(control)
          tr = document.createElement("tr")
          td = document.createElement("td")
          label = paramdef.name + ":"
          if 'caption' in paramdef
            label = paramdef.caption
    
          td.innerHTML = label
          tr.appendChild(td)
          td = document.createElement("td")
          td.appendChild(control)
          tr.appendChild(td)
          tablerows.push(tr)
          
        tablerows.map((tr) ->
          @parameterstable.appendChild(tr)
        )
        @paramControls = paramControls
    
      getParamDefinitions: (script)->
        scriptisvalid = true
        try
           * first try to execute the script itself
           * this will catch any syntax errors
          f = new Function(script)
          f()
        catch e 
          scriptisvalid = false;
        params = []
        if(scriptisvalid)
          script1 = "if(typeof(getParameterDefinitions) == 'function') {return getParameterDefinitions();} else {return [];} "
          script1 += script
          f = new Function(script1)
          params = f()
          if( (typeof(params) != "object") || (typeof(params.length) != "number") )
            throw new Error("The getParameterDefinitions() function should return an array with the parameter definitions")
        return params
        
       getParamValues: ()->
         if @debug
           console.log("Getting param values")
           console.log("#{@paramDefinitions.length}")
         paramValues = {}
         for i in [0...@paramDefinitions.length]
            paramdef = @paramDefinitions[i]
            type = "text"
            if 'type' in paramdef
              type = paramdef.type
            control = @paramControls[i]
            value = ""
            if( (type == "text") || (type == "float") || (type == "int") )
              value = control.value;
              if( (type == "float") || (type == "int") )
                isnumber = !isNaN(parseFloat(value)) && isFinite(value)
                if(!isnumber)
                  throw new Error("Not a number: "+value)
                if(type == "int")
                  value = parseInt(value)
                else
                  value = parseFloat(value);
    
            else if type == "choice"
              value = control.options[control.selectedIndex].value
            paramValues[paramdef.name] = value
         if @debug
           console.log("Finished getting param values")
         return paramValues
     */
    return CsgProcessor;
  });

}).call(this);
