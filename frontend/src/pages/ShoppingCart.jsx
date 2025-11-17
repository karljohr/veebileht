import React from "react";
import {Link} from "react-router-dom";
import "../style/ShoppingCart.css"
import "../style/Catalogue.css"

const cartItems = [
    {
        id: 1,
        name: "Haruldane saagikast",
        priceRange: "5–10€",
        minPrice: 10,
        maxPrice: 25,
        imgClass: "rare"
    },
    {
        id: 2,
        name: "Müstiline saagikast",
        priceRange: "10-25€",
        minPrice: 5,
        maxPrice: 10,
        imgClass: "mystic"
    }
];

const totalMin = cartItems.reduce((sum, item) => sum + item.minPrice, 0);
const totalMax = cartItems.reduce((sum, item) => sum + item.maxPrice, 0);
const totalDisplay = `${totalMin}–${totalMax}€`;


function ShoppingCart() {
    return (
        <div className="page-container">
            <div className="content-box">

                <div className="title-section">
                    <h1 className="title">OSTUKORV</h1>
                    <hr className="title-separator"/>
                </div>

                <div className="item-list">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item-card">
                            <div className="item-image-container">
                                <img
                                    src="../../public/karp2.png"
                                    alt={item.name}
                                    className={`box-image ${item.imgClass}`}
                                />
                            </div>

                            <div className="item-details">
                                <span className="item-name">{item.name}</span>
                                <span className="item-price">{item.priceRange}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <span className="summary-total-label">Kokku</span>
                    <span className="summary-total-value">{totalDisplay}</span>
                </div>

                <div className="button-container">
                    <Link to="/payment">
                        <button className="buy-button">
                            Osta
                        </button>
                    </Link>
                </div>

                <div className="footer-button-container">
                    <Link to="/">
                        <button className="back-button">
                            &larr; Tagasi avalehele
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default ShoppingCart