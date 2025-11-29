import ProfileButton from "../components/ProfileButton.jsx";
import "../style/profile.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const token = localStorage.getItem("token");

  localStorage.setItem("wallet", wallet);

  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:5000/protected`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
      })
      .catch((error) => console.log(error));

    fetch(`http://localhost:5000/api/wallet`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store",
      },
    })
      .then((res) => res.json())
      .then((amount) => {
        setWallet(amount.balance);
      })
      .catch((error) => console.log(error));
  }, [token]);

  return (
    <div id="content">
      <div className="boxes" id="profile">
        <div id="profile_box_title">
          <h1>KASUTAJA ANDMED</h1>
        </div>
        <div id="profile_box_content">
          {/*Suure kasti vasak pool*/}
          <div className="profile_box_content_box">
            <div className="k">
              {/*Profiilipilt*/}
              <div id="pfp">
                <img src="/gambler.png" alt="profile_picture" id="pfp_img" />
                <div id="pfp_gray_box" />
              </div>
              <div id="textbox">
                <div id="textbox_text">
                  <p>
                    <b>
                      Nimi: {firstName} {lastName}
                    </b>
                  </p>
                  <p>Meiliaadress: {email}</p>
                </div>
                <Link to="/userdata">
                  <div id="changebox">
                    <ProfileButton
                      text="Muuda"
                      width="100px"
                      height="32px"
                      fontSize="100%"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/*Suure kasti parem pool*/}
          <div className="profile_box_content_box">
            <div className="k">
              <p>Omatud žetoonid: {wallet} ❂</p>
              {/*<p>Omatud kaste:</p>*/}
              {/*<p>Avatud kaste:</p>*/}
            </div>
          </div>
        </div>
      </div>
      <div id="small_box_container">
        <div className="boxes small_boxes">
          <h1>SALASÕNA</h1>
          <Link to="/password-change">
            <ProfileButton
              text="Muuda salasõna"
              width="150px"
              height="40px"
              fontSize="100%"
            />
          </Link>
        </div>
        <div className="boxes small_boxes">
          <h1>ARVELDUSINFO</h1>
          <Link to="/billing-info">
            <ProfileButton text="Lisa arveldusinfo" style={{}} />
          </Link>
        </div>
      </div>
      <div id="logout_box_container">
        <Link to="/">
          <ProfileButton
            style={{
              "--bgcolor": "#6f0013",
              "--tcolor": "white",
              "--hbgcolor": "white",
              "--htcolor": "#6f0013",
              "--bradius": "50px",
              "--fsize": "1.5rem",
              "--border": "3px solid #6f0013",
            }}
            text="Logi välja"
            onClickOptions={() => localStorage.removeItem("token")}
          />
        </Link>
      </div>
    </div>
  );
}

export default Profile;
