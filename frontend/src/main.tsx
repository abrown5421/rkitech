import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store.ts';
import App from './App.tsx'
import './index.css';
import 'animate.css';
import { AppThemeProvider } from './theme/ThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </AppThemeProvider>
  </StrictMode>,
)
