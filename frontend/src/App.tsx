import { Dashboard } from "./pages/Dashboard";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ViewBrain } from "./pages/ViewBrain";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./pages/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: "#4ade80",
              color: "white",
            },
          },
          error: {
            style: {
              background: "#f87171",
              color: "white",
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/share/:shareLink" element={<ViewBrain />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
