import React, {PropTypes, Component} from 'react';

const { object } = PropTypes;
const propTypes = {
  style: object
};
const defaultProps = {
  style: {
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
      onDragStart,
      onDragEnd,
      children
    } = this.props;

    return (
      <div
          style={ style }
          draggable="true"
          onDrag={ onDragStart }
          onDragEnd={ onDragEnd }>
        { children }
      </div>
    );
  }
}

Draggable.propTypes = propTypes;
Draggable.defaultProps = defaultProps;
