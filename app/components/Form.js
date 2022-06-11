//  issues:
// tabing through fields doesn't correct them (try "100" tab tab 100 - it won't add the 00 to boomer)
// NaN error
// todo fix the two bar graphs... or make it a pie chart

import React, { useEffect, useState, useRef } from 'react'

import Calculations from './Calculations'

function Form() {
  const DELAY = 1300
  const MIN_YEAR = 1946
  const MAX_YEAR = 2022
  const MAX_DOL = 999.99
  const MIN_DOL = 0.01
  const PLACEHOLDER = {
    boomerWage: 3.05,
    boomerYear: 1985,
    zWage: 7.75,
    zYear: MAX_YEAR
  }

  const [readyToCalc, setReadyToCalc] = useState(true)

  const [boomerWage, setBoomerWage] = useState(PLACEHOLDER.boomerWage)
  const [boomerYear, setBoomerYear] = useState(PLACEHOLDER.boomerYear)
  const [zWage, setZWage] = useState(PLACEHOLDER.zWage)
  const [zYear, setZYear] = useState(PLACEHOLDER.zYear)

  const timmyRef = useRef(null);
  const boomerWageRef = useRef(null)
  const boomerYearRef = useRef(null)
  const zWageRef = useRef(null)
  const zYearRef = useRef(null)

  function clampRange(val, min, max) {
    if (val > max) return max
    if (val < min) return min
    return val
  }

  function limitCharacters(e) {
    let value = e.target.value
    // match anything that's not a number or dot
    const rex = /[^\.0-9]/g
    if (rex.test(value)) {
      value = value.replace(rex, '');
    }
    e.target.value = value
  }

  function wageHandler(e) {
    let safeVal = parseFloat(e.target.value).toFixed(2)
    safeVal = clampRange(safeVal, MIN_DOL, MAX_DOL)

    if (e.target.name == "boomerWage") {
      setBoomerWage(safeVal)
      boomerWageRef.current.value = safeVal
    }
    else if (e.target.name == "zWage") {
      setZWage(safeVal)
      zWageRef.current.value = safeVal
    }
  }

  function yearHandler(e) {
    let safeVal = clampRange(e.target.value, MIN_YEAR, MAX_YEAR)
    if (e.target.name == "boomerYear") {
      setBoomerYear(safeVal)
      boomerYearRef.current.value = safeVal
    } else if (e.target.name == "zYear") {
      setZYear(safeVal)
      zYearRef.current.value = safeVal
    }
  }

  function boolCorrectUserData() {
    if (boomerYear < MIN_YEAR || boomerYear > MAX_YEAR) return false
    if (zYear < MIN_YEAR || zYear > MAX_YEAR) return false
    return true
  }


  function handleChange(e, fieldHandler) {
    clearTimeout(timmyRef.current)
    setReadyToCalc(false)
    timmyRef.current = setTimeout(() => {
      fieldHandler(e)
      setReadyToCalc(boolCorrectUserData())
    }, DELAY)
  }


  useEffect(() => {
    boomerWageRef.current.value = PLACEHOLDER.boomerWage
    boomerYearRef.current.value = PLACEHOLDER.boomerYear
    zWageRef.current.value = PLACEHOLDER.zWage
    zYearRef.current.value = PLACEHOLDER.zYear
  }, [])


  return <>
    <section className="user-inputs-wrapper container container--with-border">
      <div className="boomer-inputs">
        <input
          type="text"
          ref={boomerWageRef}
          id="boomerWage"
          name="boomerWage"
          onKeyUp={limitCharacters}
          onChange={(e) => handleChange(e, wageHandler)}
          onBlur={wageHandler}
        />

        <p className="time-period">
          in: <input
            type="number"
            ref={boomerYearRef}
            id="boomerYear"
            name="boomerYear"
            min={MIN_YEAR}
            max={MAX_YEAR}
            onChange={(e) => handleChange(e, yearHandler)}
            onBlur={yearHandler}
          />
        </p>
      </div>

      <div className="divider"></div>
      <div className="z-inputs">
        <input type="text"
          ref={zWageRef}
          id="zWage"
          name="zWage"
          onKeyUp={limitCharacters}
          onChange={(e) => handleChange(e, wageHandler)}
          onBlur={wageHandler}
        />
        <p className="time-period">
          <span id="today">today</span>
          <span className="hidden">in: <input
            type="number"
            ref={zYearRef}
            id="zYear"
            name="zYear"
            min={MIN_YEAR}
            max={MAX_YEAR}
            onChange={(e) => handleChange(e, yearHandler)}
            onBlur={yearHandler}
          />
          </span>
        </p>
      </div>
    </section>
    <section className="calculations-wrapper">
      {readyToCalc ? <Calculations boomerWage={boomerWage} boomerYear={boomerYear} zWage={zWage} zYear={zYear} /> : "traveling back in time..."}
    </section>
  </>
}
export default Form