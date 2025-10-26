import React from "react";
import {Link} from "react-router-dom";
import "../style/DailyProduct.css"

function DailyProduct() {
    const currentPrice = "14€"

    return (
        <div className="daily-product-container">
            <div className="product-frame">
                <div className="header-row">
                    <h1 className="title">Ainult täna</h1>
                    <span className="info-icon">?</span>

                </div>
                <h2 className="subtitle">Müstiline energiajook</h2>

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
                    Praegune hind: <span className="price-value">{currentPrice}</span>
                </p>

                <div className="price-slider-area">
                    <span className="min-value">1€</span>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value="14"
                        className="price-slider"
                        disabled
                    />
                    <span className="max-value">100€</span>
                </div>

                <Link to="/method-of-payment">
                    <button
                        className="buy-button"
                    >
                        Osta kohe
                    </button>
                </Link>
            </div>
        </div>
    );

}

export default DailyProduct;
