import Home from "./pages/Home";
import NavigationBar from "./components/NavigationBar.jsx";
import React from "react";
import {Routes, Route, useLocation} from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";

function App() {
    const location = useLocation();
    const currentPath = location.pathname;

    // Navbar, kus keskel on Saagikastid, on nähtav igal pool peale Avalehe
    const shouldShowNavbar = currentPath !== '/';


    return (
        <>
            {shouldShowNavbar && (
                <NavigationBar/>
            )}

            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </>
    );
}

export default App;
