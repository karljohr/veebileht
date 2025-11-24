import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/DailyProduct.css";
import InfoOverlay from "../components/InfoOverlay";

function DailyProduct() {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId(openId === id ? null : id);
  const [product, setProduct] = useState({
    name: "data.name",
    description: "data.description",
    price: 0,
    startPrice: 0,
    picture: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/dayproduct")
      .then((res) => res.json())
      .then((data) => {
        setProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          startPrice: data.startprice,
          picture: data.picture,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          <h2 className="subtitle">{product.name}</h2>
        </div>
        <div className="product-card">
          {/*<div className="sold-tag">Müüdud</div>*/}
          <img
            src={`/${product.picture}.jpg`}
            alt="Product image"
            className="product-image"
          />
        </div>

        <p className="product-description">{product.description}</p>

        <p className="current-price-text">
          Praegune hind: <span className="price-value">{product.price} €</span>
        </p>

        <div className="price-slider-area">
          <span className="min-value">{product.startPrice} €</span>
          <input
            type="range"
            min="1"
            max="100"
            value={Math.floor((product.price / product.startPrice) * 100)}
            className="price-slider"
            disabled
            style={{ direction: "rtl" }}
          />
          <span className="max-value">? €</span>
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
