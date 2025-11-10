import React, {useState} from "react";
import {Link} from "react-router-dom";
import "../style/PasswordChange.css"
import ProfileButton from "../components/ProfileButton.jsx";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Kontrollin meiliaadressi...');

        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                setResetToken(data.token);
                setMessage('Kinnituslink loodi. Jätkamiseks vajuta nuppu allpool.');
                console.log('ARENDUSKOOD:', data.token);

            } else {
                setMessage(data.message || 'Viga meiliaadressi töötlemisel.');
                setResetToken(null);
            }
        } catch (error) {
            setMessage('Serveriga ühenduse viga.');
            setResetToken(null);
        }
    };


    return (
        <div className="page-container">
            <div className="content-box">
                <div className="title-section">
                    <h1 className="title">UNUSTASID SALASÕNA?</h1>
                    <hr className="title-separator"/>
                </div>

                <div className="description-text">
                    <p>{message || "Sisesta oma e-posti aadress. Saadame sulle lingi salasõna lähtestamiseks."}</p>
                </div>

                <form onSubmit={handleSubmit} className="data-form-section centered-form">
                    {!resetToken && (
                        <input
                            type="email"
                            placeholder="Sinu e-posti aadress"
                            className="data-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    )}

                    <div className="button-container">
                        {!resetToken && (
                            <ProfileButton
                                text="SAADA KINNITUSLINK"
                                type="submit"
                                width="220px"
                                height="40px"
                            />
                        )}

                        {resetToken && (
                            <Link to={`/reset-password?token=${resetToken}`} style={{ textDecoration: 'none' }}>
                                <ProfileButton
                                    text="JÄTKA PAROOLI VAHETAMISEGA"
                                    width="280px"
                                    height="40px"
                                />
                            </Link>
                        )}
                    </div>
                </form>

                <div className="footer-button-container">
                    <Link to="/login">
                        <button className="back-button">
                            &larr; Tagasi
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword