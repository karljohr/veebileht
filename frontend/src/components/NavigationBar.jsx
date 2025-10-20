import React from "react";
import "../style/NavigationBar.css";
import Logo from "./Logo";
import MenuButtonWhite from "./MenuButtonWhite.jsx";
import {Link} from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Logo />
      </Link>
      <div className="navbar-center">
        <span className="navbar-text">SaagiSalong</span>
      </div>
      <div className="navbar-right">
        <button className="menubutton">
          <MenuButtonWhite />
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
