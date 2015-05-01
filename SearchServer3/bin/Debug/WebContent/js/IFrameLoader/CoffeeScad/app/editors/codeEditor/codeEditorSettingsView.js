(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var $, CodeEditorSettingsForm, CodeEditorSettingsView, boostrap, forms, marionette, _;
    $ = require('jquery');
    _ = require('underscore');
    boostrap = require('bootstrap');
    marionette = require('marionette');
    forms = require('backbone-forms');
    CodeEditorSettingsForm = (function(_super) {
      __extends(CodeEditorSettingsForm, _super);

      function CodeEditorSettingsForm(options) {
        if (!options.schema) {
          options.schema = {
            startLine: 'Number',
            fontSize: {
              type: 'Number',
              editorAttrs: {
                step: 0.1,
                min: 0.5,
                max: 1.5
              }
            },
            undoDepth: {
              type: 'Number',
              editorAttrs: {
                step: 1,
                min: 1,
                max: 100
              }
            },
            autoClose: {
              type: 'Checkbox'
            },
            highlightLine: {
              type: 'Checkbox'
            },
            showInvisibles: {
              type: 'Checkbox'
            },
            showIndentGuides: {
              type: 'Checkbox'
            },
            showGutter: {
              type: 'Checkbox'
            },
            theme: {
              type: 'Select',
              options: ["monokai", "vibrant_ink", "tomorrow_night_eighties", "terminal", "chaos", "solarized_dark", "solarized_light", "clouds", "eclipse", "github"]
            },
            doLint: {
              type: 'Checkbox',
              title: 'Lint code'
            }
          };
          options.fieldsets = [
            {
              "legend": "General settings",
              "fields": ["fontSize", "autoClose", "highlightLine", "showInvisibles", "showIndentGuides", "showGutter", "theme"]
            }, {
              "legend": "Linting",
              "fields": ["doLint"]
            }
          ];
        }
        CodeEditorSettingsForm.__super__.constructor.call(this, options);

        /* linting      :
              type: "Object"
              title:''
              subSchema:
                max_line_length: 
                  title : 'Max line length'
                  type: 'Object'
                  subSchema:
                    value:
                      title:'Max line length' 
                      type: 'Number'
                    level: 
                      title: 'Max line length Error Level'
                      type: 'Select'
                      options : ["ignore","warn", "error"]
                no_tabs:
                  title: 'No tabs'
                  type: 'Object'
                  subSchema:
                    level: 
                      type: 'Select'
                      options : ["ignore","warn", "error"]
                indentation:
                  title: "Indentation"
                  type: "Object"
                  subSchema:
                    value:{type:'Number'}
                    level: 
                      type: 'Select'
                      options : ["ignore","warn", "error"]
                no_trailing_whitespace:
                  title: "Trailing whitespaces"
                  type: "Object"
                  subSchema:
                    level: 
                      type: 'Select'
                      options : ["ignore","warn", "error"]
                no_trailing_semicolons:
                  title: "Trailing semicolons"
                  type: "Object"
                  subSchema:
                    level: 
                      type: 'Select'
                      options : ["ignore","warn", "error"]
         */
      }

      return CodeEditorSettingsForm;

    })(Backbone.Form);
    CodeEditorSettingsView = (function(_super) {
      __extends(CodeEditorSettingsView, _super);

      function CodeEditorSettingsView(options) {
        this.render = __bind(this.render, this);
        CodeEditorSettingsView.__super__.constructor.call(this, options);
        this.wrappedForm = new CodeEditorSettingsForm({
          model: this.model
        });
      }

      CodeEditorSettingsView.prototype.render = function() {
        var tmp;
        tmp = this.wrappedForm.render();
        this.$el.append(tmp.el);
        this.$el.addClass("tab-pane");
        this.$el.addClass("fade");
        this.$el.attr('id', this.model.get("name"));
        return this.el;
      };

      return CodeEditorSettingsView;

    })(Backbone.Marionette.ItemView);
    return CodeEditorSettingsView;
  });

}).call(this);
