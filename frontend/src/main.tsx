import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { BrowserRouter } from 'react-router-dom'
import { ThemeWrapper } from './features/theme/ThemeWrapper.tsx'
import './index.css';
import 'animate.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeWrapper>
          <CssBaseline />
          <App />
        </ThemeWrapper>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)