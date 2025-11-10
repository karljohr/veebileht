import Logo from "../components/Logo.jsx";
import MenuButton from "../components/MenuButton.jsx";
import { Link } from "react-router-dom";
import "../style/Home.css";

function Home({ setNavbarOpen }) {
  return (
    <div id="home">
      <div style={{ backgroundColor: "black", flexGrow: 1 }}>
        <div
          style={{
            height: "8vh",
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            paddingLeft: "10px",
          }}
        >
          <div style={{ height: "60px", marginTop: "20px" }}>
            <Logo />
          </div>
        </div>
        <div className="home_side">
          <img
            src="/QuestionMark.png"
            alt="Küsimärk"
            style={{ height: "25%", objectFit: "cover", filter: "invert(100)" }}
          />
          <Link to="/daily-product">
            <button className="daily-product-button">Päevatoode</button>
          </Link>
        </div>
      </div>
      <div style={{ backgroundColor: "white", flexGrow: 1 }}>
        <div
          style={{
            height: "8vh",
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setNavbarOpen(true)}
            style={{
              background: "none",
              color: "inherit",
              border: "none",
              padding: "0",
              font: "inherit",
              cursor: "pointer",
              outline: "inherit",
              margin: "20px",
            }}
          >
            <MenuButton />
          </button>
        </div>
        <div className="home_side">
          <div
            style={{
              width: "100%",
              height: "25%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="../../public/karp.png"
              alt="Saagikast"
              style={{ height: "180%", objectFit: "cover", overflow: "hidden" }}
            />
          </div>
          <Link to="/catalogue">
            <button className="catalogue-button">Saagikastid</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
