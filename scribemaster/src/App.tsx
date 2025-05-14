import { Route, Routes, Navigate } from "react-router"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"


function App() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-svh">   
      <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/home" element={<HomePage />} />
      </Routes>
    </main>
    </>
  )
}

export default App
