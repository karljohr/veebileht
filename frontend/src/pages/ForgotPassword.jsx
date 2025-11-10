import React from "react";
import {Link} from "react-router-dom";
import "../style/PasswordChange.css"
import ProfileButton from "../components/ProfileButton.jsx";

function ForgotPassword() {
    return (
        <div className="page-container">
            <div className="content-box">
                <div className="title-section">
                    <h1 className="title">UNUSTASID SALASÕNA?</h1>
                    <hr className="title-separator"/>
                </div>

                <div className="description-text">
                    <p>Sisesta oma e-posti aadress. Saadame sulle lingi salasõna lähtestamiseks.</p>
                </div>

                <form className="data-form-section centered-form">
                    <input
                        type="email"
                        placeholder="Sinu e-posti aadress"
                        className="data-input"
                        required
                    />

                    <div className="button-container">
                        <ProfileButton
                            text="SAADA LÄHTESTAMISE LINK"
                            type="submit"
                            width="220px"
                            height="40px"
                            fontSize="14px"
                        />
                    </div>
                </form>

                <div className="footer-button-container">
                    <Link to="/login">
                        <button className="back-button">
                            &larr; Tagasi
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword