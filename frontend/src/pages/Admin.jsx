import "../style/Admin.css";
import { useEffect, useState } from "react";
import ProfileButton from "../components/ProfileButton.jsx";

function Admin() {
  const [prizes, setPrizes] = useState([]);
  const [prizePage, setPrizePage] = useState(1);
  const [isFlipped, setisFlipped] = useState(false);
  const [chosenBox, setChosenBox] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/info")
      .then((res) => res.json())
      .then((prizes) => setPrizes(prizes));
  });

  const getPrizesByBox = (box) => {
    return prizes.filter((prize) => prize.boxtype === box);
  };

  const cardFlip = () => setisFlipped(!isFlipped);

  function addBox() {
    // Add the submited box to the database
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
                <li className="admin_li" key={index}>
                  {prize.prize}
                </li>
              ))}
            </ul>
          )}
          {isFlipped && (
            <div className="flipped_sheet">
              <form onSubmit={addBox} className="admin_box_form">
                <select name="boxes" required className="admin_select">
                  <option className="admin_option" value="hs">
                    {prizeTitles[1]}
                  </option>
                  <option className="admin_option" value="ms">
                    {prizeTitles[2]}
                  </option>
                  <option className="admin_option" value="es">
                    {prizeTitles[3]}
                  </option>
                  <option className="admin_option" value="ls">
                    {prizeTitles[4]}
                  </option>
                </select>
                <input
                  type="text"
                  className="admin_select"
                  placeholder="Prize"
                  required
                  onChange={() => setChosenBox(e.target.value)}
                  value={chosenBox}
                />
              </form>
            </div>
          )}
        </div>
        <div className="left_right_goodnight">
          <button
            className="admin_button"
            onClick={() => {
              console.log("clicked");
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
              console.log("clicked");
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
