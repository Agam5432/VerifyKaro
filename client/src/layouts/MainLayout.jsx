import { Routes, Route } from "react-router-dom";

import Header from "../components/Header";

import VerifyPage from "../pages/VerifyPage";
import AboutPage from "../pages/AboutPage";
import HowItWorksPage from "../pages/HowItWorksPage";

import "../css/Layout.css";

function MainLayout() {
  return (
    <div className="page">
      <Header />

      <Routes>
        <Route path="/" element={<VerifyPage />} />

        <Route path="/about" element={<AboutPage />} />

        <Route
          path="/how-it-works"
          element={<HowItWorksPage />}
        />
      </Routes>
    </div>
  );
}

export default MainLayout;