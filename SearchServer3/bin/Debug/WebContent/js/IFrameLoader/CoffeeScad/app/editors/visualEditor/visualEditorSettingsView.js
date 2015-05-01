(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var $, GlViewSettingsForm, VisualEditorSettingsView, boostrap, forms, marionette, _;
    $ = require('jquery');
    _ = require('underscore');
    boostrap = require('bootstrap');
    marionette = require('marionette');
    forms = require('backbone-forms');
    GlViewSettingsForm = (function(_super) {
      __extends(GlViewSettingsForm, _super);

      function GlViewSettingsForm(options) {
        if (!options.schema) {
          options.schema = {
            renderer: {
              type: 'Select',
              options: ["webgl", "canvas"]
            },
            antialiasing: 'Checkbox',
            shadows: 'Checkbox',
            shadowResolution: {
              title: 'Shadow resolution (restart required)',
              type: 'Select',
              options: ["256x256", "512x512", "1024x1024", "2048x2048", "4096x4096"]
            },
            selfShadows: {
              type: 'Checkbox',
              title: 'Object self shadowing'
            },
            showAxes: 'Checkbox',
            showConnectors: 'Checkbox',
            showGrid: 'Checkbox',
            gridSize: 'Number',
            gridStep: 'Number',
            gridColor: 'Text',
            gridOpacity: {
              type: 'Number',
              editorAttrs: {
                step: 0.1,
                min: 0,
                max: 1
              }
            },
            gridText: 'Checkbox',
            gridNumberingPosition: {
              title: 'Grid numbering position',
              type: 'Select',
              options: ['center', 'border']
            },
            showStats: 'Checkbox',
            position: {
              type: 'Select',
              options: ['diagonal', 'top', 'bottom', 'front', 'back', 'left', 'right', 'center']
            },
            projection: {
              type: 'Select',
              options: ['perspective', 'orthographic']
            },
            center: 'Checkbox',
            autoRotate: 'Checkbox',
            objectViewMode: {
              title: 'object rendering',
              type: 'Select',
              options: ['shaded', 'wireframe', 'structural']
            },
            objectOutline: 'Checkbox',
            helpersColor: 'Text',
            bgColor: {
              title: "background color",
              type: 'Text'
            },
            bgColor2: {
              title: "background color2 (gradient)",
              type: 'Text'
            },
            textColor: {
              type: 'Text'
            },
            axesSize: 'Number',
            grid: {
              type: 'Object',
              subSchema: {
                enabled: 'Checkbox',
                size: 'Number',
                steps: 'Number',
                color: 'Text',
                opacity: {
                  type: 'Number',
                  editorAttrs: {
                    step: 0.1,
                    min: 0,
                    max: 1
                  }
                },
                numbering: 'Checkbox',
                numberingPosition: {
                  title: 'Grid numbering position',
                  type: 'Select',
                  options: ['center', 'border']
                }
              }
            }
          };
          options.fieldsets = [
            {
              "legend": "Render settings",
              "fields": ["renderer", "antialiasing", "shadows", "shadowResolution", "selfShadows", "objectViewMode", "objectOutline"]
            }, {
              "legend": "View settings",
              "fields": ["position", "projection", "center", "autoRotate"]
            }, {
              "legend": "Axes and Grid settings",
              "fields": ["showAxes", "helpersColor", "showConnectors", "showGrid", "gridSize", "gridStep", "gridColor", "gridOpacity", "gridText", "gridNumberingPosition"]
            }, {
              "legend": "Extra settings",
              "fields": ["bgColor", "textColor", "axesSize", "showStats"]
            }, {
              "legend": "TEST",
              "fields": ["grid"]
            }
          ];
        }
        GlViewSettingsForm.__super__.constructor.call(this, options);
      }

      return GlViewSettingsForm;

    })(Backbone.Form);
    VisualEditorSettingsView = (function(_super) {
      __extends(VisualEditorSettingsView, _super);

      function VisualEditorSettingsView(options) {
        this.render = __bind(this.render, this);
        VisualEditorSettingsView.__super__.constructor.call(this, options);
        this.wrappedForm = new GlViewSettingsForm({
          model: this.model
        });
      }

      VisualEditorSettingsView.prototype.render = function() {
        var tmp;
        if (this.beforeRender) {
          this.beforeRender();
        }
        this.trigger("before:render", this);
        this.trigger("item:before:render", this);
        tmp = this.wrappedForm.render();
        this.$el.append(tmp.el);
        this.$el.addClass("tab-pane");
        this.$el.addClass("fade");
        this.$el.attr('id', this.model.get("name"));
        this.bindUIElements();
        if (this.onRender) {
          this.onRender();
        }
        this.trigger("render", this);
        this.trigger("item:rendered", this);
        return this;
      };

      return VisualEditorSettingsView;

    })(Backbone.Marionette.ItemView);
    return VisualEditorSettingsView;
  });

}).call(this);
