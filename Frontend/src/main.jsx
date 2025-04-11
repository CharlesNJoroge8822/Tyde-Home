import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // ✅ Import BrowserRouter
import { CrudProvider } from './context/ProductProfile.jsx'
import { UserProvider } from './context/usercontext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <BrowserRouter> */}
    {/* <OrderContext> */}
      <AuthProvider>
        <UserProvider>
          <CrudProvider>
            <App /> {/* ✅ App should NOT have another BrowserRouter inside */}
          </CrudProvider>
        </UserProvider>
      </AuthProvider>
      {/* </OrderContext> */}
    {/* </BrowserRouter> */}
  </StrictMode>
)
