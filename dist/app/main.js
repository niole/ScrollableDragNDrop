"use strict";

//import React from "react";
//import { render } from "react-dom";
//import ScrollableContainer from "./ScrollableContainer.jsx";
var ScrollableContainer = require("./ScrollableContainer.jsx");

module.exports = ScrollableContainer;

//const Element = props => <div style={{ background: props.background }} className="test-element">{ props.content }</div>;
//const hexComponents = [0,1,2,3,4,5,6,7,8,9,"a", "b", "c", "d", "e", "f"];
//
//function getRandomHex() {
//  let hex = [];
//  let i=0;
//  for (; i < 6; i++) {
//      hex.push(hexComponents[Math.floor(Math.random()*hexComponents.length)]);
//  }
//
//  return "#"+hex.join("");
//}
//
//const elts = [];
//let i=0;
//for (; i < 10; i++) {
//    elts.push(<Element content={ i } background={ getRandomHex() } />);
//}
//
//document.addEventListener("DOMContentLoaded", event => {
//  render(
//     <ScrollableContainer
//        showHandle={ false }
//        innerPanelStyle={{ top: 50 }}
//        elements={ elts }
//        containerStyle={{ background: "yellow", height: 700, width: 700, left: 0 }}
//        noDragStyle={{ width: 100 }}
//        dragStyle={{ width: 100 }}
//     />
//      , document.getElementById("app")
//  );
//});