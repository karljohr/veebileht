import React, { useState } from "react";
import "../style/Lootbox.css";

const Lootbox = ({ image, nimi, hind, prizes, reverse, imgClass }) => {
  const [isFlipped, setFlipped] = useState(false);
  const handleFlip = () => {
    setFlipped(!isFlipped);
  };
  const [showToast, setShowToast] = useState(false);
  const handleAddToCart = () => {
    // Add item to cart logic hiljem
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  return (
    <div className="lootbox">
      <div className={`card ${isFlipped ? "flipped" : ""}`}>
        <div className="card-inner">
          <div
            className="card-front"
            style={{
              flexDirection: reverse ? "row-reverse" : "row",
            }}
          >
            <div className="image">
              <img src={image} alt="image" className={imgClass} />
            </div>
            <div className="content">
              <div className="name">
                <p>{nimi}</p>
              </div>
              <div className="price">
                <p>{hind}</p>
              </div>
              <button className="prizes" onClick={handleFlip}>
                Võimalikud auhinnad ?
              </button>
              <button className="cart" onClick={handleAddToCart}>
                Lisa ostukorvi
              </button>
            </div>
          </div>
          <div className="card-back" onClick={handleFlip}>
            <ul className="prize-list">
              {prizes.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {showToast && <div className="toast">Lisatud ostukorvi</div>}
    </div>
  );
};

export default Lootbox;
