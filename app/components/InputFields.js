import React from 'react'
// import input from 'react-currency-input-field'


export function BoomerWageInput(props) {
  return <div>
    <label htmlFor="boomerWage">boomer wage</label>
    <input
      id="boomerWage"
      name="boomerWage"
      prefix="$"
      allowNegativeValue="false"
      value={props.boomerWage}
      decimalsLimit={2}
      onValueChange={(value, name) => props.setBoomerWage(value)}
    />
  </div>
}

export function BoomerYearInput(props) {
  return <div>
    <label htmlFor="boomerYear">boomer year</label>
    <input
      value={props.boomerYear}
      name="boomerYear"
      min="1946"
      max="2022"
      onChange={(e) => props.setBoomerYear(e.target.value)}
      type="number" />
  </div>
}

export function ZWageInput(props) {
  return <div>
    <label htmlFor="zWage">z wage</label>
    <input
      id="zWage"
      name="zWage"
      prefix="$"
      allowNegativeValue="false"
      value={props.zWage}
      decimalsLimit={2}
      onValueChange={(value, name) => props.setZWage(value)}
    />
  </div>
}

export function ZYearInput(props) {
  return <div className={`extra-field ${props.showExtraFields ? "extra-field--visible" : ""}`}>
    <label htmlFor="zYear">z year</label>
    <input
      value={props.zYear}
      name="zYear"
      min="1946"
      max="2022"
      onChange={(e) => props.setZYear(e.target.value)}
      type="number" />
  </div>
}