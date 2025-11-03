import React from "react";
import "../style/PasswordChange.css"
import {Link} from "react-router-dom";
import ProfileButton from "../components/ProfileButton.jsx";

function PasswordChange() {

    return (
        <div className="page-container">
            <div className="content-box">
                <div className="title-section">
                    <h1 className="title">SALASÕNA</h1>
                    <hr className="title-separator"/>
                </div>

                <div className="data-form-section centered-form">
                    <div className="data-form-section">
                        <input
                            type="text"
                            value="Vana salasõna"
                            className="data-input"
                            readOnly
                        />
                    </div>

                    <div className="data-form-section">
                        <input
                            type="text"
                            value="Uus salasõna"
                            className="data-input"
                            readOnly
                        />
                    </div>

                    <div className="button-container">
                        <ProfileButton
                            text="Muuda salasõna"
                            width="120px"
                            height="40px"
                            fontSize="75%"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PasswordChange