import Logo from "../components/Logo.jsx";
import MenuButton from "../components/MenuButton.jsx";
import ButtonHomepage from "../components/ButtonHomepage.jsx";

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
            margin: "2vh",
          }}
        >
          <Logo />
        </div>
        <div className="home_side">
          <img
            src="/QuestionMark.png"
            alt="Küsimärk"
            style={{ height: "25%", objectFit: "cover", filter: "invert(100)" }}
          />
          <ButtonHomepage fill="#6F0013" text="Päevatoode" textColor="white" />
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
              margin: "2vh",
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
              style={{ height: "150%", objectFit: "cover", overflow: "hidden" }}
            />
          </div>
          <ButtonHomepage text="Saagikastid" />
        </div>
      </div>
    </div>
  );
}

export default Home;
