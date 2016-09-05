import React from "react";
import ReactDOM, {render} from "react-dom";
import Draggable from "./Draggable.jsx";

document.addEventListener("DOMContentLoaded", event => {
  render(<Draggable/>, document.getElementById("app"));
});
