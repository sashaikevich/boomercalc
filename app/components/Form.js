import React, { useState, useEffect } from "react"
import CurrencyInput from "react-currency-input-field"
import data from "../data"
import Results from './Results'
import { BoomerWageInput, BoomerYearInput, ZWageInput, ZYearInput } from './InputFields'

function Form() {
  const [boomerWage, setBoomerWage] = useState(3.05)
  const [boomerYear, setBoomerYear] = useState(1985)
  const [zYear, setZYear] = useState(2022)
  const [zWage, setZWage] = useState(9.20)
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
    setBoomerWage(prev => prev == 0 ? 1 : Math.abs(prev) )
    setZWage(prev => prev == 0 ? 1 : Math.abs(prev) )

    const boomerCPI = data.years.filter(year => year.year == boomerYear)[0].cpi
    const zCPI = data.years.filter(year => year.year == zYear)[0].cpi
    setCalculations({ boomerCPI, zCPI, boomerWage, zWage })
    setShowResults(true)

  }

  return <>
    {/* add error handling */}
    {/* {errors.length ? errors : ""} */}

    {/* add toggle for simple or complex form */}
    <button onClick={() => { setShowExtraFields(prev => !prev) }}>show fields</button>
    <section className="user-inputs-wrapper">
      <div className="boomer-inputs">
        <BoomerWageInput boomerWage={boomerWage} setBoomerWage={setBoomerWage} />
        <BoomerYearInput boomerYear={boomerYear} setBoomerYear={setBoomerYear} />
      </div>

      <div className="z-inputs">
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