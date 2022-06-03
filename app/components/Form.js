import React, { useEffect } from 'react'

function Form({ userInputs, setUserInputs, readyToCalculate, setReadyToCalculate }) {

  useEffect(() => {
    setReadyToCalculate(prev => {
      return { ...prev, boomerYear: false }
    })

    let awaitYear = setTimeout(() => {
      setUserInputs(prev => {
        return { ...prev, boomerYear: clampYearsRange(prev.boomerYear) }
      })

      setReadyToCalculate(prev => {
        return { ...prev, boomerYear: true }
      })
    }, 1300)
    return () => { clearTimeout(awaitYear) }
  }, [userInputs.boomerYear])

  useEffect(() => {
    setReadyToCalculate(prev => {
      return { ...prev, zYear: false }
    })

    let awaitYear = setTimeout(() => {
      setUserInputs(prev => {
        return { ...prev, zYear: clampYearsRange(prev.zYear) }
      })
      setReadyToCalculate(prev => {
        return { ...prev, zYear: true }
      })
    }, 1300)
    return () => { clearTimeout(awaitYear) }
  }, [userInputs.zYear])

  useEffect(() => {
    setReadyToCalculate(prev => {
      return { ...prev, boomerWage: false }
    })

    let awaitWage = setTimeout(() => {
      setUserInputs(prev => {
        return { ...prev, boomerWage: normalizeWage(prev.boomerWage) }
      })
      setReadyToCalculate(prev => {
        return { ...prev, boomerWage: true }
      })
    }, 1300)
    return () => { clearTimeout(awaitWage) }
  }, [userInputs.boomerWage])

  useEffect(() => {
    setReadyToCalculate(prev => {
      return { ...prev, zWage: false }
    })

    let awaitWage = setTimeout(() => {
      setUserInputs(prev => {
        return { ...prev, zWage: normalizeWage(prev.zWage) }
      })
      setReadyToCalculate(prev => {
        return { ...prev, zWage: true }
      })
    }, 1300)
    return () => { clearTimeout(awaitWage) }
  }, [userInputs.zWage])

  useEffect(() => {
    if (readyToCalculate.boomerWage && readyToCalculate.boomerYear && readyToCalculate.zWage && readyToCalculate.zYear) {
      console.log('ready to claculate')
    }
  }, [readyToCalculate])

  function handleYear(e) {
    setUserInputs(prev => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  function clampYearsRange(year) {
    const maxYear = 2022
    const minYear = 1946

    if (year > maxYear) return maxYear
    if (year < minYear) return minYear
    return year
  }


  function handleWage(e) {
    setUserInputs(prev => {
      return { ...prev, [e.target.name]: limitToTwoDecimals(e.target.value) }
    })
  }

  function limitToTwoDecimals(wage) {
    return wage.toString().split(".").map((el, i) => i ? el.split("").slice(0, 2).join("") : el).join(".")

  }

  function normalizeWage(wage) {
    wage = parseFloat(wage)
    return isNaN(wage) ? (1).toFixed(2) : Math.abs(wage).toFixed(2)
  }

  function handleCalculations() {
    setShowCalculations(false)

    setUserInputs.boomerYear(prev => clampYearsRange(prev))
    setUserInputs.boomerWage(prev => prev == 0 ? 1 : Math.abs(prev))
    setUserInputs.zYear(prev => clampYearsRange(prev))
    setUserInputs.zWage(prev => prev == 0 ? 1 : Math.abs(prev))

    // const boomerCPI = dataCpiUs.years.filter(year => year.year == boomerYear)[0].cpi
    // const zCPI = dataCpiUs.years.filter(year => year.year == zYear)[0].cpi
    // const boomerSchoolCost = artsTuition.years.filter(year => year.year == boomerYear)[0].tuition
    // const zSchoolCost = artsTuition.years.filter(year => year.year == zYear)[0].tuition

    // function hoursPerWeek(totalHrs) {
    //   const NUM_WORK_WEEKS = 50
    //   return totalHrs / NUM_WORK_WEEKS
    // }
    // setCalculations({ boomerCPI, zCPI, boomerWage, zWage, boomerSchoolCost, zSchoolCost, hoursPerWeek })
    // setShowCalculations(true)
  }

  return <>
    <section className="user-inputs-wrapper">
      <div className="boomer-inputs">
        <h4>Boomer</h4>
        <div>
          <input
            id="boomerWage"
            name="boomerWage"
            value={userInputs.boomerWage}
            onChange={handleWage}
          />
          <label htmlFor="boomerWage">boomer wage</label>
        </div>

        <div>
          <input
            value={userInputs.boomerYear}
            name="boomerYear"
            min="1946"
            max="2022"
            type="number"
            onChange={handleYear}
          />
          <label htmlFor="boomerYear">boomer year</label>
        </div>

      </div>

      <div className="z-inputs">
        <h4>you</h4>
        <div>
          <input
            id="zWage"
            name="zWage"
            value={userInputs.zWage}
            onChange={handleWage}
          />
          <label htmlFor="zWage">z wage</label>
        </div>

        <div className={`extra-field ${userInputs.showExtraFields ? "extra-field--visible" : ""}`}>
          <input
            value={userInputs.zYear}
            name="zYear"
            min="1946"
            max="2022"
            type="number"
            onChange={handleYear}
          />
          <label htmlFor="zYear">z year</label>
        </div>
      </div>
    </section>

    <button onClick={() => handleCalculation()}>Calculate</button>
  </>
}
export default Form