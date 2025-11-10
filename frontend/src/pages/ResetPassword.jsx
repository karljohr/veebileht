import React, {useState, useEffect} from "react";
import {Link, useSearchParams, useNavigate} from "react-router-dom";
import "../style/PasswordChange.css"
import ProfileButton from "../components/ProfileButton.jsx";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('Sisesta uus salasõna.');

    useEffect(() => {
        if (!token) {
            setMessage('Vigane või puuduv parooli lähtestamise link.');
        }
    }, [token]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Salasõna muutmine...');

        if (password !== confirmPassword) {
            setMessage('Salasõnad ei kattu!');
            return;
        }

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Parool edukalt muudetud! Palun logi sisse.');
                navigate('/login');
            } else {
                setMessage(data.message || 'Parooli muutmine ebaõnnestus. Kinnituslink võib olla aegunud.');
            }
        } catch (error) {
            setMessage('Serveri ühenduse viga parooli muutmisel.');
        }
    };

    return (
        <div className="page-container">
            <div className="content-box">
                <div className="title-section">
                    <h1 className="title">PAROOLI LÄHTESTAMINE</h1>
                    <hr className="title-separator"/>
                </div>

                <div className="description-text">
                    <p>{message}</p>
                </div>

                {token && (
                    <form onSubmit={handleSubmit} className="data-form-section centered-form">

                        <input
                            type="password"
                            placeholder="Sisesta uus parool"
                            className="data-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Kinnita uus parool"
                            className="data-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
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
                )}

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