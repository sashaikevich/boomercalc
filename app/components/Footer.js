import React from "react";

import Menu from './Menu'
import Credits from './Credits'

function Footer() {
  return (<footer className="container">
    {/* <Menu />
    <Credits /> */}
    <p>Made for the good ppl at <a tabIndex="-1" href="https://www.reddit.com/r/antiwork/" target="_blank">r/antiwork</a> by <a tabIndex="-1" href="https://twitter.com/sashaikevich" target="_blank">@sashaikevich</a></p>
    <p>Go start a union!</p>
    <p>Please use: <a tabIndex="-1" href="mailto:z@boomercalc.com">z@boomercalc.com</a> if you have suggestions or better data.</p>
  </footer >)
}

export default Footer