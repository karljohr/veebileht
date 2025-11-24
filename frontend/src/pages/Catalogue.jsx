import "../style/Catalogue.css";
import { useState } from "react";
import Lootbox from "../components/Lootbox.jsx";
import InfoOverlay from "../components/InfoOverlay.jsx";

const API_URL = "http://localhost:5000";

function Catalogue() {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId(openId === id ? null : id);

  const addToCart = async (productID, productName) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Ostukorvi lisamiseks palun logi sisse.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST", // Meetod peab olema POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productID: productID,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Viga kasti lisamisel.";
        if (response.status === 401) {
          errorMessage = "Sessioon aegunud. Palun logi uuesti sisse.";
        } else if (response.status === 400) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Viga kasti lisamisel:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="content">
      <div className="info">
        <button onClick={() => toggle(1)} className="info-button">
          Kuidas saagikastid töötavad ?
        </button>
      </div>
      <InfoOverlay
        text="
            Saagikastid on erilise üllatusmomendiga tooted, kus ostja ei tea
            enne paki avamist täpselt, millise auhinna ta endale saab. Just see
            teebki iga saagikasti ostmise põnevaks kogemuseks. Samuti ei ole
            kohe teada ka lõplik hind – klient valib lihtsalt talle sobiva
            saagikasti kategooria ning lõplik summa kujuneb pärast ostu
            kinnitamist vastavalt valitud kasti hinnavahemikule. Iga saagikasti
            sees olevate auhindade väärtus on alati õiglane ning vastab täpselt
            kasti tasemele, kuhu need on paigutatud. Nii võid kindel olla, et
            ükski ost ei lähe raisku ning igast kastist leiab midagi
            väärtuslikku. Soovime palju põnevust ja head ostuõnne!"
        isOpen={openId === 1}
        onClose={() => toggle(null)}
      />
      <ul className="lootbox-list">
        <li>
          <Lootbox
            productID={1}
            image="/karp.png"
            nimi="Haruldane saagikast"
            hind="5 - 10 ❂"
            prizes={[
              "Käsitööšokolaad",
              "Kõrgekvaliteediline teevalik",
              "Metallist võtmehoidja",
              "E-raamat",
              "TalTechi kleepsupakk",
              "Indie-mängu kood",
              "USB-C juhtmekaabel",
              "Väike märkmik",
              "Steam Wallet krediit",
              "Autoaksessuaar",
              "Mikrofiiberlapp",
              "Lauakaunistus",
              "Sinise valguse lambid",
            ]}
            reverse={false}
            imgClass="rare"
            onAddToCart={addToCart}
          />
        </li>
        <li>
          <Lootbox
            productID={2}
            image="/karp.png"
            nimi="Müstiline saagikast"
            hind="10 - 25 ❂"
            prizes={[
              "Lõhnaküünal",
              "Nahkne kaarditasku",
              "Roostevabast terasest pudel",
              "TalTech T-särk",
              "Juhtmevaba laadija",
              "Trühvliõli komplekt",
              "Disainitud kruus",
              "RGB valgusriba",
              "Spotify kuutellimus",
              "Laualamp",
              "E-kursuse sooduskood",
              "Kõrgekvaliteediline hiirematt",
              "Kvaliteetne matkalamp",
              "Toiduõlipihusti",
            ]}
            reverse={true}
            imgClass="mystic"
            onAddToCart={addToCart}
          />
        </li>
        <li>
          <Lootbox
            productID={3}
            image="/karp.png"
            nimi="Eepiline saagikast"
            hind="25 - 50 ❂"
            prizes={[
              "Kaasaskantav bluetooth kõlar",
              "Nutika kodu juhtpult",
              "Viskiklaaside komplekt",
              "TalTech dressipluus",
              "Kõrgekvaliteediline kööginuga",
              "Töölaua organiseerija",
              "Eksklusiivne Discordi serveri osalus",
              "Kvaliteetsed päikeseprillid",
              "Nutikas LED-lamp",
              "Soundboard-klaviatuur",
              "Stiilne seljakott",
              "Trükitud kunstiposter",
              "Virtuaalse töötoa osalus",
              "Juhtmevaba arvutihiir",
            ]}
            reverse={false}
            imgClass="epic"
            onAddToCart={addToCart}
          />
        </li>
        <li>
          <Lootbox
            productID={4}
            image="/karp.png"
            nimi="Legendaarne saagikast"
            hind="50 - 100 ❂"
            prizes={[
              "Nutikell",
              "NFT sertifikaat",
              "Disainitud aksessuaar",
              "Juhtmevabad kõrvaklapid",
              "Kohviveski komplekt",
              "Disney+ aastatellimus",
              "Miniprojektor",
              "Virtuaalne üks-ühele mentorisessioon",
              "Autohoolduskomplekt",
              "Retro mängukonsool",
              "Kõrgtehnoloogiline föön",
              "Sülearvutikott",
              "Kutse eksklusiivsele üritusele",
              "Juhtmevaba klaviatuur",
            ]}
            reverse={true}
            imgClass="legendary"
            onAddToCart={addToCart}
          />
        </li>
      </ul>
      <div className="bottom">
        <p className="bottom-text">© Tiim Veebipingviinid 2025</p>
      </div>
    </div>
  );
}

export default Catalogue;
