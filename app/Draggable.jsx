import React, {PropTypes, Component} from 'react';

const { bool, string, object, func, number } = PropTypes;
const propTypes = {
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
    handleStyle: object,
};

const defaultProps = {
    dragClass: "",
    noDragClass: "",
    handleClass: "",
    handleStyle: {},
};

//TODO implement should update for Draggable

export default class Draggable extends Component {
    getNoHandlePageX(event) {
        const { dragStyle } = this.props;
        const {
            offsetX,
            pageX,
        } = event.nativeEvent;

        return pageX - offsetX + dragStyle.width/2;
    }

    render() {
        const {
            dragStyle,
            onDrag,
            onDragEnd,
            noDragStyle,
            noDragClass,
            handleClass,
            handleStyle,
            children,
            isDragging,
            index,
            showHandle,
        } = this.props;
        const dragClass = isDragging ? " dragging" : "";

        return (
            <div
                draggable={ showHandle ? "false" : "true" }
                onDrag={ showHandle ? () => {} : event => onDrag(this.getNoHandlePageX(event), index) }
                onDragEnd={ showHandle ? () => {} :  onDragEnd }
                style={ isDragging ? dragStyle : noDragStyle }
                className={ `draggable${dragClass}` }>
                { showHandle &&
                    <div
                        style={ handleStyle }
                        className="draggable handle"
                        draggable="true"
                        onDrag={ event => onDrag(event.pageX, index) }
                        onDragEnd={ onDragEnd }/> }
                { children }
            </div>
        );
    }
}

Draggable.propTypes = propTypes;
Draggable.defaultProps = defaultProps;
