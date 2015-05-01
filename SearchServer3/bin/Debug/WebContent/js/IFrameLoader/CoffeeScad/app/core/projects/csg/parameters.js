(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(function(require) {

    /* 
    params = {
        name: 'width', 
        type: 'float', 
        default: 10,
        caption: "Width of the cube:", 
      }
     */
    var ParameterParser;
    return ParameterParser = (function() {
      function ParameterParser() {
        this.createControls = __bind(this.createControls, this);
        this.exportParams = __bind(this.exportParams, this);
        this.paramControls = [];
        this.tablerows = [];
      }

      ParameterParser.prototype.exportParams = function() {};

      ParameterParser.prototype.getParamDefinitions = function(script) {
        var e, f, params, script1, scriptisvalid;
        scriptisvalid = true;
        try {
          f = new Function(script);
          f();
        } catch (_error) {
          e = _error;
          scriptisvalid = false;
        }
        params = [];
        if (scriptisvalid) {
          script1 = "if(typeof(getParameterDefinitions) == 'function') {return getParameterDefinitions();} else {return [];} ";
          script1 += script;
          f = new Function(script1);
          params = f();
          if ((typeof params !== "object") || (typeof params.length !== "number")) {
            throw new Error("The getParameterDefinitions() function should return an array with the parameter definitions");
          }
        }
        return params;
      };

      ParameterParser.prototype.createControls = function(params) {
        var captions, control, errorprefix, index, label, option, paramDefinitions, paramdef, selectedindex, td, tr, type, valueindex, values, _i, _j, _len, _ref;
        paramDefinitions = params;
        for (index = _i = 0, _len = paramDefinitions.length; _i < _len; index = ++_i) {
          paramdef = paramDefinitions[index];
          errorprefix = "Error in parameter definition # " + index + " :";
          if (!"name" in paramdef) {
            throw new Error(" " + errorprefix + " Should include a 'name' parameter");
          }
          type = "text";
          type = __indexOf.call(paramdef, 'type') >= 0 ? paramdef.type : void 0;
          if ((type !== "text") && (type !== "int") && (type !== "float") && (type !== "choice")) {
            throw new Error("" + errorprefix + " Unknown parameter type " + type);
          }
          control = null;
          if ((type === "text") || (type === "int") || (type === "float")) {
            control = document.createElement("input");
            control.type = "text";
            if ('default' in paramdef) {
              control.value = paramdef["default"];
            } else {
              if ((type || "int") || (type || "float")) {
                control.value = "0";
              } else {
                control.value = "";
              }
            }
          } else if (type === "choice") {
            if (!('values' in paramdef)) {
              throw new Error(errorprefix + "Should include a 'values' parameter");
            }
            control = document.createElement("select");
            values = paramdef.values;
            captions = null;
            if (__indexOf.call(paramdef, 'captions') >= 0) {
              captions = paramdef.captions;
              if (captions.length !== values.length) {
                throw new Error(errorprefix + "'captions' and 'values' should have the same number of items");
              }
            } else {
              captions = values;
            }
            selectedindex = 0;
            for (valueindex = _j = 0, _ref = values.length; 0 <= _ref ? _j <= _ref : _j >= _ref; valueindex = 0 <= _ref ? ++_j : --_j) {
              option = document.createElement("option");
              option.value = values[valueindex];
              option.text = captions[valueindex];
              control.add(option);
              if (__indexOf.call(paramdef, 'default') >= 0) {
                if (paramdef["default"] === values[valueindex]) {
                  selectedindex = valueindex;
                }
              }
            }
            if (values.length > 0) {
              control.selectedIndex = selectedindex;
            }
          }
          paramControls.push(control);
          tr = document.createElement("tr");
          td = document.createElement("td");
          label = paramdef.name + ":";
          if (__indexOf.call(paramdef, 'caption') >= 0) {
            label = paramdef.caption;
          }
          td.innerHTML = label;
          tr.appendChild(td);
          td = document.createElement("td");
          td.appendChild(control);
          tr.appendChild(td);
          tablerows.push(tr);
        }
        tablerows.map(function(tr) {
          return this.parameterstable.appendChild(tr);
        });
        return this.paramControls = paramControls;
      };

      return ParameterParser;

    })();
  });

}).call(this);
