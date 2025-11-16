import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/DailyProduct.css";
import InfoOverlay from "../components/InfoOverlay";

function DailyProduct() {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId(openId === id ? null : id);
  return (
    <div className="daily-product-container">
      <img className="palm-right" src="/palm_tree.png" alt="palm-right" />
      <img className="palm-left" src="/palm_tree.png" alt="palm-left" />
      <div className="info">
        <button onClick={() => toggle(2)} className="info-button">
          Kuidas päevatoode töötab ?
        </button>
      </div>
      <div>
        <InfoOverlay
          text="Meie päevatoode on ainult üheks päevaks kehtiv eripakkumine soodushinnaga.
        Pakkumine kehtib kuni toote väljamüügini või päeva lõpuni.
        Tooted on saadaval piiratud koguses, seega tasub tegutseda kiiresti.
        Iga päev uuendame valikut, et pakkuda midagi uut ja huvitavat.
        "
          isOpen={openId === 2}
          onClose={() => toggle(null)}
        />
      </div>
      <div className="product-frame">
        <div className="header-row">
          <h1 className="title">Ainult täna!!</h1>
        </div>
        <div className="extra-info">
          <h2 className="subtitle">Müstiline energiajook</h2>
        </div>
        <div className="product-card">
          <div className="sold-tag">Müüdud</div>
          <img
            src="../../public/energy-drink.jpg"
            alt="Product image"
            className="product-image"
          />
        </div>

        <p className="product-description">
          Väidetavalt annab +5 karismat ja -3 und.
        </p>

        <p className="current-price-text">
          Praegune hind: <span className="price-value">14 €</span>
        </p>

        <div className="price-slider-area">
          <span className="min-value">1 €</span>
          <input
            type="range"
            min="1"
            max="100"
            value="14"
            className="price-slider"
            disabled
          />
          <span className="max-value">100 €</span>
        </div>

        <Link to="/payment">
          <button className="buy-button">Osta kohe</button>
        </Link>
      </div>
      <div className="bottom">
        <p className="bottom-text">© Tiim Veebipingviinid 2025</p>
      </div>
    </div>
  );
}

export default DailyProduct;
