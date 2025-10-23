import ProfileButton from "../components/ProfileButton.jsx";
import "../style/profile.css"


const FirstName = "Eesnimi";
const LastName = "Perekonnanimi";
const email = "meiliaadress@meil.ee";

function Profile() {
    return (
            <div id="content">
                <div className='boxes' id='profile'>
                    <div id="profile_box_title">
                        <h1 className="text">KASUTAJA ANDMED</h1>
                        <hr id="line"/>
                    </div>
                    <div id="textbox">
                        <p className="text">Nimi: {FirstName} {LastName}</p>
                        <p className="text">E-mail: {email}</p>
                    </div>
                    <div id="changebox">
                        <ProfileButton text="Muuda" width="100px" height="40px"/>
                    </div>
                </div>
                <div id="small_box_container">
                    <div className="boxes small_boxes" >
                        <h1 className="text">SALASÕNA</h1>
                        <ProfileButton text="Muuda salasõna" width="120px" height="40px"/>
                    </div>
                    <div className="boxes small_boxes" >
                        <h1 className="text">ARVELDUSINFO</h1>
                        <ProfileButton text="Lisa arveldusinfo" width="120px" height="40px"/>
                    </div>
                </div>
                <div id="logout_box_container">
                    <ProfileButton text="Logi välja" width="150px" height="50px" color="#6F0013" fontSize="125%"/>
                </div>
            </div>
    );
}

export default Profile;