/// <reference types="vite/client" />
import React, { useState } from 'react'
import CssBaseline  from "@mui/material/CssBaseline"
import { Button } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import useMediaQuery  from "@mui/material/useMediaQuery"
import reactLogo from './react.svg'
import viteLogo from './electron-vite.animate.svg'
//import './App.css'

function App() {

  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = createTheme({ palette: { mode: isDarkMode ? "dark" : 'light' } })
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button variant="contained" color="primary" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <p>
          編集 <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </ThemeProvider>
  )
}

export default App
