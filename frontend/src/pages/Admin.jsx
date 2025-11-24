import "../style/Admin.css";
import { useEffect, useState } from "react";
import ProfileButton from "../components/ProfileButton.jsx";

function Admin() {
  const [prizes, setPrizes] = useState([]);
  const [prizePage, setPrizePage] = useState(1);
  const [productPage, setProductPage] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [chosenBox, setChosenBox] = useState(1);
  const [chosenPrize, setChosenPrize] = useState("");
  const [dayProducts, setDayProducts] = useState([]);
  const token = localStorage.getItem("token");

  const fetchPrizes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/info");
      const data = await res.json();
      setPrizes(data);
    } catch (error) {
      console.error("Error fetching prizes", error);
    }
  };

  const fetchDayProducts = async () => {
    await fetch("http://localhost:5000/api/dayproducts")
      .then((res) => res.json())
      .then((data) => {
        setDayProducts(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchPrizes();
    fetchDayProducts();
  }, []);

  const getPrizesByBox = (box) => {
    return prizes.filter((prize) => prize.boxtype === box);
  };

  const cardFlip = (event, id) => {
    if (isFlipped) {
      switch (id) {
        case 1:
          addBox(event);
          break;
        case 2:
        // Delete a daily product
        case 3:
        // Add a daily product
        default:
          break;
      }
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  const addBox = async (event) => {
    event.preventDefault();
    // Add the submited box to the database
    try {
      if (chosenPrize !== "") {
        const response = await fetch("http://localhost:5000/api/add-box", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ boxtype: chosenBox, prize: chosenPrize }),
        });

        if (!response.ok) console.log("Failed to add prize");
      }

      await fetchPrizes();

      setIsFlipped(false);
      setChosenBox(1);
      setChosenPrize("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (prize, event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/delete-box", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ boxtype: prize.boxtype, prize: prize.prize }),
      });

      if (!response.ok) console.log("Failed to delete");

      await fetchPrizes();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function getCurrentPrice() {
    if (dayProducts[productPage]) {
      const time = new Date();
      const step = Math.floor(
        (dayProducts[productPage].startprice -
          dayProducts[productPage].endprice) /
          24,
      );
      return dayProducts[productPage].startprice - step * time.getHours();
    }
    return "error";
  }

  const prizeTitles = {
    1: "Haruldane saagikast",
    2: "Müütiline saagikast",
    3: "Eepiline saagikast",
    4: "Legendaarne saagikast",
  };

  return (
    <div className="admin_content">
      <div className={`admin_box admin_content_box`}>
        <h4>{prizeTitles[prizePage]}</h4>
        <hr />
        <div className={`admin_box scroll_box ${isFlipped ? "flipped" : ""}`}>
          {!isFlipped && (
            <ul>
              {getPrizesByBox(prizePage).map((prize, index) => (
                <li
                  className="admin_li"
                  key={index}
                  onClick={(event) => handleDelete(prize, event)}
                >
                  {prize.prize}
                </li>
              ))}
            </ul>
          )}
          {isFlipped && (
            <div className="flipped_sheet">
              <form onSubmit={addBox} className="admin_box_form" id="myForm">
                <select
                  name="boxes"
                  required
                  className="admin_select"
                  value={chosenBox}
                  onChange={(event) => setChosenBox(event.target.value)}
                >
                  <option className="admin_option" value={1}>
                    {prizeTitles[1]}
                  </option>
                  <option className="admin_option" value={2}>
                    {prizeTitles[2]}
                  </option>
                  <option className="admin_option" value={3}>
                    {prizeTitles[3]}
                  </option>
                  <option className="admin_option" value={4}>
                    {prizeTitles[4]}
                  </option>
                </select>
                <input
                  type="text"
                  className="admin_select"
                  placeholder="Auhind"
                  required
                  onChange={(event) => setChosenPrize(event.target.value)}
                />
              </form>
            </div>
          )}
        </div>
        <div className="left_right_goodnight">
          <button
            className="admin_button"
            onClick={() => {
              if (prizePage > 1) {
                setPrizePage(prizePage - 1);
              }
            }}
          >
            {"<"}
          </button>
          <ProfileButton
            width="10rem"
            height="90%"
            text="Lisa auhind"
            fontSize="70%"
            onClickOptions={(event) => cardFlip(event, 1)}
          />
          <button
            className="admin_button"
            onClick={() => {
              if (prizePage < 4) {
                setPrizePage(prizePage + 1);
              }
            }}
          >
            {">"}
          </button>
        </div>
      </div>
      <div className="admin_box admin_content_box">
        <h4>Päevatoode</h4>
        <hr />
        <div className="admin_box admin_dayproduct_box">
          <img
            src={`/${dayProducts[productPage]?.picture}.jpg`}
            alt={"Picture"}
            className="admin_box_image"
          />
          <p>{dayProducts[productPage]?.name}</p>
          <p>{dayProducts[productPage]?.description}</p>
          <p>
            {dayProducts[productPage]?.startprice}€ > {getCurrentPrice()}€ >{" "}
            {dayProducts[productPage]?.endprice}€
          </p>
        </div>
        <div className="left_right_goodnight">
          <button
            className="admin_button"
            onClick={() => {
              if (productPage > 0) {
                setProductPage(productPage - 1);
              }
            }}
          >
            {"<"}
          </button>
          <ProfileButton
            width="6rem"
            height="90%"
            text="Kustuta"
            fontSize="70%"
            bcolor={"rgb(111,0,19)"}
            color={"white"}
            // onClickOptions={(event) => cardFlip(event, 2)}
          />
          <ProfileButton
            width="6rem"
            height="90%"
            text="Lisa"
            fontSize="70%"
            // onClickOptions={(event) => cardFlip(event, 3)}
          />
          <button
            className="admin_button"
            onClick={() => {
              if (productPage < dayProducts.length - 1) {
                setProductPage(productPage + 1);
              }
            }}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
