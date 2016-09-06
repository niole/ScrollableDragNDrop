import React, {PropTypes, Component} from 'react';

const { bool, object, func } = PropTypes;
const propTypes = {
  style: object,
  onDragStyle: object,
  dragHandleStyle: object,
  onDrag: func.isRequired,
  onDragEnd: func.isRequired,
  isDragging: bool.isRequired
};
const defaultProps = {
  style: {},
  onDragStyle: {},
  dragHandleStyle: {
    left: 0,
    top: 0,
    width: 10,
    height: 10
  }
};

export default class Draggable extends Component {
  render() {
    const {
      style,
      onDragStyle,
      dragHandleStyle,
      onDrag,
      onDragEnd,
      isDragging,
      children
    } = this.props;

    return (
      <div style={ isDragging ? onDragStyle : style }>
        <div
            style={ dragHandleStyle }
            draggable="true"
            onDrag={ onDrag }
            onDragEnd={ onDragEnd }/>
        { children }
      </div>
    );
  }
}

Draggable.propTypes = propTypes;
Draggable.defaultProps = defaultProps;
