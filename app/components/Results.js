import React from "react";
function Results({ boomerCPI, zCPI, boomerWage, zWage, boomerSchoolCost, zSchoolCost, hoursPerWeek }) {
  const factor = boomerCPI / zCPI

  return (
    < section className="results-wrapper" >
      {/* <p>{props.calcResults.boomerCPI}</p>
      <p>{JSON.stringify(props.calcResults.zCPI)}</p>
      {((100 * (props.zCPI) / props.boomerCPI) * props.boomerWage).toFixed(2)} */}
      boomer cpi: {boomerCPI}<br />
      z cpi: {zCPI} <br />
      factor: {factor} <br />
      boomer's wage adjusted for today: {Math.round(boomerWage * 100 / factor) / 100}<br />
      z's wage adjusted for yesteryear: {Math.round(zWage * 100 * factor) / 100}<br />
      <ul>
        <li className="schoooling">
          <span>boomer hours needed: {hoursPerWeek(boomerSchoolCost / boomerWage)}</span>
          <span>z hours needed: {hoursPerWeek(zSchoolCost / zWage)}</span>
        </li>
      </ul>
    </section >
  )
}

export default Results