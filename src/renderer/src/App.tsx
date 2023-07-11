/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react'
import CssBaseline  from "@mui/material/CssBaseline"
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import useMediaQuery  from "@mui/material/useMediaQuery"

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import CloseIcon from "@mui/icons-material/Close";
import MaximizeIcon from "@mui/icons-material/HomeMax";
import MinimizeIcon from "@mui/icons-material/Minimize";

import { createWorker } from "tesseract.js"

import reactLogo from './react.svg'
import viteLogo from './electron-vite.animate.svg'
import ocrImage from './eng_bw.png'

import '../../preload/index.d';
//import './App.css'

let ocrWorker: Tesseract.Worker;
const ocrWorkerInit = () => {
  createWorker().then( async (wk) => {
    ocrWorker = wk;
    await ocrWorker.loadLanguage('eng');
    await ocrWorker.initialize('eng');
  })
}
ocrWorkerInit()

function App() {

  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = createTheme({ palette: { mode: isDarkMode ? "dark" : 'light' } })
  const [count, setCount] = useState(0)
  const [ocrResults, setOcrResult] = useState([]);

  const windowClose = () => {
    window.electron.ipcRenderer.send('window-close')
  }

  const windowMaxmize = () => {
    window.electron.ipcRenderer.send('window-maximize');
  }

  const windowMiniMize = () => {
    window.electron.ipcRenderer.send('window-minize');
  }

  const ocr = async () => {
    const { data: { text } } = await ocrWorker.recognize(ocrImage);
    console.log(text);
    await ocrWorker.terminate();
    ocrWorkerInit();

    const newOcrResult = ( <p>{ text }</p> );
    setOcrResult([...ocrResults, newOcrResult]);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ height: '25.6px' }}>
        <Toolbar sx={{ height: '25.6px', minHeight: 'unset' }} variant="dense" disableGutters>
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            gamers-OCR
          </Typography>
          <IconButton onClick={ windowMiniMize } aria-label='最小化' sx={{ '-webkit-app-region': 'no-drag', height: '100%' }}>
            <MinimizeIcon />
          </IconButton>
          <IconButton onClick={ windowMaxmize } aria-label='最大化' sx={{ '-webkit-app-region': 'no-drag', height: '100%' }}>
            <MaximizeIcon />
          </IconButton>
          <IconButton sx={{
            height: '100%',
            borderRadius: 'unset',
            '-webkit-app-region': 'no-drag',
            '&:hover': { backgroundColor: 'red' }
          }} aria-label='アプリ終了' onClick={ windowClose }>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
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
        <Button variant="contained" color="secondary" onClick={ ocr }>
          OCR
        </Button>
        <Button variant="contained" color="secondary" onClick={ windowClose }>
          閉じる
        </Button>
        <p>
          編集 <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      >
        <TreeItem nodeId="1" label="Applications">
          <TreeItem nodeId="2" label="Calendar" />
        </TreeItem>
        <TreeItem nodeId="5" label="Documents">
          <TreeItem nodeId="10" label="OSS" />
          <TreeItem nodeId="6" label="MUI">
            <TreeItem nodeId="8" label="index.js" />
          </TreeItem>
        </TreeItem>
      </TreeView>
      { ocrResults }
    </ThemeProvider>
  )
}

export default App
