(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, $ui, DialogRegion, boostrap, marionette;
    $ = require('jquery');
    $ui = require('jquery_ui');
    boostrap = require('bootstrap');
    marionette = require('marionette');
    DialogRegion = (function(_super) {
      __extends(DialogRegion, _super);

      DialogRegion.prototype.el = "#none";

      function DialogRegion(options) {
        this._bindNewPanel_old = __bind(this._bindNewPanel_old, this);
        this._setupBindings = __bind(this._setupBindings, this);
        this._dockDraggable = __bind(this._dockDraggable, this);
        this.showDialog = __bind(this.showDialog, this);
        this.onShow = __bind(this.onShow, this);
        var elName, _ref, _ref1, _ref2, _ref3, _ref4;
        options = options || {};
        this.width = (_ref = options.width) != null ? _ref : 640;
        this.height = (_ref1 = options.height) != null ? _ref1 : 480;
        this.title = (_ref2 = options.title) != null ? _ref2 : "Title";
        this.large = (_ref3 = options.large) != null ? _ref3 : false;
        elName = (_ref4 = options.elName) != null ? _ref4 : "dummyDiv";
        this.makeEl(elName);
        options.el = "#" + elName;
        DialogRegion.__super__.constructor.call(this, options);
        _.bindAll(this);
        this.docked = false;
      }

      DialogRegion.prototype.onShow = function(view) {
        this.showDialog(view);
        return this._setupDockZones();
      };

      DialogRegion.prototype.makeEl = function(elName) {
        if ($("#" + elName).length === 0) {
          return $('<div>', {
            id: elName
          }).appendTo('body');
        }
      };

      DialogRegion.prototype.getEl = function(selector) {
        var $el;
        $el = $(selector);
        $el.on("hidden", this.close);
        return $el;
      };

      DialogRegion.prototype.showDialog = function(view) {
        view.on("close", this.hideDialog, this);

        /*
         *workaround for twitter bootstrap multi modal bug
        oldFocus = @$el.modal.Constructor.prototype.enforceFocus
        @$el.modal.Constructor.prototype.enforceFocus = ()->{}
        
         *@$el.modal({'show':true,'backdrop':false})
        @$el.addClass('modal fade')
        @$el.removeClass('fade')#to increase drag responsiveness
        @$el.draggable({ snap: ".mainContent", snapMode: "outer",containment: ".mainContent" })
        @$el.resizable({minWidth:200, minHeight:200})#{handles : "se"})
        
        @$el.css("width",800)
        @$el.css("margin",0)
        
        
        @$el.css("z-index",200)
         *cleanup for workaround
        @$el.modal.Constructor.prototype.enforceFocus = oldFocus
        @$el.css("overflow-y": "hidden")
        
         *@$el.on 'resize' , (event,ui)=>
         *view.$el.trigger("resize")
        @$el.on 'resizestart' , (event,ui)=>
          view.$el.trigger("resize:start")
        @$el.on 'resizestop' , (event,ui)=>
          view.$el.trigger("resize:stop")
         */
        view.isVisible = true;

        /* 
        @$el.dialog
          title : @title#view.model.get("name")
          width: @width
          height: @height
          closeOnEscape: false
          position: 
            my: "left top"
            at: "left top+100"
            of: "#mainContent"
          beforeClose: =>
            view.isVisible=false
            view.close()
            
          resize:=>
            view.$el.trigger("resize")
           *open:(event, ui)=>
             *$(".ui-dialog-titlebar-close", ui.dialog or ui).hide()
        .parent().resizable({
          containment: "#mainContent"
        }).draggable({
          containment: "#mainContent", 
          opacity: 0.70 
        }); 
         *console.log @$el
        console.log @$el[0].parentElement
        @_bindNewPanel($(@$el[0].parentElement))
         */
        return this._setupBindings();
      };

      DialogRegion.prototype._setupDockZones = function() {
        var that;
        that = this;
        return $('.dockZone').droppable({
          tolerance: 'pointer',
          drop: function(event, ui) {
            return that._dockDraggable(this, ui.draggable);
          }
        });
      };

      DialogRegion.prototype._dockDraggable = function(dockzone, draggable) {
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
      };

      DialogRegion.prototype._setupBindings = function() {
        this.$el.draggable({
          containment: '#mainContent'
        });
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
              if (!_this._touchingBoundary(_this)) {
                return _this.unsnapAll(_this, $('.dockZone'));
              }
            } else if (_this.$el.hasClass('docked')) {
              return _this._undoc(_this, e, ui);
            }
          };
        })(this));
        this.$el.bind("dragstop", (function(_this) {
          return function(e) {
            return _this.$el.removeClass('draggingpanel');
          };
        })(this));
        return this.$el.bind("drag", (function(_this) {
          return function(e, ui) {
            return console.log("dragging");
          };
        })(this));
      };

      DialogRegion.prototype._bindNewPanel_old = function(p) {
        var that;
        that = this;
        $(p).bind("dragstart", function(e, ui) {
          if ($(this).hasClass('floatpanel')) {
            return $(this).addClass('draggingpanel');
          }
        });
        $(p).bind("drag", function(e, ui) {
          if ($(this).hasClass('floatpanel')) {
            if (!that._touchingBoundary(this)) {
              $('#_umsg').text('');
              return unsnapAll(this, $('.dockZone'));
            }
          } else if ($(this).hasClass('docked')) {
            return undoc(this, e, ui);
          }
        });
        $(p).bind("dragstop", function(e) {
          return $(this).removeClass('draggingpanel');
        });
        return console.log($(p));
      };

      DialogRegion.prototype._touchingBoundary = function(p) {
        var bTouching;
        bTouching = true;
        if (this._touchingNorth(p)) {
          $('#_umsg').text('Snapping North!');
          this._snapNorth(p, $('#_dockZoneNorth'));
        } else if (this._touchingWest(p)) {
          $('#_umsg').text('Snapping West!');
          this._snapWest(p, $('#_dockZoneWest'));
        } else if (touchingEast(p)) {
          $('#_umsg').text('Snapping East!');
          _snapEast(p, $('#_dockZoneEast'));
        } else if (touchingSouth(p)) {
          $('#_umsg').text('Snapping South!');
          _snapSouth(p, $('#_dockZoneSouth'));
        } else {
          bTouching = false;
        }
        return bTouching;
      };

      DialogRegion.prototype._touchingNorth = function(elem) {
        return elem.offsetTop <= 1;
      };

      DialogRegion.prototype._touchingWest = function(elem) {
        return elem.offsetLeft <= 1;
      };

      DialogRegion.prototype._touchingEast = function(elem) {
        var rm;
        rm = $(elem).parent().width() - (elem.offsetLeft + $(elem).outerWidth());
        return rm <= 1;
      };

      DialogRegion.prototype._touchingSouth = function(elem) {
        var bm;
        bm = $(elem).parent().height() - (elem.offsetTop + $(elem).outerHeight());
        return bm <= 1;
      };

      DialogRegion.prototype._snapNorth = function(elem, zone) {
        $(elem).addClass('dockableDraggable');
        return $(zone).addClass('dockZoneHighlight');
      };

      DialogRegion.prototype._snapWest = function(elem, zone) {
        $(elem).addClass('dockableDraggable');
        return $(zone).addClass('dockZoneHighlight');
      };

      DialogRegion.prototype._snapEast = function(elem, zone) {
        $(elem).addClass('dockableDraggable');
        return $(zone).addClass('dockZoneHighlight');
      };

      DialogRegion.prototype._snapSouth = function(elem, zone) {
        $(elem).addClass('dockableDraggable');
        return $(zone).addClass('dockZoneHighlight');
      };

      DialogRegion.prototype._unsnapAll = function(elem, zones) {
        $(elem).removeClass('dockableDraggable');
        return $(zones).removeClass('dockZoneHighlight');
      };

      DialogRegion.prototype._dockNorth = function(elem, draggable) {
        $(draggable).addClass('dockNorth');
        $(draggable).removeAttr('style');
        return $(".dockNorth").resizable({
          handles: 's'
        });
      };

      DialogRegion.prototype._dockEast = function(elem, draggable) {
        $(draggable).addClass('dockEast');
        $(draggable).removeAttr('style');
        return $(".dockEast").resizable({
          handles: 'w'
        });
      };

      DialogRegion.prototype._dockWest = function(elem, draggable) {
        $(draggable).addClass('dockWest');
        $(draggable).removeAttr('style');
        return $(".dockWest").resizable({
          handles: 'e'
        });
      };

      DialogRegion.prototype._dockSouth = function(elem, draggable) {
        $(draggable).addClass('dockSouth');
        $(draggable).removeAttr('style');
        return $(".dockSouth").resizable({
          handles: 'n'
        });
      };

      DialogRegion.prototype._undoc = function(p, e, ui) {
        $(p).removeClass('docked dockNorth dockEast dockWest dockSouth');
        $(p).addClass('floatpanel draggingpanel');
        $(p).css('height', 100);
        $(p).css('width', 100);
        $(p).resizable();
        ui.position.left = e.pageX;
        ui.position.top = e.pageY;
        ui.originalPosition.left = e.pageX;
        ui.originalPosition.top = e.pageY;
        ui.offset.top = 0;
        ui.offset.left = 0;
        $(p).css('top', e.pageY + 2);
        $(p).css('left', e.pageX + 2);
        return true;
      };

      DialogRegion.prototype.hideDialog = function() {
        this.$el.modal('hide');
        this.$el.remove();
        return this.trigger("closed");
      };

      return DialogRegion;

    })(Backbone.Marionette.Region);
    return DialogRegion;
  });

}).call(this);
