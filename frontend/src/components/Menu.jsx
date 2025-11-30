import React, { useEffect, useState } from "react";
import "../style/Menu.css";
import { Link } from "react-router-dom";

const Menu = ({ navbarOpen, setNavbarOpen }) => {
  const token = localStorage.getItem("token");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }

    fetch("http://localhost:5000/admin", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store",
      },
    })
      .then((res) => res.json())
      .then((data) => setIsAdmin(data))
      .catch((err) => console.log(err));
  }, []);

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
              to="/inventory"
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
              to="/shopping-cart"
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
          {isAdmin && (
            <li className="menu-li">
              <Link
                to="/admin"
                className="menu-button"
                onClick={() => {
                  setNavbarOpen(false);
                }}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};
export default Menu;
