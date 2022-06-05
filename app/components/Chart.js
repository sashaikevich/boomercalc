import React from 'react'
import { Bar } from 'react-chartjs-2'
import uniCost from '../data/upenn-tuition'
import { Chart } from 'chart.js/auto'

export function UniPriceChart({ boomerYear, zYear }) {

  const chartData = {
    labels: uniCost.years.filter(yr => yr.year >= boomerYear && yr.year <= zYear).map(yr => yr.year),
    datasets: [{
      label: "UPENN Arts & Science Tuition",
      data: uniCost.years.filter(yr => yr.year >= boomerYear && yr.year <= zYear).map(yr => yr.tuition),
      backgroundColor: "#fff",
      hoverBackgroundColor: "#000"
    }
    ]
  }
  const chartOptions = {
    responsive: true,
    // maintainAspectRatio: false,    
    legend: {
      display: false
    },
  }
  return (
    <Bar data={chartData} options={chartOptions} width={100} height={50} />
  )
}