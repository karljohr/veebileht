import ProfileButton from "../components/ProfileButton.jsx";
import NavigationBar from "../components/NavigationBar.jsx";

const FirstName = "Eesnimi";
const LastName = "Perekonnanimi";
const email = "meiliaadress@meil.ee";

function Profile() {
    return (
        <div>
            <NavigationBar/>
            <div id="content">
                <div className='boxes' id='profile'>
                    <div id="profile_box_title">
                        <p className="text"><b>KASUTAJA ANDMED</b></p>
                        <hr id="line"/>
                    </div>
                    <div id="textbox">
                        <p className="text">Nimi: {FirstName} {LastName}</p>
                        <p className="text">E-mail: {email}</p>
                    </div>
                    <div id="changebox">
                        <ProfileButton text="Muuda" width="10%" height="50%"/>
                    </div>
                </div>
                <div id="small_box_container">
                    <div className="boxes small_boxes" >
                        <p className="text"><b>SALASÕNA</b></p>
                        <ProfileButton text="Muuda salasõna" width="30%" height="100%"/>
                    </div>
                    <div className="boxes small_boxes" >
                        <p className="text"><b>ARVELDUSINFO</b></p>
                        <ProfileButton text="Lisa arveldusinfo" width="30%" height="100%"/>
                    </div>
                </div>
                <div id="logout_box_container">
                    <ProfileButton text="Logi välja" width="10%" height="30%" color="#6F0013" fontSize="450%"/>
                </div>
            </div>
        </div>
    );
}

export default Profile;