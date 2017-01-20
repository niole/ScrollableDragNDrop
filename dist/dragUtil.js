"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementLeftFromIndex = getElementLeftFromIndex;
exports.getElementIndexFromLeft = getElementIndexFromLeft;
/**
 * @function
 * @name getElementLeftFromIndex
 * @param {Number} index
 * @return {Number} the left style value for an undragged element
 */
function getElementLeftFromIndex(index, elementMargin, noDragStyle) {
  var width = noDragStyle.width;


  return index * (elementMargin + width) + elementMargin;
}

/**
 * @function
 * @name getElementIndexFromLeft
 * @param {Number} left
 * @return {Number} closest index for provided left
 */
function getElementIndexFromLeft(left, elementMargin, noDragStyle, elements, maxLeftValue) {
  var width = noDragStyle.width;

  var cappedLeft = Math.max(Math.min(left, maxLeftValue), elementMargin);

  return Math.floor(cappedLeft / (elementMargin + width + elementMargin));
}