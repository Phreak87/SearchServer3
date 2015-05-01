(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, ExamplesView, MainMenuView, RecentFileView, RecentFilesView, appVent, mainMenuMasterTemplate, mainMenuTemplate, marionette, modelBinder, recentFileTemplate, _;
    $ = require('jquery');
    _ = require('underscore');
    marionette = require('marionette');
    modelBinder = require('modelbinder');
    require('bootstrap');
    require('bootbox');
    require('notify');
    appVent = require('core/messaging/appVent');
    mainMenuMasterTemplate = require("text!core/mainMenu.tmpl");
    mainMenuTemplate = _.template($(mainMenuMasterTemplate).filter('#mainMenuTmpl').html());
    recentFileTemplate = _.template($(mainMenuMasterTemplate).filter('#recentFileTmpl').html());
    MainMenuView = (function(_super) {
      __extends(MainMenuView, _super);

      MainMenuView.prototype.el = $("#header");

      MainMenuView.prototype.template = mainMenuTemplate;

      MainMenuView.prototype.regions = {
        recentsStub: "#recentProjects",
        examplesStub: "#examples",
        exportersStub: "#exporters"
      };

      MainMenuView.prototype.ui = {
        exportersStub: "#exporters",
        storesStub: "#stores"
      };

      MainMenuView.prototype.events = {
        "click .newProject": function() {
          return appVent.trigger("project:new");
        },
        "click .newFile": function() {
          return appVent.trigger("project:file:new");
        },
        "click .saveProjectAs": function() {
          return appVent.trigger("project:saveAs");
        },
        "click .saveProject": function() {
          return appVent.trigger("project:save");
        },
        "click .loadProject": function() {
          return appVent.trigger("project:load");
        },
        "click .deleteProject": function() {
          return appVent.trigger("project:delete");
        },
        "click .undo": "onUndoClicked",
        "click .redo": "onRedoClicked",
        "click .settings": function() {
          return appVent.trigger("settings:show");
        },
        "click .showEditor": function() {
          return appVent.trigger("codeEditor:show");
        },
        "click .compileProject": function() {
          return appVent.trigger("project:compile");
        },
        "click .geometryCreator": function() {
          return appVent.trigger("geometryEditor:show");
        },
        "click .about": "showAbout"
      };

      function MainMenuView(options) {
        this.showAbout = __bind(this.showAbout, this);
        this._fetchFiles = __bind(this._fetchFiles, this);
        this.onRedoClicked = __bind(this.onRedoClicked, this);
        this.onDomRefresh = __bind(this.onDomRefresh, this);
        this._addStoreEntries = __bind(this._addStoreEntries, this);
        this._addExporterEntries = __bind(this._addExporterEntries, this);
        this._onSubAppStarted = __bind(this._onSubAppStarted, this);
        this._onNoRedoAvailable = __bind(this._onNoRedoAvailable, this);
        this._onNoUndoAvailable = __bind(this._onNoUndoAvailable, this);
        this._onRedoAvailable = __bind(this._onRedoAvailable, this);
        this._onUndoAvailable = __bind(this._onUndoAvailable, this);
        this._clearUndoRedo = __bind(this._clearUndoRedo, this);
        this._onNotificationRequested = __bind(this._onNotificationRequested, this);
        var _ref, _ref1;
        MainMenuView.__super__.constructor.call(this, options);
        this.appVent = appVent;
        this.editors = {};
        this.stores = (_ref = options.stores) != null ? _ref : {};
        this.exporters = (_ref1 = options.exporters) != null ? _ref1 : {};
        this.settings = options.settings;
        this.appVent.on("file:undoAvailable", this._onUndoAvailable);
        this.appVent.on("file:redoAvailable", this._onRedoAvailable);
        this.appVent.on("file:undoUnAvailable", this._onNoUndoAvailable);
        this.appVent.on("file:redoUnAvailable", this._onNoRedoAvailable);
        this.appVent.on("clearUndoRedo", this._clearUndoRedo);
        this.appVent.on("notify", this.onNotificationRequested);
        this.appVent.on("project:loaded", (function(_this) {
          return function() {
            return _this._onNotificationRequested("Project:loaded");
          };
        })(this));
        this.appVent.on("project:saved", (function(_this) {
          return function() {
            return _this._onNotificationRequested("Project:saved");
          };
        })(this));
        this.appVent.on("project:autoSaved", (function(_this) {
          return function() {
            return _this._onNotificationRequested("Project:autosave");
          };
        })(this));
        this.appVent.on("project:compiled", (function(_this) {
          return function() {
            return _this._onNotificationRequested("Project:compiled");
          };
        })(this));
        this.appVent.on("project:compile:error", (function(_this) {
          return function() {
            return _this._onNotificationRequested("Project:compile ERROR check console for details!");
          };
        })(this));
        this.appVent.on("app:started", this._onSubAppStarted);
      }

      MainMenuView.prototype._onNotificationRequested = function(message) {
        console.log("bla", this.settings.get("General").displayEventNotifications);
        if (this.settings.get("General").displayEventNotifications) {
          return $('.notifications').notify({
            message: {
              text: message
            },
            fadeOut: {
              enabled: true,
              delay: 1000
            }
          }).show();
        }
      };

      MainMenuView.prototype._clearUndoRedo = function() {
        $('#undoBtn').addClass("disabled");
        return $('#redoBtn').addClass("disabled");
      };

      MainMenuView.prototype._onUndoAvailable = function() {
        return $('#undoBtn').removeClass("disabled");
      };

      MainMenuView.prototype._onRedoAvailable = function() {
        return $('#redoBtn').removeClass("disabled");
      };

      MainMenuView.prototype._onNoUndoAvailable = function() {
        return $('#undoBtn').addClass("disabled");
      };

      MainMenuView.prototype._onNoRedoAvailable = function() {
        return $('#redoBtn').addClass("disabled");
      };

      MainMenuView.prototype._onSubAppStarted = function(title, subApp) {
        var className, event, icon, subAppEl;
        if (subApp.addMainMenuIcon) {
          title = subApp.title;
          icon = subApp.icon;
          if (!title in this.editors) {
            this.editors[title] = subApp;
          }
          className = "open" + (title[0].toUpperCase() + title.slice(1));
          subAppEl = "<li><a id=\"" + title + "Btn\" href=\"#\" rel=\"tooltip\" title=\"Open " + title + "\" class=" + className + "><i class=\"" + icon + "\"></i></a></li>";
          $(subAppEl).insertAfter('#editorsMarker');
          event = "" + title + ":show";
          this.events["click ." + className] = (function(event) {
            return function() {
              return this.appVent.trigger(event);
            };
          })(event);
          return this.delegateEvents();
        }
      };

      MainMenuView.prototype._addExporterEntries = function() {
        var className, event, exporterName, index, _ref, _results;
        _ref = this.exporters;
        _results = [];
        for (index in _ref) {
          exporterName = _ref[index];
          className = "start" + (index[0].toUpperCase() + index.slice(1)) + "Exporter";
          event = "" + index + "Exporter:start";
          this.events["click ." + className] = (function(event) {
            return function() {
              return this.appVent.trigger(event);
            };
          })(event);
          _results.push(this.ui.exportersStub.append("<li ><a href='#' class='" + className + "'>" + index + "</li>"));
        }
        return _results;
      };

      MainMenuView.prototype._addStoreEntries = function() {
        var index, loginClassName, loginEvent, logoutClassName, logoutEvent, store, _ref, _results;
        _ref = this.stores;
        _results = [];
        for (index in _ref) {
          store = _ref[index];
          if (store.isLogginRequired) {
            loginClassName = "login" + (index[0].toUpperCase() + index.slice(1));
            loginEvent = "" + index + "Store:login";
            this.events["click ." + loginClassName] = (function(loginEvent) {
              return function() {
                return this.appVent.trigger(loginEvent);
              };
            })(loginEvent);
            logoutClassName = "logout" + (index[0].toUpperCase() + index.slice(1));
            logoutEvent = "" + index + "Store:logout";
            this.events["click ." + logoutClassName] = (function(logoutEvent) {
              return function() {
                return this.appVent.trigger(logoutEvent);
              };
            })(logoutEvent);
            (function(_this) {
              return (function(index) {
                var onLoggedIn, onLoggedOut;
                onLoggedIn = function() {
                  var selector;
                  selector = "#" + loginClassName;
                  $('.notifications').notify({
                    message: {
                      text: "" + index + ": logged IN"
                    },
                    fadeOut: {
                      enabled: true,
                      delay: 1000
                    }
                  }).show();
                  return $(selector).replaceWith("<li id='" + logoutClassName + "' ><a href='#' class='" + logoutClassName + "'><i class='icon-signout' style='color:green'/>  " + index + " - Signed In</a></li>");
                };
                onLoggedOut = function() {
                  var selector;
                  selector = "#" + logoutClassName;
                  $('.notifications').notify({
                    message: {
                      text: "" + index + ": logged OUT"
                    },
                    fadeOut: {
                      enabled: true,
                      delay: 1000
                    }
                  }).show();
                  return $(selector).replaceWith("<li id='" + loginClassName + "' ><a href='#' class='" + loginClassName + "'><i class='icon-signin' style='color:red'/>  " + index + " - Signed out</a></li>");
                };
                _this.appVent.on("" + index + "Store:loggedIn", function() {
                  return onLoggedIn();
                });
                return _this.appVent.on("" + index + "Store:loggedOut", function() {
                  return onLoggedOut();
                });
              });
            })(this)(index);
            _results.push(this.ui.storesStub.append("<li id='" + loginClassName + "'><a href='#' class='" + loginClassName + "'><i class='icon-signin' style='color:red'/>  " + index + " - Signed Out</a></li>"));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      MainMenuView.prototype.onDomRefresh = function() {
        this.$el.find('[rel=tooltip]').tooltip({
          'placement': 'bottom'
        });
        this._addExporterEntries();
        this._addStoreEntries();
        this.delegateEvents();
        return this.examplesStub.show(new ExamplesView());
      };

      MainMenuView.prototype.onRedoClicked = function() {
        if (!($('#redoBtn').hasClass("disabled"))) {
          return this.appVent.trigger("file:redoRequest");
        }
      };

      MainMenuView.prototype.onUndoClicked = function() {
        if (!($('#undoBtn').hasClass("disabled"))) {
          console.log("triggering undo Request");
          return this.appVent.trigger("file:undoRequest");
        }
      };

      MainMenuView.prototype._fetchFiles = function() {
        var examplesUrl, serverUrl;
        serverUrl = window.location.href;
        examplesUrl = "" + serverUrl + "/examples";
        console.log("ServerURL : " + serverUrl);
        return $.get("" + examplesUrl, (function(_this) {
          return function(data) {
            console.log("totot");
            return console.log(data);
          };
        })(this));
      };

      MainMenuView.prototype.showAbout = function(ev) {
        return bootbox.dialog("<b>Coffeescad v0.3.3</b> (pre-alpha)<br/><br/>\nLicenced under the MIT Licence<br/>\n@2012-2013 by Mark 'kaosat-dev' Moissette  and contributors", [
          {
            label: "Ok",
            "class": "btn-inverse"
          }
        ], {
          "backdrop": false,
          "keyboard": true,
          "animate": false
        });
      };

      return MainMenuView;

    })(Backbone.Marionette.Layout);
    RecentFileView = (function(_super) {
      __extends(RecentFileView, _super);

      function RecentFileView() {
        this.onRender = __bind(this.onRender, this);
        return RecentFileView.__super__.constructor.apply(this, arguments);
      }

      RecentFileView.prototype.template = recentFileTemplate;

      RecentFileView.prototype.tagName = "li";

      RecentFileView.prototype.onRender = function() {
        return this.$el.attr("id", this.model.name);
      };

      return RecentFileView;

    })(Backbone.Marionette.ItemView);
    RecentFilesView = (function(_super) {
      __extends(RecentFilesView, _super);

      RecentFilesView.prototype.tagName = "ul";

      RecentFilesView.prototype.className = "dropdown-menu recentProjects";

      RecentFilesView.prototype.itemView = RecentFileView;

      function RecentFilesView(options) {
        this._onProjectLoadedAndSaved = __bind(this._onProjectLoadedAndSaved, this);
        var tmpCollection;
        options = options || {};
        tmpCollection = new Backbone.Collection();
        tmpCollection.add({
          name: "toto"
        });
        options.collection = tmpCollection;
        RecentFilesView.__super__.constructor.call(this, options);
        this.appVent = appVent;
        this.appVent.on("project:saved", this._onProjectLoadedAndSaved);
        this.appVent.on("project:loaded", this._onProjectLoadedAndSaved);
      }

      RecentFilesView.prototype._onProjectLoadedAndSaved = function(project) {
        console.log("save and load handler", project);
        console.log(this.collection);
        return this.collection.add(project);
      };

      RecentFilesView.prototype.comparator = function(project) {
        var date;
        date = new Date(project.lastModificationDate);
        return date.getTime();
      };

      return RecentFilesView;

    })(Backbone.Marionette.CollectionView);
    ExamplesView = (function(_super) {
      __extends(ExamplesView, _super);

      ExamplesView.prototype.tagName = "ul";

      ExamplesView.prototype.className = "dropdown-menu examplesTree";

      ExamplesView.prototype.events = {
        "click .example": "onLoadExampleClicked",
        "click": "onLoadExampleClicked"
      };

      function ExamplesView(options) {
        this._generateExamplesTree = __bind(this._generateExamplesTree, this);
        this.render = __bind(this.render, this);
        this.onLoadExampleClicked = __bind(this.onLoadExampleClicked, this);
        ExamplesView.__super__.constructor.call(this, options);
        this.examplesData = null;
        this.examplesHash = {};
        this.appBaseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
        this.examplesUrl = "" + this.appBaseUrl + "examples/examples.json";
        $.get("" + this.examplesUrl, (function(_this) {
          return function(data) {
            _this.examplesData = data;
            return _this.render();
          };
        })(this));
      }

      ExamplesView.prototype.onLoadExampleClicked = function(e) {
        var Project, deferredList, exampleFullPath, exampleName, fileName, project, _fn, _i, _len, _ref;
        console.log("example clicked");
        exampleFullPath = $(e.currentTarget).data("id");
        Project = require("core/projects/project");
        exampleName = exampleFullPath.split('/').pop();
        deferredList = [];
        project = new Project({
          name: exampleName
        });
        _ref = this.examplesHash[exampleFullPath];
        _fn = (function(_this) {
          return function(fileName) {
            var deferred, filePath, projectFile;
            projectFile = project.addFile({
              name: fileName,
              content: ""
            });
            filePath = "" + _this.appBaseUrl + "examples" + exampleFullPath + "/" + fileName;
            deferred = $.get(filePath);
            deferredList.push(deferred);
            return $.when(deferred).done(function(fileContent) {
              return projectFile.content = fileContent;
            });
          };
        })(this);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          fileName = _ref[_i];
          _fn(fileName);
        }
        return $.when.apply($, deferredList).done((function(_this) {
          return function() {
            project._clearFlags();
            project.trigger("loaded");
            return appVent.trigger("project:loaded", project);
          };
        })(this));
      };

      ExamplesView.prototype.render = function() {
        var insertRoot, rootEl;
        this.isClosed = false;
        this.triggerMethod("before:render", this);
        this.triggerMethod("item:before:render", this);
        rootEl = this._generateExamplesTree();
        this.$el.parent().append("<a tabindex=\"-1\" href=\"#\"><i class=\"icon-fixed-width icon-list-ul\"></i>Examples</a>");
        insertRoot = this.$el;
        $(rootEl).children("li").each(function(i) {
          return insertRoot.append($(this));
        });
        this.bindUIElements();
        this.triggerMethod("render", this);
        this.triggerMethod("item:rendered", this);
        return this;
      };

      ExamplesView.prototype._generateExamplesTree = function() {
        var createItem, result;
        createItem = (function(_this) {
          return function(jsonObj, $obj) {
            var elem, sub, _i, _j, _len, _len1, _ref;
            $obj = typeof $obj === "function" ? $obj(null) : void 0;
            if (jsonObj.name) {
              $obj = $('<a>').attr('href', "#").text(jsonObj.name);
              if ("files" in jsonObj) {
                $obj = $obj.prepend($("<i class='icon-fixed-width icon-file'></i>"));
              } else {
                $obj = $obj.prepend($("<i class='icon-fixed-width icon-folder-open'></i>"));
              }
              $obj = $('<li>').append($obj);
            }
            if (jsonObj.length) {
              $obj = $('<ul>');
              for (_i = 0, _len = jsonObj.length; _i < _len; _i++) {
                elem = jsonObj[_i];
                $obj.append(createItem(elem));
              }
            }
            if (jsonObj.categories) {
              sub = $('<ul>');
              _ref = jsonObj.categories;
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                elem = _ref[_j];
                sub.append(createItem(elem));
              }
              $obj = $obj.append(sub);
              sub.addClass("dropdown-menu");
            }
            if ("files" in jsonObj) {
              $obj.attr("data-id", jsonObj.path);
              $obj.addClass("example");
              _this.examplesHash[jsonObj.path] = jsonObj.files;
            } else {
              $obj.addClass("dropdown-submenu");
            }
            return $obj;
          };
        })(this);
        result = "";
        if (this.examplesData) {
          result = createItem(this.examplesData["categories"], this.$el);
        }
        return result;
      };

      return ExamplesView;

    })(Backbone.Marionette.ItemView);
    return MainMenuView;
  });

}).call(this);
