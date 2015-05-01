(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, FileView, TreeRoot, TreeView, fileTemplate, filesTreeTemplate, jquery_layout, projectTemplate, rootTemplate, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    require('marionette');
    require('modelbinder');
    require('pickysitter');
    jquery_layout = require('jquery_layout');
    vent = require('core/messaging/appVent');
    filesTreeTemplate = require("text!./filesTreeView.tmpl");
    fileTemplate = _.template($(filesTreeTemplate).filter('#fileTmpl').html());
    projectTemplate = _.template($(filesTreeTemplate).filter('#projectTmpl').html());
    rootTemplate = _.template($(filesTreeTemplate).filter('#rootTmpl').html());
    FileView = (function(_super) {
      __extends(FileView, _super);

      FileView.prototype.template = fileTemplate;

      FileView.prototype.tagName = "tr";

      FileView.prototype.ui = {
        fileNameColumn: "#fileNameColumn",
        editFileColumn: "#editFileColumn"
      };

      FileView.prototype.events = {
        "click .editFile": "onEditFileClicked",
        "click .deleteFile": "onDeleteFileClicked",
        'dblclick .openFile': "onFileSelected"
      };

      FileView.prototype.triggers = {
        "click #fileNameColumn": "selected"
      };

      function FileView(options) {
        this.onClose = __bind(this.onClose, this);
        this.onRender = __bind(this.onRender, this);
        this.onDeleteFileClicked = __bind(this.onDeleteFileClicked, this);
        this.onFileSelected = __bind(this.onFileSelected, this);
        this.onEditFileClicked = __bind(this.onEditFileClicked, this);
        var selectable;
        FileView.__super__.constructor.call(this, options);
        selectable = new Backbone.PickySitter.Selectable(this);
        _.extend(this, selectable);
        this.on("selected", (function(_this) {
          return function() {
            return _this.$el.addClass("info");
          };
        })(this));
        this.on("deselected", (function(_this) {
          return function() {
            return _this.$el.removeClass("info");
          };
        })(this));
        this.bindings = {
          name: [
            {
              selector: "[name=fileName]"
            }
          ]
        };
        this.modelBinder = new Backbone.ModelBinder();
        this.model.on('change', (function(_this) {
          return function() {
            return _this.render();
          };
        })(this));
      }

      FileView.prototype.onEditFileClicked = function() {
        var selector, _onFileNameEdited;
        selector = this.ui.fileNameColumn;
        _onFileNameEdited = (function(_this) {
          return function() {
            var name;
            selector.attr('contentEditable', false);
            selector.removeClass("fileListEditable");
            _this.ui.editFileColumn.show();
            name = _this.ui.fileNameColumn.find('.openFile').text();
            name = name.replace(/^\s+|\s+$/g, '');
            _this.trigger("file:rename", {
              model: _this.model,
              newName: name
            });
            return selector.off("focusout", _onFileNameEdited);
          };
        })(this);
        if (selector.attr('contentEditable') === "true") {
          return _onFileNameEdited();
        } else {
          selector.attr('contentEditable', true);
          selector.children("a").css({
            'cursor': 'text'
          });
          selector.addClass("fileListEditable");
          this.ui.editFileColumn.hide();
          this.ui.fileNameColumn.attr("collspan", 3);
          selector.focus();
          return selector.on("focusout", _onFileNameEdited);
        }
      };

      FileView.prototype.onFileSelected = function(ev) {
        return vent.trigger("file:selected", this.model);
      };

      FileView.prototype.onDeleteFileClicked = function(ev) {
        return this.trigger("file:delete", this.model);
      };

      FileView.prototype.onRender = function() {
        return this.modelBinder.bind(this.model, this.el, this.bindings);
      };

      FileView.prototype.onClose = function() {
        return this.modelBinder.unbind();
      };

      return FileView;

    })(Backbone.Marionette.ItemView);
    TreeView = (function(_super) {
      __extends(TreeView, _super);

      TreeView.prototype.itemView = FileView;

      TreeView.prototype.template = projectTemplate;

      TreeView.prototype.itemViewContainer = "tbody";

      TreeView.prototype.className = "table table-hover table-condensed";

      TreeView.prototype.ui = {
        newFileColumn: "#newFileColumn",
        newFileInput: "#newFileInput"
      };

      TreeView.prototype.events = {
        'click .addFile': "onFileAddClicked"
      };

      function TreeView(options) {
        this.onFileRenameRequest = __bind(this.onFileRenameRequest, this);
        this.onFileDeleteRequest = __bind(this.onFileDeleteRequest, this);
        this.onFileAddClicked = __bind(this.onFileAddClicked, this);
        this.onFileViewSelected = __bind(this.onFileViewSelected, this);
        var singleSelect;
        TreeView.__super__.constructor.call(this, options);
        this.on("itemview:file:delete", this.onFileDeleteRequest);
        this.on("itemview:file:rename", this.onFileRenameRequest);
        this.on("itemview:selected", this.onFileViewSelected);
        singleSelect = new Backbone.PickySitter.SingleSelect(this.itemViewContainer);
        _.extend(this, singleSelect);
        this.modelBinder = new Backbone.ModelBinder();
        this.bindings = {
          name: [
            {
              selector: "[name=projectName]"
            }
          ]
        };
      }

      TreeView.prototype.onRender = function() {
        return this.modelBinder.bind(this.model, this.el, this.bindings);
      };

      TreeView.prototype.onFileViewSelected = function(childView) {
        return this.select(childView);
      };

      TreeView.prototype.onFileAddClicked = function(ev) {
        var found, name;
        name = this.ui.newFileInput.val();
        name = name.replace(/^\s+|\s+$/g, '');
        found = this.collection.find((function(_this) {
          return function(file) {
            return file.name === name;
          };
        })(this));
        if (found) {
          console.log("" + name + " already exists");
          this.ui.newFileColumn.addClass("error");
          this.ui.newFileColumn.popover({
            placement: "top",
            content: "" + name + " already exists",
            template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title" style="display: none"></h3><div class="popover-content"><p></p></div></div></div>'
          });
          return this.ui.newFileColumn.popover("show");
        } else {
          this.model.addFile({
            name: name
          });
          this.ui.newFileInput.val("");
          this.ui.newFileColumn.removeClass("error");
          return this.ui.newFileColumn.popover("destroy");
        }
      };

      TreeView.prototype.onFileDeleteRequest = function(childView, projectFile) {
        var fileName;
        fileName = projectFile.name;
        if (fileName.split('.')[0] === this.model.name) {
          bootbox.animate(false);
          return bootbox.alert("you cannot delete the main file in a project");

          /*bootbox.alert
           str:"you cannot delete the main file in a project"
           backdrop: false
           */
        } else {
          bootbox.animate(false);
          return bootbox.dialog("Are you sure you want to delete this file?", [
            {
              label: "Ok",
              "class": "btn-inverse",
              callback: (function(_this) {
                return function() {
                  return projectFile.destroy();
                };
              })(this)
            }, {
              label: "Cancel",
              "class": "btn-inverse",
              callback: function() {}
            }
          ]);
        }
      };

      TreeView.prototype.onFileRenameRequest = function(childView, msg) {
        var found, model, name, selector;
        model = msg.model;
        name = msg.newName;
        found = this.collection.find((function(_this) {
          return function(file) {
            return file.name === name;
          };
        })(this));
        selector = childView.$el;
        if (found) {
          selector.addClass("error");
          selector.popover({
            placement: "right",
            content: "" + name + " already exists",
            template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title" style="display: none"></h3><div class="popover-content"><p></p></div></div></div>'
          });
          selector.popover("show");
          selector.find('.openFile').html("<i class=\"icon-file\"></i> " + model.name + "</a>");
          return setTimeout(((function(_this) {
            return function() {
              selector.popover('destroy');
              return selector.removeClass("error");
            };
          })(this)), 2000);
        } else {
          model.name = name;
          return selector.popover("destroy");
        }
      };

      return TreeView;

    })(Backbone.Marionette.CompositeView);
    TreeRoot = (function(_super) {
      __extends(TreeRoot, _super);

      TreeRoot.prototype.template = rootTemplate;

      TreeRoot.prototype.itemView = FileView;

      TreeRoot.prototype.tagName = "table";

      TreeRoot.prototype.className = "filesTree";

      function TreeRoot(options) {
        TreeRoot.__super__.constructor.call(this, options);
      }

      TreeRoot.prototype.onRender = function() {
        return this.$el.addClass("align-left");
      };

      return TreeRoot;

    })(Backbone.Marionette.CompositeView);
    return TreeView;
  });

}).call(this);
