import React, {useState} from "react";
import {Link} from "react-router-dom";
import "../style/Payment.css"

function Payment() {
    const [paymentMethod, setPaymentMethod] = useState('card')

    const handlePayment = (e) => {
        e.preventDefault();

        if (paymentMethod === "card") {
            // Siia tuleb kood kaardimakse käivitamiseks
        } else if (paymentMethod === "paypal") {
            // Siia tuleb kood PayPali suunamiseks
        }
    };

    const CardFields = () => (
        <div className="card-info-section">
            <h4 className="card-info-title">Kaardi informatsioon</h4>
            <label htmlFor="cardNumber" className="input-label">Kaardi number</label>
            <input type="text" placeholder="1234 5678 9012 3456" className="input-field full-width"/>

            <div className="input-group">
                <div>
                    <label htmlFor="expiryDate" className="input-label">Aegumiskuupäev</label>
                    <input type="text" id="expiryDate" placeholder="MM / YY" className="input-field half-width"/>
                </div>
                <div>
                    <label htmlFor="cvc" className="input-label">CVC</label>
                    <input type="text" id="cvc" placeholder="123" className="input-field half-width"/>
                </div>
            </div>
        </div>
    );

    const PayPalInfo = () => (
        <p className="paypal-info">
            Maksa kohe nupp suunab teid turvalise makse sooritamiseks PayPali lehele.
        </p>
    );

    return (
        <div className="page-container">
            <div className="payment-frame">
                <h1>Maksmine</h1>
                <div className="payment-method-select">
                    <label htmlFor="method">Makseviis</label>
                    <select id="method" className="select-dropdown" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="card">💳 Pangakaart</option>
                        <option value="paypal">🅿️ PayPal</option>
                    </select>
                </div>

                {paymentMethod === "card" && <CardFields/>}
                {paymentMethod === "paypal" && <PayPalInfo/>}

                <button className="pay-button" onClick={handlePayment}>
                    <Link to="/payment/confirmation">
                        Maksa kohe
                    </Link>
                </button>

            </div>
        </div>
    );
}

export default Payment;
