import ProfileButton from "../components/ProfileButton.jsx";
import "../style/profile.css";
import {Link} from "react-router-dom";
import {useEffect} from "react";

const FirstName = "Eesnimi";
const LastName = "Perekonnanimi";
const email = "meiliaadress@meil.ee";

function Profile() {
        const token = localStorage.getItem("token");


    useEffect(() => {
        if (!token) return;

        fetch(JSON.stringify(window.location.href), {
            headers: {Authorization: `Bearer ${token}`}
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
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
                        <div id="pfp_gray_box"/>
                    </div>
                    <div id="textbox">
                      <p>
                          <b>{FirstName} {LastName}</b>
                      </p>
                      <p>{email}</p>
                    <Link to="/userdata">
                        <div id="changebox">
                          <ProfileButton
                              text="Muuda"
                              width="75px"
                              height="25px"
                              fontSize="75%"
                          />
                        </div>
                    </Link>
                    </div>
                </div>
            </div>
            {/*Suure kasti parem pool*/}
            <div className="profile_box_content_box">
                <div className="k">
                    <p>WIP</p>
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
                  width="120px"
                  height="40px"
                  fontSize="75%"
              />
          </Link>
        </div>
        <div className="boxes small_boxes">
          <h1>ARVELDUSINFO</h1>
          <Link to="/billing-info">
            <ProfileButton
              text="Lisa arveldusinfo"
              width="120px"
              height="40px"
              fontSize="75%"
            />
          </Link>
        </div>
      </div>
      <div id="logout_box_container">
        <Link to="/">
            <ProfileButton
              text="Logi välja"
              width="150px"
              height="50px"
              color="#6F0013"
              fontSize="125%"
              onClickOptions={() => localStorage.removeItem("token")}
            />
        </Link>
      </div>
    </div>
  );
}

export default Profile;
