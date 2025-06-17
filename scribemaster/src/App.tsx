import { Route, Routes, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import "./lib/axiosConfig";
import CampaignCreationPage from "./pages/CampaignCreationPage";
import CampaignReaderPage from "./pages/CampaignReaderPage";
import ProtectedRoute from "./components/UtilityComponents/ProtectedRoute";
import CampaignExplorerPage from "./pages/CampaignExplorerPage";
import CharacterCreationPage from "./pages/CharacterCreationPage";

function App() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-svh">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route
              path="/campaigncreation"
              element={<CampaignCreationPage />}
            />
            <Route path="/campaignreader" element={<CampaignReaderPage />} />
            <Route
              path="/campaign/:campaignId"
              element={<CampaignExplorerPage />}
            />
            <Route
              path="/charactercreation"
              element={<CharacterCreationPage />}
            />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
