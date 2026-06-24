import { BrowserRouter, Routes, Route } from 'react-router'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ChatAppPage from './pages/ChatAppPage'
import { Toaster } from 'sonner'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { TooltipProvider } from './components/ui/tooltip'
import { useEffect } from 'react'
import { useAuthStore } from './stores/useAuthStore'
import { useSocketStore } from './stores/useSocketStore'




function App() {
  const {accessToken} = useAuthStore();
  const {connectSocket,disconnectSocket} = useSocketStore();

  useEffect(()=>{
    if(accessToken){
      connectSocket();
    }
    return () => {
      disconnectSocket();
    }
  },[accessToken])

  return (
    <TooltipProvider>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />

          <Route path="/signup" element={<SignUpPage />} />
          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatAppPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App
