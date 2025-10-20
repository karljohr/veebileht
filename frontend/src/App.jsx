import Home from "./pages/Home";
import NavigationBar from "./components/NavigationBar.jsx";
import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Menu from "./components/Menu.jsx";

function App() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Navbar, kus keskel on Saagikastid, on nähtav igal pool peale Avalehe
  const shouldShowNavbar = currentPath !== "/";

  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <>
      <div className="App">
        {shouldShowNavbar && (
          <NavigationBar
            navbarOpen={navbarOpen}
            setNavbarOpen={setNavbarOpen}
          />
        )}
        <Menu navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
      </div>
      <Routes>
        <Route path="/" element={<Home setNavbarOpen={setNavbarOpen} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
