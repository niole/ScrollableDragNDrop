'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bool = _react.PropTypes.bool,
    string = _react.PropTypes.string,
    object = _react.PropTypes.object,
    func = _react.PropTypes.func,
    number = _react.PropTypes.number;

var propTypes = {
    dragStyle: object.isRequired,
    onDrag: func.isRequired,
    onDragEnd: func.isRequired,
    noDragStyle: object.isRequired,
    index: number.isRequired,
    isDragging: bool.isRequired,
    showHandle: bool.isRequired,
    dragClass: string,
    noDragClass: string,
    handleClass: string,
    handleStyle: object
};

var defaultProps = {
    dragClass: "",
    noDragClass: "",
    handleClass: "",
    handleStyle: {}
};

var Draggable = function (_Component) {
    _inherits(Draggable, _Component);

    function Draggable() {
        _classCallCheck(this, Draggable);

        var _this = _possibleConstructorReturn(this, (Draggable.__proto__ || Object.getPrototypeOf(Draggable)).call(this));

        _this.dragId = _shortid2.default.generate();

        _this.onDrag = _this.onDrag.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        _this.onDragStart = _this.onDragStart.bind(_this);
        return _this;
    }

    _createClass(Draggable, [{
        key: 'onDragStart',
        value: function onDragStart(event) {
            var index = this.props.index;


            var image = document.createElement("img");
            image.className = "drag_img";
            image.id = this.dragId;

            document.body.appendChild(image);
            event.dataTransfer.setDragImage(image, 2, 2);
        }
    }, {
        key: 'onDrag',
        value: function onDrag(event) {
            var _props = this.props,
                onDrag = _props.onDrag,
                index = _props.index;

            onDrag(event.pageX, index);
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd() {
            var onDragEnd = this.props.onDragEnd;


            var image = document.getElementById(this.dragId);
            document.body.removeChild(image);

            onDragEnd();
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                dragStyle = _props2.dragStyle,
                noDragStyle = _props2.noDragStyle,
                noDragClass = _props2.noDragClass,
                handleClass = _props2.handleClass,
                handleStyle = _props2.handleStyle,
                children = _props2.children,
                isDragging = _props2.isDragging,
                showHandle = _props2.showHandle;

            var dragClass = isDragging ? " dragging" : "";

            return _react2.default.createElement(
                'div',
                {
                    onDragStart: this.onDragStart,
                    draggable: showHandle ? "false" : "true",
                    onDrag: showHandle ? function () {} : this.onDrag,
                    onDragEnd: showHandle ? function () {} : this.onDragEnd,
                    style: isDragging ? dragStyle : noDragStyle,
                    className: 'draggable' + dragClass },
                showHandle && _react2.default.createElement('div', {
                    style: handleStyle,
                    className: 'draggable handle',
                    draggable: 'true',
                    onDrag: this.onDrag,
                    onDragEnd: this.onDragEnd }),
                children
            );
        }
    }]);

    return Draggable;
}(_react.Component);

exports.default = Draggable;


Draggable.propTypes = propTypes;
Draggable.defaultProps = defaultProps;