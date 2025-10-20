import React from "react";
import {Link} from "react-router-dom";
import './Register.css';

function Login() {

    const handleDummyEvent = (event) => {
        event.preventDefault()
        console.log("Sisse logimise andmeid ei salvestatud!")
    };

    return (
        <>
            <div className="register-container">
                <div className="form-box">
                    <h2>Logi sisse</h2>

                    <p className="secondary-text">
                        Kui sul kasutajat veel ei ole, siis
                        <Link to="/register">
                            Loo kasutaja
                        </Link>
                    </p>

                    <form onSubmit={handleDummyEvent}>

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
                            Logi sisse
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;