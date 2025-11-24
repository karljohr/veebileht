import Logo from "../components/Logo.jsx";
import MenuButton from "../components/MenuButton.jsx";
import { Link } from "react-router-dom";
import "../style/Home.css";

function Home({ setNavbarOpen }) {
  return (
    <div id="home">
      <div className="top-left">
        <div className="logo-container">
          <Logo />
        </div>
      </div>
      <div className="top-right">
        <button
          onClick={() => setNavbarOpen(true)}
          className="menu-button-wrapper"
        >
          <MenuButton />
        </button>
      </div>
      <div className="left-side">
        <div className="home_side">
          <img
            src="/QuestionMark.png"
            alt="Küsimärk"
            className="question-img"
          />
          <Link to="/daily-product">
            <button className="daily-product-button">Päevatoode</button>
          </Link>
        </div>
      </div>
      <div className="right-side">
        <div className="home_side">
          <div className="center-box">
            <img src="/karp.png" alt="Saagikast" className="big-img" />
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
