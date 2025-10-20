import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {

  const handleDummySubmit = (event) => {
    event.preventDefault();
    console.log('Registreerimise vorm esitati (andmeid ei salvestatud).');
  };

  return (
    <>
      <div className="register-container">
        <div className="form-box">

          <h2>Loo kasutaja</h2>

          <p className="secondary-text">
            Kui sul juba on kasutaja, siis
            <Link to="/login">
              logi sisse
            </Link>
          </p>

          <form onSubmit={handleDummySubmit}>

            <div className="input-group">
              <div className="input-field-wrapper">
                <p className="input-label">Eesnimi</p>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Sisesta eesnimi"
                />
              </div>
              <div className="input-field-wrapper">
                <p className="input-label">Perekonnanimi</p>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Sisesta perekonnanimi"
                />
              </div>
            </div>

            <div className="full-width-input">
              <p className="input-label">Email</p>
              <input
                type="email"
                required
                className="input-field"
                placeholder="Sisesta email"
              />
            </div>

            <div className="full-width-input">
              <p className="input-label">Parool</p>
              <input
                type="password"
                required
                className="input-field"
                placeholder="Sisesta parool"
              />
            </div>

            <button type="submit" className="submit-button">
              Loo kasutaja
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
