(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(function(require) {
    var $, Backbone, Compiler, Folder, Project, ProjectFile, buildProperties, debug, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    buildProperties = require('core/utils/buildProperties');
    Compiler = require('./compiler');
    debug = false;
    ProjectFile = (function(_super) {
      __extends(ProjectFile, _super);

      ProjectFile.prototype.idAttribute = 'name';

      ProjectFile.prototype.defaults = {
        name: "testFile.coffee",
        content: "",
        isActive: false,
        isSaveAdvised: false,
        isCompileAdvised: false
      };

      ProjectFile.prototype.attributeNames = ['name', 'content', 'isActive', 'isSaveAdvised', 'isCompileAdvised'];

      ProjectFile.prototype.persistedAttributeNames = ['name', 'content'];

      buildProperties(ProjectFile);

      function ProjectFile(options) {
        this.destroy = __bind(this.destroy, this);
        this.save = __bind(this.save, this);
        this._onIsActiveChanged = __bind(this._onIsActiveChanged, this);
        this._onSaved = __bind(this._onSaved, this);
        this._onContentChanged = __bind(this._onContentChanged, this);
        this._onNameChanged = __bind(this._onNameChanged, this);
        ProjectFile.__super__.constructor.call(this, options);
        this.storedContent = this.content;
        this.on("save", this._onSaved);
        this.on("change:name", this._onNameChanged);
        this.on("change:content", this._onContentChanged);
        this.on("change:isActive", this._onIsActiveChanged);
      }

      ProjectFile.prototype._onNameChanged = function() {
        return this.isSaveAdvised = true;
      };

      ProjectFile.prototype._onContentChanged = function() {
        this.isCompileAdvised = true;
        if (this.storedContent === this.content) {
          return this.isSaveAdvised = false;
        } else {
          return this.isSaveAdvised = true;
        }
      };

      ProjectFile.prototype._onSaved = function() {
        this.storedContent = this.content;
        return this.isSaveAdvised = false;
      };

      ProjectFile.prototype._onIsActiveChanged = function() {
        if (this.isActive) {
          return this.trigger("activated");
        } else {
          return this.trigger("deActivated");
        }
      };

      ProjectFile.prototype.save = function(attributes, options) {
        var backup;
        backup = this.toJSON;
        this.toJSON = (function(_this) {
          return function() {
            var attrName, attrValue;
            attributes = _.clone(_this.attributes);
            for (attrName in attributes) {
              attrValue = attributes[attrName];
              if (__indexOf.call(_this.persistedAttributeNames, attrName) < 0) {
                delete attributes[attrName];
              }
            }
            return attributes;
          };
        })(this);
        ProjectFile.__super__.save.call(this, attributes, options);
        this.toJSON = backup;
        return this.trigger("save", this);
      };

      ProjectFile.prototype.destroy = function(options) {
        options = options || {};
        return this.trigger('destroy', this, this.collection, options);
      };

      return ProjectFile;

    })(Backbone.Model);
    Folder = (function(_super) {
      __extends(Folder, _super);

      Folder.prototype.model = ProjectFile;

      Folder.prototype.sync = null;

      function Folder(options) {
        this.save = __bind(this.save, this);
        Folder.__super__.constructor.call(this, options);
        this._storageData = [];
      }

      Folder.prototype.save = function() {
        var file, index, _ref, _results;
        _ref = this.models;
        _results = [];
        for (index in _ref) {
          file = _ref[index];
          file.sync = this.sync;
          _results.push(file.save());
        }
        return _results;
      };

      Folder.prototype.changeStorage = function(storeName, storeData) {
        var file, index, oldStoreName, _i, _len, _ref, _ref1, _results;
        _ref = this._storageData;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          oldStoreName = _ref[_i];
          delete this[oldStoreName];
        }
        this._storageData = [];
        this._storageData.push(storeName);
        this[storeName] = storeData;
        _ref1 = this.models;
        _results = [];
        for (index in _ref1) {
          file = _ref1[index];
          _results.push(file.sync = this.sync);
        }
        return _results;
      };

      return Folder;

    })(Backbone.Collection);
    Project = (function(_super) {
      "Main aspect of coffeescad : contains all the files\n* project is a top level element (\"folder\"+metadata)\n* a project contains files \n* a project can reference another project (includes)";
      __extends(Project, _super);

      Project.prototype.idAttribute = 'name';

      Project.prototype.defaults = {
        name: "Project",
        lastModificationDate: null,
        activeFile: null,
        isSaveAdvised: false,
        isCompiled: false,
        isCompileAdvised: false
      };

      Project.prototype.attributeNames = ['name', 'lastModificationDate', 'activeFile', 'isCompiled', 'isSaveAdvised', 'isCompileAdvised'];

      Project.prototype.persistedAttributeNames = ['name', 'lastModificationDate'];

      buildProperties(Project);

      function Project(options) {
        this._onFileDestroyed = __bind(this._onFileDestroyed, this);
        this._onFileChanged = __bind(this._onFileChanged, this);
        this._onFileSaved = __bind(this._onFileSaved, this);
        this._onFilesReset = __bind(this._onFilesReset, this);
        this._onNameChanged = __bind(this._onNameChanged, this);
        this._onCompileError = __bind(this._onCompileError, this);
        this._onCompiled = __bind(this._onCompiled, this);
        this._clearFlags = __bind(this._clearFlags, this);
        this._setupFileEventHandlers = __bind(this._setupFileEventHandlers, this);
        this._addFile = __bind(this._addFile, this);
        this.makeFileActive = __bind(this.makeFileActive, this);
        this.injectContent = __bind(this.injectContent, this);
        this.compile = __bind(this.compile, this);
        this.save = __bind(this.save, this);
        this.removeFile = __bind(this.removeFile, this);
        var classRegistry, _ref;
        options = options || {};
        Project.__super__.constructor.call(this, options);
        this.compiler = (_ref = options.compiler) != null ? _ref : new Compiler();
        this.rootFolder = new Folder();
        this.rootFolder.on("reset", this._onFilesReset);
        classRegistry = {};
        this.bom = new Backbone.Collection();
        this.rootAssembly = {};
        this.dataStore = null;
        this.on("change:name", this._onNameChanged);
        this.on("compiled", this._onCompiled);
        this.on("compile:error", this._onCompileError);
        this.on("loaded", this._onFilesReset);
      }

      Project.prototype.addFile = function(options) {
        var file, _ref, _ref1;
        file = new ProjectFile({
          name: (_ref = options.name) != null ? _ref : this.name + ".coffee",
          content: (_ref1 = options.content) != null ? _ref1 : " \n\n"
        });
        this._addFile(file);
        return file;
      };

      Project.prototype.removeFile = function(file) {
        this.rootFolder.remove(file);
        return this.isSaveAdvised = true;
      };

      Project.prototype.save = function(attributes, options) {
        this.dataStore.saveProject(this);
        this._clearFlags();
        return this.trigger("save", this);
      };

      Project.prototype.compile = function(options) {
        if (this.compiler == null) {
          throw new Error("No compiler specified");
        }
        this.compiler.project = this;
        return this.compiler.compile(options);
      };

      Project.prototype.injectContent = function(content, fileName) {
        var file;
        if (fileName == null) {
          fileName = this.rootFolder.get(this.name + ".coffee");
        }
        file = this.rootFolder.get(fileName);
        return file.content += content;
      };

      Project.prototype.makeFileActive = function(options) {
        var file, fileName, otherFile, otherFiles, _i, _len;
        options = options || {};
        fileName = null;
        if (options instanceof String || typeof options === 'string') {
          fileName = options;
        }
        if (options instanceof ProjectFile) {
          fileName = options.name;
        }
        if (options.file) {
          fileName = options.file.name;
        }
        if (options.fileName) {
          fileName = options.fileName;
        }
        file = this.rootFolder.get(fileName);
        if (file != null) {
          file.isActive = true;
          this.activeFile = file;
          otherFiles = _.without(this.rootFolder.models, file);
          for (_i = 0, _len = otherFiles.length; _i < _len; _i++) {
            otherFile = otherFiles[_i];
            otherFile.isActive = false;
          }
        }
        return this.activeFile;
      };

      Project.prototype._addFile = function(file) {
        this.rootFolder.add(file);
        this._setupFileEventHandlers(file);
        return this.isSaveAdvised = true;
      };

      Project.prototype._setupFileEventHandlers = function(file) {
        file.on("change:content", this._onFileChanged);
        file.on("save", this._onFileSaved);
        return file.on("destroy", this._onFileDestroyed);
      };

      Project.prototype._clearFlags = function() {
        var file, _i, _len, _ref;
        _ref = this.rootFolder.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          file.isSaveAdvised = false;
          file.isCompileAdvised = false;
        }
        this.isSaveAdvised = false;
        return this.isCompileAdvised = false;
      };

      Project.prototype._onCompiled = function() {
        var file, _i, _len, _ref;
        this.compiler.project = null;
        this.isCompileAdvised = false;
        _ref = this.rootFolder.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          file.isCompileAdvised = false;
        }
        return this.isCompiled = true;
      };

      Project.prototype._onCompileError = function() {
        var file, _i, _len, _ref;
        this.compiler.project = null;
        this.isCompileAdvised = false;
        _ref = this.rootFolder.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          file.isCompileAdvised = false;
        }
        return this.isCompiled = true;
      };

      Project.prototype._onNameChanged = function(model, name) {
        var error, mainFile;
        try {
          mainFile = this.rootFolder.get(this.previous('name') + ".coffee");
          if (mainFile != null) {
            console.log("project name changed from " + (this.previous('name')) + " to " + name);
            return mainFile.name = "" + name + ".coffee";
          }
        } catch (_error) {
          error = _error;
          return console.log("error in rename : " + error);
        }
      };

      Project.prototype._onFilesReset = function() {
        var file, mainFileName, _i, _len, _ref;
        mainFileName = "" + this.name + ".coffee";

        /* 
        mainFile = @rootFolder.get(mainFileName)
        @rootFolder.remove(mainFileName)
        @rootFolder.add(mainFile, {at:0})
        
        configFileName = "config.coffee"
        configFile = @rootFolder.get(configFileName)
        @rootFolder.remove(configFileName)
        @rootFolder.add(configFile, {at:1})
         */
        console.log("files reset, setting active file to", mainFileName);
        this.makeFileActive({
          fileName: mainFileName
        });
        _ref = this.rootFolder.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          this._setupFileEventHandlers(file);
        }
        return this._clearFlags();
      };

      Project.prototype._onFileSaved = function(fileName) {
        var file;
        this.lastModificationDate = new Date();
        for (file in this.rootFolder) {
          if (file.isSaveAdvised) {
            return;
          }
        }
      };

      Project.prototype._onFileChanged = function(file) {
        if (file.isSaveAdvised === true) {
          this.isSaveAdvised = file.isSaveAdvised;
        }
        if (file.isCompileAdvised === true) {
          return this.isCompileAdvised = file.isCompileAdvised;
        }
      };

      Project.prototype._onFileDestroyed = function(file) {
        if (this.dataStore) {
          return this.dataStore.destroyFile(this.name, file.name);
        }
      };

      return Project;

    })(Backbone.Model);
    return Project;
  });

}).call(this);
