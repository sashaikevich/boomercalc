import React from "react";
import dataCpiUs from "../data/cpi-us"
import artsTuition from "../data/upenn-tuition"

import { UniPriceChart } from './Chart'

function Calculations({ boomerWage, boomerYear, zWage, zYear }) {

  const NUM_WORK_WEEKS = 50
  const boomerCPI = dataCpiUs.years.filter(year => year.year == boomerYear)[0].cpi
  const zCPI = dataCpiUs.years.filter(year => year.year == zYear)[0].cpi
  const factor = boomerCPI / zCPI

  const zWageWayback = (Math.round(zWage * 100 * factor) / 100).toFixed(2)
  const boomerWageToday = (Math.round(boomerWage * 100 / factor) / 100).toFixed(2)
  const percentChange = (Math.abs(1 - zWageWayback / boomerWage) * 100).toFixed(2)
  const hasImproved = zWageWayback > boomerWage

  const generateText = function (percent, hasImproved) {
    if (percent < 8 && hasI) {

    }

    // "true": { "0": `${percentChange}% It's a small improvement!` },
    // "false": { "0": `${percentChange}% is not a lot, but it adds up!` },

    /*
    <8 
    which isn't so bad if everything else stayed the same...
    8-20
     That's like winning 10 minutes for every hour you work.
      20-35
    That's a sizable difference!
    35-60
    That's HUGE
    60-100%
    This is life changing

     */
  }

  const boomerSchoolCost = artsTuition.years.filter(year => year.year == boomerYear)[0].tuition
  const zSchoolCost = artsTuition.years.filter(year => year.year == zYear)[0].tuition


  function hoursPerWeek(totalHrs) {
    return totalHrs / NUM_WORK_WEEKS
  }




  return (
    < >
      <div className="context-text container ">
        <p>${zWage} is <span className="inverse">${zWageWayback}</span> in {boomerYear} dollars,<br />
          or {percentChange}% {hasImproved ? "more" : "less"} than ${boomerWage}</p>
      </div>
      <div className="context-text container ">
        <p>But, what if you want to go to college?</p>
      </div>

      <div className="education-chart container container--with-border">
        <UniPriceChart boomerYear={boomerYear} zYear={zYear} />
      </div>
      <ul>
        <li className="schoooling">
          <span>boomer hours needed: {hoursPerWeek(boomerSchoolCost / boomerWage)}</span>
          <span>z hours needed: {hoursPerWeek(zSchoolCost / zWage)}</span>
        </li>
      </ul>


    </>
  )
}

export default Calculations