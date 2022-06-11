import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import uniCost from '../data/upenn-tuition'
import rent from '../data/historic-rent'
import { Chart } from 'chart.js/auto'

export function UniPriceChart({ boomerYear, zYear }) {

  const chartData = {
    labels: uniCost.years.filter(yr => yr.year >= boomerYear && yr.year <= zYear).map(yr => yr.year),
    datasets: [{
      label: "UPENN Arts & Science Tuition",
      data: uniCost.years.filter(yr => yr.year >= boomerYear && yr.year <= zYear).map(yr => yr.tuition),
      // backgroundColor: "#fff",
      // hoverBackgroundColor: "#000"
      backgroundColor: "#fff",
      hoverBackgroundColor: "#000",
    }
    ]
  }
  const chartOptions = {
    responsive: true,
    // maintainAspectRatio: false,    
    barPercentage: 0.95,
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: "#000"
        }
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }
  return (
    <Bar data={chartData} options={chartOptions} width={100} height={50} />
  )
}

export function WaybackComparison({ boomerWage, zWageWayback }) {
  const chartData = {
    labels: ["a", "b"],
    datasets: [{
      data: [zWageWayback, boomerWage],
      backgroundColor: ["#fff", "#000"],
      hoverBackgroundColor: ["#fff", "#000"],
    }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.8,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  }

  return (
    <Bar data={chartData} options={chartOptions} />
  )
}

export function RentLine({ boomerYear, zYear }) {

  function sortRentAscending() {

    function condition(year) {
      return (
        year >= Math.floor(boomerYear / 10) * 10 &&
        year % 10 == 0 &&
        year <= Math.ceil(zYear / 10) * 10 &&
        year < 2022 &&
        year >= 1940
      )
    }

    return rent.years.filter(yr => condition(yr.year)).sort((yr1, yr2) => yr1.year - yr2.year)
  }
  sortRentAscending();

  const chartData = {
    labels: sortRentAscending().map(yr => yr.year),

    datasets: [{
      label: "Median rent",
      data: sortRentAscending().map(yr => yr.rent),
      fill: false,
      borderColor: "#000",
      pointBackgroundColor: "#000",
      pointHoverBackgroundColor: "#fff",
      pointRadius: 4,
      pointHoverRadius: 8,
      pointHitRadius: 12
    }
    ]
  }

  const chartOptions = {
    responsive: true,
    // maintainAspectRatio: false,
    barPercentage: 0.8,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        // enabled: false
      }
    }
  }

  return (
    <Line data={chartData} options={chartOptions} width={100} height={45} />
  )
}