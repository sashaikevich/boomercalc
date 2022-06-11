import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.scss'

// components 
import Form from './components/Form'
import Footer from './components/Footer'
import Header from './components/Header'

function CalcInterface() {
  return (
    <>
      <Header />
      <Form />
      {/* <Footer /> */}
    </>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<CalcInterface />)