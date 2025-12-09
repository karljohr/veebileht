import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Payment.css";
import { clearCartExternal } from "./ShoppingCart.jsx";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("chips");
  const totalMax = Number(localStorage.getItem("totalMax"));
  const totalMin = Number(localStorage.getItem("totalMin"));
  const wallet = Number(localStorage.getItem("wallet"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const lootboxPurchase = async (amount, reason) => {
    const res = await fetch(`http://localhost:5000/api/lootbox-purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, reason }),
    });
    if (!res.ok) throw new Error("Purchase failed");
    return await res.json();
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      if (paymentMethod === "chips") {
        if (wallet < totalMax) return;
        await lootboxPurchase(
          Math.floor(Math.random() * (totalMax - totalMin + 1)) + totalMin,
          "Lootbox purchase",
        );
        navigate("/payment/confirmation");
        await clearCartExternal();
      } else if (paymentMethod === "card") {
        navigate("/payment/confirmation");
      } else if (paymentMethod === "paypal") {
        navigate("/payment/confirmation");
      }
    } catch (e) {
      console.error(e);
      alert("Makse ebaõnnestus");
    }
  };

  const CardFields = () => (
    <div className="card-info-section">
      <h4 className="card-info-title">Kaardi informatsioon</h4>
      <label htmlFor="cardNumber" className="input-label">
        Kaardi number
      </label>
      <input
        type="text"
        placeholder="1234 5678 9012 3456"
        className="input-field full-width"
      />

      <div className="input-group">
        <div>
          <label htmlFor="expiryDate" className="input-label">
            Aegumiskuupäev
          </label>
          <input
            type="text"
            id="expiryDate"
            placeholder="MM / YY"
            className="input-field half-width"
          />
        </div>
        <div>
          <label htmlFor="cvc" className="input-label">
            CVC
          </label>
          <input
            type="text"
            id="cvc"
            placeholder="123"
            className="input-field half-width"
          />
        </div>
      </div>
    </div>
  );

  const PayPalInfo = () => (
    <p className="paypal-info">
      Maksa kohe nupp suunab teid turvalise makse sooritamiseks PayPali lehele.
    </p>
  );

  const ChipsInfo = () => {
    if (wallet < totalMax) {
      return <p>Teil pole ostu sooritamiseks piisavalt žetoone!</p>;
    } else {
      return (
        <div>
          <p>Kindel, et soovite ostu sooritada?</p>
          <p>Teil on hetkel {wallet} žetooni.</p>
        </div>
      );
    }
  };

  return (
    <div className="page-container">
      <div className="payment-frame">
        <h1>Maksmine</h1>
        <div className="payment-method-select">
          <label htmlFor="method">Makseviis</label>
          <select
            id="method"
            className="select-dropdown"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="chips">❂ Žetoonid</option>
            <option value="card">💳 Pangakaart</option>
            <option value="paypal">🅿️ PayPal</option>
          </select>
        </div>

        {paymentMethod === "chips" && (
          <>
            <ChipsInfo />
            <button
              className="pay-button"
              onClick={handlePayment}
              disabled={wallet < totalMax}
            >
              Maksa kohe
            </button>
          </>
        )}
        {paymentMethod === "card" && (
          <>
            <CardFields />
            <button className="pay-button" onClick={handlePayment}>
              Maksa kohe
            </button>
          </>
        )}
        {paymentMethod === "paypal" && (
          <>
            <PayPalInfo />
            <button className="pay-button" onClick={handlePayment}>
              Maksa kohe
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Payment;
