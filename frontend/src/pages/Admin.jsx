import "../style/Admin.css";
import { useEffect, useState } from "react";
import ProfileButton from "../components/ProfileButton.jsx";

function Admin() {
  const [prizes, setPrizes] = useState([]);
  const [prizePage, setPrizePage] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [chosenBox, setChosenBox] = useState(1);
  const [chosenPrize, setChosenPrize] = useState("");
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

  useEffect(() => {
    fetchPrizes();
  }, []);

  const getPrizesByBox = (box) => {
    return prizes.filter((prize) => prize.boxtype === box);
  };

  const cardFlip = (event) => {
    if (isFlipped) {
      addBox(event);
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  const addBox = async (event) => {
    event.preventDefault();
    // Add the submited box to the database
    try {
      const response = await fetch("http://localhost:5000/api/add-box", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ boxtype: chosenBox, prize: chosenPrize }),
      });

      if (!response.ok) throw new Error("Failed to add prize");

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

      if (!response.ok) throw new Error("Failed to delete");

      await fetchPrizes();
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
            onClickOptions={cardFlip}
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
      </div>
    </div>
  );
}

export default Admin;
