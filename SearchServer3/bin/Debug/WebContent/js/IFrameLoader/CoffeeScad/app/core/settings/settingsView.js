(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, GeneralSettingsForm, GeneralSettingsWrapper, KeyBindingsWrapper, KeybindingsForm, SettingContent, SettingContentItemView, SettingHeader, SettingHeaderItemView, SettingsView, bootstrap, forms, forms_bstrap, forms_custom, forms_list, marionette, reqRes, s_template, sc_template, sca_template, sh_template, sha_template, _;
    $ = require('jquery');
    _ = require('underscore');
    bootstrap = require('bootstrap');
    marionette = require('marionette');
    forms = require('backbone-forms');
    forms_bstrap = require('forms_bootstrap');
    forms_list = require('forms_list');
    forms_custom = require('forms_custom');
    s_template = require("text!./settings.tmpl");
    sh_template = require("text!./settingsHeader.tmpl");
    sha_template = require("text!./settingsHeaderAll.tmpl");
    sc_template = require("text!./settingsContent.tmpl");
    sca_template = require("text!./settingsContentAll.tmpl");
    reqRes = require('core/messaging/appReqRes');
    SettingsView = (function(_super) {
      __extends(SettingsView, _super);

      SettingsView.prototype.template = s_template;

      SettingsView.prototype.regions = {
        tabHeaders: "#tabHeaders",
        tabContent: "#tabContent"
      };

      SettingsView.prototype.ui = {
        tabHeaders: "#tabHeaders",
        tabContent: "#tabContent"
      };

      SettingsView.prototype.events = {
        "mouseup .applySettings": "applySettings",
        "mouseup .resetSettings": "resetSettings"
      };

      SettingsView.prototype.applySettings = function(ev) {
        var form, index, _ref;
        _ref = this.tabContent.currentView.forms;
        for (index in _ref) {
          form = _ref[index];
          form.commit({
            validate: true
          });
        }
        return this.model.save();
      };

      SettingsView.prototype.resetSettings = function(ev) {

        /* 
        for index, form of @tabContent.currentView.forms
          console.log "index, form", index, form
          model = form.model
          defaults = model.defaults
          console.log "model defaults",  defaults
          model.set(defaults)
           *model.clear().set(defaults)
         */
        return bootbox.dialog("This will reset settings and restart the application, are you sure?", [
          {
            label: "Ok",
            "class": "btn-inverse",
            callback: (function(_this) {
              return function() {
                var form, index, model, _ref;
                _ref = _this.tabContent.currentView.forms;
                for (index in _ref) {
                  form = _ref[index];
                  model = form.model;
                  model.destroy();
                }
                return document.location.reload(true);
              };
            })(this)
          }, {
            label: "Cancel",
            "class": "btn-inverse",
            callback: function() {}
          }
        ]);
      };

      function SettingsView(options) {
        this.onRender = __bind(this.onRender, this);
        this.resetSettings = __bind(this.resetSettings, this);
        this.applySettings = __bind(this.applySettings, this);
        SettingsView.__super__.constructor.call(this, options);
      }

      SettingsView.prototype.onRender = function() {
        var defaultItem, sContentView, sHeaderView;
        sHeaderView = new SettingHeader({
          collection: this.model
        });
        this.tabHeaders.show(sHeaderView);
        sContentView = new SettingContent({
          collection: this.model
        });
        this.tabContent.show(sContentView);
        $(this.ui.tabHeaders).find('li:first').addClass('active');
        defaultItem = $(this.ui.tabContent).find('div .tab-pane:first');
        defaultItem.addClass('active');
        return defaultItem.removeClass('fade');
      };

      return SettingsView;

    })(Backbone.Marionette.Layout);
    SettingHeaderItemView = (function(_super) {
      __extends(SettingHeaderItemView, _super);

      function SettingHeaderItemView() {
        return SettingHeaderItemView.__super__.constructor.apply(this, arguments);
      }

      SettingHeaderItemView.prototype.template = sh_template;

      SettingHeaderItemView.prototype.tagName = "li";

      return SettingHeaderItemView;

    })(Backbone.Marionette.ItemView);
    SettingHeader = (function(_super) {
      __extends(SettingHeader, _super);

      SettingHeader.prototype.itemView = SettingHeaderItemView;

      SettingHeader.prototype.tagName = "ul";

      SettingHeader.prototype.template = sha_template;

      SettingHeader.prototype.itemViewContainer = "#settingsHeaderUl";

      SettingHeader.prototype.ui = {
        globalContainer: "#settingsHeaderUl"
      };

      function SettingHeader(options) {
        this.onRender = __bind(this.onRender, this);
        SettingHeader.__super__.constructor.call(this, options);
      }

      SettingHeader.prototype.onRender = function() {
        return $(this.ui.globalContainer).find('li:first').tab('show');
      };

      return SettingHeader;

    })(Backbone.Marionette.CompositeView);
    SettingContentItemView = (function(_super) {
      __extends(SettingContentItemView, _super);

      function SettingContentItemView() {
        this.onRender = __bind(this.onRender, this);
        return SettingContentItemView.__super__.constructor.apply(this, arguments);
      }

      SettingContentItemView.prototype.template = sc_template;

      SettingContentItemView.prototype.onRender = function() {
        this.$el.addClass("tab-pane");
        this.$el.addClass("fade");
        return this.$el.attr('id', this.model.get("name"));
      };

      return SettingContentItemView;

    })(Backbone.Marionette.ItemView);
    SettingContent = (function(_super) {
      __extends(SettingContent, _super);

      SettingContent.prototype.itemView = SettingContentItemView;

      SettingContent.prototype.template = sca_template;

      SettingContent.prototype.itemViewContainer = "#settingsContentAll";

      function SettingContent(options) {
        this.onRender = __bind(this.onRender, this);
        this.getItemView = __bind(this.getItemView, this);
        SettingContent.__super__.constructor.call(this, options);
        this.forms = [];
        this.specificViews = {
          "GeneralSettings": GeneralSettingsWrapper,
          "KeyBindings": KeyBindingsWrapper
        };
      }

      SettingContent.prototype.getItemView = function(item) {
        var error, name, view;
        view = SettingContentItemView;
        if (item != null) {
          try {
            if (this.specificViews.hasOwnProperty(item.constructor.name)) {
              view = this.specificViews[item.constructor.name];
            } else {
              name = item.get("name");
              view = reqRes.request("" + name + "SettingsView");
            }
          } catch (_error) {
            error = _error;
            console.log("error: " + error);
          }
        }
        return view;
      };

      SettingContent.prototype.onRender = function() {
        var childView, index, _ref, _results;
        _ref = this.children._views;
        _results = [];
        for (index in _ref) {
          childView = _ref[index];
          if (childView.wrappedForm != null) {
            _results.push(this.forms.push(childView.wrappedForm));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return SettingContent;

    })(Backbone.Marionette.CompositeView);
    GeneralSettingsForm = (function(_super) {
      __extends(GeneralSettingsForm, _super);

      function GeneralSettingsForm(options) {
        if (!options.schema) {
          options.schema = {
            csgCompileMode: {
              title: "Compile trigger mode",
              type: 'Select',
              options: ["onDemand", "onCodeChange", "onCodeChangeDelayed", "onSave"]
            },
            csgCompileDelay: {
              type: 'Number'
            },
            csgBackgroundProcessing: {
              type: 'Checkbox'
            },
            displayEventNotifications: {
              type: 'Checkbox',
              title: 'Display event notifications'
            },
            autoReloadLastProject: {
              type: 'Checkbox',
              title: 'Reload last project on application start'
            },
            autoSave: {
              type: 'Checkbox',
              title: 'Auto save'
            },
            autoSaveFrequency: {
              type: 'Number',
              editorAttrs: {
                step: 5,
                min: 10
              },
              title: 'Auto save frequancy (s)'
            },
            theme: {
              type: 'Select',
              options: ["coffeescad", "spacelab", "slate"]
            }
          };
          options.fieldsets = [
            {
              "legend": "CSG compiling settings",
              "fields": ["csgCompileMode", "csgCompileDelay", "csgBackgroundProcessing"]
            }, {
              "legend": "Save and load",
              "fields": ["autoReloadLastProject", "autoSave", "autoSaveFrequency"]
            }, {
              "legend": "Other settings",
              "fields": ["theme", "displayEventNotifications"]
            }
          ];
        }
        GeneralSettingsForm.__super__.constructor.call(this, options);
      }

      return GeneralSettingsForm;

    })(Backbone.Form);
    GeneralSettingsWrapper = (function(_super) {
      __extends(GeneralSettingsWrapper, _super);

      function GeneralSettingsWrapper(options) {
        this.render = __bind(this.render, this);
        this.onDomRefresh = __bind(this.onDomRefresh, this);
        GeneralSettingsWrapper.__super__.constructor.call(this, options);
        this.wrappedForm = new GeneralSettingsForm({
          model: this.model
        });
      }

      GeneralSettingsWrapper.prototype.onDomRefresh = function() {
        this.$el.addClass("tab-pane");
        return this.$el.addClass("fade");
      };

      GeneralSettingsWrapper.prototype.render = function() {
        var tmp;
        this.isClosed = false;
        this.triggerMethod("before:render", this);
        this.triggerMethod("item:before:render", this);
        tmp = this.wrappedForm.render();
        this.$el.html(tmp.el);
        this.$el.attr('id', this.model.get("name"));
        this.bindUIElements();
        this.triggerMethod("render", this);
        this.triggerMethod("item:rendered", this);
        return this;
      };

      return GeneralSettingsWrapper;

    })(Backbone.Marionette.ItemView);
    KeybindingsForm = (function(_super) {
      __extends(KeybindingsForm, _super);

      function KeybindingsForm(options) {
        if (!options.schema) {
          options.schema = {
            bindings: {
              type: 'KeyBind'
            }
          };
        }
        KeybindingsForm.__super__.constructor.call(this, options);
      }

      return KeybindingsForm;

    })(Backbone.Form);
    KeyBindingsWrapper = (function(_super) {
      __extends(KeyBindingsWrapper, _super);

      function KeyBindingsWrapper(options) {
        this.render = __bind(this.render, this);
        KeyBindingsWrapper.__super__.constructor.call(this, options);
        this.wrappedForm = new KeybindingsForm({
          model: this.model
        });
      }

      KeyBindingsWrapper.prototype.render = function() {
        var tmp;
        tmp = this.wrappedForm.render();
        this.$el.append(tmp.el);
        this.$el.addClass("tab-pane");
        this.$el.addClass("fade");
        this.$el.attr('id', this.model.get("name"));
        return this.el;
      };

      return KeyBindingsWrapper;

    })(Backbone.Marionette.ItemView);
    return SettingsView;
  });

}).call(this);
