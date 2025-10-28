import React from "react";
import "../style/Menu.css";
import { Link } from "react-router-dom";

const Menu = ({ navbarOpen, setNavbarOpen }) => {
  return (
    <div
      className={`menu ${navbarOpen ? "open" : "closed"}`}
      onClick={() => setNavbarOpen(false)}
    >
      <nav className="menu-nav" onClick={(e) => e.stopPropagation()}>
        <ul className="menu-ul">
          <div className="title">
            <p>Saagisalong</p>
          </div>
          <li className="menu-li">
            <Link
              to="/"
              className="menu-button"
              onClick={() => {
                setNavbarOpen(false);
              }}
            >
              Avaleht
            </Link>
          </li>
          <li className="menu-li">
            <Link
              to="/"
              className="menu-button"
              onClick={() => {
                setNavbarOpen(false);
              }}
            >
              Minu saagikastid
            </Link>
          </li>
          <li className="menu-li">
            <Link
              to="/"
              className="menu-button"
              onClick={() => {
                setNavbarOpen(false);
              }}
            >
              Ostukorv
            </Link>
          </li>
          <li className="menu-li">
            <Link
              to="/profile"
              className="menu-button"
              onClick={() => {
                setNavbarOpen(false);
              }}
            >
              Profiil
            </Link>
          </li>
          <li className="menu-li">
            <Link
              to="/login"
              className="menu-button"
              onClick={() => {
                setNavbarOpen(false);
              }}
            >
              Logi Sisse
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Menu;
