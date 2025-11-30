import "../style/Admin.css";
import { useEffect, useState } from "react";
import ProfileButton from "../components/ProfileButton.jsx";

function Admin() {
  const [prizes, setPrizes] = useState([]);
  const [prizePage, setPrizePage] = useState(1);
  const [productPage, setProductPage] = useState(0);
  const [isFlipped, setIsFlipped] = useState(0);
  const [chosenBox, setChosenBox] = useState(1);
  const [chosenPrize, setChosenPrize] = useState("");
  const [dayProducts, setDayProducts] = useState([]);
  const [dayName, setDayName] = useState("");
  const [dayDescription, setDayDescription] = useState("");
  const [dayStartPrice, setDayStartPrice] = useState(0);
  const [dayEndPrice, setDayEndPrice] = useState(0);
  const [dayImage, setDayImage] = useState("");
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

      setIsFlipped(0);
      setChosenBox(1);
      setChosenPrize("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addDayProduct = async (event) => {
    event.preventDefault();

    try {
      console.log("Making fetch request...");
      const response = await fetch("http://localhost:5000/api/add-day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: dayName,
          description: dayDescription,
          startPrice: dayStartPrice,
          endPrice: dayEndPrice,
          picture: dayImage,
        }),
      });

      if (!response.ok) console.log("Failed to add daily product");

      await fetchDayProducts();
      setIsFlipped(0);
    } catch (error) {
      console.error("Error in addDayProduct:", error);
      return false;
    }
  };

  const cardFlip = (event, id) => {
    if (isFlipped === 0) {
      setIsFlipped(id);
    } else {
      setIsFlipped(0);
    }
  };

  const handleDeletePrize = async (prize, event) => {
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

  const handleDeleteDayProduct = async (event, id) => {
    event.preventDefault();
    console.log(id);
    try {
      await fetch("http://localhost:5000/api/delete-day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      await fetchDayProducts();
      setProductPage(0);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) console.log(`Upload failed: ${response.status}`);

      const data = await response.json();
      setDayImage(data.filePath);
      console.log("File saved:", data.filePath);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleActivation = async (event, id) => {
    event.preventDefault();

    setDayProducts((prev) =>
      prev.map((product) => ({ ...product, activated: product.id === id })),
    );

    try {
      await fetch("http://localhost:5000/api/activateDay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      await fetchDayProducts();
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
        <div
          className={`admin_box scroll_box ${isFlipped === 1 ? "flipped" : ""}`}
        >
          {isFlipped !== 1 && (
            <ul>
              {getPrizesByBox(prizePage).map((prize, index) => (
                <li
                  className="admin_li"
                  key={index}
                  onClick={(event) => handleDeletePrize(prize, event)}
                >
                  {prize.prize}
                </li>
              ))}
            </ul>
          )}
          {isFlipped === 1 && (
            <div className="flipped_sheet">
              <form className="admin_box_form" id="myForm">
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
            style={{ "--height": "35%" }}
            text="Lisa auhind"
            onClickOptions={(event) =>
              isFlipped === 0 ? cardFlip(event, 1) : addBox(event)
            }
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
        <div
          className={`admin_box transition ${isFlipped === 2 ? "flipped_2" : ""}`}
        >
          {isFlipped !== 2 && (
            <div className="admin_dayproduct_box">
              <img
                src={`http://localhost:5000${dayProducts[productPage]?.picture}`}
                alt={"Picture"}
                className="admin_box_image"
              />
              <p>{dayProducts[productPage]?.name}</p>
              <p>{dayProducts[productPage]?.description}</p>
              <p>
                {dayProducts[productPage]?.startprice}❂ {">"}{" "}
                {getCurrentPrice()}❂ {">"} {dayProducts[productPage]?.endprice}❂
              </p>
            </div>
          )}
          {isFlipped === 2 && (
            <div className="admin_dayproduct_box flipped_2">
              <form className="admin_day_form" id="dayFrom">
                <input
                  type="text"
                  className="admin_select"
                  placeholder="Nimi"
                  required
                  onChange={(event) => setDayName(event.target.value)}
                />
                <input
                  type="text"
                  className="admin_select"
                  placeholder="Kirjeldus"
                  required
                  onChange={(event) => setDayDescription(event.target.value)}
                />
                <input
                  type="number"
                  className="admin_select"
                  placeholder="Alghind"
                  required
                  onChange={(event) => setDayStartPrice(event.target.value)}
                />
                <input
                  type="number"
                  className="admin_select"
                  placeholder="Lõpphind"
                  required
                  onChange={(event) => setDayEndPrice(event.target.value)}
                />
                <input
                  type="file"
                  className="admin_select"
                  placeholder="Pilt"
                  accept=".jpg"
                  required
                  onChange={(event) => handleFileUpload(event)}
                />
              </form>
            </div>
          )}
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
            text="Kustuta"
            style={{
              "--height": "35%",
              "--width": "15%",
              "--bgcolor": "rgb(111,0,19)",
              "--tcolor": "rgb(230,230,230)",
              "--border": "2px solid rgb(66,0,11)",
              "--hbgcolor": "rgb(255,0,45)",
            }}
            onClickOptions={(event) =>
              handleDeleteDayProduct(event, dayProducts[productPage].id)
            }
          />

          <ProfileButton
            style={{
              "--height": "35%",
              "--bgcolor": dayProducts[productPage]?.activated
                ? "rgb(25,255,0)"
                : "rgb(255,0,0)",
              "--border": dayProducts[productPage]?.activated
                ? "2px solid rgb(14,158,0)"
                : "2px solid rgb(161,0,0)",
              "--hbgcolor": dayProducts[productPage]?.activated
                ? "rgb(177,255,165)"
                : "rgb(255,188,188)",
            }}
            onClickOptions={(event) =>
              handleActivation(event, dayProducts[productPage].id)
            }
          />

          <ProfileButton
            text="Lisa"
            style={{ "--height": "35%", "--width": "15%" }}
            onClickOptions={(event) =>
              isFlipped === 0 ? cardFlip(event, 2) : addDayProduct(event)
            }
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
