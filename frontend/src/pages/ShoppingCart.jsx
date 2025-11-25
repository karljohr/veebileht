import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/ShoppingCart.css";
import "../style/Catalogue.css";

const API_URL = "http://localhost:5000";

export const clearCartExternal = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/cart/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Ostukorvi tühjendamine ebaõnnestus.");
  }
};

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalMin, setTotalMin] = useState(0);
  const [totalMax, setTotalMax] = useState(0);
  const [error, setError] = useState(null);

  localStorage.setItem("totalMax", totalMax);

  // Ostukorvi sisu laadimne
  const fetchCartData = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Kasutaja pole sisse logitud või token puudub.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sessioon aegus. Palun logi uuesti sisse.");
        }
        throw new Error("Andmete laadimine ebaõnnestus.");
      }

      const data = await response.json();

      setCartItems(data.items);
      setTotalMin(parseFloat(data.totalMinPrice));
      setTotalMax(parseFloat(data.totalMaxPrice));
    } catch (err) {
      console.error("Viga ostukorvi laadimisel:", err);
      setError(err.message || "Andmete laadimisel tekkis ootamatu viga.");
      setCartItems([]);
      setTotalMin(0);
      setTotalMax(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleClearCart = async () => {
    try {
      await clearCartExternal();
      fetchCartData();
    } catch (error) {
      console.error("Viga ostukorvi tühjendamisel:", error.message);
      alert("Viga: " + error.message);
    }
  };

  const handleDecreaseQuantity = async (cartItemId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItemId: parseInt(cartItemId) }),
      });

      if (!response.ok) {
        throw new Error("Eseme koguse vähendamine ebaõnnestus.");
      }

      fetchCartData();
    } catch (error) {
      console.error("Viga eseme koguse vähendamisel:", error.message);
      alert("Viga: " + error.message);
    }
  };

  const handleIncreaseQuantity = async (cartItemId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/cart/add_one`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItemId: parseInt(cartItemId) }),
      });

      if (!response.ok) {
        throw new Error("Eseme koguse suurendamine ebaõnnestus.");
      }

      fetchCartData();
    } catch (error) {
      console.error("Viga eseme koguse suurendamisel:", error.message);
      alert("Viga: " + error.message);
    }
  };

  const totalDisplay = `${totalMin.toFixed(0)} – ${totalMax.toFixed(0)} ❂`;

  if (loading) {
    return <div className="page-container">Laadimine...</div>;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="content-box">
          <h2>Viga</h2>
          <p>{error}</p>
          <Link to="/login">Mine Logi sisse</Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="content-box">
          <h2>Ostukorv on tühi</h2>
          <p>Lisa tooteid kataloogist, et jätkata.</p>
          <Link to="/catalogue">Mine Kataloogi</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-box">
        <div className="title-section">
          <h1 className="title">OSTUKORV</h1>
          <hr className="title-separator" />
        </div>

        <div className="item-list">
          {cartItems.map((item) => {
            let imgClass = "";
            const itemNameLower = item.name ? item.name.toLowerCase() : "";

            if (itemNameLower.includes("haruldane")) {
              imgClass = "rare";
            } else if (itemNameLower.includes("müstiline")) {
              imgClass = "mystic";
            } else if (itemNameLower.includes("eepiline")) {
              imgClass = "epic";
            } else if (itemNameLower.includes("legendaarne")) {
              imgClass = "legendary";
            }

            return (
              <div key={item.cartitemid} className="cart-item-card">
                <div className="item-image-container">
                  <img
                    src="../../public/karp2.png"
                    alt={item.name}
                    className={`box-image ${imgClass}`}
                  />
                </div>

                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    {parseFloat(item.min_price).toFixed(0)} –{" "}
                    {parseFloat(item.max_price).toFixed(0)} ❂
                  </span>
                </div>

                <div className="quantity-controls">
                  <button
                    className="quantity-button decrease-button"
                    onClick={() => handleDecreaseQuantity(item.cartitemid)}
                  >
                    –
                  </button>

                  <span className="item-quantity-display">
                    {item.quantity} tk
                  </span>

                  <button
                    className="quantity-button increase-button"
                    onClick={() => handleIncreaseQuantity(item.cartitemid)}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="clear-cart-container">
          <button onClick={handleClearCart} className="clear-cart-button">
            Tühjenda ostukorv
          </button>
        </div>

        <div className="cart-summary">
          <span className="summary-total-label">Kokku</span>
          <span className="summary-total-value">{totalDisplay}</span>
        </div>

        <div className="button-container">
          <Link to="/payment">
            <button className="buy-button">Osta</button>
          </Link>
        </div>

        <div className="footer-button-container">
          <Link to="/">
            <button className="back-button">&larr; Tagasi avalehele</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
