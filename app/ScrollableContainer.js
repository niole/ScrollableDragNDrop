import React, {PropTypes, Component} from 'react';
import Draggable from './Draggable.js';
import {
    getElementLeftFromIndex,
    getElementIndexFromLeft,
} from './dragUtil.js';

const DEFAULT_HANDLE_WIDTH = 10;
const SCROLL_MARGIN = 100;
const SCROLL_LEFT = "left";
const SCROLL_RIGHT = "right";
const DONT_SCROLL = "";
const SCROLL_RATE = 60/1000; //60 frames per second
const DEFAULT_SCROLL_DIST = 10; //10px per scroll


const { bool, func, shape, string, number, node, arrayOf, object, array } = PropTypes;
const propTypes = {
    elements: arrayOf(node).isRequired,
    containerStyle: shape({
        left: number.isRequired,
        width: number.isRequired,
        height: number.isRequired,
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
    showHandle: bool,
};

const defaultProps = {
    handleStyle: { width: DEFAULT_HANDLE_WIDTH },
    noDragStyle: {
        width: 100,
    },
    containerStyle: {
        left: 0,
        width: 500,
    },
    innerPanelStyle: {},
    dragClass: "",
    noDragClass: "",
    containerClass: "",
    handleClass: "",
    elementMargin: 0,
    scrollableContainerShouldUpdate: () => false,
    draggableShouldUpdate: () => false,
    showHandle: true,
};


export default class ScrollableContainer extends Component {
    constructor(props) {
        super(props);

        const {
            elementMargin,
            noDragStyle,
            elements,
        } = props;

        this.state = {
            elements: props.elements,
            draggedIndex: -1,
            dragLeft: -1,
            scrollLeft: 0,
        };

        this.maxLeftValue = getElementLeftFromIndex(elements.length-1, elementMargin, noDragStyle)
        this.innerPanel = null;
        //set width inner panel
        this.widthInnerPanel = this.getWidthInnerPanel();
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDrag = this.onDrag.bind(this);
    }

    shouldComponentUpdate(newProps, newState) {
        const { scrollableContainerShouldUpdate } = newProps;

        return newProps.elements.length !== this.props.elements.length ||
            newState.draggedIndex !== this.state.draggedIndex ||
            newState.dragLeft !== this.state.dragLeft ||
            newState.scrollLeft !== this.state.scrollLeft ||
            scrollableContainerShouldUpdate.apply(this, arguments);
    }

    componentWillUpdate(props) {
        const {
            elementMargin,
            noDragStyle,
            elements,
        } = props;

        this.maxLeftValue = getElementLeftFromIndex(elements.length-1, elementMargin, noDragStyle)
        this.widthInnerPanel = this.getWidthInnerPanel();
    }

    /**
     * Width of inner scrollable panel is the width of all
     * elements plus the margins between them and on the ends
     * @method
     * @name getWidthInnerPanel
     * @return {Number} width of inner scrollable panel
     */
    getWidthInnerPanel() {
        const {
            elements,
            elementMargin,
            noDragStyle,
        } = this.props;
        const { width } = noDragStyle;

        return (width+elementMargin)*elements.length+elementMargin;
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
    windowToInnerPanelLeft(windowLeft) {
        const { scrollLeft } = this.state;
        const { containerStyle, noDragStyle } = this.props;
        const containerLeft = containerStyle.left;

        return windowLeft - containerLeft + scrollLeft - noDragStyle.width/2;
    }

    onDrag(pageX, index) {
        const {
            handleStyle,
            noDragStyle,
            showHandle,
            elements,
            elementMargin,
        } = this.props;
        const {
            scrollLeft,
            dragLeft,
        } = this.state;


        if (dragLeft === -1) {
            let initialLeft = this.windowToInnerPanelLeft(pageX);
            if (!showHandle) {
                //if the user has chosen handless drag, must normalize the initial dragLeft
                initialLeft =
                    getElementLeftFromIndex(
                        getElementIndexFromLeft(initialLeft, elementMargin, noDragStyle, elements, this.maxLeftValue),
                        elementMargin,
                        noDragStyle
                    );
            }

            //transfer scrollleft into left value for inner panel
            //set actual scrollLeft to 0
            const oldScrollLeft = this.innerPanel.scrollLeft;
            this.innerPanel.scrollLeft = 0;

            this.setState({
                draggedIndex: index,
                dragLeft: initialLeft,
                scrollLeft: oldScrollLeft,
            });
        } else {
          const scrollDirection = this.getScrollDir(pageX);
            if (scrollDirection) {
                //programmatically scroll
                this.programmaticallyScroll(scrollDirection);
            } else {
                //update left value on dragged element
                this.setState({
                    draggedIndex: index,
                    dragLeft: this.windowToInnerPanelLeft(pageX),
                });
            }
        }
    }

    /**
     * Rearranges draggable elements when drag end event fired
     * @method
     * @name onDragEnd
     */
    onDragEnd() {
        const {
            handleStyle,
            noDragStyle,
            elementMargin,
            elements,
        } = this.props;
        const {
            draggedIndex,
            dragLeft, //grab safe left value as drag end events differ between browsers
            scrollLeft,
        } = this.state;


        const newIndex = getElementIndexFromLeft(dragLeft, elementMargin, noDragStyle, elements, this.maxLeftValue);

        const rearrangedElements = this.rearrangeElements(draggedIndex, newIndex);

        this.setState({
            draggedIndex: -1,
            dragLeft: -1,
            elements: rearrangedElements,
        }, () => {
            //transfer scrollLeft back into scrollable panel's scrollLeft
            this.innerPanel.scrollLeft = scrollLeft;
        });
    }

    rearrangeElements(oldIndex, newIndex) {
        const {
            elements,
        } = this.state;

        let rearrangedElements = elements;
        let target = [elements[oldIndex]];

       if (oldIndex < newIndex) {
            rearrangedElements = rearrangedElements.slice(0, oldIndex)
                    .concat(
                        rearrangedElements.slice(oldIndex+1, newIndex+1),
                        target,
                        rearrangedElements.slice(newIndex+1)
                    );
        }

        if (oldIndex > newIndex) {
            rearrangedElements = rearrangedElements.slice(0, newIndex)
                    .concat(
                        target,
                        rearrangedElements.slice(newIndex, oldIndex),
                        rearrangedElements.slice(oldIndex+1)
                    );
        }


        return rearrangedElements;
    }

    /**
     * @method
     * @name getScrollDir
     * @param {Number} nextX pageX value from drag event
     * @return {String} the direction of scroll or empty string
     */
    getScrollDir(nextX) {
        const { containerStyle } = this.props;
        const {
            left,
            width,
        } = containerStyle;

        if (nextX >= left && nextX <= left + SCROLL_MARGIN) {
            return SCROLL_LEFT;
        }

        if (nextX >= left + width - SCROLL_MARGIN && nextX <= left + width) {
            return SCROLL_RIGHT;
        }

        return DONT_SCROLL;
    }

    capScrollLeft(nextScrollLeft) {
        //need content width
        const { containerStyle } = this.props;
        const {
            width,
        } = containerStyle;

        if (nextScrollLeft > this.widthInnerPanel - width) {
            return this.widthInnerPanel - width;
        }

        if (nextScrollLeft < 0) {
            return 0;
        }

        return nextScrollLeft;
    }

    capDraggedLeft(nextLeft, scrollLeft, widthContainer, elementMargin) {
        const { noDragStyle } = this.props;
        const { width } = noDragStyle;
        const maxLeft = scrollLeft + widthContainer - elementMargin - width;

        if (nextLeft > maxLeft) {
            return maxLeft;
        }

        const minLeft = elementMargin;
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
    programmaticallyScroll(scrollDirection) {
        const {
            containerStyle,
            elementMargin,
        } = this.props;
        const {
            width,
        } = containerStyle;
        const {
            scrollLeft,
            dragLeft,
        } = this.state;

        setTimeout(() => {
            let nextScrollLeft = scrollLeft;
            let nextLeft = dragLeft;

            if (scrollDirection === SCROLL_RIGHT) {
                nextScrollLeft = this.capScrollLeft(scrollLeft + DEFAULT_SCROLL_DIST);
                nextLeft = this.capDraggedLeft(dragLeft + DEFAULT_SCROLL_DIST, scrollLeft, width, elementMargin);
            } else if (scrollDirection === SCROLL_LEFT) {
                nextScrollLeft = this.capScrollLeft(scrollLeft - DEFAULT_SCROLL_DIST);
                nextLeft = this.capDraggedLeft(dragLeft - DEFAULT_SCROLL_DIST, scrollLeft, width, elementMargin);
            }

            this.setState({
                dragLeft: nextLeft,
                scrollLeft: nextScrollLeft,
            });

        }, SCROLL_RATE);
    }

    getNoDragStyle(elementMargin, noDragStyle, index) {
        return Object.assign({}, noDragStyle, { left: getElementLeftFromIndex(index, elementMargin, noDragStyle) });
    }

    getDragStyle(dragStyle, dragLeft, dragIndex, index) {
        if (index === dragIndex) {
            return Object.assign({}, dragStyle, { left: dragLeft });
        }
        return dragStyle;
    }

    getInnerPanelStyle(innerPanelStyle, scrollLeft, draggedIndex) {
        if (draggedIndex > -1) {
            return Object.assign({}, innerPanelStyle, { left: -1*scrollLeft });
        }
        return innerPanelStyle;
    }

    render() {
        const {
            containerStyle,
            noDragStyle,
            dragStyle,
            dragClass,
            noDragClass,
            containerClass,
            handleStyle,
            handleClass,
            elementMargin,
            innerPanelStyle,
            showHandle,
        } = this.props;
        const {
            elements,
            draggedIndex,
            dragLeft,
            scrollLeft,
        } = this.state;
        const scrollingClass = draggedIndex > -1 ? " scrolling" : "";

        return (
            <div
                ref={ ref => this.innerPanel = ref }
                className={ `scrollable-container${scrollingClass}` }
                style={ containerStyle }>
                <div
                    style={ this.getInnerPanelStyle(innerPanelStyle, scrollLeft, draggedIndex) }
                    className="scrollable-panel">
                    { elements.map((element, index) => (
                        <Draggable
                                showHandle={ showHandle }
                                key={ `draggable-${index}` }
                                dragStyle={ this.getDragStyle(dragStyle, dragLeft, draggedIndex, index) }
                                onDrag={ this.onDrag }
                                onDragEnd={ this.onDragEnd }
                                noDragStyle={ this.getNoDragStyle(elementMargin, noDragStyle, index) }
                                index={ index }
                                isDragging={ draggedIndex === index }
                                dragClass={ dragClass }
                                noDragClass={ noDragClass }
                                handleClass={ handleClass }
                                handleStyle={ handleStyle }
                            >
                                { element }
                            </Draggable>
                        )
                    ) }
                </div>
            </div>
        );
    }
}

ScrollableContainer.defaultProps = defaultProps;
ScrollableContainer.propTypes = propTypes;
