import React from "react";

// data
import DATA_CPI from "../data/cpi-us"
import DATA_TUITION from "../data/upenn-tuition"
import DATA_RENT from "../data/historic-rent"

// images 
import { BiUpArrow, BiDownArrow } from 'react-icons/bi'
import college from "../imgs/college.svg"
import collegeDrop from "../imgs/college-drop.svg"
import keys from "../imgs/keys.svg"
import fish from "../imgs/fish.svg"
import wheel from "../imgs/wheel.svg"

// charts 
import { UniPriceChart, WaybackComparison, RentLine } from './Chart'


function Calculations({ boomerWage, boomerYear, zWage, zYear }) {

  const CPIS = {
    boomer: DATA_CPI.years.filter(year => year.year == boomerYear)[0].cpi,
    z: DATA_CPI.years.filter(year => year.year == zYear)[0].cpi,
    get factor() { return this.boomer / this.z }
  }

  const WAGES = {
    boomer: boomerWage,
    z: zWage,
    // get zWayback() { return (this.z * CPIS.factor).toFixed(2) },
    get zWayback() { return (this.z * CPIS.factor) },
    get boomerToday() { return (this.boomer / CPIS.factor) },
  }

  const UNI_COSTS = {
    boomer: DATA_TUITION.years.filter(year => year.year == boomerYear)[0].tuition,
    z: DATA_TUITION.years.filter(year => year.year == zYear)[0].tuition,
    get zWayback() { return this.z * CPIS.factor }
  }


  const RENT_COSTS = {
    get boomer() { return this.lookupIncompleteData(boomerYear) },
    get z() { return this.lookupIncompleteData(zYear) },
    get zWayback() { return this.z * CPIS.factor },
    lookupIncompleteData: function (yr) {
      let [...yearsArr] = DATA_RENT.years;
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
    },
  }

  const PERCENT_CHANGE = {
    PercentChange: function (wayback, historic) {
      this.amount = Math.round((Math.abs(1 - wayback / historic) * 100) * 1e2) / 1e2
      // this.amountFormatted = `${parseFloat(this.amount)}%`
      this.amountFormatted = `${this.amount.toLocaleString('en-US')}%`
      this.isNowHigher = wayback >= historic
    },
    get wage() { return new this.PercentChange(WAGES.zWayback, WAGES.boomer) },
    get rent() { return new this.PercentChange(RENT_COSTS.zWayback, RENT_COSTS.boomer) },
    get uni() { return new this.PercentChange(UNI_COSTS.zWayback, UNI_COSTS.boomer) }
  }

  function formatIntoDollars(num, dec = 2) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: dec }).format(num)
  }

  function formatIntoHrsMins(num) {
    let str = ""
    let hrs = Math.floor(num)
    let mins = Math.round(num % 1 * 60)

    if (mins > 57) {
      hrs++
      mins = 0
      str += "about "
    } else if (mins > 0 && mins < 3) {
      mins = 0
      str += "about "
    }

    if (hrs) {
      if (hrs == 1) {
        str += `${hrs} hour `
      } else if (hrs > 1) {
        str += `${hrs.toLocaleString('en-US')} hours `
      }
    }

    if (mins && hrs) {
      str += `and ${mins} minutes `
    } else if (mins) {
      str += `${mins} minutes `
    }
    // edge cases:
    // if time is almost nothing
    else if (hrs == 0 && mins == 0) {
      str = "about a minute"
    }

    return { hrs, mins, str }
  }

  function timePerWorkWeek(expenseObj) {
    let factor = 1 / ((expenseObj.boomer / WAGES.boomer) / (expenseObj.z / WAGES.z))

    let { hrs, mins } = formatIntoHrsMins(40 * factor)
    let str = "a "

    if (hrs) str += `${hrs}-hour`

    if (mins && hrs) {
      str += `-and-${mins}-minute`
    } else if (mins) {
      str += `${mins}-minute`
    }

    str += " workweek, instead of a 40-hour workweek of "

    // edge cases:
    // if time is almost nothing
    if (hrs == 0 && mins == 0) str = "only a couple minutes a week, instead of 40 hours in "
    // if time equals the hours in a week
    else if (hrs == 24 * 7) str = "every single hour of the week in "
    // if time is a lot more than all the hours in a week
    else if (hrs >= 24 * 7 * 1.5) str = "every single hour of the week and then some in "

    str += ""
    return str


  }

  function timeDiff(expenseObj, convertToDays = false) {
    let diff = expenseObj.z / WAGES.z - expenseObj.boomer / WAGES.boomer
    let hasImproved = diff <= 0
    let str = ""
    diff = Math.abs(diff)
    let days = Math.ceil(diff / 24)

    if (hasImproved) str = formatIntoHrsMins(diff).str + " less"
    else str = "an extra " + formatIntoHrsMins(diff).str

    if (convertToDays) str += days >= 2 ? ` (that's ${days.toLocaleString('en-US')} days!)` : ''

    return str;
  }



  function WageContext() {
    return <>
      <p className="context">{formatIntoDollars(WAGES.z, 2)} is <span className="light-color">{formatIntoDollars(WAGES.zWayback, 2)} in {boomerYear}</span> dollars, or {PERCENT_CHANGE.wage.amountFormatted} {PERCENT_CHANGE.wage.isNowHigher ? "more" : "less"} than {formatIntoDollars(WAGES.boomer, 2)}</p>
      <p className="context">You'd have to work {WAGES.boomer > WAGES.zWayback ? 'only' : ''} {formatIntoHrsMins(1 / (WAGES.boomer / WAGES.zWayback)).str} at {boomerYear}'s wage to have the buying power of an hour worked at {zYear}'s wage.</p>
    </>
  }

  function UniContext() {
    return <>
      <p className="context">{formatIntoDollars(UNI_COSTS.z, 0)} adjusted to {boomerYear} is {formatIntoDollars(UNI_COSTS.zWayback, 0)}. That's {PERCENT_CHANGE.uni.amountFormatted} {PERCENT_CHANGE.uni.isNowHigher ? "higher" : "lower"} than {formatIntoDollars(UNI_COSTS.boomer, 0)} - the actual tuition that year.</p>

      <p className="context">Having to pay {formatIntoDollars(Math.abs(UNI_COSTS.boomer - UNI_COSTS.zWayback), 0)} {PERCENT_CHANGE.uni.isNowHigher ? "more" : "less"}{PERCENT_CHANGE.wage.amount >= PERCENT_CHANGE.uni.amount ? ", but" : ""} with a wage that's {formatIntoDollars(Math.abs(WAGES.boomer - WAGES.zWayback), 2)}/hr {PERCENT_CHANGE.wage.isNowHigher ? "higher" : "lower"}, means that you'd need to work {timeDiff(UNI_COSTS, true)} to pay off your tuition.</p>

      {/* <p className="context">Having to pay {formatIntoDollars(Math.abs(UNI_COSTS.boomer - UNI_COSTS.zWayback), 0)} {PERCENT_CHANGE.uni.isNowHigher ? "more" : "less"} with a wage that's {formatIntoDollars(Math.abs(WAGES.boomer - WAGES.zWayback), 2)}/hr {PERCENT_CHANGE.wage.isNowHigher ? "higher" : "lower"}, means that you'd be working {timePerWorkWeek(UNI_COSTS)} {boomerYear} to pay off the same proportion of your student debt.</p> */}
    </>
  }

  function RentContext() {
    return (<>
      <p className="context">{formatIntoDollars(RENT_COSTS.z, 0)} adjusted to {boomerYear} is {formatIntoDollars(RENT_COSTS.zWayback, 0)}. That's {PERCENT_CHANGE.rent.amountFormatted} {PERCENT_CHANGE.rent.isNowHigher ? "higher" : "lower"} than {formatIntoDollars(RENT_COSTS.boomer, 0)} - the median rent for {boomerYear}.</p>

      <p className="context">Having to pay {formatIntoDollars(Math.abs(RENT_COSTS.boomer - RENT_COSTS.zWayback), 0)} {PERCENT_CHANGE.uni.isNowHigher ? "more" : "less"}{PERCENT_CHANGE.wage.amount >= PERCENT_CHANGE.uni.amount ? ", but" : ""} with a wage that's {formatIntoDollars(Math.abs(WAGES.boomer - WAGES.zWayback), 2)}/hr {PERCENT_CHANGE.wage.isNowHigher ? "higher" : "lower"}, means that you'd need to work {timeDiff(RENT_COSTS)} to cover your rent.</p>
    </>)
  }


  return (
    < >
      <article className="history-dollar container container--with-border">
        <div className="history-dollar__text">
          <WageContext />
        </div>
        <div className="graphic-wrapper history-dollar__graphic ">
          <WaybackComparison boomerWage={WAGES.boomer} zWageWayback={WAGES.zWayback} />
        </div>
      </article>

      <article className="college-stats container ">
        <div className="college-stats__graphic">
          <img src={college} alt="" />
        </div>
        <div className="college-stats__text">
          <div className="question">
            <h2 className="section-title">What if you want to attend college?</h2>
          </div>
        </div>
      </article>

      <article className="upenn-chart container container--with-border">
        <h2 className="section-title">Cost of Tuition</h2>
        <h3 className="subtitle">(~<span className="light-color">{formatIntoDollars(UNI_COSTS.z, 0)}</span> in {zYear})</h3>
        <UniPriceChart className="chart" boomerYear={boomerYear} zYear={zYear} />
        <p className="legend">Historical price of tuition at UPENN for Arts &amp; Science programs</p>
      </article>

      <article className="uni-real-cost container container--with-border">
        <div className="uni-real-cost__graphic ">
          <img src={collegeDrop} alt="" />
        </div>
        <div className="uni-real-cost__text">
          <UniContext />
        </div>
      </article>

      <article className="place-to-live container container--with-border">
        <div className="place-to-live__text">
          <h2 className="section-title">How about a place to live?</h2>
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
          <h2 className="section-title">Median Rent</h2>
          <h3 className="subtitle">(~<span className="light-color">{formatIntoDollars(RENT_COSTS.z, 0)}</span> in {zYear})</h3>
          <RentLine boomerYear={boomerYear} zYear={zYear} />
          <p className="legend">Data between decades approximated</p>
        </div>
      </article>
      <article className="rent-real-cost container container--with-border">
        <div className="rent-real-cost__text">
          <RentContext />
        </div>
      </article>

      <article className="summary container container--with-border">
        <div className="summary__text">
          <h2 className="section-title">{boomerYear} -- {zYear}</h2>
          <table>
            <tbody>
              <tr><td>Wages:</td><td>{PERCENT_CHANGE.wage.amountFormatted}</td><td>{PERCENT_CHANGE.wage.isNowHigher ? <BiUpArrow /> : <BiDownArrow />}</td></tr>
              <tr><td>College:</td><td>{PERCENT_CHANGE.uni.amountFormatted}</td><td>{PERCENT_CHANGE.uni.isNowHigher ? <BiUpArrow /> : <BiDownArrow />}</td></tr>
              <tr><td>Rent:</td><td>{PERCENT_CHANGE.rent.amountFormatted}</td><td>{PERCENT_CHANGE.rent.isNowHigher ? <BiUpArrow /> : <BiDownArrow />}</td></tr>
            </tbody>
          </table>
          {/* {formatIntoHrsMins(Math.abs((UNI_COSTS.z / WAGES.z - UNI_COSTS.boomer / WAGES.boomer) + (RENT_COSTS.z / WAGES.z - RENT_COSTS.boomer / WAGES.boomer))).str} */}
        </div>
        <div className="summary_graphic">
          <img src={wheel} alt="" />
        </div>
      </article>
    </>
  )
}

export default Calculations