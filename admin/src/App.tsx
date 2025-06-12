import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App