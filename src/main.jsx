import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn,SignedOut,RedirectToSignIn } from '@clerk/clerk-react'
import { UserButton,UserProfile,SignIn,SignUp } from '@clerk/clerk-react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
  path="/dashboard"
  element={
    <>
      <SignedIn>
        {/* Sirf avatar button */}
        <UserButton />

        {/* Dashboard content */}
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <SignIn />
        <SignUp />
        <RedirectToSignIn />
      </SignedOut>
    </>
  }
/>
      </Routes>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
