import Home from "./pages/Home";
import NavigationBar from "./components/NavigationBar.jsx";
import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Menu from "./components/Menu.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Catalogue from "./pages/Catalogue.jsx";
import LoginConfirmation from "./pages/LoginConfirmation.jsx"
import RegisterConfirmation from "./pages/RegisterConfirmation.jsx";
import DailyProduct from "./pages/DailyProduct.jsx";
import Payment from "./pages/Payment.jsx";
import PaymentConfirmation from "./pages/PaymentConfirmation.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserData from "./pages/UserData.jsx";
import PasswordChange from "./pages/PasswordChange.jsx";
import BillingInfo from "./pages/BillingInfo.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

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
        <Route path="/catalogue" element={<Catalogue />} />
        <Route
            path="/login"
            element={
            <ProtectedRoute url="/login/confirmation" reverse={true}>
                <Login/>
            </ProtectedRoute>
            }
        />
          <Route
              path="/profile"
              element={
              <ProtectedRoute url="/login">
                  <Profile/>
              </ProtectedRoute>
              }
          />
        <Route path="/login/confirmation" element={<LoginConfirmation/>}/>
          <Route path="/register/confirmation" element={<RegisterConfirmation/>}/>
        <Route path="/daily-product" element={<DailyProduct/>}/>
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/payment/confirmation" element={<PaymentConfirmation/>}/>
        <Route path="/userdata" element={<UserData/>}/>
        <Route path="/password-change" element={<PasswordChange/>}/>
        <Route path="/billing-info" element={<BillingInfo/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
      </Routes>
    </>
  );
}

export default App;
