import ProfileButton from "./ProfileButton.jsx";
import {Link} from "react-router-dom";
import React from "react";

function ConfirmationPage({text = "Text", bgColor = "#6F0013", textColor = "white", showImage = false}) {
    return (
        <div
            style={{
                background: bgColor,
                width: "100%",
                height: "90vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "100px",
            }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "30px",
                    padding: "40px",
            }}>
                {showImage &&
                    <div
                        style={{
                            borderRadius: "50%",
                            height: "75px",
                            width: "75px",
                            boxShadow: "0 0 45px 10px #5edd60",
                            backgroundColor: "#5edd60",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <img
                            src="/confirm.png"
                            alt="Confirmed"
                        />
                    </div>
                }
                <h1 style={{color:textColor}}>{text}</h1>
            </div>
            <Link to="../../">
                <ProfileButton
                    width="200px"
                    height="50px"
                    text="Mine avalehele"
                    shadow="0 0 0 0"
                    bcolor="rgb(0, 0 ,0)"
                    color="white"
                />
            </Link>
        </div>
        )
}

export default ConfirmationPage;