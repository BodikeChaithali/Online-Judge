import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Problems from "./pages/Problems";
import Profile from "./pages/Profile";
import ProblemDetails from "./pages/ProblemDetails";
import UpdateProfile from "./pages/UpdateProfile";
import Compiler from "./pages/Compiler";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/problems/:id" element={<ProblemDetails />} />
      <Route path="/compiler" element={<Compiler />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/update-profile"
        element={
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
