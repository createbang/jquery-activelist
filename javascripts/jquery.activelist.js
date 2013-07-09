/*
===================================================================

jQuery ActiveList

jquery-activelist
Version 1.0
By Michael Phillips (@createbang / createbang.com)
https://github.com/createbang/jquery-activelist

A jQuery plug-in that makes your lists come alive.

===================================================================
*/

(function ($, undefined) {

  //
  // jshint use strict

  "use strict";

  //
  // ActiveList constructor

  var ActiveList = function (element, options) {
    this.$element = $(element);
    this.options = options;
  }

  //
  // ActiveList Prototype methods

  ActiveList.prototype = {

    constructor: ActiveList,

    //
    // English-language mappings for common keyCodes

    keysMap: {
      space: "32",
      enter: "13",
      backspace: "8",
      shift: "16"
    },



    // ------------------------------------------
    // getcurrentListItem
    //
    // Get the currently selected listItem and update this.currentListItem.
    // ------------------------------------------

    getCurrentListItem: function() {
      var elem = this.$element.find("." + this.options.activeClass)

      this.currentListItem = (elem.length > 0) ? elem : undefined;

      return this.currentListItem;
    },

    // ------------------------------------------
    // goToListItem
    // Arguments:
    //   index: "next"|"prev"|int
    //
    // Apply the activeClass to a listItem in the list, either by "prev", "next", or by index.
    // ------------------------------------------

    goToListItem: function(index) {
      //
      // If we've passed in a string, either "next" or "prev"

      if (typeof index === "string" && this.currentListItem) {

        if (index === "next") { var targetListItem = this.currentListItem.next(); }
        if (index === "prev") { var targetListItem = this.currentListItem.prev(); }

      //
      // if we've passed in an index

      } else if (typeof index === "number") {

        var targetListItem = this.$element.children().eq(index);

      }

      //
      // bump out if a targetListItem isn't found (index doesn't exist or we're at the beginning or end of the list)

      if (targetListItem.length === 0) { return false; }

      //
      // If we have a currently selected item (we don't if we're initially entering the list),
      // remove it's activeClass

      if (this.currentListItem) {
        this.currentListItem.removeClass(this.options.activeClass);
      }

       //
      // Set the functions this.currentListItem value

      this.currentListItem = targetListItem;

      //
      // Add the activeClass to the targetListItem

      targetListItem.addClass(this.options.activeClass);

      //
      // If we have a onHighlight callback, execute it.

      this.options.onHighlight && this.options.onHighlight(targetListItem)

    },


    // ------------------------------------------
    // Method: convertStringKeys
    //
    // Coerce any string keys to numerical keys
    // ------------------------------------------

    convertStringKeys: function() {

      this.interactions = this.options.interactions;

      for (var key in this.interactions) {

        if (key in this.keysMap) {
          this.interactions[this.keysMap[key]] = this.interactions[key]
        }

      }

    },



    // ------------------------------------------
    // bindInteractions
    //
    // Listen for any interactions on the list or the list items.
    // ------------------------------------------

    bindInteractions: function() {
      this.convertStringKeys();

      $(document).bind("keydown.active-list", $.proxy(function (e) {
        var key = e.keyCode;

        if (key === 38) { // up arrow
          this.prev();
        } else if (key === 40) { // down arrow
          this.next();
        } else if (key === 27) { // escape
          this.exit();
        } else if (key === 16) {
          console.log("here");
          this.onShift();
        } else if (key in this.interactions) { // execute any custom key bindings
          e.preventDefault();
          this.interactions[key](this.currentListItem);
          return false;
        }

      }, this));


      $(document).bind("keyup.active-list", $.proxy(function (e) {
        var key = e.keyCode;

        if (key === 16) {
          this.offShift();
        }

      }, this));

    },

    // ------------------------------------------
    // enter
    //
    // Enter into the list
    // ------------------------------------------

    enter: function() {

      //
      // exit all currently active lists

      $("[data-active-list=true]").each(function (index, list){
        console.log("here");
        $(list).data("active-list").exit()
      });

      this.$element.attr("data-active-list", true);

      //
      // start listening for the up arrow, down arrow, and enter keys

      this.bindInteractions();

      //
      // Enter the list, selecting the first item at index 0

      this.goToListItem(0);

    },

    // ------------------------------------------
    // exit
    //
    // Exit the list
    // ------------------------------------------

    exit: function() {

      //
      // Unbind all keyboard events from the document

      $(document).unbind("keydown.active-list");

      //
      // Execute the onExit callback, if it exists

      this.options.onExit && this.options.onExit(this.currentListItem);

      //
      // Unselect the current list item

      this.currentListItem.removeClass(this.options.activeClass) && delete this.currentListItem;

      //
      // remove the data-active-list attribute from the current list

      this.$element.removeAttr("data-active-list");
    },

    // ------------------------------------------
    // next
    //
    // Navigate to the next item in the list
    // ------------------------------------------

    next: function() {

      this.goToListItem("next");

    },

    // ------------------------------------------
    // prev
    //
    // Navigate to the previous item in the list
    // ------------------------------------------

    prev: function() {

      this.goToListItem("prev");

    },

    // ------------------------------------------
    // goto
    //
    // Navigate to a specific item in the list, specified by index
    // ------------------------------------------

    goto: function(index) {

      this.goToListItem(index);

    },

    // ------------------------------------------
    // onShift
    //
    // When shift is being held
    // ------------------------------------------

    onShift: function(index) {

      //
      // apply the active-list-shift class to the list

      this.$element.addClass("active-list-shift");

      //
      // set the shift boolean to true

      this.shift = true;

    },

    // ------------------------------------------
    // offShift
    //
    // When shift is being held
    // ------------------------------------------

    offShift: function(index) {

      //
      // remove the active-list-shift class to the list

      this.$element.removeClass("active-list-shift");

      //
      // set the shift boolean to false

      this.shift = false;

    },


  }








  var old = $.fn.activeList;

  $.fn.activeList = function (option) {
    var args = arguments;

    return this.each(function () {
      var $this = $(this),
          data = $this.data('active-list'),
          options = $.extend({}, $.fn.activeList.defaults, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('active-list', (data = new ActiveList(this, options)))
      if (typeof option == 'string') data[option](args[1])
    })

  };

  $.fn.activeList.defaults = {
    activeClass: "active-list-active",
    prevKey: 38,
    nextKey: 40,
    escapeKey: 27
  }

  $.fn.activeList.Constructor = ActiveList

  $.fn.activeList.noConflict = function () {
    $.fn.activeList = old
    return this
  }







}(window.jQuery));