(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, ConsoleView, DummyView, FileCodeView, FileTabView, FilesCodeView, FilesListView, FilesTabView, fileTabTemplate, filesListTemplate, filesTabTemplate, jquery_layout, jquery_ui, marionette, modelBinder, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    jquery_layout = require('jquery_layout');
    jquery_ui = require('jquery_ui');
    modelBinder = require('modelbinder');
    vent = require('core/messaging/appVent');
    fileTabTemplate = require("text!./fileTab.tmpl");
    filesTabTemplate = require("text!./filesTab.tmpl");
    filesListTemplate = require("text!./filesList.tmpl");
    FileCodeView = require("./fileCodeViewAce");
    ConsoleView = require("./consoleView");
    DummyView = require('core/utils/dummyView');
    FileTabView = (function(_super) {
      __extends(FileTabView, _super);

      FileTabView.prototype.template = fileTabTemplate;

      FileTabView.prototype.tagName = "li";

      FileTabView.prototype.events = {
        "click a[data-toggle=\"tab\"]": "selectFile",
        "click .closeFile": "closeTab"
      };

      function FileTabView(options) {
        this.onClose = __bind(this.onClose, this);
        this.onRender = __bind(this.onRender, this);
        this.onShow = __bind(this.onShow, this);
        this.selectFile = __bind(this.selectFile, this);
        var converter;
        FileTabView.__super__.constructor.call(this, options);
        converter = (function(_this) {
          return function() {
            var extra;
            extra = "";
            if (_this.model.isSaveAdvised) {
              extra = "*";
            }
            return _this.model.name + extra + "  ";
          };
        })(this);
        this.bindings = {
          name: [
            {
              selector: "[name=fileName]",
              converter: converter
            }
          ],
          isSaveAdvised: [
            {
              selector: "[name=fileName]",
              converter: converter
            }
          ]
        };
        this.modelBinder = new Backbone.ModelBinder();
      }

      FileTabView.prototype.selectFile = function(e) {
        e.stopImmediatePropagation();
        vent.trigger("file:selected", this.model);
        return this.trigger("file:selected", this.model);
      };

      FileTabView.prototype.closeTab = function(e) {
        e.stopImmediatePropagation();
        this.trigger("file:closed", this.model);
        vent.trigger("file:closed", this.model);
        return this.close();
      };

      FileTabView.prototype.onShow = function() {
        vent.trigger("file:selected", this.model);
        this.$el.tab('show');
        return this.$el.addClass("active");
      };

      FileTabView.prototype.onRender = function() {
        return this.modelBinder.bind(this.model, this.el, this.bindings);
      };

      FileTabView.prototype.onClose = function() {
        return this.modelBinder.unbind();
      };

      return FileTabView;

    })(Backbone.Marionette.ItemView);
    FilesTabView = (function(_super) {
      __extends(FilesTabView, _super);

      FilesTabView.prototype.itemView = FileTabView;

      FilesTabView.prototype.tagName = "ul";

      FilesTabView.prototype.template = filesTabTemplate;

      FilesTabView.prototype.className = "nav nav-tabs";

      function FilesTabView(options) {
        this.selectFile = __bind(this.selectFile, this);
        this.onFileClosed = __bind(this.onFileClosed, this);
        this.onFileSelected = __bind(this.onFileSelected, this);
        FilesTabView.__super__.constructor.call(this, options);
        this.on("itemview:file:selected", this.onFileSelected);
        this.on("itemview:file:closed", this.onFileClosed);
      }

      FilesTabView.prototype.onFileSelected = function(childView, file) {
        this.children.each(function(childView) {
          return childView.$el.removeClass("active");
        });
        return childView.$el.addClass("active");
      };

      FilesTabView.prototype.onFileClosed = function(childView, file) {
        console.log(this.children.length);
        console.log(childView.cid);
        console.log(this.children);
        if (this.children.length > 1) {
          console.log(this.children.rest());
          this.children.each(function(childView) {
            return childView.$el.removeClass("active");
          });
          return this.children.first().$el.addClass("active");
        }
      };

      FilesTabView.prototype.selectFile = function(file) {
        return this.children.each(function(childView) {
          childView.$el.removeClass("active");
          if (childView.model === file) {
            return childView.$el.addClass("active");
          }
        });
      };

      FilesTabView.prototype.onRender = function() {
        return this.$el.sortable();
      };

      return FilesTabView;

    })(Backbone.Marionette.CompositeView);
    FilesCodeView = (function(_super) {
      __extends(FilesCodeView, _super);

      FilesCodeView.prototype.itemView = FileCodeView;

      FilesCodeView.prototype.tagName = "div";

      FilesCodeView.prototype.template = filesTabTemplate;

      FilesCodeView.prototype.className = "tab-content";

      function FilesCodeView(options) {
        this.onFileClosed = __bind(this.onFileClosed, this);
        this.selectFile = __bind(this.selectFile, this);
        FilesCodeView.__super__.constructor.call(this, options);
        this.settings = options.settings;
        vent.on("file:closed", this.onFileClosed);
      }

      FilesCodeView.prototype.itemViewOptions = function() {
        return {
          settings: this.settings
        };
      };

      FilesCodeView.prototype.selectFile = function(file) {
        return this.children.each(function(childView) {
          childView.$el.removeClass("active");
          if (childView.model === file) {
            childView.$el.addClass("active");
            return childView.$el.removeClass('fade');
          }
        });
      };

      FilesCodeView.prototype.onFileClosed = function(childView, file) {
        if (this.children.length > 0) {
          return this.children.each(function(childView) {
            childView.$el.addClass("active");
            return childView.$el.removeClass('fade');
          });
        }
      };

      return FilesCodeView;

    })(Backbone.Marionette.CompositeView);
    FilesListView = (function(_super) {
      __extends(FilesListView, _super);

      FilesListView.prototype.template = filesListTemplate;

      FilesListView.prototype.regions = {
        tabHeaders: "#tabHeaders",
        tabHeadersList: "#tabList",
        tabContent: "#tabContent",
        console: "#console"
      };

      FilesListView.prototype.ui = {
        console: "#console",
        tabContent: "#tabContent"
      };

      function FilesListView(options) {
        this.hideFile = __bind(this.hideFile, this);
        this.showFile = __bind(this.showFile, this);
        this.onRender = __bind(this.onRender, this);
        this.onDomRefresh = __bind(this.onDomRefresh, this);
        this._setupKeyboardBindings = __bind(this._setupKeyboardBindings, this);
        FilesListView.__super__.constructor.call(this, options);
        this.settings = options.settings;
        this.activeFile = this.model.activeFile != null ? this.model.activeFile : this.collection.first();
        console.log("setting active file", this.activeFile);
        this.openFiles = new Backbone.Collection();
        this.openFiles.add(this.activeFile);
        this.collection.on('remove', (function(_this) {
          return function(item) {
            return _this.openFiles.remove(item);
          };
        })(this));
        vent.on("file:selected", this.showFile);
        vent.on("file:closed", this.hideFile);
        this._setupKeyboardBindings();
      }

      FilesListView.prototype._setupKeyboardBindings = function() {

        /*
        @$el.bind 'keydown', 'ctrl+s', ->
          console.log "i want to save a FILE"
          return false
        
        $(document).bind "keydown", "ctrl+s", ->
          console.log "I WANT TO SAVE2"
          return false
         */
      };

      FilesListView.prototype.onDomRefresh = function() {
        var innerLayoutOptions;
        this.console.el = this.ui.console;
        this.tabContent.el = this.ui.tabContent;
        this.$el.parent().addClass("filesListContainer");
        $(this.console.el).addClass("ui-layout-south");
        $(this.tabContent.el).addClass("ui-layout-center");
        return innerLayoutOptions = {
          defaults: {
            applyDefaultStyles: true
          }
        };
      };

      FilesListView.prototype.onRender = function() {
        var consoleView;
        this.headerView = new FilesTabView({
          collection: this.openFiles
        });
        this.tabHeaders.show(this.headerView);
        this.codeView = new FilesCodeView({
          collection: this.openFiles,
          settings: this.settings
        });
        this.tabContent.show(this.codeView);
        consoleView = new ConsoleView({
          model: this.model
        });
        return this.console.show(consoleView);
      };

      FilesListView.prototype.showFile = function(file) {
        var error, found;
        found = this.openFiles.find((function(_this) {
          return function(item) {
            return item.get('name') === file.get('name');
          };
        })(this));
        if (found == null) {
          console.log("new File " + (file.get('name')));
          return this.openFiles.add(file);
        } else {
          try {
            this.headerView.selectFile(found);
            this.codeView.selectFile(found);
            return this.model.makeFileActive(found);
          } catch (_error) {
            error = _error;
          }
        }
      };

      FilesListView.prototype.hideFile = function(file) {
        var found;
        found = this.openFiles.find((function(_this) {
          return function(item) {
            return item.get('name') === file.get('name');
          };
        })(this));
        if (found) {
          this.openFiles.remove(file);
          return console.log("removed File " + (file.get('name')));
        }
      };

      return FilesListView;

    })(Backbone.Marionette.Layout);
    return FilesListView;
  });

}).call(this);
