import "../style/CoinFlipPage.css";
import InfoOverlay from "../components/InfoOverlay.jsx";
import { useState } from "react";
import CoinFlip from "../components/CoinFlip.jsx";

function CoinFlipPage() {
  const token = localStorage.getItem("token");
  const wallet = Number(localStorage.getItem("wallet"));
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId(openId === id ? null : id);
  const BETS = [5, 10, 50, 100];
  const [amount, setAmount] = useState("");

  const win = async (amount, reason) => {
    const res = await fetch(`http://localhost:5000/api/wallet/increase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, reason }),
    });
    if (!res.ok) throw new Error("Coin Flip failed");
    return await res.json();
  };

  const lose = async (amount) => {
    const res = await fetch(`http://localhost:5000/api/wallet/deduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) throw new Error("Coin Flip failed");
    return await res.json();
  };

  const handleFlipResult = async (outcome) => {
    if (outcome === "tails" && amount) {
      await win(amount, "Coin flip win");
    }
    if (outcome === "heads" && amount) {
      await lose(amount, "Coin flip loss");
    }
  };

  return (
    <div className="coinflip-content">
      <div className="coinflip-info">
        <button onClick={() => toggle(6)} className="info-button">
          Kuidas mündivise töötab?
        </button>
      </div>
      <InfoOverlay
        text="Mündivise on lihtne viis žetoone juurde teenida. Valige oma
        soovitud panus ning kui võidate, saate tagasi kahekordse panuse. Kui
        aga kaotate, siis kaotate oma panuse. Võiduvõimalus on 25%. Kui
        teil saavad žetoonid otsa ning soovite juurde, siis kontakteeruda
        haldajatega, ehk saate kokkuleppe sõlmida. Mündiviske sooritamiseks
        peate olema sissee logitud"
        isOpen={openId === 6}
        onClose={() => toggle(null)}
      />
      <div className="coinflip-box">
        <div className="bet-select">
          <label htmlFor="bet-question">Palju soovite panustada?</label>
          <select
            className="bet-amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          >
            {BETS.map((amount) => (
              <option
                key={amount}
                value={amount}
                disabled={wallet < amount || !token}
              >
                {amount} ❂
              </option>
            ))}
          </select>
        </div>
        <div className="coin">
          <CoinFlip onResult={handleFlipResult} />
        </div>
      </div>
    </div>
  );
}

export default CoinFlipPage;
