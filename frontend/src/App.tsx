import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import CaregiverDashboard from "./pages/CaregiverDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientHome from "./pages/PatientHome";
import Games from "./pages/Games";
import MemoryAssistant from "./pages/MemoryAssistant";
import Family from "./pages/Family";
import Memories from "./pages/Memories";
import Reminders from "./pages/Reminders";
import Progress from "./pages/Progress";

import MatchingGame from "./games/MatchingGame";
import SequenceGame from "./games/SequenceGame";
import WhatsMissingGame from "./games/WhatsMissingGame";
import FindFamiliarGame from "./games/FindFamiliarGame";
import FamilyFacesGame from "./games/FamilyFacesGame";
import PhotoRecallGame from "./games/PhotoRecallGame";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/home"
          element={<PatientHome />}
        />

        <Route
          path="/caregiver"
          element={<CaregiverDashboard />}
        />

        <Route
          path="/games"
          element={<Games />}
        />

        <Route
          path="/games/matching"
          element={<MatchingGame />}
        />

        <Route
          path="/games/sequence"
          element={<SequenceGame />}
        />

        <Route
          path="/games/whats-missing"
          element={<WhatsMissingGame />}
        />

        <Route
          path="/games/find-familiar"
          element={<FindFamiliarGame />}
        />

        <Route
          path="/games/family-faces"
          element={<FamilyFacesGame />}
        />

        <Route
          path="/games/photo-recall"
          element={<PhotoRecallGame />}
        />

        <Route
          path="/assistant"
          element={<MemoryAssistant />}
        />

        <Route
          path="/family"
          element={<Family />}
        />

        <Route
          path="/memories"
          element={<Memories />}
        />

        <Route
          path="/reminders"
          element={<Reminders />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;