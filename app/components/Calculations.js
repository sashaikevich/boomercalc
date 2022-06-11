import React from "react";

// todo $12.95 today is giving me 0.600000000001 minutes !

// data
import DATA_CPI from "../data/cpi-us"
import DATA_TUITION from "../data/upenn-tuition"
import DATA_RENT from "../data/historic-rent"

// images 
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
    get zWayback() { return (this.z * CPIS.factor).toFixed(2) },
    get boomerToday() { return (this.boomer / CPIS.factor).toFixed(2) },
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
    }
  }

  const PERCENT_CHANGE = {
    PercentChange: function (wayback, historic) {
      this.amount = Math.round((Math.abs(1 - wayback / historic) * 100) * 1e2) / 1e2
      // this.amountFormatted = `${parseFloat(this.amount)}%`
      this.amountFormatted = `${this.amount}%`
      this.isNowHigher = wayback >= historic
    },
    get wage() { return new this.PercentChange(WAGES.zWayback, WAGES.boomer) },
    get rent() { return new this.PercentChange(RENT_COSTS.zWayback, RENT_COSTS.boomer) },
    get uni() { return new this.PercentChange(UNI_COSTS.zWayback, UNI_COSTS.boomer) }
  }

  function extraTimeNeeded(expenseObj) {
    let factor = ((expenseObj.z / WAGES.z) / (expenseObj.boomer / WAGES.boomer))
    return 40 * factor - 40
  }

  function formatIntoHours(num, roundToNearestQuarter) {
    num = Math.abs(num)
    console.log(num)
    if (num < 1) {
      return Math.round(60 * num) + " minutes"
    } else if (num == 1) {
      return num + " hour"
    } else {
      if (roundToNearestQuarter) {
        num = Math.ceil(num * 4) / 4
        num = Math.round(num * 1e2) / 1e2
        return num + " hours"
      } else {
        let hrs = Math.floor(num)
        let mins = Math.ceil((num % 1) * 60)
        let str = "";

        if (mins < 58 && mins > 2) {
          if (hrs == 1) {
            str += `${hrs} hour`
          } else {
            str += `${hrs} hours`
          }
          
          return hrs + " hours and " + mins + " minutes"

        } else if (mins >= 58) {
          hrs++
          mins = 0;
          str += "about "
        } else if (mins <= 2) {
          mins = 0;
          str += "about "
        }

        if (hrs == 1) {
          str += `${hrs} hour`
        } else {
          str += `${hrs} hours`
        }

      }
    }

  }

  function formatIntoDollars(num, dec = 2) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: dec }).format(num)
  }

  function WageContext() {
    return <>
      <p className="context">{formatIntoDollars(WAGES.z, 2)} is {formatIntoDollars(WAGES.zWayback, 2)} in {boomerYear} dollars,
        or <span className="light-color">{PERCENT_CHANGE.wage.amountFormatted} {PERCENT_CHANGE.wage.isNowHigher ? "more" : "less"}</span> than {formatIntoDollars(WAGES.boomer, 2)}</p>
      <p className="context">Every hour worked in {boomerYear} has the buying power of {formatIntoHours(1 / (WAGES.zWayback / WAGES.boomer), false)} in {zYear}.</p>
    </>
  }


  function SchoolContext() {
    let movement;
    if (PERCENT_CHANGE.uni.amount >= 20) movement = "significantly "
    else if (PERCENT_CHANGE.uni.amount >= 10) movement = "a lot "
    else if (PERCENT_CHANGE.uni.amount < 10) movement = "a little "

    return <>
      <p className="context">{formatIntoDollars(UNI_COSTS.z, 0)} adjusted to {boomerYear} is <span className="xxlight-color xxlight-color--with-bg">{formatIntoDollars(UNI_COSTS.zWayback, 0)}</span>. That's {PERCENT_CHANGE.uni.amountFormatted} - {movement} {PERCENT_CHANGE.uni.isNowHigher ? "higher" : "lower"} than the tuition in {boomerYear} - {formatIntoDollars(UNI_COSTS.boomer, 0)}.</p>
      {/* <p className="context">{string}</p> */}
    </>
  }

  function RentContext() {
    return (<>
      <p className="context">{formatIntoDollars(RENT_COSTS.z, 0)} adjusted to {boomerYear} is <span className="xxlight-color xxlight-color--with-bg">{formatIntoDollars(RENT_COSTS.zWayback, 0)}</span>. That's {PERCENT_CHANGE.rent.amountFormatted} {PERCENT_CHANGE.rent.isNowHigher ? "higher" : "lower"} than the actual rent of {formatIntoDollars(RENT_COSTS.boomer, 0)}.</p>

      {/* {PERCENT_CHANGE.rent.amount >= 10 && PERCENT_CHANGE.rent.isNowHigher ?
        <p className="context">Imagine having to work another {formatIntoHours(extraTimeNeeded(RENT_COSTS), true)} this week for the same place to live.</p> : ""
      } */}
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
            <p className="context">What if you want to attend college?</p>
          </div>
        </div>
      </article>

      <article className="upenn-chart container container--with-border">
        <p className="context">Cost of Tuition</p>
        <p className="context context--smaller">(~<span className="light-color">{formatIntoDollars(UNI_COSTS.z, 0)}</span> in {zYear})</p>
        <UniPriceChart className="chart" boomerYear={boomerYear} zYear={zYear} />
        <p className="legend">Historical price of tuition at UPENN for Arts &amp; Science programs</p>
      </article>

      <article className="uni-real-cost container container--with-border">
        <div className="uni-real-cost__graphic ">
          <img src={collegeDrop} alt="" />
        </div>
        <div className="uni-real-cost__text">
          <SchoolContext />
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
          <p className="context context--smaller">(~<span className="light-color">{formatIntoDollars(RENT_COSTS.z, 0)}</span> in {zYear})</p>
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
          <p className="context">{PERCENT_CHANGE.wage.amountFormatted} difference in income is only a part of the story. {(extraTimeNeeded(RENT_COSTS) + extraTimeNeeded(UNI_COSTS))}</p>
        </div>
        <div className="summary_graphic">
          <img src={wheel} alt="" />
        </div>
      </article>
    </>
  )
}

export default Calculations