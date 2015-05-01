(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, $ui, DialogView, boostrap, dialogTemplate, marionette;
    $ = require('jquery');
    $ui = require('jquery_ui');
    boostrap = require('bootstrap');
    marionette = require('marionette');
    dialogTemplate = require("text!./dialog.tmpl");
    DialogView = (function(_super) {
      __extends(DialogView, _super);

      DialogView.prototype.template = dialogTemplate;

      DialogView.prototype.el = "#none";

      DialogView.prototype.className = "unselectable";

      DialogView.prototype.events = {
        "change .opacitySetter": "onOpacityChanged",
        "keyup .opacitySetter": "onOpacityChanged"
      };

      function DialogView(options) {
        this._undoc = __bind(this._undoc, this);
        this._dockWest = __bind(this._dockWest, this);
        this._setupBindings = __bind(this._setupBindings, this);
        this._setupDockZones = __bind(this._setupDockZones, this);
        this.render = __bind(this.render, this);
        this._setTransparency = __bind(this._setTransparency, this);
        this._setDragable = __bind(this._setDragable, this);
        this._setResizeable = __bind(this._setResizeable, this);
        var elName, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
        options = options || {};
        this.width = (_ref = options.width) != null ? _ref : 640;
        this.height = (_ref1 = options.height) != null ? _ref1 : 480;
        this.position = (_ref2 = options.position) != null ? _ref2 : [100, 100];
        this.resizeable = (_ref3 = options.resizeable) != null ? _ref3 : true;
        this.dockable = (_ref4 = options.dockable) != null ? _ref4 : false;
        this.title = (_ref5 = options.title) != null ? _ref5 : "Title";
        elName = (_ref6 = options.elName) != null ? _ref6 : "dummyDiv";
        this.makeEl(elName);
        options.el = "#" + elName;
        DialogView.__super__.constructor.call(this, options);
        _.bindAll(this);
        this.docked = false;
      }

      DialogView.prototype.makeEl = function(elName) {
        if ($("#" + elName).length === 0) {
          return $('<div>', {
            id: elName
          }).appendTo('#mainContent');
        }
      };

      DialogView.prototype.getEl = function(selector) {
        var $el;
        $el = $(selector);
        $el.on("hidden", this.close);
        return $el;
      };

      DialogView.prototype.serializeData = function() {
        return {
          "title": this.title
        };
      };

      DialogView.prototype._setResizeable = function() {
        if (this.resizeable) {
          this.$el.resizable({
            containment: "#mainContent",
            handles: "all",
            stop: (function(_this) {
              return function(event, ui) {
                _this.currentView.$el.trigger("resize", {
                  event: event,
                  ui: ui
                });
                return _this.$el.css("height", "auto");
              };
            })(this)
          });
          return this.$el.css("position", "absolute");
        }
      };

      DialogView.prototype._setDragable = function() {
        return this.$el.draggable({
          containment: '#mainContent',
          handle: '.dialog-header',
          scroll: false
        });
      };

      DialogView.prototype._setTransparency = function() {
        return $(".dialog").css("opacity", 0.9);
      };

      DialogView.prototype.onOpacityChanged = function(e) {
        var opacity;
        opacity = parseFloat(e.currentTarget.value) / 100;
        console.log(opacity);
        if (opacity >= 0.15 && opacity <= 1) {
          return this.$el.css("opacity", opacity);
        }
      };

      DialogView.prototype.render = function() {
        var data, html, realTemplate, template, triggerResize;
        this.isClosed = false;
        this.triggerMethod("before:render", this);
        this.triggerMethod("item:before:render", this);
        realTemplate = $(dialogTemplate).filter('#dialogTmpl');
        realTemplate = _.template($(dialogTemplate).filter('#dialogTmpl').html());
        data = this.serializeData();
        data = this.mixinTemplateHelpers(data);
        template = this.getTemplate();
        html = Marionette.Renderer.render(template, data);
        this.$el.html(html);
        this.bindUIElements();
        this.triggerMethod("render", this);
        this.triggerMethod("item:rendered", this);
        this.$el.addClass("dialog floatpanel unselectable");
        this.$el.css("width", this.width);
        this.$el.css("height", this.height);
        this.$el.css("left", this.position[0]);
        this.$el.css("top", this.position[1]);
        triggerResize = (function(_this) {
          return function() {
            _this.currentView.$el.trigger("resize");
            _this.$el.css("height", "auto");
            return $('#visual').trigger("resize");
          };
        })(this);
        setTimeout(triggerResize, 5);
        this._setDragable();
        this._setResizeable();
        this._setTransparency();
        this._setupBindings();
        this._setupDockZones();
        return this;
      };

      DialogView.prototype._setupDockZones = function() {
        var that;
        if (this.dockable) {
          that = this;
          return $('.dockZone').droppable({
            tolerance: 'touch',
            drop: function(event, ui) {
              return that._dockDraggable(this, ui.draggable);
            }
          });
        }
      };

      DialogView.prototype._dockDraggable = function(dockzone, draggable) {
        if (this.dockable) {
          console.log("docking attempt because I am dockable " + this.dockable);
          $(draggable).resizable('destroy');
          $(draggable).addClass('docked');
          if (dockzone.id.indexOf("North") !== -1) {
            this._dockNorth(dockzone, draggable);
          } else if (dockzone.id.indexOf("West") !== -1) {
            this._dockWest(dockzone, draggable);
          } else if (dockzone.id.indexOf("East") !== -1) {
            this._dockEast(dockzone, draggable);
          } else if (dockzone.id.indexOf("South") !== -1) {
            this._dockSouth(dockzone, draggable);
          }
          $(draggable).removeClass('floatpanel dockableDraggable');
          return $('.dockZoneHighlight').removeClass('dockZoneHighlight');
        }
      };

      DialogView.prototype._setupBindings = function() {
        var that;
        that = this;
        $('#contentContainer').on('show hide', function() {
          return $(this).css('height', 'auto');
        });
        this.$el.on('click.collapse-next.data-api', '[data-toggle=collapse-next]', function(e) {
          var $target;
          $target = $(this).parent().parent().next();
          if ($target.data('collapse') != null) {
            return $target.collapse('toggle');
          } else {
            return $target.collapse();
          }
        });
        $("ul.dropdown-menu").on("click", "[data-stopPropagation]", function(e) {
          return e.stopPropagation();
        });
        this.$el.on('click.data-dismiss.data-api', '[data-dismiss=dialog]', (function(_this) {
          return function(e) {
            var $target;
            that = _this;
            $target = $(_this).parent().parent().parent();
            $target.addClass("hide");
            return _this.hideDialog();
          };
        })(this));
        if (this.dockable) {
          this.$el.bind("dragstart", (function(_this) {
            return function(e, ui) {
              if (_this.$el.hasClass('floatpanel')) {
                return _this.$el.addClass('draggingpanel');
              }
            };
          })(this));
          this.$el.bind("drag", (function(_this) {
            return function(e, ui) {
              if (_this.$el.hasClass('floatpanel')) {
                if (!_this._touchingBoundary(_this.$el)) {
                  return _this._unsnapAll(_this.$el, $('.dockZone'));
                }
              } else if (_this.$el.hasClass('docked')) {
                return that._undoc(_this.$el, e, ui);
              }
            };
          })(this));
          return this.$el.bind("dragstop", (function(_this) {
            return function(e) {
              return _this.$el.removeClass('draggingpanel');
            };
          })(this));
        }
      };

      DialogView.prototype._touchingBoundary = function(p) {
        var bTouching;
        bTouching = true;
        if (this._touchingNorth(p)) {
          this._snapNorth(p, $('#_dockZoneNorth'));
        } else if (this._touchingWest(p)) {
          this._snapWest(p, $('#_dockZoneWest'));
        } else if (this._touchingEast(p)) {
          this._snapEast(p, $('#_dockZoneEast'));
        } else if (this._touchingSouth(p)) {
          this._snapSouth(p, $('#_dockZoneSouth'));
        } else {
          bTouching = false;
        }
        return bTouching;
      };

      DialogView.prototype._touchingNorth = function(elem) {
        return elem.offset().top <= 1;
      };

      DialogView.prototype._touchingWest = function(elem) {
        return elem.offset().left <= $("#_dockZoneWest").width();
      };

      DialogView.prototype._touchingEast = function(elem) {
        var rm;
        rm = elem.offset().left + $(elem).width() >= $("#_dockZoneEast").offset().left;
        return rm;
      };

      DialogView.prototype._touchingSouth = function(elem) {
        var bm;
        bm = $(elem).parent().height() - (elem.offset().top + $(elem).outerHeight());
        return bm <= 1;
      };

      DialogView.prototype._snapNorth = function(elem, zone) {
        $(elem).addClass('dockableDraggable');
        return $(zone).addClass('dockZoneHighlight');
      };

      DialogView.prototype._snapWest = function(elem, zone) {
        $(elem).addClass('dockableDraggable');
        return $(zone).addClass('dockZoneHighlight');
      };

      DialogView.prototype._snapEast = function(elem, zone) {
        $(elem).addClass('dockableDraggable');
        return $(zone).addClass('dockZoneHighlight');
      };

      DialogView.prototype._snapSouth = function(elem, zone) {
        $(elem).addClass('dockableDraggable');
        return $(zone).addClass('dockZoneHighlight');
      };

      DialogView.prototype._unsnapAll = function(elem, zones) {
        $(elem).removeClass('dockableDraggable');
        return $(zones).removeClass('dockZoneHighlight');
      };

      DialogView.prototype._dockNorth = function(elem, draggable) {
        $(draggable).addClass('dockNorth');
        $(draggable).removeAttr('style');
        return $(".dockNorth").resizable({
          handles: 's'
        });
      };

      DialogView.prototype._dockEast = function(elem, draggable) {
        var dockZone, triggerResize;
        console.log("docking east");
        dockZone = elem;
        this.docked = true;
        this.dock = elem;
        this.savedWidth = draggable.width();
        this.savedHeight = draggable.height();

        /*$(draggable).height($(dockZone).height()-30)
        $(draggable).css("right","0px")
        $(draggable).css("top",0)
         */
        $(draggable).addClass('dockEast');
        $('#_dockZoneEast').width(draggable.width());
        $(".dockEast").resizable({
          containment: "#mainContent",
          handles: "w",
          stop: (function(_this) {
            return function(event, ui) {
              _this.currentView.$el.trigger("resize");
              $('#_dockZoneEast').width($(".dockEast").width());
              return $('#visual').trigger("resize");
            };
          })(this)
        });
        $(".dockEast").css("position", "absolute");
        triggerResize = (function(_this) {
          return function() {
            _this.currentView.$el.trigger("resize");
            return $('#visual').trigger("resize");
          };
        })(this);
        return setTimeout(triggerResize, 5);
      };

      DialogView.prototype._dockWest = function(elem, draggable) {
        var dockZone, triggerResize;
        dockZone = elem;
        this.docked = true;
        this.dock = elem;
        this.savedWidth = draggable.width();
        this.savedHeight = draggable.height();
        $(draggable).addClass('dockWest');
        $('#_dockZoneWest').width(draggable.width());
        $(".dockWest").resizable({
          containment: "#mainContent",
          handles: "e",
          stop: (function(_this) {
            return function(event, ui) {
              _this.currentView.$el.trigger("resize");
              $('#_dockZoneWest').width(_this.$el.width());
              return $('#visual').trigger("resize");
            };
          })(this)
        });
        triggerResize = (function(_this) {
          return function() {
            _this.currentView.$el.trigger("resize");
            return $('#visual').trigger("resize");
          };
        })(this);
        return setTimeout(triggerResize, 5);
      };

      DialogView.prototype._dockSouth = function(elem, draggable) {
        var dockZone, triggerResize;
        dockZone = elem;
        this.docked = true;
        this.dock = elem;
        this.savedWidth = draggable.width();
        this.savedHeight = draggable.height();
        $(draggable).width($(dockZone).width());
        $(draggable).css("left", 0);
        $(draggable).addClass('dockSouth');
        $('#_dockZoneSouth').height(draggable.height());
        $(".dockSouth").resizable({
          containment: "#mainContent",
          handles: "n",
          stop: (function(_this) {
            return function(event, ui) {
              _this.currentView.$el.trigger("resize");
              $('#_dockZoneSouth').width($(".dockSouth").width());
              return $('#visual').trigger("resize");
            };
          })(this)
        });
        $(".dockSouth").css("position", "absolute");
        triggerResize = (function(_this) {
          return function() {
            return _this.currentView.$el.trigger("resize");
          };
        })(this);
        setTimeout(triggerResize, 5);
        return $('#visual').trigger("resize");
      };

      DialogView.prototype._undoc = function() {
        var error, triggerResize;
        console.log("undocking");
        console.log(this);
        if (this.dock != null) {
          console.log("setting dock width");
          $(this.dock).css('width', 10);
        }
        if (this.savedHeight != null) {
          this.$el.css("height", this.savedHeight);
        }
        if (this.savedWidth != null) {
          this.$el.css("width", this.savedWidth);
        }
        this.$el.removeClass('docked dockNorth dockEast dockWest dockSouth');
        this.$el.addClass('floatpanel draggingpanel');
        try {
          this.$el.resizable('destroy');
        } catch (_error) {
          error = _error;
        }
        this._setResizeable();
        this._setDragable();
        triggerResize = (function(_this) {
          return function() {
            $('#visual').trigger("resize");
            return _this.currentView.$el.trigger("resize");
          };
        })(this);
        setTimeout(triggerResize, 15);
        return true;
      };


      /* 
      _undoc:(p, e, ui)=>
        console.log "undocking"
        console.log @
        if @dock?
          console.log "setting dock width"
          $(@dock).css('width', 10)
          
        console.log "recalling saved dims: width/height", @savedWidth, @savedHeight
        if @savedHeight?
          $(p).css("height",@savedHeight)
        if @savedWidth?
          $(p).css("width",@savedWidth)
        
        $(p).removeClass('docked dockNorth dockEast dockWest dockSouth')
        $(p).addClass('floatpanel draggingpanel')
        
        $(p).resizable('destroy')#destroy previous , constrained resize
        @_setResizeable()
        @_setDragable()
        
        triggerResize= =>
           *resize the pannels etc (inner elements first)
          $('#visual').trigger("resize")
          @currentView.$el.trigger("resize")
          
        setTimeout triggerResize, 15
        return true
       */


      /* 
      hide: ->
        @$el.modal 'hide'
        @$el.remove()
        @trigger("closed")
       */

      DialogView.prototype.show = function(view) {
        var injectTarget;
        view.render();
        injectTarget = this.$el.find("#contentContainer");
        injectTarget.append(view.el);
        Marionette.triggerMethod.call(view, "show");
        Marionette.triggerMethod.call(this, "show", view);
        this.currentView = view;
        this._setTransparency();
        return this.showDialog();
      };

      DialogView.prototype.hide = function(view) {
        var injectTarget;
        if (this.currentView) {
          this.currentView.close();
          this.currentView = null;
        }
        injectTarget = this.$el.find("#contentContainer");
        return injectTarget.html("");
      };

      DialogView.prototype.close = function() {
        this._isShown = false;
        this.isClosed = true;
        this._undoc();
        if (this.currentView != null) {
          return this.hide(this.currentView);
        }
      };

      DialogView.prototype.hideDialog = function() {
        return this.$el.addClass('hide');
      };

      DialogView.prototype.showDialog = function() {
        return this.$el.removeClass('hide');
      };

      return DialogView;

    })(Backbone.Marionette.ItemView);
    return DialogView;
  });

}).call(this);
