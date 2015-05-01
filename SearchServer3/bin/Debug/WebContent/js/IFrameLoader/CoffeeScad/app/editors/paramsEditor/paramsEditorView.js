(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(function(require) {
    var $, ParamsEditorView, jquery_layout, jquery_ui, marionette, template, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    jquery_layout = require('jquery_layout');
    jquery_ui = require('jquery_ui');
    vent = require('core/messaging/appVent');
    template = require("text!./paramsEditorView.tmpl");
    require('colorpicker');
    require('slider');
    ParamsEditorView = (function(_super) {
      __extends(ParamsEditorView, _super);

      ParamsEditorView.prototype.template = template;

      ParamsEditorView.prototype.className = "paramsEditor";

      ParamsEditorView.prototype.events = {
        "resize:start": "onResizeStart",
        "resize:stop": "onResizeStop",
        "resize": "onResizeStop",
        "change .myParams": "onParamChanged",
        "click .applyParams": "onParamsApply",
        "change .autoUpdate": "onAutoUpdateChanged",
        "change .preventUiRegen": "onPreventUiRegenChanged",
        "change .color-text": "onColorTextChanged",
        "input .color-text": "onColorTextChanged",
        "paste .color-text": "onColorTextChanged"
      };

      function ParamsEditorView(options) {
        this.onParamsGenerated = __bind(this.onParamsGenerated, this);
        this.addFieldToFieldSet = __bind(this.addFieldToFieldSet, this);
        this.onParamsApply = __bind(this.onParamsApply, this);
        this.onSliderChanged = __bind(this.onSliderChanged, this);
        this.onColorChanged = __bind(this.onColorChanged, this);
        this.onColorTextChanged = __bind(this.onColorTextChanged, this);
        this.onParamChanged = __bind(this.onParamChanged, this);
        this.onPreventUiRegenChanged = __bind(this.onPreventUiRegenChanged, this);
        this.onAutoUpdateChanged = __bind(this.onAutoUpdateChanged, this);
        this._applyParamChange = __bind(this._applyParamChange, this);
        this.render = __bind(this.render, this);
        this.onRender = __bind(this.onRender, this);
        this.onResizeStop = __bind(this.onResizeStop, this);
        this.onResizeStart = __bind(this.onResizeStart, this);
        this.onDomRefresh = __bind(this.onDomRefresh, this);
        ParamsEditorView.__super__.constructor.call(this, options);
        this.settings = options.settings;
        this.project = options.model;
        this.project.on("compiled:params", this.onParamsGenerated);
        this.autoUpdateBasedOnParams = true;
        this.preventUiRegen = true;
        this._drawnOnce = false;
      }

      ParamsEditorView.prototype.onDomRefresh = function() {
        $('.colorpicker').colorpicker().on('changeColor', this.onColorChanged);
        $('.slider').slider().on('slide', this.onSliderChanged);
        return this.$el.find('[rel=tooltip]').tooltip({
          'placement': 'bottom'
        });
      };

      ParamsEditorView.prototype.onResizeStart = function() {};

      ParamsEditorView.prototype.onResizeStop = function() {};

      ParamsEditorView.prototype.onRender = function() {};

      ParamsEditorView.prototype.render = function() {
        this.isClosed = false;
        this.triggerMethod("before:render", this);
        this.triggerMethod("item:before:render", this);
        if (this.newRootEl != null) {
          this.$el.html("");
          this.$el.append(this.newRootEl);
        }
        this.bindUIElements();
        this.triggerMethod("render", this);
        this.triggerMethod("item:rendered", this);
        return this;
      };

      ParamsEditorView.prototype._componentToHex = function(c) {
        var hex, _ref;
        hex = c.toString(16);
        return (_ref = hex.length === 1) != null ? _ref : "0" + {
          hex: hex
        };
      };

      ParamsEditorView.prototype._rgbaToHex = function(r, g, b, a) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
      };

      ParamsEditorView.prototype._hexToRgba = function(hex) {
        var result, shorthandRegex;
        shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b, a) {
          return r + r + g + g + b + b + a + a;
        });
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
        return {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: result[4] != null ? parseInt(result[4], 16) : 1
        };
      };

      ParamsEditorView.prototype._applyParamChange = function(paramName, paramValue) {
        var param;
        console.log("paramName", paramName, "paramValue", paramValue);
        if (this.project.meta.modParams == null) {
          this.project.meta.modParams = {};
          for (param in this.project.meta.params) {
            this.project.meta.modParams[param] = this.project.meta.params[param];
          }
        }
        this.project.meta.modParams[paramName] = paramValue;
        if (this.autoUpdateBasedOnParams) {
          return vent.trigger("project:compile");
        }
      };

      ParamsEditorView.prototype.onAutoUpdateChanged = function(e) {
        var autoUpdate;
        autoUpdate = $(".autoUpdate").prop('checked');
        this.autoUpdateBasedOnParams = autoUpdate;
        return console.log(this.autoUpdateBasedOnParams);
      };

      ParamsEditorView.prototype.onPreventUiRegenChanged = function() {
        var preventUiRegen;
        preventUiRegen = $(".preventUiRegen").prop('checked');
        this.preventUiRegen = preventUiRegen;
        return console.log(this.preventUiRegen);
      };

      ParamsEditorView.prototype.onParamChanged = function(e) {
        var paramName, paramValue;
        console.log("param changed", e);
        if ($(e.srcElement).is('input:checkbox')) {
          paramValue = $(e.srcElement).prop('checked');
        } else if ($(e.srcElement).is('input:text')) {
          paramValue = e.srcElement.value;
        } else if ($(e.srcElement).is('input')) {
          paramValue = e.srcElement.valueAsNumber;
        } else if ($(e.srcElement).is('select')) {
          paramValue = $(e.srcElement).val();
        }
        paramName = e.srcElement.id;
        return this._applyParamChange(paramName, paramValue);
      };

      ParamsEditorView.prototype.onColorTextChanged = function(e) {
        var bleh, color, colorText, comp, index, paramName, paramValue, _i, _len;
        console.log("color change");
        colorText = e.srcElement.value;
        paramName = e.srcElement.parentElement.id;
        if (colorText.indexOf("rgb") !== -1) {
          color = colorText.replace("rgba", "").replace("rgb", "").replace("(", "").replace(")", "").replace(/\s/g, "");
          color = color.split(',');
          for (index = _i = 0, _len = color.length; _i < _len; index = ++_i) {
            comp = color[index];
            color[index] = parseInt(comp);
          }
          paramValue = color;
        }
        paramValue = [paramValue[0] / 255, paramValue[1] / 255, paramValue[2] / 255, paramValue[3]];
        bleh = $("#" + paramName).find(".color-visual");
        bleh.css('background-color', colorText);
        return this._applyParamChange(paramName, paramValue);
      };

      ParamsEditorView.prototype.onColorChanged = function(e) {
        var paramName, paramValue;
        console.log("color change", e.color.toRGB());
        console.log(e);
        paramName = e.currentTarget.id;
        paramValue = e.color.toRGB();
        paramValue = [paramValue.r / 255, paramValue.g / 255, paramValue.b / 255, paramValue.a];
        console.log("Color name:", paramName, " value", paramValue);
        return this._applyParamChange(paramName, paramValue);
      };

      ParamsEditorView.prototype.onSliderChanged = function(e) {
        var paramName, paramValue;
        console.log("slider change", e.value);
        console.log(e);
        paramValue = e.value;
        paramName = e.currentTarget.id;
        return this._applyParamChange(paramName, paramValue);
      };

      ParamsEditorView.prototype.onParamsApply = function() {
        return vent.trigger("project:compile");
      };

      ParamsEditorView.prototype.addFieldToFieldSet = function(parentEl, param) {
        var container, control, getParamValue, label, paramValue, rgbaValue, toolTip, val, vals, values, _i, _len;
        getParamValue = (function(_this) {
          return function(param) {
            var paramValue;
            if (_this.project.meta.modParams != null) {
              if (param.name in _this.project.meta.modParams) {
                paramValue = _this.project.meta.modParams[param.name];
              } else {
                paramValue = param["default"];
              }
            } else {
              paramValue = param["default"];
            }
            return paramValue;
          };
        })(this);
        console.log("param", param);
        paramValue = getParamValue(param);
        console.log("paramValue", paramValue);
        container = $('<div>', {
          "class": "control-group field-" + param.name
        });
        label = "<label class=\"control-label\" for=\"" + param.name + "\">" + param.name + "</label>";
        toolTip = "<div class=\"help-inline\"> <span><a href=\"#\" data-toggle=\"tooltip\" rel=\"tooltip\" title=\"" + param.caption + "\"><i class=\"icon-question-sign icon-medium\"/></a></span><div>";
        switch (param.type) {
          case "float":
          case "int":
            control = "<div class=\"controls\"> <input type='number' value='" + paramValue + "' id='" + param.name + "' class='myParams'/> " + toolTip + " </div>";
            break;
          case "checkbox":
            control = "<div class=\"controls\"> <input class='myParams' type='checkbox' id='" + param.name + "' " + (param["default"] === true ? 'checked' : '') + "/> " + toolTip + " </div>";
            break;
          case "select":
            values = param.values.split(',');
            vals = "";
            for (_i = 0, _len = values.length; _i < _len; _i++) {
              val = values[_i];
              vals += "<option value=" + val + ">" + val + "</option>";
            }
            control = "<div class=\"controls\"> <select id='" + param.name + "' class='myParams'> " + vals + " </select>" + toolTip + "</div>";
            break;
          case "color":
            if (__indexOf.call(paramValue, "#") >= 0) {
              paramValue = this._hexToRgba(paramValue);
            }
            rgbaValue = "rgba(" + paramValue.r + ", " + paramValue.g + ", " + paramValue.b + ", " + paramValue.a + ")";
            control = "<div class=\"controls\">\n<div class=\"input-append color colorpicker\" data-color=\"" + rgbaValue + "\" data-color-format=\"rgba\" id='" + param.name + "'>\n  <input type=\"text\" class=\"span2 color-text\" value=\"" + rgbaValue + "\" >\n  <span class=\"add-on\"><i class=\"color-visual\" style=\"background-color: " + rgbaValue + ";\"></i></span>\n</div>\n" + toolTip + "</div>";
            break;
          case "slider":
            control = "<div class=\"controls\">\n  <div>\n  " + param.min + "&nbsp<input id='" + param.name + "' type=\"text\" class=\"span2 slider\" value=\"\" \n    data-slider-min=\"" + param.min + "\" data-slider-max=\"" + param.max + "\" data-slider-step=\"" + param.step + "\" data-slider-value=\"" + paramValue + "\" \n    data-slider-orientation=\"horizontal\" data-slider-selection=\"after\"data-slider-tooltip=\"show\" data-slider-handle=\"square\">&nbsp" + param.max + "\n  " + toolTip + "\n  </div>\n</div>";
        }
        container.append(label);
        container.append(control);
        return parentEl.append(container);
      };

      ParamsEditorView.prototype.onParamsGenerated = function() {
        var field, fieldSet, fieldSetData, param, paramName, parametrizerSettings, parametrizerSettingsFieldSet, rootEl, unTreatedParams, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
        if ((!this.preventUiRegen) || (this.preventUiRegen && !this._drawnOnce)) {
          rootEl = $('<div>', {
            id: "paramsContainer",
            "class": "form-horizontal"
          });
          if (this.project.meta.rawParams != null) {
            unTreatedParams = {};
            _ref = this.project.meta.rawParams.fields;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              param = _ref[_i];
              unTreatedParams[param.name] = param;
            }
            _ref1 = this.project.meta.rawParams.fieldsets;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              fieldSetData = _ref1[_j];
              console.log("fieldset", fieldSetData);
              fieldSet = $('<div>');
              fieldSet.append("<legend>" + (fieldSetData.legend || "Default fieldset Name") + "</legend>");
              _ref2 = fieldSetData.fields;
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                field = _ref2[_k];
                param = unTreatedParams[field];

                /* 
                for paramData in @project.meta.rawParams.fields
                  if paramData.name == field
                    param = paramData
                    break
                 */
                if (param != null) {
                  this.addFieldToFieldSet(fieldSet, param);
                  delete unTreatedParams[field];
                }
              }
              rootEl.append(fieldSet);
            }
            fieldSet = $('<div>');
            fieldSet.append("<legend>Other</legend>");
            for (paramName in unTreatedParams) {
              param = unTreatedParams[paramName];
              this.addFieldToFieldSet(fieldSet, param);
              delete unTreatedParams[field];
            }
            rootEl.append(fieldSet);

            /* 
            for param in @project.meta.rawParams.fields
              console.log "param",param
              paramValue = getParamValue( param )
              console.log "paramValue",paramValue
              
              container = $('<div>',{class: "control-group field-#{param.name}"})
              label = """<label class="control-label" for="#{param.name}">#{param.name}</label>"""
              toolTip = """<div class="help-inline"> <span><a href="#" data-toggle="tooltip" rel="tooltip" title="#{param.caption}"><i class="icon-question-sign icon-medium"/></a></span><div>"""
              
              switch param.type
                when "float", "int"
                  control = """<div class="controls"> <input type='number' value='#{paramValue}' id='#{param.name}' class='myParams'/> #{toolTip} </div>"""
                
                when "checkbox"   
                  control = """<div class="controls"> <input class='myParams' type='checkbox' id='#{param.name}' #{if param.default==true then 'checked' else ''}/> #{toolTip} </div>"""
                
                when "select"
                  values = param.values.split(',')
                  vals = ""
                  for val in values
                    vals += "<option value=#{val}>#{val}</option>"
                  control = """<div class="controls"> <select id='#{param.name}' class='myParams'> #{vals} </select>#{toolTip}</div>"""
                    
                when "color"
                  if "#" in paramValue
                    paramValue = @_hexToRgba(paramValue)
                  rgbaValue = "rgba(#{paramValue.r}, #{paramValue.g}, #{paramValue.b}, #{paramValue.a})"
                  control = """
                  <div class="controls">
                  <div class="input-append color colorpicker" data-color="#{rgbaValue}" data-color-format="rgba" id='#{param.name}'>
                    <input type="text" class="span2" value="#{rgbaValue}" readonly="">
                    <span class="add-on"><i style="background-color: #{rgbaValue};"></i></span>
                  </div>
                   *{toolTip}</div>"""
                 
                when "slider"
                  control = """
                  <div class="controls">
                    <div>
                     *{param.min}&nbsp<input id='#{param.name}' type="text" class="span2 slider" value="" 
                      data-slider-min="#{param.min}" data-slider-max="#{param.max}" data-slider-step="#{param.step}" data-slider-value="#{paramValue}" 
                      data-slider-orientation="horizontal" data-slider-selection="after"data-slider-tooltip="show" data-slider-handle="square">&nbsp#{param.max}
                    
                     *{toolTip}
                    </div>
                  </div>"""
                  
              container.append(label)
              container.append(control)
              rootEl.append(container)
             */
            parametrizerSettingsFieldSet = $('<div>');
            parametrizerSettingsFieldSet.append("<legend>Parametrizer settings</legend>");
            parametrizerSettings = $('<div>', {
              "class": "control-group field-parametrizerSettings"
            });
            parametrizerSettings.append("<div class='control-group field-autoUpdate'><label class=\"control-label\" for=\"autoUpdate\">Auto update</label> <div class=\"controls\"> <input class='autoUpdate' id='autoUpdate' type='checkbox' " + (this.autoUpdateBasedOnParams ? 'checked' : '') + " /></div></div>");
            parametrizerSettings.append("<div class='control-group field-preventUiRegen'><label class=\"control-label\" for=\"preventUiRegen\">Keep ui</label> <div class=\"controls\">   <input class='preventUiRegen' id='preventUiRegen' type='checkbox' " + (this.preventUiRegen ? 'checked' : '') + " /></div></div>");
            parametrizerSettings.append("<div class='control-group field-applyParams'><button class='applyParams'>Apply Params</button></div>");
            parametrizerSettingsFieldSet.append(parametrizerSettings);
            rootEl.append(parametrizerSettingsFieldSet);
            this._drawnOnce = true;
            this.newRootEl = rootEl;
            return this.render();
          }
        }
      };

      return ParamsEditorView;

    })(Backbone.Marionette.Layout);
    return ParamsEditorView;
  });

}).call(this);
