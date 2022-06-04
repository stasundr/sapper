import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

document.addEventListener('contextmenu', (event) => {
  event.preventDefault()
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
