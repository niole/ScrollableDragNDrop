# ScrollableDragNDrop
This is a versatile React.js based package for drag and drop inside of a scrollable container. This package ...

* makes user defined elements draggable
* allows the user to create draggable elements inside of an optionally scrollable container
* makes it so that dragged elements cannot be draggged outside of their container

#API and usage

This package makes the `ScrollableContainer` element available to the user. This is all you need to make your elements draggable.

## PropTypes

* `elements` - required, an array of renderable elements. These are the elements you wish to make draggable
* `containerStyle` - required, an object with a `left`, `width` and `height` property. Values must be numbers 
* `noDragStyle` - required, must have a `width` property with a number value
* `dragStyle` - required, must have a `width` property with a number value
* `handleStyle` - must have a `width` property with a number value
* `innerPanelStyle` - style object for placing the draggable elements inside of the scrollable container. By default, elements are at 0, 0 inside of `ScrollableContainer`
* `elementMargin` - the margin between draggable elements, defaults to 0
* `scrollableContainerShouldUpdate` - optional user provided function to be executed when the React.js `shouldComponentUpdate` lifecycle hook executes
* `showHandle` - flag indicating whether draggable elements should only be draggable by a handle, defaults to false
