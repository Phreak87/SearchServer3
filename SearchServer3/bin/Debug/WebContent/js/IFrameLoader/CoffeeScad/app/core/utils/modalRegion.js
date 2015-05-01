(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, ModalRegion, bootstrap, marionette;
    $ = require('jquery');
    bootstrap = require('bootstrap');
    marionette = require('marionette');
    ModalRegion = (function(_super) {
      __extends(ModalRegion, _super);

      ModalRegion.prototype.el = "#none";

      function ModalRegion(options) {
        this.showModal = __bind(this.showModal, this);
        this.onShow = __bind(this.onShow, this);
        var elName, _ref, _ref1;
        options = options || {};
        this.large = (_ref = options.large) != null ? _ref : false;
        elName = (_ref1 = options.elName) != null ? _ref1 : "dummyDiv";
        this.makeEl(elName);
        options.el = "#" + elName;
        ModalRegion.__super__.constructor.call(this, options);
        _.bindAll(this);
      }

      ModalRegion.prototype.onShow = function(view) {
        return this.showModal(view);
      };

      ModalRegion.prototype.makeEl = function(elName) {
        if ($("#" + elName).length === 0) {
          return $('<div/>', {
            id: elName
          }).appendTo('body');
        }
      };

      ModalRegion.prototype.getEl = function(selector) {
        var $el;
        $el = $(selector);
        $el.on("hidden", this.close);
        return $el;
      };

      ModalRegion.prototype.showModal = function(view) {
        var oldFocus;
        view.on("close", this.hideModal, this);
        oldFocus = this.$el.modal.Constructor.prototype.enforceFocus;
        this.$el.modal.Constructor.prototype.enforceFocus = function() {
          return {};
        };
        this.$el.addClass('fade modal');
        this.$el.modal({
          'show': true,
          'backdrop': true
        });
        if (this.large) {
          this.$el.addClass('modal-reallyBig');
        }
        return this.$el.modal.Constructor.prototype.enforceFocus = oldFocus;
      };

      ModalRegion.prototype.hideModal = function() {
        this.$el.modal('hide');
        this.$el.removeClass('fade');
        this.$el.remove();
        return this.trigger("closed");
      };

      return ModalRegion;

    })(Backbone.Marionette.Region);
    return ModalRegion;
  });

}).call(this);
