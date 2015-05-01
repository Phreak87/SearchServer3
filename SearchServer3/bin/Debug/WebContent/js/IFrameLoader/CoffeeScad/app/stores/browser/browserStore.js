(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(function(require) {
    var Backbone, BrowserLibrary, BrowserStore, LocalStorage, Project, buildProperties, merge, reqRes, utils, vent;
    Backbone = require('backbone');
    LocalStorage = require('localstorage');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    buildProperties = require('core/utils/buildProperties');
    utils = require('core/utils/utils');
    merge = utils.merge;
    Project = require('core/projects/project');
    require('jszip');
    require('jszip-deflate');
    BrowserLibrary = (function(_super) {
      "a library contains multiple projects, stored in localstorage (browser)";
      __extends(BrowserLibrary, _super);

      BrowserLibrary.prototype.model = Project;

      BrowserLibrary.prototype.defaults = {
        recentProjects: []
      };

      function BrowserLibrary(options) {
        BrowserLibrary.__super__.constructor.call(this, options);
      }

      BrowserLibrary.prototype.comparator = function(project) {
        var date;
        date = new Date(project.lastModificationDate);
        return date.getTime();
      };

      return BrowserLibrary;

    })(Backbone.Collection);
    BrowserStore = (function(_super) {
      __extends(BrowserStore, _super);

      BrowserStore.prototype.attributeNames = ['name', 'loggedIn', 'isDataDumpAllowed'];

      buildProperties(BrowserStore);

      BrowserStore.prototype.idAttribute = 'name';

      BrowserStore.prototype.defaults = {
        name: "browserStore",
        storeType: "browser",
        tooltip: "Store to localstorage (browser)",
        loggedIn: true,
        isDataDumpAllowed: true
      };

      function BrowserStore(options) {
        this._sourceFetchHandler = __bind(this._sourceFetchHandler, this);
        this._readFile = __bind(this._readFile, this);
        this._getProjectFiles = __bind(this._getProjectFiles, this);
        this._removeFile = __bind(this._removeFile, this);
        this._addToProjectsList = __bind(this._addToProjectsList, this);
        this._removeFromProjectsList = __bind(this._removeFromProjectsList, this);
        this.destroyFile = __bind(this.destroyFile, this);
        this.renameProject = __bind(this.renameProject, this);
        this.deleteProject = __bind(this.deleteProject, this);
        this.loadProject = __bind(this.loadProject, this);
        this.autoSaveProject = __bind(this.autoSaveProject, this);
        this.saveProject = __bind(this.saveProject, this);
        this.getThumbNail = __bind(this.getThumbNail, this);
        this.getProjectFiles = __bind(this.getProjectFiles, this);
        this.getProject = __bind(this.getProject, this);
        this.getProjectsName = __bind(this.getProjectsName, this);
        this.logout = __bind(this.logout, this);
        this.login = __bind(this.login, this);
        var defaults;
        defaults = {
          storeURI: "projects"
        };
        options = merge(defaults, options);
        this.storeURI = options.storeURI;
        BrowserStore.__super__.constructor.call(this, options);
        this.store = new Backbone.LocalStorage(this.storeURI);
        this.isLogginRequired = false;
        this.vent = vent;
        this.vent.on("browserStore:login", this.login);
        this.vent.on("browserStore:logout", this.logout);
        this.lib = new BrowserLibrary();
        this.lib.localStorage = new Backbone.LocalStorage(this.storeURI);
        this.projectsList = [];
        this.lib.fetch();
        console.log("fetched lib", this.lib);
        reqRes.addHandler("getbrowserFileOrProjectCode", this._sourceFetchHandler);
        this.repair();
      }

      BrowserStore.prototype.login = function() {
        console.log("browser logged in");
        return this.loggedIn = true;
      };

      BrowserStore.prototype.logout = function() {
        return this.loggedIn = false;
      };

      BrowserStore.prototype.authCheck = function() {};

      BrowserStore.prototype.repair = function() {
        var projectsList;
        projectsList = localStorage.getItem(this.storeURI);
        if (projectsList === null || projectsList === "" || projectsList === "null") {
          projectsList = this._getAllProjectsHelper();
          return localStorage.setItem(this.storeURI, projectsList);
        }
      };

      BrowserStore.prototype.dumpAllProjects = function() {
        var content, dataType, error, fileContent, fileName, files, folder, projectName, projectsList, zip, zipB64Url, _i, _j, _len, _len1;
        zip = new JSZip();
        projectsList = localStorage.getItem("" + this.storeURI);
        if (projectsList) {
          projectsList = projectsList.split(',');
        } else {
          projectsList = [];
        }
        for (_i = 0, _len = projectsList.length; _i < _len; _i++) {
          projectName = projectsList[_i];
          try {
            files = this._getProjectFiles(projectName);
            folder = zip.folder(projectName);
            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
              fileName = files[_j];
              fileContent = this._readFile(projectName, fileName);
              folder.file(fileName, fileContent);
            }
          } catch (_error) {
            error = _error;
          }
        }
        dataType = "base64";
        content = zip.generate({
          compression: 'DEFLATE'
        });
        zipB64Url = ("data:application/zip;" + dataType + ",") + content;
        return zipB64Url;
      };

      BrowserStore.prototype.getProjectsName = function(callback) {
        var error, projectsList;
        try {
          projectsList = localStorage.getItem("" + this.storeURI);
          if (projectsList) {
            projectsList = projectsList.split(',');
          } else {
            projectsList = [];
          }
          this.projectsList = projectsList;

          /* 
          projectNames = []
          for model in @lib.models
            projectNames.push(model.id)
            @projectsList.push(model.id)
           */
          return callback(this.projectsList);
        } catch (_error) {
          error = _error;
          return console.log("could not fetch projectsName from " + this.name + " because of error " + error);
        }
      };

      BrowserStore.prototype.getProject = function(projectName) {
        return this.lib.get(projectName);
      };

      BrowserStore.prototype.getProjectFiles = function(projectName) {
        var d, fileNames;
        d = $.Deferred();
        fileNames = [];
        if (__indexOf.call(this.projectsList, projectName) >= 0) {
          fileNames = this._getProjectFiles(projectName);
        }
        d.resolve(fileNames);
        return d;
      };

      BrowserStore.prototype.getThumbNail = function(projectName) {
        var deferred, file;
        deferred = $.Deferred();
        file = this._readFile(projectName, ".thumbnail.png");
        deferred.resolve(file);
        return deferred;
      };

      BrowserStore.prototype.saveProject = function(project, newName) {
        var added, attrName, attrValue, attributes, content, ext, file, fileName, filePath, filesList, firstSave, index, name, nameChange, oldFiles, projectName, projectURI, removed, rootStoreURI, strinfigiedProject, _i, _len, _ref;
        project.collection = null;
        this.lib.add(project);
        nameChange = false;
        if (project.name !== newName) {
          nameChange = true;
        }
        if (newName != null) {
          project.name = newName;
        }
        firstSave = false;
        if (project.dataStore == null) {
          firstSave = true;
        } else if (project.dataStore !== this || nameChange) {
          firstSave = true;
        }
        project.dataStore = this;
        projectName = project.name;
        this._addToProjectsList(project.name);
        projectURI = "" + this.storeURI + "-" + projectName;
        rootStoreURI = "" + projectURI + "-files";
        filesList = [];
        _ref = project.rootFolder.models;
        for (index in _ref) {
          file = _ref[index];
          name = file.name;
          content = file.content;
          filePath = "" + rootStoreURI + "-" + name;
          ext = name.split('.').pop();
          localStorage.setItem(filePath, JSON.stringify(file.toJSON()));
          filesList.push(file.name);
          file.trigger("save");
        }
        oldFiles = localStorage.getItem(rootStoreURI);
        if (oldFiles != null) {
          oldFiles = oldFiles.split(',');
          added = _.difference(filesList, oldFiles);
          removed = _.difference(oldFiles, filesList);
          for (_i = 0, _len = removed.length; _i < _len; _i++) {
            fileName = removed[_i];
            this._removeFile(projectName, fileName);
          }
        }
        localStorage.setItem(rootStoreURI, filesList.join(","));
        attributes = _.clone(project.attributes);
        for (attrName in attributes) {
          attrValue = attributes[attrName];
          if (__indexOf.call(project.persistedAttributeNames, attrName) < 0) {
            delete attributes[attrName];
          }
        }
        strinfigiedProject = JSON.stringify(attributes);
        localStorage.setItem(projectURI, strinfigiedProject);
        this.vent.trigger("project:saved", project);
        if (firstSave) {
          project._clearFlags();
        }
        return project.trigger("save", project);
      };

      BrowserStore.prototype.autoSaveProject = function(srcProject) {
        var attrName, attrValue, attributes, content, ext, fakeClone, file, filePath, filesList, index, name, project, projectName, projectURI, rootStoreURI, srcProjectName, strinfigiedProject, _ref;
        srcProjectName = srcProject.name;
        fakeClone = (function(_this) {
          return function(project, newName) {
            var clonedProject, pfile, _i, _len, _ref;
            clonedProject = new Project({
              name: newName
            });
            _ref = project.rootFolder.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              pfile = _ref[_i];
              clonedProject.addFile({
                name: pfile.name,
                content: pfile.content
              });
            }
            return clonedProject;
          };
        })(this);
        projectName = "autosave";
        project = fakeClone(srcProject, projectName);
        this.lib.add(project);
        this._addToProjectsList(projectName);
        projectURI = "" + this.storeURI + "-" + projectName;
        rootStoreURI = "" + projectURI + "-files";
        filesList = [];
        _ref = project.rootFolder.models;
        for (index in _ref) {
          file = _ref[index];
          name = file.name;
          content = file.content;
          filePath = "" + rootStoreURI + "-" + name;
          ext = name.split('.').pop();
          localStorage.setItem(filePath, JSON.stringify(file.toJSON()));
          filesList.push(file.name);
          file.trigger("save");
        }
        localStorage.setItem(rootStoreURI, filesList.join(","));
        attributes = _.clone(project.attributes);
        for (attrName in attributes) {
          attrValue = attributes[attrName];
          if (__indexOf.call(project.persistedAttributeNames, attrName) < 0) {
            delete attributes[attrName];
          }
        }
        strinfigiedProject = JSON.stringify(attributes);
        localStorage.setItem(projectURI, strinfigiedProject);
        return this.vent.trigger("project:autoSaved");
      };

      BrowserStore.prototype.loadProject = function(projectName, silent) {
        var content, d, fileName, fileNames, onProjectLoaded, project, projectURI, rootStoreURI, _i, _len;
        if (silent == null) {
          silent = false;
        }
        d = $.Deferred();
        project = new Project({
          name: projectName
        });
        project.collection = this.lib;
        projectURI = "" + this.storeURI + "-" + projectName;
        rootStoreURI = "" + projectURI + "-files";
        project.rootFolder.sync = project.sync;
        project.rootFolder.changeStorage("localStorage", new Backbone.LocalStorage(rootStoreURI));
        onProjectLoaded = (function(_this) {
          return function() {
            project._clearFlags();
            project.trigger("loaded");
            if (!silent) {
              _this.vent.trigger("project:loaded", project);
            }
            return d.resolve(project);
          };
        })(this);
        project.dataStore = this;
        fileNames = this._getProjectFiles(projectName);
        for (_i = 0, _len = fileNames.length; _i < _len; _i++) {
          fileName = fileNames[_i];
          content = this._readFile(projectName, fileName);

          /* 
           *remove old thumbnail
          thumbNailFile = project.rootFolder.get(".thumbnail.png")
          if thumbNailFile?
            project.rootFolder.remove(thumbNailFile)
           */
          project.addFile({
            content: content,
            name: fileName
          });
        }
        onProjectLoaded();
        return d;
      };

      BrowserStore.prototype.deleteProject = function(projectName) {
        var d, file, fileName, fileNames, fileUri, filesURI, project, projectURI, rootStoreURI, _i, _len;
        d = $.Deferred();
        console.log("browser storage deletion of " + projectName);
        project = this.lib.get(projectName);
        projectURI = "" + this.storeURI + "-" + projectName;
        rootStoreURI = "" + projectURI + "-files";
        file = null;
        filesURI = "" + projectURI + "-files";
        console.log("filesURI " + filesURI);
        fileNames = localStorage.getItem(filesURI);
        console.log("fileNames " + fileNames);
        if (fileNames) {
          fileNames = fileNames.split(',');
          for (_i = 0, _len = fileNames.length; _i < _len; _i++) {
            fileName = fileNames[_i];
            fileUri = "" + rootStoreURI + "-" + fileName;
            console.log("deleting " + fileUri);
            localStorage.removeItem(fileUri);
          }
        }
        this._removeFromProjectsList(projectName);
        this.lib.remove(project);
        return d.resolve();
      };

      BrowserStore.prototype.renameProject = function(oldName, newName) {
        var project, projectURI, rootStoreURI;
        project = this.lib.get(oldName);
        this.lib.remove(project);
        project.name = newName;
        projectURI = "" + this.storeURI + "-" + newName;
        project.localstorage = new Backbone.LocalStorage(projectURI);
        rootStoreURI = "" + projectURI + "-files";
        project.rootFolder.changeStorage("localStorage", new Backbone.LocalStorage(rootStoreURI));
        project.save();
        return this.lib.add(project);
      };

      BrowserStore.prototype.destroyFile = function(projectName, fileName) {
        return this._removeFile(projectName, fileName);
      };

      BrowserStore.prototype._removeFromProjectsList = function(projectName) {
        var index, projectURI, projects, rootStoreURI;
        projects = localStorage.getItem(this.storeURI);
        if (projects != null) {
          projects = projects.split(',');
          index = projects.indexOf(projectName);
          if (index !== -1) {
            projects.splice(index, 1);
            if (projects.length > 0) {
              projects = projects.join(',');
            } else {
              projects = "";
            }
            localStorage.setItem(this.storeURI, projects);
            index = this.projectsList.indexOf(projectName);
            this.projectsList.splice(index, 1);
            console.log("projectName");
            projectURI = "" + this.storeURI + "-" + projectName;
            rootStoreURI = "" + projectURI + "-files";
            localStorage.removeItem(rootStoreURI);
            return localStorage.removeItem(projectURI);
          }
        }
      };

      BrowserStore.prototype._addToProjectsList = function(projectName) {
        var projects;
        projects = localStorage.getItem(this.storeURI);
        if (projects != null) {
          if (projects === "") {
            projects = "" + projectName;
          } else {
            projects = projects.split(',');
            if (!(__indexOf.call(projects, projectName) >= 0)) {
              projects.push(projectName);
              projects = projects.join(',');
            }
          }
        } else {
          projects = "" + projectName;
        }
        this.projectsList.push(projectName);
        return localStorage.setItem(this.storeURI, projects);
      };

      BrowserStore.prototype._removeFile = function(projectName, fileName) {
        var fileNames, fileURI, filesURI, index, projectURI;
        projectURI = "" + this.storeURI + "-" + projectName;
        filesURI = "" + projectURI + "-files";
        fileNames = localStorage.getItem(filesURI);
        fileNames = fileNames.split(',');
        index = fileNames.indexOf(fileName);
        fileNames.splice(index, 1);
        fileNames = fileNames.join(',');
        localStorage.setItem(filesURI, fileNames);
        fileURI = "" + filesURI + "-" + fileName;
        return localStorage.removeItem(fileURI);
      };

      BrowserStore.prototype._getProjectFiles = function(projectName) {
        var fileNames, filesURI, projectURI;
        projectURI = "" + this.storeURI + "-" + projectName;
        filesURI = "" + projectURI + "-files";
        fileNames = localStorage.getItem(filesURI);
        fileNames = fileNames.split(',');
        return fileNames;
      };

      BrowserStore.prototype._readFile = function(projectName, fileName) {
        var fileData, fileNames, fileUri, filesURI, projectURI, rawData;
        projectURI = "" + this.storeURI + "-" + projectName;
        filesURI = "" + projectURI + "-files";
        fileNames = localStorage.getItem(filesURI);
        fileNames = fileNames.split(',');
        if (__indexOf.call(fileNames, fileName) >= 0) {
          fileUri = "" + filesURI + "-" + fileName;
          fileData = localStorage.getItem(fileUri);
          rawData = JSON.parse(fileData);
          return rawData["content"];
        } else {
          throw new Error("no such file");
        }
      };

      BrowserStore.prototype._sourceFetchHandler = function(_arg) {
        var deferred, file, getContent, index, namespaced, path, project, projectName, result, shortName, store, _ref, _ref1;
        store = _arg[0], projectName = _arg[1], path = _arg[2], deferred = _arg[3];
        if (store !== "browser") {
          return null;
        }
        result = "";
        if ((projectName == null) && (path != null)) {
          shortName = path;
          file = this.project.rootFolder.get(shortName);
          result = file.content;
          return result = "\n" + result + "\n";
        } else if ((projectName != null) && (path == null)) {
          console.log("will fetch project " + projectName + "'s namespace");
          project = this.getProject(projectName);
          console.log(project);
          namespaced = {};
          _ref = project.rootFolder.models;
          for (index in _ref) {
            file = _ref[index];
            namespaced[file.name] = file.content;
          }
          namespaced = "" + projectName + "={";
          _ref1 = project.rootFolder.models;
          for (index in _ref1) {
            file = _ref1[index];
            namespaced += "" + file.name + ":'" + file.content + "'";
          }
          namespaced += "}";
          return result = namespaced;
        } else if ((projectName != null) && (path != null)) {
          console.log("will fetch " + path + " from " + projectName);
          getContent = (function(_this) {
            return function(project) {
              project.rootFolder.fetch();
              file = project.rootFolder.get(path);
              result = file.content;
              result = result.replace(/(?!\s*?#)(?:\s*?include\s*?)(?:\(?\"([\w\//:'%~+#-.*]+)\"\)?)/g, function(match, matchInner) {
                var includeFull;
                includeFull = matchInner.toString();
                return "\ninclude(\"browser:" + projectName + "/" + includeFull + "\")\n";
              });
              result = "\n" + result + "\n";
              return deferred.resolve(result);
            };
          })(this);
          return this.loadProject(projectName, true).done(getContent);
        }
      };

      BrowserStore.prototype._getAllProjectsHelper = function() {
        var item, key, projData, projectName, projects;
        projects = [];
        for (item in localStorage) {
          key = localStorage[item];
          projData = item.split("-");
          if (projData[0] === "projects") {
            projectName = projData[1];
            if (projectName != null) {
              if (__indexOf.call(projects, projectName) < 0) {
                projects.push(projectName);
              }
            }
          }
        }
        projects = projects.join(",");
        return projects;
      };

      return BrowserStore;

    })(Backbone.Model);
    return BrowserStore;
  });

}).call(this);
