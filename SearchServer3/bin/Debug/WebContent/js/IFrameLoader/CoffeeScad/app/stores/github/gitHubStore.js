(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var GitHubLibrary, GitHubRedirectDriver, GitHubStore, Project, github, vent;
    github = require('github');
    vent = require('core/messaging/appVent');
    Project = require('core/projects/project');
    GitHubRedirectDriver = (function() {
      function GitHubRedirectDriver() {
        this.state = 1;
        this.client_id = "c346489dcec8041bd88f";
        this.redirect_uri = window.location;
        this.scopes = "gist";
        this.authUrl = "https://github.com/login/oauth/authorize?client_id=" + this.client_id + "&redirect_uri=" + window.location + "&scope=" + this.scopes;
      }

      GitHubRedirectDriver.prototype.getURLParameter = function(paramName) {
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

      GitHubRedirectDriver.prototype.postStuff = function(url, params) {
        var request;
        params = encodeURIComponent(params);
        console.log("params" + params);
        request = new XMLHttpRequest();
        request.open('get', url, true);
        if ((__indexOf.call(request, "withCredentials") >= 0)) {
          console.log("cors supported");
        }
        request.onreadystatechange = (function(_this) {
          return function() {
            console.log("toto" + request.readyState);
            if (request.readyState === 4 && request.status === 200) {
              return alert(request.responseText);
            }
          };
        })(this);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.setRequestheader("Origin", "http://kaosat-dev.github.com/CoffeeSCad/");
        request.send(params);
        console.log("request");
        return console.log(request);
      };

      GitHubRedirectDriver.prototype.postJsonP = function(url, params) {
        var foo;
        return foo = function(response) {
          var data, meta;
          meta = response.meta;
          data = response.data;
          console.log(meta);
          return console.log(data);
        };
      };

      GitHubRedirectDriver.prototype.run = function() {
        var code, foo, params;
        code = this.getURLParameter("code");
        if (code != null) {
          this.state = 2;
          console.log("github:phase2");
        }
        if (this.state === 1) {
          console.log("gihub auth url " + this.authUrl);
          console.log("redirecting");
          window.location.href = this.authUrl;
        }
        if (this.state === 2) {
          this.tokenUrl = "https://github.com/login/oauth/access_token";
          params = "client_id=" + this.client_id + "&client_secret=mlkmlk&code=" + code;
          console.log("sending code request to url " + this.tokenUrl + " with params " + params);
          this.postStuff(this.tokenUrl, params);
          return foo = function(response) {
            console.log("jsonp response");
            return console.log(response);
          };

          /*
          $.ajax
            type: "GET"
            url: @tokenUrl
            data: null
            jsonpCallback: 'foo'
            success: (r)->console.log "github auth phase 2 ok : #{r}"
            error:(e)->console.log "aie aie error #{e.message}"
            dataType: 'jsonp'
           */
        }
      };

      return GitHubRedirectDriver;

    })();
    GitHubStore = (function() {
      function GitHubStore() {
        this.authentificate = __bind(this.authentificate, this);
        this.driver = new GitHubRedirectDriver();

        /*
        @github = new Github
          token: "OAUTH_TOKEN"
          auth: "oauth"
         */
      }

      GitHubStore.prototype.authentificate = function() {

        /*@client = new Dropbox.Client 
          key: "h8OY5h+ah3A=|AS0FmmbZJrmc8/QbpU6lMzrCd5lSGZPCKVtjMlA7ZA=="
          sandbox: true
         */
        var d;
        this.driver.run();
        console.log("here");
        d = $.Deferred();

        /* 
        @client.authenticate (error, client)=>
          console.log "in auth"
          console.log error
          console.log client
          if error?
            d.reject(@formatError(error))
          d.resolve(error)
         */
        return d.promise();
      };

      GitHubStore.prototype.sync = function() {};

      return GitHubStore;

    })();
    GitHubLibrary = (function(_super) {
      "a library contains multiple projects, stored on github";
      __extends(GitHubLibrary, _super);

      GitHubLibrary.prototype.model = Project;

      GitHubLibrary.prototype.path = "";

      GitHubLibrary.prototype.defaults = {
        recentProjects: []
      };

      function GitHubLibrary(options) {
        GitHubLibrary.__super__.constructor.call(this, options);
      }

      GitHubLibrary.prototype.comparator = function(project) {
        var date;
        date = new Date(project.get('lastModificationDate'));
        return date.getTime();
      };

      GitHubLibrary.prototype.onReset = function() {
        console.log("GitHubLibrary reset");
        console.log(this);
        return console.log("_____________");
      };

      return GitHubLibrary;

    })(Backbone.Collection);
    GitHubStore = (function(_super) {
      __extends(GitHubStore, _super);

      GitHubStore.prototype.defaults = {
        name: "gitHubStore",
        storeType: "gitHub"
      };

      function GitHubStore(options) {
        this.getProjectsName = __bind(this.getProjectsName, this);
        this.loadProject = __bind(this.loadProject, this);
        this.saveProject = __bind(this.saveProject, this);
        this.createProject = __bind(this.createProject, this);
        this.logout = __bind(this.logout, this);
        this.login = __bind(this.login, this);
        GitHubStore.__super__.constructor.call(this, options);
        this.store = new GitHubStore();
        this.isLogginRequired = true;
        this.loggedIn = true;
        this.vent = vent;
        this.vent.on("gitHubStore:login", this.login);
        this.vent.on("gitHubStore:logout", this.logout);
        this.lib = new GitHubLibrary({
          sync: this.store.sync
        });
        this.lib.sync = this.store.sync;
      }

      GitHubStore.prototype.login = function() {
        var error, loginPromise, onLoginFailed, onLoginSucceeded;
        console.log("login requested");
        try {
          onLoginSucceeded = (function(_this) {
            return function() {
              console.log("github logged in");
              localStorage.setItem("githubCon-auth", true);
              _this.loggedIn = true;
              return _this.vent.trigger("gitHubStore:loggedIn");
            };
          })(this);
          onLoginFailed = (function(_this) {
            return function(error) {
              console.log("github loggin failed");
              throw error;
            };
          })(this);
          loginPromise = this.store.authentificate();
          return $.when(loginPromise).done(onLoginSucceeded).fail(onLoginFailed);
        } catch (_error) {
          error = _error;
          return this.vent.trigger("gitHubStore:loginFailed");
        }
      };

      GitHubStore.prototype.logout = function() {
        var error, logoutPromise, onLoginFailed, onLogoutSucceeded;
        try {
          onLogoutSucceeded = (function(_this) {
            return function() {
              console.log("github logged out");
              localStorage.removeItem("githubCon-auth");
              _this.loggedIn = false;
              return _this.vent.trigger("gitHubStore:loggedOut");
            };
          })(this);
          onLoginFailed = (function(_this) {
            return function(error) {
              console.log("github logout failed");
              throw error;
            };
          })(this);
          logoutPromise = this.store.signOut();
          return $.when(logoutPromise).done(onLogoutSucceeded).fail(onLogoutFailed);
        } catch (_error) {
          error = _error;
          return this.vent.trigger("gitHubStore:logoutFailed");
        }
      };

      GitHubStore.prototype.authCheck = function() {
        var authOk, getURLParameter, urlAuthOk;
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
        urlAuthOk = getURLParameter("code");
        console.log("githubStore got redirect param " + urlAuthOk);
        authOk = localStorage.getItem("githubCon-auth");
        console.log("githubStore got localstorage Param " + authOk);
        if (urlAuthOk != null) {
          this.login();
          return window.history.replaceState('', '', '/');
        } else {
          if (authOk != null) {
            return this.login();
          }
        }
      };

      GitHubStore.prototype.createProject = function(options) {
        var project;
        project = this.lib.create(options);
        project.createFile({
          name: project.get("name")
        });
        return project.createFile({
          name: "config"
        });
      };

      GitHubStore.prototype.saveProject = function(project) {
        var file, index, _ref;
        this.lib.add(project);
        project.sync = this.store.sync;
        project.pathRoot = project.get("name");
        project.pfiles.sync = this.store.sync;
        project.pfiles.path = project.get("name");
        _ref = project.pfiles.models;
        for (index in _ref) {
          file = _ref[index];
          file.sync = this.store.sync;
          file.pathRoot = project.get("name");
          file.save();
        }
        return this.vent.trigger("project:saved");
      };

      GitHubStore.prototype.loadProject = function(projectName) {
        var project;
        console.log("github loading project " + projectName);
        project = this.lib.get(projectName);
        console.log("loaded:");
        return console.log(project);
      };

      GitHubStore.prototype.getProjectsName = function(callback) {
        return this.store.client.readdir("/", function(error, entries) {
          if (error) {
            return console.log("error");
          } else {
            console.log(entries);
            return callback(entries);
          }
        });
      };

      return GitHubStore;

    })(Backbone.Model);
    return GitHubStore;
  });

}).call(this);
