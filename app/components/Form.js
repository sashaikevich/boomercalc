import React, { useState, useEffect } from "react"
import CurrencyInput from "react-currency-input-field"
import Results from './Results'
import { BoomerWageInput, BoomerYearInput, ZWageInput, ZYearInput } from './InputFields'

// data 
import dataCpiUs from "../data/cpi-us"
import artsTuition from "../data/upenn-tuition"

function Form() {
  const [boomerWage, setBoomerWage] = useState(3.05)
  const [boomerYear, setBoomerYear] = useState(1985)
  const [zYear, setZYear] = useState(2022)
  const [zWage, setZWage] = useState(7.75)
  const [errors, setErrors] = useState([])
  const [showExtraFields, setShowExtraFields] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [calculations, setCalculations] = useState({})

  // useEffect(() => {
  //   setErrors([])
  //   console.log(errors)
  // }, [boomerWage, boomerYear, zWage, zYear])

  function limitYearsRange(year) {
    const maxYear = 2022
    const minYear = 1946

    if (year > maxYear) return maxYear
    if (year < minYear) return minYear

    return year
  }

  function handleCalculation() {
    setShowResults(false)
    // if (boomerWage == undefined) {
    //   setErrors(prev => prev.concat('Please provide an hourly wage'))
    //   return
    // }
    // if (zWage == undefined) {
    //   setErrors(prev => prev.concat('Please provide an hourly wage'))
    //   return
    // }

    setBoomerYear(prev => limitYearsRange(prev))
    setZYear(prev => limitYearsRange(prev))
    setBoomerWage(prev => prev == 0 ? 1 : Math.abs(prev))
    setZWage(prev => prev == 0 ? 1 : Math.abs(prev))

    const boomerCPI = dataCpiUs.years.filter(year => year.year == boomerYear)[0].cpi
    const zCPI = dataCpiUs.years.filter(year => year.year == zYear)[0].cpi
    const boomerSchoolCost = artsTuition.years.filter(year => year.year == boomerYear)[0].tuition
    const zSchoolCost = artsTuition.years.filter(year => year.year == zYear)[0].tuition

    function hoursPerWeek(totalHrs){
      const NUM_WORK_WEEKS = 50
      return totalHrs/NUM_WORK_WEEKS
    }
    setCalculations({ boomerCPI, zCPI, boomerWage, zWage, boomerSchoolCost, zSchoolCost, hoursPerWeek })
    setShowResults(true)

  }

  return <>
    {/* add error handling */}
    {/* {errors.length ? errors : ""} */}

    {/* add toggle for simple or complex form */}
    <button onClick={() => { setShowExtraFields(prev => !prev) }}>show fields</button>
    <section className="user-inputs-wrapper">
      <div className="boomer-inputs">
        <h4>Boomer</h4>
        <BoomerWageInput boomerWage={boomerWage} setBoomerWage={setBoomerWage} />
        <BoomerYearInput boomerYear={boomerYear} setBoomerYear={setBoomerYear} />
      </div>

      <div className="z-inputs">
        <h4>you</h4>
        <ZWageInput zWage={zWage} setZWage={setZWage} />
        <ZYearInput zYear={zYear} setZYear={setZYear} showExtraFields={showExtraFields} />
      </div>
    </section>

    <button onClick={() => handleCalculation()}>Calculate</button>

    {showResults ? <Results {...calculations} /> : ""}

  </>
}

export default Form
// onValueChange={(value, name) => console.log(value, name)}