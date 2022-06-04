import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.scss'

// components 
import Menu from './components/Menu'
import Form from './components/Form'
import Footer from './components/Footer'


function CalcInterface() {
  return (
    <>
      <Menu />
      <Form />
      <Footer />
    </>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<CalcInterface />)