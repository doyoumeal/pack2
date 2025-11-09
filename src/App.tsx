import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { useState } from "react";
import { AuthContext } from './contexts/authContext';
import { LanguageProvider } from './contexts/languageContext';
import { translations } from './lib/translations';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <LanguageProvider translations={translations}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
        </Routes>
      </LanguageProvider>
    </AuthContext.Provider>
  );
}
