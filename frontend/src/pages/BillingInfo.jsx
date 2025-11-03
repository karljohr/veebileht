import React from "react";
import "../style/BillingInfo.css"
import ProfileButton from "../components/ProfileButton.jsx";

function BillingInfo() {

    return (
        <div className="page-container">
            <div className="content-box">
                <div className="title-section">
                    <h1 className="title">ARVELDUSINFO</h1>
                    <hr className="title-separator"/>
                </div>

                <div className="input-group">
                    <p className="label">Kaardi number</p>
                    <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="data-input"
                        readOnly
                    />
                </div>

                <div className="card-details-group">
                    <div className="input-group card-detail-item">
                        <p className="label">Kehtivus</p>
                        <input
                            type="text"
                            placeholder="MM/YY"
                            className="data-input"
                            style={{maxWidth: '100px'}}
                            readOnly
                        />
                    </div>

                    <div className="input-group card-detail-item">
                        <p className="label">CVC</p>
                        <input
                            type="text"
                            placeholder="123"
                            className="data-input"
                            style={{maxWidth: '100px'}}
                            readOnly
                        />
                    </div>
                </div>

                <div className="input-group">
                    <p className="label">Kaardi omanik</p>
                    <input
                        type="text"
                        placeholder="Eesnimi Perekonnanimi"
                        className="data-input"
                        readOnly
                    />
                </div>

                <div className="button-container">
                    <ProfileButton
                        text="Lisa arveldusmeetod"
                        width="220px"
                        height="40px"
                        fontSize="100%"
                        bcolor="rgb(255, 255, 255)"
                        color="black"
                        shadow="5px 5px 10px lightgray"
                    />
                </div>
            </div>
        </div>
    );
}

export default BillingInfo