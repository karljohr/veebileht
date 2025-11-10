import React from "react";
import {Link} from "react-router-dom";
import "../style/PasswordChange.css"
import ProfileButton from "../components/ProfileButton.jsx";

function ResetPassword() {
    return (
        <div className="page-container">
            <div className="content-box">
                <div className="title-section">
                    <h1 className="title">PAROOLI LÄHTESTAMINE</h1>
                    <hr className="title-separator"/>
                </div>

                <div className="description-text">
                    <p>Sisesta oma uus salasõna ja kinnita see.</p>
                </div>

                <form className="data-form-section centered-form">
                    <input
                        type="text"
                        placeholder="Sisesta uus parool"
                        className="data-input"
                        required
                        style={{maxWidth: "300px"}}
                    />

                    <input
                        type="text"
                        placeholder="Kinnita uus parool"
                        className="data-input"
                        required
                        style={{maxWidth: "300px"}}
                    />

                    <div className="button-container">
                        <ProfileButton
                            text="MUUDAN PAROOLI"
                            type="submit"
                            width="200px"
                            height="40px"
                        />
                    </div>
                </form>

                <div className="footer-button-container">
                    <Link to="/forgot-password">
                        <button className="back-button">
                            &larr; Tagasi
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword