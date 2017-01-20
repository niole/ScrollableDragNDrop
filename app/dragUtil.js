/**
 * @function
 * @name getElementLeftFromIndex
 * @param {Number} index
 * @return {Number} the left style value for an undragged element
 */
export function getElementLeftFromIndex(index, elementMargin, noDragStyle) {
    const { width } = noDragStyle;

    return index*(elementMargin+width)+elementMargin;
}

/**
 * @function
 * @name getElementIndexFromLeft
 * @param {Number} left
 * @return {Number} closest index for provided left
 */
export function getElementIndexFromLeft(left, elementMargin, noDragStyle, elements, maxLeftValue) {
    const { width } = noDragStyle;
    const cappedLeft = Math.max(Math.min(left, maxLeftValue), elementMargin);

    return Math.floor(cappedLeft/((elementMargin+width)+elementMargin));
}

