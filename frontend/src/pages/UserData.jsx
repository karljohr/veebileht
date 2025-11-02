import React from "react";
import "../style/ProfileSettings.css"
import ProfileButton from "../components/ProfileButton.jsx";

function UserData() {
    return (
        <div className="page-container">
            <div className="content-box">
                <div className="title-section">
                    <h1 className="title">Kasutaja andmed</h1>
                    <hr className="title-separator"/>
                </div>

                <div className="data-form-section">
                    <div className="input-group">
                        <p className="label">Eesnimi</p>
                        <input
                            type="text"
                            className="data-input"
                            value="Eesnimi"
                            readOnly
                        />
                    </div>

                    <div className="input-group">
                        <p className="label">Perekonnanimi</p>
                        <input
                            type="text"
                            className="data-input"
                            value="Perekonnanimi"
                            readOnly
                        />
                    </div>

                    <div className="input-group">
                        <p className="label">E-mail:</p>
                        <input
                            type="text"
                            className="data-input"
                            value="meiliaadress@meil.ee"
                            readOnly
                        />
                    </div>

                    <div className="button-container">
                        <ProfileButton
                            text="Salvesta"
                            width="150px"
                            height="40px"
                            fontSize="100%"
                            color="black"
                            shadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default UserData