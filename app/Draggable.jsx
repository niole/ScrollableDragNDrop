import React, {PropTypes, Component} from 'react';

const { bool, string, object, func, number } = PropTypes;
const propTypes = {
    dragStyle: object.isRequired,
    onDrag: func.isRequired,
    onDragEnd: func.isRequired,
    noDragStyle: object.isRequired,
    index: number.isRequired,
    isDragging: bool.isRequired,
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
    render() {
        const {
            dragStyle,
            onDrag,
            onDragEnd,
            noDragStyle,
            dragClass,
            noDragClass,
            handleClass,
            handleStyle,
            children,
            isDragging,
            index,
        } = this.props;

        return (
            <div style={ isDragging ? dragStyle : noDragStyle } className="draggable">
                <div
                    style={ handleStyle }
                    className="draggable handle"
                    draggable="true"
                    onDrag={ event => onDrag(event, index) }
                    onDragEnd={ event => onDragEnd(index) }/>
                { children }
            </div>
        );
    }
}

Draggable.propTypes = propTypes;
Draggable.defaultProps = defaultProps;
