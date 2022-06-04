import React from "react";
import dataCpiUs from "../data/cpi-us"
import artsTuition from "../data/upenn-tuition"

function Calculations({ boomerWage, boomerYear, zWage, zYear }) {
  
  const NUM_WORK_WEEKS = 50
  const boomerCPI = dataCpiUs.years.filter(year => year.year == boomerYear)[0].cpi
  const zCPI = dataCpiUs.years.filter(year => year.year == zYear)[0].cpi
  const boomerSchoolCost = artsTuition.years.filter(year => year.year == boomerYear)[0].tuition
  const zSchoolCost = artsTuition.years.filter(year => year.year == zYear)[0].tuition

  const factor = boomerCPI / zCPI

  function hoursPerWeek(totalHrs) {
    return totalHrs / NUM_WORK_WEEKS
  }



  return (
    < >

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
    </ >
  )
}

export default Calculations