import d3 from "d3";
import initState from "./State.js";

function DragController(scrollablePanelId, externalRenderCallback) {
  const SCROLL_ZONE_WIDTH = 100;
  const PX_PER_SCROLL_INNER_PANEL = 10;
  const SCROLLING_TIMEOUT = 1000/60;
  const PROP_UPDATE = 'props';
  const DRAG_END = 'drag end';
  const DRAGGING_LEFT = 'left';
  const DRAGGING_RIGHT = 'right';
  const scrollablePanel = document.getElementById(scrollablePanelId);

  const initialState = {
    offset: 0,
    isScrolling: false,
    shouldContinueScroll: false,
    draggingDirection: null,
    noDragEvents: PROP_UPDATE,
    widthContentPanel: 0,
    widthWindow: 0,
    leftWindow: 0,
    leftDraggable: 0,
    lastMouseX: 0,
    isDragging: false,
    contentToContainer: x => x,
    upperRange: [],
    lowerRange: [],
    draggableEltIndex: -1,
    widthDraggableElt: -1,
  };

  const state = new initState()(initialState);

  function externalStateUpdater(outerState) {
    externalRenderCallback(outerState);
    if (!outerState.dragging) {
        scrollablePanel.scrollLeft = state.get("offset");
    } else {
        //only update if just started dragging
        //make sure that we don't double how scrolled the
        //panel is
        if (scrollablePanel.scrollLeft) {
            scrollablePanel.scrollLeft = 0;
        }
    }
  }

  function update(newState) {
    state.set(Object.extend(newState, {noDragEvents: PROP_UPDATE});

    const {
      widthWindow,
      widthContentPanel
    } = state.get("widthWindow", "widthContentPanel");

    updateRanges(widthWindow);
    updateScales(widthContentPanel, widthWindow);
  }

  function updateRanges(widthWindow) {
    state.set(getRanges(widthWindow, SCROLL_ZONE_WIDTH));
  }

  function getRanges(width, scrollMargin) {
    //relative to window
    const upperBound = leftWindow + width;
    const lowerBound = leftWindow;

    return {
        upperRange: [upperBound - scrollMargin, upperBound],
        lowerRange: [lowerBound, lowerBound + scrollMargin]
    };
  }

  function updateScales(widthContent, widthContainer) {
    const contentToContainer = d3.scale.linear()
                           .domain([0, widthContent])
                           .range([0, widthContainer]);
    state.set({contentToContainer});
  }

  function getToScrollPx(pxPerScroll) {
    //returns the px amount that the scroll bar must scroll
    //in order to scroll the inner panel "pxPerScroll" amount
    //no matter the size of the panels, the scroll rate is constant
    return state.get("contentToContainer")(pxPerScroll);
  }

  function nextScrollController(widthDraggedElement, direction, widthContent, eltIndex, styleDS, lastMouseX, currMouseX, dragging) {
      isScrolling = setTimeout(() => {
        isScrolling = null;
        if (direction === DRAGGING_LEFT || direction === DRAGGING_RIGHT) {
          //the next mouse pos will be the same in the case of
          //programmatic scrolling
          renderDrag(widthDraggedElement, widthContent, eltIndex, styleDS, lastMouseX, currMouseX, dragging);
        }
      }, SCROLLING_TIMEOUT);
  }

  function nextScrollDeterminer(currMouseX, upperRange, lowerRange, draggingDirection) {
      const {
        widthDraggableElt,
        widthContentPanel,
        draggableEltIndex,
        shouldContinueScroll,
        lastMouseX,
        isScrolling,
        leftWindow,
        widthWindow
      } = state.get(
        "widthDraggableElt",
        "widthContentPanel",
        "draggableEltIndex",
        "shouldContinueScroll",
        "lastMouseX",
        "isScrolling",
        "leftWindow",
        "widthWindow"
      );

      const styleWindow = {
        left: leftWindow,
        width: widthWindow
      };

      if (!isScrolling && shouldContinueScroll &&
        (draggingDirection === DRAGGING_RIGHT || draggingDirection === DRAGGING_LEFT)) {
        nextScrollController(
          widthDraggableElt,
          shouldContinueScroll,
          widthContentPanel,
          draggableEltIndex,
          styleWindow,
          lastMouseX,
          currMouseX,
          true
        );
      }
  }

  function getAbsPxMouse(leftWindow, mouseX, scrollLeft) {
    return mouseX - leftWindow + Math.abs(scrollLeft);
  }

  function getDraggingDir(mouseX, lastMouseX, draggingDir) {
    //draggingDir is truthy if programmatically scrolling
    if (inUpperRange(mouseX) && !atEnd()) {
        return DRAGGING_RIGHT;
    } else if (inLowerRange(mouseX) && !atStart()) {
        return DRAGGING_LEFT;
    }
    return null;
  }

  function atStart() {
    const { offset } = state.get("offset");
    return offset >= 0;
  }

  function atEnd() {
    const {
      widthContentPanel,
      offset,
      widthWindow
    } = state.get("widthContentPanel", "offset", "widthWindow");

    return offset <= widthWindow - widthContentPanel;
  }

  function inLowerRange(mouseX) {
    return mouseX < state.get("lowerRange")[1];
  }


  function inUpperRange(mouseX) {
    return mouseX > state.get("upperRange")[0];
  }

  function getContinueScroll(mouseX) {
    const shouldScroll = (!atEnd() && inUpperRange(mouseX)) ||
                         (!atStart() && inLowerRange(mouseX));
    if (!shouldScroll) {
      const isScrolling = state.get("isScrolling");
      clearTimeout(isScrolling);
      state.set({isScrolling: false});
    }
    return shouldScroll;
  }

  function renderDrag(
      widthPanel, widthDSContent, dsInd, styleDSAttrContainer, lastMousePos, currMousePos, dragging, leftInnerPanel) {
      const {
        leftWindow,
        widthWindow,
        offset,
        upperRange,
        lowerRange,
        isDragging
      } = state.get("isDragging", "widthWindow", "leftWindow", "offset", "upperRange", "lowerRange");

      const styleWindow = {
        left: leftWindow,
        width: widthWindow
      };

      if (!isDragging) {
          //this is the initial drag event
          //make sure that the left offset is equal to the scrollLeft
          leftInnerPanel = -scrollablePanel.scrollLeft; //TODO figure out how to get appropriate scrollLefts
      }

      //draggingDir and shouldContinueScroll are saved to this component's context
      //bc needed before other state.sets
      const {
        shouldContinueScroll,
        draggingDirection
      } = state.set({
        shouldContinueScroll: getContinueScroll(currMousePos),
        draggingDirection: getDraggingDir(currMousePos, lastMousePos, state.get("draggingDirection"))
      });

      const pxToScroll = getToScrollPx(PX_PER_SCROLL_INNER_PANEL);
      const absMousePx = getAbsPxMouse(leftWindow, currMousePos, offset);

      /* Side Effect Causing Functions
       * boundUpdateDropZone changes state in NewEditorContainer, from where the data is passed as props
       * and used by other components. These callbacks can be removed if we move to a better state
       * management system
       * */

      nextScrollDeterminer(currMousePos, upperRange, lowerRange, draggingDirection);

      leftInnerPanel = getInnerPanelLeft(leftInnerPanel, pxToScroll, draggingDirection);

      const { offset } = state.set({offset: Math.abs(leftInnerPanel)});


      //TODO new function for this?
      //this.props.boundUpdateDropZone(absMousePx, dragging, dsInd, leftInnerPanel);
      /* Side Effect Causing Functions*/

      const newLeft = getDragPanelLeft(
        widthPanel,
        draggingDirection,
        offset,
        styleWindow,
        currMousePos
      );


      state.set({
        lastMousePos: currMousePos
      });

      externalStateUpdater({
        dragging: dragging ? " dragging-dspanel" : "",
        left: newLeft
      });
  }

  function getInnerPanelLeft(baseLeft, pxToScroll, draggingDirection) {
      if (draggingDirection === DRAGGING_RIGHT) {
          return baseLeft - pxToScroll;
      }

      if (draggingDirection === DRAGGING_LEFT) {
          return baseLeft + pxToScroll;
      }

      return baseLeft;
  }

  function getDragPanelLeft(widthPanel, draggingDir, offset, styleDS, currMousePos) {
      //get new left for dragged dataset panel relative to inner content panel
      let {
        width,
        left
      } = styleDS;
      const truePx = offset + currMousePos - left - getLeftDragHandleDSPanelHead(widthPanel);

      //the below checks keep the dragged data set panel from being dragged off
      //edge of containing panel
      if (draggingDir === DRAGGING_RIGHT || (truePx > offset + width - widthPanel)) {
          return offset + width - widthPanel;
      } else if (draggingDir === DRAGGING_LEFT || truePx < offset) {
          return offset;
      }

      return truePx;
  }

  function getLeftDragHandleDSPanelHead(widthPanel) {
    const DSPANEL_HANDLE_WIDTH = 20;
    return widthPanel/2 - DSPANEL_HANDLE_WIDTH/2;
  }

  function onDrag(event) {
    event.preventDefault();
    const {
      widthDraggableElt,
      widthContentPanel,
      draggableEltIndex,
      widthWindow,
      leftWindow,
      offset,
      lastMouseX,
      isScrolling
    } = state.get(
      "widthDraggableElt",
      "widthContentPanel",
      "draggableEltIndex",
      "widthWindow",
      "leftWindow",
      "offset",
      "lastMouseX",
      "isScrolling"
    );

    const mouse = event.nativeEvent.pageX;
    const styleWindow = {
      width: widthWindow,
      left: leftWindow
    };

    if (!isScrolling && mouse !== 0) {
      //pageX for the mouse pos will never be zero by
      //nature of how this editor is set up
      //react's event handling for onDrag
      //returns 0 when onDrag ends, which produces visual inconsistencies
      renderDrag(
        widthDraggableElt,
        widthContentPanel,
        draggableEltIndex,
        styleWindow,
        lastMouseX,
        mouse,
        true,
        offset
      );
    }
  }

  function onDragEnd(event) {
    event.preventDefault();
    state.set({
      noDragEvents: DRAG_END
      shouldContinueScroll: false
    });

    const {
      widthDraggableElt,
      widthContentPanel,
      draggableEltIndex,
      widthWindow,
      leftWindow,
      offset,
      lastMouseX,
      isScrolling
    } = state.get(
      "widthDraggableElt",
      "widthContentPanel",
      "draggableEltIndex",
      "widthWindow",
      "leftWindow",
      "offset",
      "lastMouseX",
      "isScrolling"
    );

    const mouse = event.nativeEvent.pageX;
    renderDrag(
      widthDraggableElt,
      widthContentPanel,
      draggableEltIndex,
      styleWindow,
      lastMouseX,
      mouse,
      false,
      offset
    );
  }

  function getPanelStyle(dragging, leftWhileDragging, leftNoDrag, widthPanel) {
    const noDragEvents = state.get("noDragEvents");
    let resStyle = { width: widthPanel };

    if (dragging !== "" || this.noDragEvents === DRAG_END) {
      return Object.assign(resStyle, { left: leftWhileDragging });
    } else if (this.noDragEvents === PROP_UPDATE) {
      return Object.assign(resStyle, { left: leftNoDrag });
    }
  }

  return {
    update: update,
    onDrag: onDrag,
    onDragEnd: onDragEnd
  };
}

export default DragController;
