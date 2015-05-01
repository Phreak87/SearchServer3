(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(function(require) {
    var DropBoxLibrary, DropBoxStore, Project, backbone_dropbox, buildProperties, reqRes, vent;
    buildProperties = require('core/utils/buildProperties');
    backbone_dropbox = require('./backbone.dropbox');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    Project = require('core/projects/project');
    DropBoxLibrary = (function(_super) {
      "a library contains multiple projects, stored on dropbox";
      __extends(DropBoxLibrary, _super);

      DropBoxLibrary.prototype.path = "";

      DropBoxLibrary.prototype.defaults = {
        recentProjects: []
      };

      function DropBoxLibrary(options) {
        DropBoxLibrary.__super__.constructor.call(this, options);
      }

      DropBoxLibrary.prototype.comparator = function(project) {
        var date;
        date = new Date(project.get('lastModificationDate'));
        return date.getTime();
      };

      DropBoxLibrary.prototype.onReset = function() {
        console.log("DropBoxLibrary reset");
        console.log(this);
        return console.log("_____________");
      };

      return DropBoxLibrary;

    })(Backbone.Collection);
    DropBoxStore = (function(_super) {
      __extends(DropBoxStore, _super);

      DropBoxStore.prototype.attributeNames = ['name', 'loggedIn', 'isDataDumpAllowed'];

      buildProperties(DropBoxStore);

      DropBoxStore.prototype.idAttribute = 'name';

      DropBoxStore.prototype.defaults = {
        name: "DropboxStore",
        storeType: "Dropbox",
        tooltip: "Store to the Dropbox Cloud based storage: requires login",
        loggedIn: false,
        isDataDumpAllowed: false
      };

      function DropBoxStore(options) {
        this._sourceFetchHandler = __bind(this._sourceFetchHandler, this);
        this._removeFile = __bind(this._removeFile, this);
        this.renameProject = __bind(this.renameProject, this);
        this.destroyFile = __bind(this.destroyFile, this);
        this.deleteProject = __bind(this.deleteProject, this);
        this.loadProject = __bind(this.loadProject, this);
        this.saveProject_ = __bind(this.saveProject_, this);
        this.saveProject = __bind(this.saveProject, this);
        this.createProject = __bind(this.createProject, this);
        this.checkProjectExists = __bind(this.checkProjectExists, this);
        this.getThumbNail = __bind(this.getThumbNail, this);
        this.getProjectFile = __bind(this.getProjectFile, this);
        this.getProjectFiles2 = __bind(this.getProjectFiles2, this);
        this.getProjectFiles = __bind(this.getProjectFiles, this);
        this.getProject = __bind(this.getProject, this);
        this.getProjectsName = __bind(this.getProjectsName, this);
        this.logout = __bind(this.logout, this);
        this.login = __bind(this.login, this);
        DropBoxStore.__super__.constructor.call(this, options);
        this.debug = true;
        this.store = new backbone_dropbox();
        this.isLogginRequired = true;
        this.vent = vent;
        this.vent.on("DropboxStore:login", this.login);
        this.vent.on("DropboxStore:logout", this.logout);
        this.lib = new DropBoxLibrary({
          sync: this.store.sync
        });
        this.lib.sync = this.store.sync;
        this.projectsList = [];
        this.cachedProjects = {};
        reqRes.addHandler("getdropboxFileOrProjectCode", this._sourceFetchHandler);
      }

      DropBoxStore.prototype.login = function() {
        var error, loginPromise, onLoginFailed, onLoginSucceeded;
        try {
          onLoginSucceeded = (function(_this) {
            return function() {
              localStorage.setItem("dropboxCon-auth", true);
              _this.loggedIn = true;
              _this.vent.trigger("DropboxStore:loggedIn");
              return console.lo;
            };
          })(this);
          onLoginFailed = (function(_this) {
            return function(error) {
              throw error;
            };
          })(this);
          loginPromise = this.store.authentificate();
          return $.when(loginPromise).done(onLoginSucceeded).fail(onLoginFailed);
        } catch (_error) {
          error = _error;
          return this.vent.trigger("DropboxStore:loginFailed");
        }
      };

      DropBoxStore.prototype.logout = function() {
        var error, logoutPromise, onLoginFailed, onLogoutSucceeded;
        try {
          onLogoutSucceeded = (function(_this) {
            return function() {
              localStorage.removeItem("dropboxCon-auth");
              _this.loggedIn = false;
              return _this.vent.trigger("DropboxStore:loggedOut");
            };
          })(this);
          onLoginFailed = (function(_this) {
            return function(error) {
              throw error;
            };
          })(this);
          logoutPromise = this.store.signOut();
          return $.when(logoutPromise).done(onLogoutSucceeded).fail(onLogoutFailed);
        } catch (_error) {
          error = _error;
          return this.vent.trigger("DropboxStore:logoutFailed");
        }
      };

      DropBoxStore.prototype.authCheck = function() {
        var appBaseUrl, authOk, getURLParameter, urlAuthOk;
        getURLParameter = function(paramName) {
          var i, params, searchString, val;
          searchString = window.location.search.substring(1);
          i = void 0;
          val = void 0;
          params = searchString.split("&");
          i = 0;
          while (i < params.length) {
            val = params[i].split("=");
            if (val[0] === paramName) {
              return unescape(val[1]);
            }
            i++;
          }
          return null;
        };
        urlAuthOk = getURLParameter("_dropboxjs_scope");
        authOk = localStorage.getItem("dropboxCon-auth");
        if (urlAuthOk != null) {
          this.login();
          appBaseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
          return window.history.replaceState('', '', appBaseUrl);
        } else {
          if (authOk != null) {
            return this.login();
          }
        }
      };

      DropBoxStore.prototype.getProjectsName = function(callback) {
        if (this.store.client != null) {
          return this.store.client.readdir("/", (function(_this) {
            return function(error, entries) {
              if (error) {
                return console.log("error");
              } else {
                _this.projectsList = entries;
                if (callback != null) {
                  return callback(entries);
                }
              }
            };
          })(this));
        }
      };

      DropBoxStore.prototype.getProject = function(projectName) {
        if (__indexOf.call(this.projectsList, projectName) >= 0) {
          return this.loadProject(projectName, true);
        } else {
          return null;
        }
      };

      DropBoxStore.prototype.getProjectFiles = function(projectName) {
        var d;
        d = $.Deferred();
        if (this.store.client != null) {
          this.store.client.readdir("/" + projectName + "/", (function(_this) {
            return function(error, entries) {
              if (error) {
                return d.reject(error);
              } else {
                return d.resolve(entries);
              }
            };
          })(this));
        } else {
          d.reject(error);
        }
        return d;
      };

      DropBoxStore.prototype.getProjectFiles2 = function(projectName) {
        return this.store.client.readdir("/" + projectName + "/");
      };

      DropBoxStore.prototype.getProjectFile = function(projectName, fileName) {};

      DropBoxStore.prototype.getThumbNail = function(projectName) {
        var deferred, myDeferred, parseBase64Png;
        myDeferred = $.Deferred();
        deferred = this.store._readFile("/" + projectName + "/.thumbnail.png", {
          arrayBuffer: true
        });
        parseBase64Png = function(rawData) {
          var base64src, bytes, data, i, _i, _ref;
          bytes = new Uint8Array(rawData);
          data = '';
          for (i = _i = 0, _ref = bytes.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            data += String.fromCharCode(bytes[i]);
          }
          data = btoa(data);
          base64src = 'data:image/png;base64,' + data;
          return myDeferred.resolve(base64src);
        };
        deferred.done(parseBase64Png);
        return myDeferred;
      };

      DropBoxStore.prototype.checkProjectExists = function(projectName) {
        return this.store._readDir("/" + projectName + "/");
      };

      DropBoxStore.prototype.createProject = function(fileName) {
        var project;
        project = new Project({
          name: fileName
        });
        project.rootFolder.sync = this.store.sync;
        project.rootFolder.path = project.get("name");
        project.createFile({
          name: fileName
        });
        project.createFile({
          name: "config"
        });
        return this.vent.trigger("project:loaded", project);
      };

      DropBoxStore.prototype.saveProject = function(project, newName) {
        var ab, array, byteString, content, data, dataURIComponents, ext, file, filePath, filesList, i, index, length, mimeString, name, projectName, ua, _i, _j, _ref, _ref1;
        console.log("saving projectto dropbox");
        project.collection = null;
        this.lib.add(project);
        if (newName != null) {
          project.name = newName;
        }
        project.dataStore = this;
        filesList = [];
        _ref = project.rootFolder.models;
        for (index in _ref) {
          file = _ref[index];
          projectName = project.name;
          name = file.name;
          content = file.content;
          filePath = "" + projectName + "/" + name;
          filesList.push(file.name);
          ext = name.split('.').pop();
          if (ext === "png") {
            dataURIComponents = content.split(',');
            mimeString = dataURIComponents[0].split(':')[1].split(';')[0];
            if (dataURIComponents[0].indexOf('base64') !== -1) {
              console.log("base64 v1");
              data = atob(dataURIComponents[1]);
              array = [];
              for (i = _i = 0, _ref1 = data.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
                array.push(data.charCodeAt(i));
              }
              content = new Blob([new Uint8Array(array)], {
                type: 'image/png'
              });
            } else {
              console.log("other v2");
              byteString = unescape(dataURIComponents[1]);
              length = byteString.length;
              ab = new ArrayBuffer(length);
              ua = new Uint8Array(ab);
              for (i = _j = 0; 0 <= length ? _j < length : _j > length; i = 0 <= length ? ++_j : --_j) {
                ua[i] = byteString.charCodeAt(i);
              }
            }
          }
          file.trigger("save");
          console.log("saving file to " + filePath);
          this.store.writeFile(filePath, content);
        }

        /*
        oldFiles = @projectsList
        added = _.difference(filesList,oldFiles)
        removed = _.difference(oldFiles,filesList)
        console.log "added",added
        console.log "removed", removed
        @_removeFile(projectName, fileName) for fileName in removed
         */
        return this.vent.trigger("project:saved");
      };

      DropBoxStore.prototype.saveProject_ = function(project, newName) {
        console.log("saving projectto dropbox");
        project.collection = null;
        this.lib.add(project);
        if (newName != null) {
          project.name = newName;
        }
        project.sync = this.store.sync;
        project.rootFolder.sync = project.sync;
        project.rootFolder.path = project.name;
        project.save();

        /* 
        for index, file of project.rootFolder.models
           *file.pathRoot= project.get("name")
           *file.save()
          
           *actual saving of file, not json hack
          projectName = project.name
          name = file.name
          content =file.content
          filePath = "#{projectName}/#{name}"
          ext = name.split('.').pop()
          if ext == "png"
             *save thumbnail
            dataURIComponents = content.split(',')
            console.log "dataURIComponents"
            console.log dataURIComponents
            mimeString = dataURIComponents[0].split(':')[1].split(';')[0]
            if(dataURIComponents[0].indexOf('base64') != -1)
              data =  atob(dataURIComponents[1])
              array = []
              for i in [0...data.length]
                array.push(data.charCodeAt(i))
              content = new Blob([new Uint8Array(array)], {type: 'image/jpeg'})
            else
              byteString = unescape(dataURIComponents[1])
              length = byteString.length
              ab = new ArrayBuffer(length)
              ua = new Uint8Array(ab)
              for i in [0...length]
                ua[i] = byteString.charCodeAt(i)
            file.trigger("save")
          console.log "saving file to #{filePath}"
          @store.writeFile(filePath, content)
         */
        return this.vent.trigger("project:saved");
      };

      DropBoxStore.prototype.loadProject = function(projectName, silent) {
        var d, onProjectLoaded, project;
        if (silent == null) {
          silent = false;
        }
        d = $.Deferred();
        if (__indexOf.call(this.projectsList, projectName) >= 0) {
          console.log("dropbox loading project " + projectName);
          this.lib.add(project);
          project = new Project();
          project.name = projectName;
          onProjectLoaded = (function(_this) {
            return function() {
              var thumbNailFile;
              thumbNailFile = project.rootFolder.get(".thumbnail.png");
              project.rootFolder.remove(thumbNailFile);
              project._clearFlags();
              if (!silent) {
                _this.vent.trigger("project:loaded", project);
              }
              return d.resolve(project);
            };
          })(this);
          project.dataStore = this;
          project.rootFolder.rawData = true;
          project.rootFolder.sync = this.store.sync;
          project.rootFolder.path = projectName;
          project.rootFolder.fetch().done(onProjectLoaded);
        } else {
          this.checkProjectExists(projectName).fail((function(_this) {
            return function() {
              return d.fail(new Error("Project " + projectName + " not found"));
            };
          })(this)).done((function(_this) {
            return function() {
              _this.projectsList.push(projectName);
              return _this.loadProject(projectName);
            };
          })(this));
        }
        return d;
      };

      DropBoxStore.prototype.deleteProject = function(projectName) {
        var index;
        index = this.projectsList.indexOf(projectName);
        this.projectsList.splice(index, 1);
        return this.store.remove("/" + projectName);
      };

      DropBoxStore.prototype.destroyFile = function(projectName, fileName) {
        return this.store.remove("" + projectName + "/" + fileName);
      };

      DropBoxStore.prototype.renameProject = function(oldName, newName) {
        var index;
        index = this.projectsList.indexOf(oldName);
        this.projectsList.splice(index, 1);
        this.projectsList.push(newName);
        return this.store.move(oldName, newName).done(this.store.move("/" + newName + "/" + oldName + ".coffee", "/" + newName + "/" + newName + ".coffee"));
      };

      DropBoxStore.prototype._removeFile = function(projectName, fileName) {
        return this.store.remove("" + projectName + "/" + fileName);
      };

      DropBoxStore.prototype._sourceFetchHandler = function(_arg) {
        var deferred, file, getContent, index, namespaced, path, project, projectName, result, shortName, store, _ref, _ref1;
        store = _arg[0], projectName = _arg[1], path = _arg[2], deferred = _arg[3];
        if (store !== "dropbox") {
          return null;
        }
        console.log("handler recieved " + store + "/" + projectName + "/" + path);
        result = "";
        if ((projectName == null) && (path != null)) {
          shortName = path;
          file = this.project.rootFolder.get(shortName);
          result = file.content;
          result = "\n" + result + "\n";
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
          result = namespaced;
        } else if ((projectName != null) && (path != null)) {
          console.log("will fetch " + path + " from " + projectName);
          getContent = (function(_this) {
            return function(project) {
              _this.cachedProjects[projectName] = project;
              file = project.rootFolder.get(path);
              result = file.content;
              result = result.replace(/(?!\s*?#)(?:\s*?include\s*?)(?:\(?\"([\w\//:'%~+#-.*]+)\"\)?)/g, function(match, matchInner) {
                var includeFull;
                includeFull = matchInner.toString();
                return "\ninclude(\"dropbox:" + projectName + "/" + includeFull + "\")\n";
              });
              result = "\n" + result + "\n";
              return deferred.resolve(result);
            };
          })(this);
          if (!(projectName in this.cachedProjects)) {
            this.loadProject(projectName, true).done(getContent);
          } else {
            getContent(this.cachedProjects[projectName]);
          }
        }
        return result;
      };

      return DropBoxStore;

    })(Backbone.Model);
    return DropBoxStore;
  });

}).call(this);
