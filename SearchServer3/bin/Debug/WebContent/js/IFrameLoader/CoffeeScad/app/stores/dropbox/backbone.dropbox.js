(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var $, Backbone, DropBoxStorage, Dropbox, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    Dropbox = require("dropbox");
    DropBoxStorage = (function() {
      function DropBoxStorage(debug) {
        if (debug == null) {
          debug = false;
        }
        this.move = __bind(this.move, this);
        this.remove = __bind(this.remove, this);
        this.sync = __bind(this.sync, this);
        this.authentificate = __bind(this.authentificate, this);
        this.debug = debug;
        this.client = null;
        this.destroy_cache = [];
      }

      DropBoxStorage.prototype.authentificate = function() {
        var d;
        this.client = new Dropbox.Client({
          key: "h8OY5h+ah3A=|AS0FmmbZJrmc8/QbpU6lMzrCd5lSGZPCKVtjMlA7ZA==",
          sandbox: true
        });
        this.client.authDriver(new Dropbox.Drivers.Redirect({
          rememberUser: true,
          useQuery: true
        }));
        d = $.Deferred();
        this.client.authenticate((function(_this) {
          return function(error, client) {
            if (error != null) {
              _this.formatError(error, d);
            }
            return d.resolve(error);
          };
        })(this));
        return d.promise();
      };

      DropBoxStorage.prototype.signOut = function() {
        var d;
        d = $.Deferred();
        this.client.signOut((function(_this) {
          return function(error) {
            if (error != null) {
              return _this.formatError(error, d);
            } else {
              return d.resolve(error);
            }
          };
        })(this));
        return d.promise();
      };

      DropBoxStorage.prototype.formatError = function(error, deferred) {
        switch (error.status) {
          case 401:
            error = new Error("Dropbox token expired");
            break;
          case 404:
            error = new Error("Failed to find the specified file or folder");
            break;
          case 507:
            error = new Error("Dropbox quota exceeded");
            break;
          case 503:
            error = new Error("Dropbox: too many requests");
            break;
          case 400:
            error = new Error("Dropbox: bad input parameter");
            break;
          case 403:
            error = new Error("Dropbox: bad oauth request");
            break;
          case 405:
            error = new Error("Dropbox: unexpected request method");
            break;
          default:
            error = new Error("Dropbox: uknown error");
        }
        return deferred.reject(error);
      };

      DropBoxStorage.prototype.sync = function(method, model, options) {
        var id, _i, _len, _ref;
        switch (method) {
          case 'read':
            if (model.id != null) {
              console.log("bla", model.id);
              return this.find(model, options);
            } else {
              return this.findAll(model, options);
            }
            break;
          case 'create':
            if (!model.id) {
              model.set(model.id, model.idAttribute);
            }
            console.log("id" + model.get("id"));
            id = model.id;
            id = "" + id;
            this.writeFile(id, JSON.stringify(model));
            return model.toJSON();
          case 'update':
            id = model.id;
            id = "" + id;
            if (model.collection != null) {
              if (model.collection.path != null) {
                id = "" + model.collection.path + "/" + id;
              }
            }
            console.log("id: " + id);
            this.writeFile(id, JSON.stringify(model));
            _ref = this.destroy_cache;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              console.log("REALLY deleting model");
              console.log(model);
              id = model.id;
              if (model.collection != null) {
                if (model.collection.path != null) {
                  id = "" + model.collection.path + "/" + id;
                }
              } else if (model.memoPath) {
                id = "" + model.memoPath + "/" + id;
              }
              this.remove(id);
            }
            this.destroy_cache = [];
            return model.toJSON();
          case 'delete':
            id = model.id;
            if (model.collection != null) {
              if (model.collection.path != null) {
                id = "" + model.collection.path + "/" + id;
              }
            }
            return this.remove(id);
        }
      };

      DropBoxStorage.prototype.find = function(model, options) {
        var parse, path, promise;
        path = model.rootPath || model.path || "/";
        promise = this._findByName(path, model.id);
        parse = (function(_this) {
          return function(res) {
            var filePath;
            console.log("res");
            console.log(res[0]);
            filePath = res[0].path;
            return _this._readFile(filePath).then(function(res) {
              console.log("gne");
              console.log(res);
              model.set(JSON.parse(res));
              return console.log(model);
            });
          };
        })(this);
        return $.when(promise).then(parse);
      };

      DropBoxStorage.prototype.findAll = function(model, options) {
        var error, fetchData, p, promise, promises, rootPath, success;
        console.log("searching at " + model.path);
        rootPath = model.path;
        success = options.success;
        error = options.error;
        promises = [];
        promise = this._readDir(model.path);
        model.trigger('fetch', model, null, options);
        fetchData = (function(_this) {
          return function(entries) {
            var fileName, filePath, _i, _len;
            for (_i = 0, _len = entries.length; _i < _len; _i++) {
              fileName = entries[_i];
              filePath = "" + rootPath + "/" + fileName;
              if (_this.debug) {
                console.log("file path: " + filePath);
              }
              promises.push(_this._readFile(filePath));
            }
            return $.when.apply($, promises).done(function() {
              var entry, entryData, filename, i, preResults, results, _j, _ref;
              preResults = arguments;
              if (model.rawData != null) {
                results = [];
                for (i = _j = 0, _ref = entries.length; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
                  entry = entries[i];
                  if (_this.debug) {
                    console.log("retrieved entry " + entry);
                  }
                  entryData = entry.split('.');
                  filename = entry;
                  results.push({
                    name: filename,
                    content: preResults[i]
                  });
                }
              } else {
                results = $.map(results, JSON.parse);
              }
              if (options.update != null) {
                if (options.update === true) {
                  model.update(results);
                  model.trigger("update", results);
                } else {
                  model.reset(results, {
                    collection: model
                  });
                }
              } else {
                model.reset(results, {
                  collection: model
                });
              }
              if (success != null) {
                success(results);
              }
              return results;
            });
          };
        })(this);
        p = $.when(promise).then(fetchData);
        return p;
      };

      DropBoxStorage.prototype.remove = function(name) {
        var d;
        d = $.Deferred();
        this.client.remove(name, (function(_this) {
          return function(error, userInfo) {
            if (error) {
              _this.formatError(error, d);
            }
            console.log("removed " + name);
            return d.resolve();
          };
        })(this));
        return d.promise();
      };

      DropBoxStorage.prototype.writeFile = function(name, content) {
        var d;
        d = $.Deferred();
        this.client.writeFile(name, content, (function(_this) {
          return function(error, stat) {
            if (error) {
              _this.formatError(error, d);
            }
            if (_this.debug) {
              console.log("writen file " + name + " with content " + content);
              console.log("File saved as revision " + stat.versionTag);
            }
            return d.resolve();
          };
        })(this));
        return d.promise();
      };

      DropBoxStorage.prototype.createFolder = function(name) {
        return this.client.mkdir(name, (function(_this) {
          return function(error, stat) {
            if (error) {
              _this.formatError(error, d);
            }
            return console.log("folder create ok");
          };
        })(this));
      };

      DropBoxStorage.prototype.move = function(fromPath, toPath) {
        var d;
        d = $.Deferred();
        this.client.move(fromPath, toPath, (function(_this) {
          return function(error) {
            if (error) {
              _this.formatError(error, d);
            }
            return d.resolve();
          };
        })(this));
        return d.promise();
      };

      DropBoxStorage.prototype._readDir = function(path) {
        var d;
        d = $.Deferred();
        this.client.readdir(path, (function(_this) {
          return function(error, entries) {
            if (error) {
              _this.formatError(error, d);
            }
            return d.resolve(entries);
          };
        })(this));
        return d.promise();
      };

      DropBoxStorage.prototype._readFile = function(path, options) {
        var d;
        options = options || {};
        d = $.Deferred();
        this.client.readFile(path, options, (function(_this) {
          return function(error, data) {
            if (error) {
              _this.formatError(error, d);
            }
            return d.resolve(data);
          };
        })(this));
        return d.promise();
      };

      DropBoxStorage.prototype._findByName = function(path, name) {
        var d;
        console.log(path, name);
        d = $.Deferred();
        this.client.findByName(path, name, (function(_this) {
          return function(error, data) {
            if (error) {
              _this.formatError(error, d);
            }
            console.log("found data " + data);
            return d.resolve(data);
          };
        })(this));
        return d.promise();
      };

      return DropBoxStorage;

    })();
    return DropBoxStorage;
  });

}).call(this);
