import React from "react";
import "./Menu.css";

const Menu = ({ navbarOpen, setNavbarOpen }) => {
  return (
    <div
      className={`menu ${navbarOpen ? "open" : "closed"}`}
      onClick={() => setNavbarOpen(false)}
    >
      <nav className="menu-nav" onClick={(e) => e.stopPropagation()}>
        <ul className="menu-ul">
          <div className="title">
            <u>Saagisalong</u>
          </div>
          <li className="menu-li">
            <a
              href="/"
              className="menu-button"
              onClick={() => {
                setNavbarOpen(false);
              }}
            >
              Avaleht
            </a>
          </li>
          <li className="menu-li">
            <a
              href="/"
              className="menu-button"
              onClick={() => {
                setNavbarOpen(false);
              }}
            >
              Minu Saagikastid
            </a>
          </li>
          <li className="menu-li">
            <a
              href="/"
              className="menu-button"
              onClick={() => {
                setNavbarOpen(false);
              }}
            >
              Ostukorv
            </a>
          </li>
          <li className="menu-li">
            <a
              href="/"
              className="menu-button"
              onClick={() => {
                setNavbarOpen(false);
              }}
            >
              Profiil
            </a>
          </li>
          <li className="menu-li">
            <a
              href="/register"
              className="menu-button"
              onClick={() => {
                setNavbarOpen(false);
              }}
            >
              Logi Sisse
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Menu;
