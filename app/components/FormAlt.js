import React, { useEffect, useState, useRef } from 'react'

function Form() {
  const DELAY = 1300
  const MIN_YEAR = 1946
  const MAX_YEAR = 2022
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

  function clampYearsRange(year) {
    if (year > MAX_YEAR) return MAX_YEAR
    if (year < MIN_YEAR) return MIN_YEAR
    return year
  }

  function wageHandler(e) {
    let safeVal = parseFloat(e.target.value).toFixed(2)

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
    let safeVal = clampYearsRange(e.target.value)
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
    <input type="text" ref={boomerWageRef} name="boomerWage" onChange={(e) => {
      handleChange(e, wageHandler)
    }}></input>
    <input type="number" ref={boomerYearRef} name="boomerYear" onChange={(e) => {
      handleChange(e, yearHandler)
    }}></input>
    <input type="text" ref={zWageRef} name="zWage" onChange={(e) => {
      handleChange(e, wageHandler)
    }}></input>
    <input type="number" ref={zYearRef} name="zYear" onChange={(e) => {
      handleChange(e, yearHandler)
    }}></input>
    <p>{readyToCalc ? `${boomerYear}, ${zYear}` : "loading..."}</p>
  </>
}
export default Form