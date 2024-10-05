import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter';
import {CssBaseline, CssVarsProvider} from "@mui/joy";
import App from './App.tsx'
import './index.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <CssVarsProvider>
          {/* must be used under CssVarsProvider */}
          <CssBaseline />
          <App />
      </CssVarsProvider>
  </StrictMode>,
)
