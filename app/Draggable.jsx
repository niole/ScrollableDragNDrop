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


export default class Draggable extends Component {
    constructor() {
        super();
        this.onDrag = this.onDrag.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
    }

    onDragStart(event) {
        const image = document.createElement("img");
        event.dataTransfer.setDragImage(image, 0, 0);
    }

    onDrag(event) {
        const {
            onDrag,
            index,
        } = this.props;
        onDrag(event.pageX, index);
    }

    onDragEnd() {
        const {
            onDragEnd,
        } = this.props;
        onDragEnd();
    }

    render() {
        const {
            dragStyle,
            noDragStyle,
            noDragClass,
            handleClass,
            handleStyle,
            children,
            isDragging,
            showHandle,
        } = this.props;
        const dragClass = isDragging ? " dragging" : "";

        return (
            <div
                onDragStart={ this.onDragStart }
                draggable={ showHandle ? "false" : "true" }
                onDrag={ showHandle ? () => {} : this.onDrag }
                onDragEnd={ showHandle ? () => {} :  this.onDragEnd }
                style={ isDragging ? dragStyle : noDragStyle }
                className={ `draggable${dragClass}` }>
                { showHandle &&
                    <div
                        style={ handleStyle }
                        className="draggable handle"
                        draggable="true"
                        onDrag={ this.onDrag }
                        onDragEnd={ this.onDragEnd }/> }
                { children }
            </div>
        );
    }
}

Draggable.propTypes = propTypes;
Draggable.defaultProps = defaultProps;
