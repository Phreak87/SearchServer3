(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, CodeEditorView, FilesListView, FilesTreeView, filesCodeTemplate, jquery_layout, jquery_ui, marionette, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    jquery_layout = require('jquery_layout');
    jquery_ui = require('jquery_ui');
    vent = require('core/messaging/appVent');
    filesCodeTemplate = require("text!./codeEditorView.tmpl");
    FilesTreeView = require("./filesTreeView");
    FilesListView = require("./filesListView");
    CodeEditorView = (function(_super) {
      __extends(CodeEditorView, _super);

      CodeEditorView.prototype.template = filesCodeTemplate;

      CodeEditorView.prototype.className = "codeEditor";

      CodeEditorView.prototype.regions = {
        filesList: "#filesList",
        filesTree: "#filesTree"
      };

      CodeEditorView.prototype.events = {
        "resize:start": "onResizeStart",
        "resize:stop": "onResizeStop",
        "resize": "onResizeStop"
      };

      function CodeEditorView(options) {
        this.onClose = __bind(this.onClose, this);
        this.onRender = __bind(this.onRender, this);
        this.onResizeStop = __bind(this.onResizeStop, this);
        this.onResizeStart = __bind(this.onResizeStart, this);
        this.onDomRefresh = __bind(this.onDomRefresh, this);
        CodeEditorView.__super__.constructor.call(this, options);
        this.settings = options.settings;
      }

      CodeEditorView.prototype.onDomRefresh = function() {
        var elHeight;
        this.$el.parent().addClass("codeEditorContainer");
        $(this.filesTree.el).addClass("ui-layout-west filesTreeContainer");
        $(this.filesList.el).addClass("ui-layout-center");
        elHeight = this.$el.parent().height();
        this.$el.height(elHeight);
        this.myLayout = this.$el.layout({
          applyDefaultStyles: true,
          west__size: 220,
          west__minSize: 220,
          west__initClosed: true,
          center__childOptions: {
            center__paneSelector: "#tabContent",
            south__paneSelector: "#console",
            applyDefaultStyles: true,
            north__size: 'auto',
            south__size: 100,
            south__initClosed: true
          }
        });
        elHeight = this.$el.parent().height();
        this.$el.height(elHeight);
        $("#codeArea").height(elHeight - 40);
        $(".codeEditorBlock").height(elHeight - 40);
        return this.myLayout.resizeAll();
      };

      CodeEditorView.prototype.onResizeStart = function() {
        console.log("resized start");
        console.log("old size: " + (this.$el.parent().height()));
        return console.log(this.$el.parent());
      };

      CodeEditorView.prototype.onResizeStop = function(ev, args) {
        var elHeight;
        if (args != null) {
          elHeight = args.ui.size.height;
        } else {
          elHeight = $("#codeEdit").outerHeight(false);
          elHeight = $("#codeEdit").height();
        }
        this.$el.height(elHeight);
        $("#codeArea").height(elHeight - 40);
        $(".codeEditorBlock").height(elHeight - 40);
        this.myLayout.resizeAll();
        return vent.trigger("codeEditor:refresh", elHeight);
      };

      CodeEditorView.prototype.onRender = function() {
        var filesListView, filesTreeView;
        filesTreeView = new FilesTreeView({
          collection: this.model.rootFolder,
          model: this.model
        });
        this.filesTree.show(filesTreeView);
        filesListView = new FilesListView({
          collection: this.model.rootFolder,
          model: this.model,
          settings: this.settings
        });
        return this.filesList.show(filesListView);
      };

      CodeEditorView.prototype.onClose = function() {
        return console.log("closing code editor");
      };

      return CodeEditorView;

    })(Backbone.Marionette.Layout);
    return CodeEditorView;
  });

}).call(this);
