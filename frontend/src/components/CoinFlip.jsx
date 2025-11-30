import "../style/CoinFlip.css";
import { useState } from "react";
import ProfileButton from "./ProfileButton.jsx";

function CoinFlip({ onResult }) {
  const [result, setResult] = useState("");
  const wallet = Number(localStorage.getItem("wallet"));

  const coinToss = () => {
    const outcome = Math.random() < 0.75 ? "heads" : "tails";
    setResult("");
    setTimeout(() => {
      setResult(outcome);
      onResult && onResult(outcome);
    }, 20);
  };

  return (
    <div className="coin-content">
      <div id="coin" className={result}>
        <div className="side-a">
          <h2>VÕIT</h2>
        </div>
        <div className="side-b">
          <h2>KAOTUS</h2>
        </div>
      </div>
      <ProfileButton
        text="Viska münti"
        style={{
          "--bgcolor": "black",
          "--tcolor": "white",
          "--hbgcolor": "white",
          "--htcolor": "black",
          "--bradius": "15px",
          "--fsize": "1.5rem",
          "--border": "3px solid black",
        }}
        onClickOptions={coinToss}
        disabled={wallet < 5}
      ></ProfileButton>
    </div>
  );
}

export default CoinFlip;
