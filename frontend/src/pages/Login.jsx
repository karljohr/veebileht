import React, {useState} from "react";
import {Link} from "react-router-dom";
import '../style/Register.css';


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const logIn = async (event) => {
        event.preventDefault()
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/login/confirmation";
        } else {
            alert(data.message || "Login failed");
        }

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

                    <form onSubmit={logIn}>

                        <div className="full-width-input">
                            <p className="input-label">Email</p>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Sisesta email"
                            />

                        </div>

                        <div className="full-width-input">
                            <p className="input-label">Parool</p>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Sisesta parool"
                            />
                        </div>
                        <Link to="/forgot-password"  className="secondary-text">
                            <p style={{color: "white"}}
                            >Unustasid salasõna?
                            </p>
                        </Link>

                        <button type="submit" className="submit-button">Logi sisse</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;