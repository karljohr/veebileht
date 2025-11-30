import React, {useState} from "react";
import "../style/PasswordChange.css"
import {Link} from "react-router-dom";
import ProfileButton from "../components/ProfileButton.jsx";

const API_URL = "http://localhost:5000";

function PasswordChange() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChangePassword = async () => {
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Uus salasõna ja korduv salasõna ei kattu.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Uus salasõna peab olema vähemalt 6 tähemärki pikk.");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/api/profile/password_change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(data.error || "Salasõna muutmine ebaõnnestus.");
            }

        } catch (err) {
            console.error("Salasõna muutmisel tekkis viga:", err);
            setError("Võrguviga või serveriga ühenduse probleem.");
        }
    };

    return (
        <div className="page-container">
            <div className="content-box">
                <div className="title-section">
                    <h1 className="title">SALASÕNA</h1>
                    <hr className="title-separator"/>
                </div>

                <div className="data-form-section centered-form">
                    {message && <p className="success-message" style={{color: 'lime', fontWeight: 'bold'}}>{message}</p>}
                    {error && <p className="error-message" style={{color: 'red', fontWeight: 'bold'}}>{error}</p>}

                    <div className="data-form-section">
                        <input
                            type="password"
                            placeholder="Vana salasõna"
                            className="data-input"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>

                    <div className="data-form-section">
                        <input
                            type="password"
                            placeholder="Uus salasõna"
                            className="data-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="data-form-section">
                        <input
                            type="password"
                            placeholder="Korda uut salasõna"
                            className="data-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="button-container">
                        <ProfileButton
                            text="Muuda salasõna"
                            width="120px"
                            height="40px"
                            fontSize="75%"
                            onClick={handleChangePassword}
                        />
                    </div>

                    <div className="footer-button-container">
                        <Link to="/profile">
                            <button className="back-button">
                                &larr; Tagasi
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PasswordChange