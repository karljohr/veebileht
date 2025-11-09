import React, {useEffect, useState} from "react";
import "../style/UserData.css"
import ProfileButton from "../components/ProfileButton.jsx";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";

function UserData() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState("");
    const token = localStorage.getItem("token");
    let navigate = useNavigate();

    useEffect(() => {
        if (!token) return navigate("/login")

        fetch("http://localhost:5000/api/user", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-store"
            }
        })
            .then(res => res.json())
            .then(data => setUserId(data))
            .catch(err => console.error(err));
    }, [token]);

    const saveData = async (event) => {
        event.preventDefault();
        const response = await fetch("http://localhost:5000/changeData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-cache",
            },
            body: JSON.stringify({firstName, lastName, email, userId}),
        })

        if (response.ok) {
            navigate("/profile");
        }
    };


    return (
        <div className="page-container">
            <div className="content-box">
                <div className="title-section">
                    <h1 className="title">Kasutaja andmed</h1>
                    <hr className="title-separator"/>
                </div>

                <form onSubmit={saveData}>

                    <div className="data-form-section">
                        <div className="input-group">
                            <p className="label">Eesnimi</p>
                            <input
                                type="text"
                                className="data-input"
                                placeholder="Eesnimi"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <p className="label">Perekonnanimi</p>
                            <input
                                type="text"
                                className="data-input"
                                placeholder="Perekonnanimi"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <p className="label">E-mail:</p>
                            <input
                                type="text"
                                className="data-input"
                                placeholder="meiliaadress@meil.ee"
                                onChange={(e) => setEmail(e.target.value)}
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

                                type="submit"
                            />
                        </div>
                    </div>

                </form>

                    <div className="footer-button-container">
                        <Link to="/profile">
                            <button className="back-button">
                                &larr; Tagasi
                            </button>
                        </Link>
                    </div>
            </div>
        </div>
    )
}

export default UserData
