import React from "react";

// data
import dataCpiUs from "../data/cpi-us"
import artsTuition from "../data/upenn-tuition"
import historicRent from "../data/historic-rent"

// images 
import college from "../imgs/college.svg"
import collegeDrop from "../imgs/college-drop.svg"
import keys from "../imgs/keys.svg"
import fish from "../imgs/fish.svg"
import wheel from "../imgs/wheel.svg"

// charts 
import { UniPriceChart, WaybackComparison, RentLine } from './Chart'


function Calculations({ boomerWage, boomerYear, zWage, zYear }) {
  // TODO turn most of these into objects - cpi, wage, unicost, rentcost

  const boomerCPI = dataCpiUs.years.filter(year => year.year == boomerYear)[0].cpi
  const zCPI = dataCpiUs.years.filter(year => year.year == zYear)[0].cpi
  const CPIFactor = boomerCPI / zCPI

  const zWageWayback = (zWage * CPIFactor).toFixed(2)
  const boomerWageToday = (boomerWage / CPIFactor).toFixed(2)
  const wagePercentChange = calcPercentChange(zWageWayback, boomerWage)
  
  const boomerUniCost = artsTuition.years.filter(year => year.year == boomerYear)[0].tuition
  const zUniCost = artsTuition.years.filter(year => year.year == zYear)[0].tuition
  const zUniCostWayback = zUniCost * CPIFactor
  const uniPercentChange = calcPercentChange(zUniCostWayback, boomerUniCost)

  const boomerRentCost = lookupRent(boomerYear)
  const zRentCost = lookupRent(zYear)
  const zRentCostWayback = zRentCost * CPIFactor
  const rentPercentChange = calcPercentChange(zRentCostWayback, boomerRentCost)


  function dollarFormat(num, dec = 2) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: dec }).format(num)
  }

  function calcPercentChange(adjusted, historic) {
    const obj = {}
    obj.amount = (Math.abs(1 - adjusted / historic) * 100).toFixed(2)
    obj.amountFormatted = `${obj.amount}%`
    obj.isNowHigher = adjusted >= historic

    return obj
  }

  function calcExtraTimeForUni() {
    let factor = (zUniCost / zWage) / (boomerUniCost / boomerWage)

    let hours = (Math.ceil((40 * factor - 40) * 4) / 4).toFixed(2)
    hours = new Intl.NumberFormat({ style: 'number', maximumFractionDigits: 2 }).format(hours)
    return hours + " hours"
  }

  function calcExtraTimeForRent() {
    let factor = (zRentCost / zWage) / (boomerRentCost / boomerWage)

    let hours = (Math.ceil((40 * factor - 40) * 4) / 4).toFixed(2)
    hours = new Intl.NumberFormat({ style: 'number', maximumFractionDigits: 2 }).format(hours)
    return hours + " hours"
  }

  function lookupRent(yr) {
    let [...yearsArr] = historicRent.years;
    let exactMatch = yearsArr.filter(year => year.year == yr)

    // if exact match found
    if (exactMatch.length) {
      return exactMatch[0].rent
    }

    // if exact match NOT found data will have to be estimated from preceeding and subsequent data points that are available
    yearsArr.sort((yr1, yr2) => yr1.year - yr2.year)
    let index = yearsArr.findIndex(year => year.year > yr)
    let lowerBracket = yearsArr[index - 1]
    let upperBracket = yearsArr[index]

    return lowerBracket.rent + (upperBracket.rent - lowerBracket.rent) / (upperBracket.year - lowerBracket.year) * (yr - lowerBracket.year)
  }


  return (
    < >
      <article className="history-dollar container container--with-border">
        <div className="history-dollar__text">
          <p className="context">{dollarFormat(zWage, 2)} is <span className="light-color">{dollarFormat(zWageWayback, 2)}</span> in {boomerYear} dollars,
            or {wagePercentChange.amountFormatted} {wagePercentChange.isNowHigher ? "more" : "less"} than {dollarFormat(boomerWage, 2)}</p>
        </div>
        <div className="graphic-wrapper history-dollar__graphic">
          <WaybackComparison boomerWage={boomerWage} zWageWayback={zWageWayback} />
        </div>
      </article>

      <article className="college-stats container ">
        <div className="college-stats__graphic">
          <img src={college} alt="" />
        </div>
        <div className="college-stats__text">
          <div className="question">
            <p className="context">What if you want to attend college?</p>
          </div>
        </div>
      </article>

      <article className="upenn-chart container container--with-border">
        <p className="context">Cost of Tuition</p>
        <p className="context context--smaller">(~<span className="light-color">{dollarFormat(zUniCost, 0)}</span> in {zYear})</p>
        <UniPriceChart boomerYear={boomerYear} zYear={zYear} />
        <p className="legend">Historical price of tuition at UPENN for Arts &amp; Science programs</p>
      </article>

      <article className="uni-real-cost container container--with-border">
        <div className="uni-real-cost__graphic">
          <img src={collegeDrop} alt="" />
        </div>
        <div className="uni-real-cost__text">
          <p className="context">{dollarFormat(zUniCost, 0)} adjusted to {boomerYear} is <span className="xxlight-color xxlight-color--with-bg">{dollarFormat(zUniCostWayback, 0)}</span>. That's {uniPercentChange.amountFormatted} {uniPercentChange.isNowHigher ? "higher" : "lower"} than the actual tuition - {dollarFormat(boomerUniCost, 0)}.</p>
          {uniPercentChange.amount >= 10 && uniPercentChange.isNowHigher ?
            <p className="context">Imagine working 40 hours, then working another {calcExtraTimeForUni()} just to catch up.</p> : ""
          }
        </div>
      </article>

      <article className="place-to-live container container--with-border">
        <div className="place-to-live__text">
          <p className="context">How about a place to live?</p>
        </div>
        <div className="place-to-live__graphic">
          <img src={keys} alt="" />
        </div>
      </article>

      <article className="rent-chart container container--with-border">
        <div className="rent-chart__graphic">
          <img src={fish} alt="" />
        </div>
        <div className="rent-chart__line-graph">
          <p className="context">Median Rent</p>
          <p className="context context--smaller">(~<span className="light-color">{dollarFormat(lookupRent(zYear), 0)}</span> in {zYear})</p>
          <RentLine boomerYear={boomerYear} zYear={zYear} />
          <p className="legend">Data between decades approximated</p>
        </div>
      </article>
      <article className="rent-real-cost container container--with-border">
        <div className="rent-real-cost__text">
          <p className="context">{dollarFormat(zRentCost, 0)} adjusted to {boomerYear} is <span className="xxlight-color xxlight-color--with-bg">{dollarFormat(zRentCostWayback, 0)}</span>. That's {rentPercentChange.amountFormatted} {rentPercentChange.isNowHigher ? "higher" : "lower"} than the actual rent - {dollarFormat(boomerRentCost, 0)}.</p>
          {rentPercentChange.amount >= 10 && rentPercentChange.isNowHigher ?
            <p className="context">Imagine having to work another {calcExtraTimeForRent()} this week for the same place to live.</p> : ""
          }
        </div>
      </article>

      <article className="summary container container--with-border">
        <div className="summary__text">
          <p className="context">{wagePercentChange.amountFormatted} difference in income is only a part of the story. {calcExtraTimeForRent() + calcExtraTimeForUni()}</p>
        </div>
        <div className="summary_img">
          <img src={wheel} alt="" />
        </div>
      </article>
    </>
  )
}

export default Calculations