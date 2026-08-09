import 'react-toastify/dist/ReactToastify.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './store/Authentication.jsx'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ErrorBoundary>
 <App />
      </ErrorBoundary>
    </AuthProvider>
  </StrictMode>,
)
