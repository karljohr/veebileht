import ProfileButton from "./ProfileButton.jsx";
import {Link} from "react-router-dom";
import React from "react";

function ConfirmationPage({text = "Text"}) {
    return (
        <div
            style={{
                background: "#6F0013",
                width: "100%",
                height: "90vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "50px",
            }}>
            <h1 style={{color:"white"}}>{text}</h1>
            <Link to="../../">
                <ProfileButton
                    width="200px"
                    height="50px"
                    text="Mine avalehele"
                    shadow="0 0 0 0"
                    bcolor="black"
                    color="white"
                />
            </Link>
        </div>
        )
}

export default ConfirmationPage;