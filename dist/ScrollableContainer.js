'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Draggable = require('./Draggable.js');

var _Draggable2 = _interopRequireDefault(_Draggable);

var _dragUtil = require('./dragUtil.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_HANDLE_WIDTH = 10;
var SCROLL_MARGIN = 100;
var SCROLL_LEFT = "left";
var SCROLL_RIGHT = "right";
var DONT_SCROLL = "";
var SCROLL_RATE = 60 / 1000; //60 frames per second
var DEFAULT_SCROLL_DIST = 10; //10px per scroll


var bool = _react.PropTypes.bool,
    func = _react.PropTypes.func,
    shape = _react.PropTypes.shape,
    string = _react.PropTypes.string,
    number = _react.PropTypes.number,
    node = _react.PropTypes.node,
    arrayOf = _react.PropTypes.arrayOf,
    object = _react.PropTypes.object,
    array = _react.PropTypes.array;

var propTypes = {
    elements: arrayOf(node).isRequired,
    containerStyle: shape({
        left: number.isRequired,
        width: number.isRequired,
        height: number.isRequired
    }).isRequired,
    noDragStyle: shape({ width: number.isRequired }).isRequired,
    dragStyle: shape({ width: number.isRequired }).isRequired,
    handleStyle: shape({ width: number }),
    innerPanelStyle: object,
    dragClass: string,
    noDragClass: string,
    containerClass: string,
    handleClass: string,
    elementMargin: number,
    scrollableContainerShouldUpdate: func,
    draggableShouldUpdate: func,
    showHandle: bool
};

var defaultProps = {
    handleStyle: { width: DEFAULT_HANDLE_WIDTH },
    noDragStyle: {
        width: 100
    },
    containerStyle: {
        left: 0,
        width: 500
    },
    innerPanelStyle: {},
    dragClass: "",
    noDragClass: "",
    containerClass: "",
    handleClass: "",
    elementMargin: 0,
    scrollableContainerShouldUpdate: function scrollableContainerShouldUpdate() {
        return false;
    },
    draggableShouldUpdate: function draggableShouldUpdate() {
        return false;
    },
    showHandle: true
};

var ScrollableContainer = function (_Component) {
    _inherits(ScrollableContainer, _Component);

    function ScrollableContainer(props) {
        _classCallCheck(this, ScrollableContainer);

        var _this = _possibleConstructorReturn(this, (ScrollableContainer.__proto__ || Object.getPrototypeOf(ScrollableContainer)).call(this, props));

        var elementMargin = props.elementMargin,
            noDragStyle = props.noDragStyle,
            elements = props.elements;


        _this.state = {
            elements: props.elements,
            draggedIndex: -1,
            dragLeft: -1,
            scrollLeft: 0
        };

        _this.maxLeftValue = (0, _dragUtil.getElementLeftFromIndex)(elements.length - 1, elementMargin, noDragStyle);
        _this.innerPanel = null;
        //set width inner panel
        _this.widthInnerPanel = _this.getWidthInnerPanel();
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        _this.onDrag = _this.onDrag.bind(_this);
        return _this;
    }

    _createClass(ScrollableContainer, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(newProps, newState) {
            var scrollableContainerShouldUpdate = newProps.scrollableContainerShouldUpdate;


            return newProps.elements.length !== this.props.elements.length || newState.draggedIndex !== this.state.draggedIndex || newState.dragLeft !== this.state.dragLeft || newState.scrollLeft !== this.state.scrollLeft || scrollableContainerShouldUpdate.apply(this, arguments);
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(props) {
            var elementMargin = props.elementMargin,
                noDragStyle = props.noDragStyle,
                elements = props.elements;


            this.maxLeftValue = (0, _dragUtil.getElementLeftFromIndex)(elements.length - 1, elementMargin, noDragStyle);
            this.widthInnerPanel = this.getWidthInnerPanel();
        }

        /**
         * Width of inner scrollable panel is the width of all
         * elements plus the margins between them and on the ends
         * @method
         * @name getWidthInnerPanel
         * @return {Number} width of inner scrollable panel
         */

    }, {
        key: 'getWidthInnerPanel',
        value: function getWidthInnerPanel() {
            var _props = this.props,
                elements = _props.elements,
                elementMargin = _props.elementMargin,
                noDragStyle = _props.noDragStyle;
            var width = noDragStyle.width;


            return (width + elementMargin) * elements.length + elementMargin;
        }

        /**
         * Translates a left value that is relative to the window
         * to a left value that is relative to the inner scrollable panel
         * of ScrollableContainer
         * @method
         * @name windowToInnerPanelLeft
         * @param {Number} windowLeft
         * @return {Number} left style value relative to inner panel
         */

    }, {
        key: 'windowToInnerPanelLeft',
        value: function windowToInnerPanelLeft(windowLeft) {
            var scrollLeft = this.state.scrollLeft;
            var _props2 = this.props,
                containerStyle = _props2.containerStyle,
                noDragStyle = _props2.noDragStyle;

            var containerLeft = containerStyle.left;

            return windowLeft - containerLeft + scrollLeft - noDragStyle.width / 2;
        }
    }, {
        key: 'onDrag',
        value: function onDrag(pageX, index) {
            var _props3 = this.props,
                handleStyle = _props3.handleStyle,
                noDragStyle = _props3.noDragStyle,
                showHandle = _props3.showHandle,
                elements = _props3.elements,
                elementMargin = _props3.elementMargin;
            var _state = this.state,
                scrollLeft = _state.scrollLeft,
                dragLeft = _state.dragLeft;


            if (dragLeft === -1) {
                var initialLeft = this.windowToInnerPanelLeft(pageX);
                if (!showHandle) {
                    //if the user has chosen handless drag, must normalize the initial dragLeft
                    initialLeft = (0, _dragUtil.getElementLeftFromIndex)((0, _dragUtil.getElementIndexFromLeft)(initialLeft, elementMargin, noDragStyle, elements, this.maxLeftValue), elementMargin, noDragStyle);
                }

                //transfer scrollleft into left value for inner panel
                //set actual scrollLeft to 0
                var oldScrollLeft = this.innerPanel.scrollLeft;
                this.innerPanel.scrollLeft = 0;

                this.setState({
                    draggedIndex: index,
                    dragLeft: initialLeft,
                    scrollLeft: oldScrollLeft
                });
            } else {
                var scrollDirection = this.getScrollDir(pageX);
                if (scrollDirection) {
                    //programmatically scroll
                    this.programmaticallyScroll(scrollDirection);
                } else {
                    //update left value on dragged element
                    this.setState({
                        draggedIndex: index,
                        dragLeft: this.windowToInnerPanelLeft(pageX)
                    });
                }
            }
        }

        /**
         * Rearranges draggable elements when drag end event fired
         * @method
         * @name onDragEnd
         */

    }, {
        key: 'onDragEnd',
        value: function onDragEnd() {
            var _this2 = this;

            var _props4 = this.props,
                handleStyle = _props4.handleStyle,
                noDragStyle = _props4.noDragStyle,
                elementMargin = _props4.elementMargin,
                elements = _props4.elements;
            var _state2 = this.state,
                draggedIndex = _state2.draggedIndex,
                dragLeft = _state2.dragLeft,
                scrollLeft = _state2.scrollLeft;


            var newIndex = (0, _dragUtil.getElementIndexFromLeft)(dragLeft, elementMargin, noDragStyle, elements, this.maxLeftValue);

            var rearrangedElements = this.rearrangeElements(draggedIndex, newIndex);

            this.setState({
                draggedIndex: -1,
                dragLeft: -1,
                elements: rearrangedElements
            }, function () {
                //transfer scrollLeft back into scrollable panel's scrollLeft
                _this2.innerPanel.scrollLeft = scrollLeft;
            });
        }
    }, {
        key: 'rearrangeElements',
        value: function rearrangeElements(oldIndex, newIndex) {
            var elements = this.state.elements;


            var rearrangedElements = elements;
            var target = [elements[oldIndex]];

            if (oldIndex < newIndex) {
                rearrangedElements = rearrangedElements.slice(0, oldIndex).concat(rearrangedElements.slice(oldIndex + 1, newIndex + 1), target, rearrangedElements.slice(newIndex + 1));
            }

            if (oldIndex > newIndex) {
                rearrangedElements = rearrangedElements.slice(0, newIndex).concat(target, rearrangedElements.slice(newIndex, oldIndex), rearrangedElements.slice(oldIndex + 1));
            }

            return rearrangedElements;
        }

        /**
         * @method
         * @name getScrollDir
         * @param {Number} nextX pageX value from drag event
         * @return {String} the direction of scroll or empty string
         */

    }, {
        key: 'getScrollDir',
        value: function getScrollDir(nextX) {
            var containerStyle = this.props.containerStyle;
            var left = containerStyle.left,
                width = containerStyle.width;


            if (nextX >= left && nextX <= left + SCROLL_MARGIN) {
                return SCROLL_LEFT;
            }

            if (nextX >= left + width - SCROLL_MARGIN && nextX <= left + width) {
                return SCROLL_RIGHT;
            }

            return DONT_SCROLL;
        }
    }, {
        key: 'capScrollLeft',
        value: function capScrollLeft(nextScrollLeft) {
            //need content width
            var containerStyle = this.props.containerStyle;
            var width = containerStyle.width;


            if (nextScrollLeft > this.widthInnerPanel - width) {
                return this.widthInnerPanel - width;
            }

            if (nextScrollLeft < 0) {
                return 0;
            }

            return nextScrollLeft;
        }
    }, {
        key: 'capDraggedLeft',
        value: function capDraggedLeft(nextLeft, scrollLeft, widthContainer, elementMargin) {
            var noDragStyle = this.props.noDragStyle;
            var width = noDragStyle.width;

            var maxLeft = scrollLeft + widthContainer - elementMargin - width;

            if (nextLeft > maxLeft) {
                return maxLeft;
            }

            var minLeft = elementMargin;
            if (nextLeft < minLeft) {
                return minLeft;
            }

            return nextLeft;
        }

        /**
         * Programmatically scrolls inner panel when user drags too close
         * to edges of container
         * @method
         * @name programmaticallyScroll
         * @param {String} scrollDirection
         */

    }, {
        key: 'programmaticallyScroll',
        value: function programmaticallyScroll(scrollDirection) {
            var _this3 = this;

            var _props5 = this.props,
                containerStyle = _props5.containerStyle,
                elementMargin = _props5.elementMargin;
            var width = containerStyle.width;
            var _state3 = this.state,
                scrollLeft = _state3.scrollLeft,
                dragLeft = _state3.dragLeft;


            setTimeout(function () {
                var nextScrollLeft = scrollLeft;
                var nextLeft = dragLeft;

                if (scrollDirection === SCROLL_RIGHT) {
                    nextScrollLeft = _this3.capScrollLeft(scrollLeft + DEFAULT_SCROLL_DIST);
                    nextLeft = _this3.capDraggedLeft(dragLeft + DEFAULT_SCROLL_DIST, scrollLeft, width, elementMargin);
                } else if (scrollDirection === SCROLL_LEFT) {
                    nextScrollLeft = _this3.capScrollLeft(scrollLeft - DEFAULT_SCROLL_DIST);
                    nextLeft = _this3.capDraggedLeft(dragLeft - DEFAULT_SCROLL_DIST, scrollLeft, width, elementMargin);
                }

                _this3.setState({
                    dragLeft: nextLeft,
                    scrollLeft: nextScrollLeft
                });
            }, SCROLL_RATE);
        }
    }, {
        key: 'getNoDragStyle',
        value: function getNoDragStyle(elementMargin, noDragStyle, index) {
            return Object.assign({}, noDragStyle, { left: (0, _dragUtil.getElementLeftFromIndex)(index, elementMargin, noDragStyle) });
        }
    }, {
        key: 'getDragStyle',
        value: function getDragStyle(dragStyle, dragLeft, dragIndex, index) {
            if (index === dragIndex) {
                return Object.assign({}, dragStyle, { left: dragLeft });
            }
            return dragStyle;
        }
    }, {
        key: 'getInnerPanelStyle',
        value: function getInnerPanelStyle(innerPanelStyle, scrollLeft, draggedIndex) {
            if (draggedIndex > -1) {
                return Object.assign({}, innerPanelStyle, { left: -1 * scrollLeft });
            }
            return innerPanelStyle;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var _props6 = this.props,
                containerStyle = _props6.containerStyle,
                noDragStyle = _props6.noDragStyle,
                dragStyle = _props6.dragStyle,
                dragClass = _props6.dragClass,
                noDragClass = _props6.noDragClass,
                containerClass = _props6.containerClass,
                handleStyle = _props6.handleStyle,
                handleClass = _props6.handleClass,
                elementMargin = _props6.elementMargin,
                innerPanelStyle = _props6.innerPanelStyle,
                showHandle = _props6.showHandle;
            var _state4 = this.state,
                elements = _state4.elements,
                draggedIndex = _state4.draggedIndex,
                dragLeft = _state4.dragLeft,
                scrollLeft = _state4.scrollLeft;

            var scrollingClass = draggedIndex > -1 ? " scrolling" : "";

            return _react2.default.createElement(
                'div',
                {
                    ref: function ref(_ref) {
                        return _this4.innerPanel = _ref;
                    },
                    className: 'scrollable-container' + scrollingClass,
                    style: containerStyle },
                _react2.default.createElement(
                    'div',
                    {
                        style: this.getInnerPanelStyle(innerPanelStyle, scrollLeft, draggedIndex),
                        className: 'scrollable-panel' },
                    elements.map(function (element, index) {
                        return _react2.default.createElement(
                            _Draggable2.default,
                            {
                                showHandle: showHandle,
                                key: 'draggable-' + index,
                                dragStyle: _this4.getDragStyle(dragStyle, dragLeft, draggedIndex, index),
                                onDrag: _this4.onDrag,
                                onDragEnd: _this4.onDragEnd,
                                noDragStyle: _this4.getNoDragStyle(elementMargin, noDragStyle, index),
                                index: index,
                                isDragging: draggedIndex === index,
                                dragClass: dragClass,
                                noDragClass: noDragClass,
                                handleClass: handleClass,
                                handleStyle: handleStyle
                            },
                            element
                        );
                    })
                )
            );
        }
    }]);

    return ScrollableContainer;
}(_react.Component);

exports.default = ScrollableContainer;


ScrollableContainer.defaultProps = defaultProps;
ScrollableContainer.propTypes = propTypes;