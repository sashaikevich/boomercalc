import React from "react";
function Results({boomerCPI, zCPI, boomerWage, zWage}) {

  return (
    <section className="results-wrapper">
      {/* <p>{props.calcResults.boomerCPI}</p>
      <p>{JSON.stringify(props.calcResults.zCPI)}</p>
      {((100 * (props.zCPI) / props.boomerCPI) * props.boomerWage).toFixed(2)} */}
      results {boomerCPI/zCPI * boomerWage}
    </section>
  )
}

export default Results