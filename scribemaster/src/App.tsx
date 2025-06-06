import { Route, Routes, Navigate } from "react-router"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import "./lib/axiosConfig";
import CampaignCreationPage from "./pages/CampaignCreationPage";
import CampaignReaderPage from "./pages/CampaignReaderPage";
import CampaignExplorer from "./components/CampaignExplorer";


function App() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-svh">   
      <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/campaigncreation" element={<CampaignCreationPage />} />
            <Route path="/campaignreader" element={<CampaignReaderPage />} />
            <Route path="/campaignexplorer" element={<CampaignExplorer campaignId="1" />} />



            <Route
              path="/home"
              element={
                //<ProtectedRoute>    
                    <HomePage />
                //</ProtectedRoute>
              }
            />
      </Routes>
    </main>
    </>
  )
}

export default App
