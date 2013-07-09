jQuery ActiveList
============

A simple jQuery plugin that replicates Google's tab-to-listings functionality.

If you do a [Google](http://google.com) search, pres the `tab` key on your keyboard and notice how the first listing in the search results has a blue arrow next to it.  Hit the `up` key and the `down` key and you'll notice that the blue arrow moves up and down the listings accordingly.  If you hit the `enter` key with one of the search results highlighted with the blue arrow, you'll be redirected to that listing.

This plugin replicates this functionality.

# Installation

This plugin is a jQuery extension, thus it requires jQuery.  An example installation in your markup would be:

``` html
<script src="/jquery.js"></script>
<script src="/jquery.tabby.js"></script>
```

# Example usage

Markup
``` html
<html>
<head>
  <title>My Tabby Example</title>
</head>
<body>

  <input class="search">

  <ul class="tabby-list">
    <li><p>Result 1</p></li>
    <li><p>Result 2</p></li>
    <li><p>Result 3</p></li>
  </ul>

  <script src="/jquery.js"></script>
  <script src="/jquery.tabby.js"></script>
  <script type="text/javascript">
    $('input.search').tabby();
  </script>
</body>
</html>
```

A user will be able to hit `tab` from being focused in the input field and cycle through the results using the up and down arrows on their keyboard.  A class of `active` will be applied to the currently highlighted list item.  If the user hits the `enter` key, nothing will happen, as this is a callback that should be defined by the developer.

# API

The `tabby()` method accepts an argument of an `options` object.  The properties of the `options` object are as follows:

## keyToEnterList

The keyCode to move from the input to the list items.

Property: `keyToPress`  
Value type: integer  
Default: `9` (tab)

## listItems

A jQuery object of all elements to cycle through for the list.  This should be a selector that targets all elements to cycle through, not just the containing element.  Thus, if the list you want to cycle through is `<li>`s in a `<ul>`, the value for this property would be `$('ul li')`.

Property: `listItems`  
Value type: jQuery object  
Default: `$('.tabby-list').children()`

## highlightedClass

The class that is to be applied to the currently highlighted list item.

Property: `highlightedClass`  
Value type: string  
Default: `"tabby-highlighted"`

## onEnter

A callback function to be executed when a user hits the `enter` key on their keyboard while a list item is currently selected.  The function is passed the currently highlighted list item (wrapped in jQuery) as the only argument.

Property: `onEnter`  
Value type: `function(currentListItem){}`

## onHighlight

A callback function to be executed when a user highlights a list item.  The function is passed the currently highlighted list item (wrapped in jQuery) as the only argument.

Property: `onHighlight`  
Value type: `function(currentListItem){}`

# Footnotes

This plugin has been "passed" through both JSLint and JSHint.  Passed is in quotes as JSLint throws an error or two that are not issues I'm concerned about.
