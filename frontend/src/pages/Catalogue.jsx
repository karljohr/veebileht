import "../style/Catalogue.css";
import { useState } from "react";

function Overlay({ text, isOpen, onClose }) {
  return (
    <div className={`overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <p className="text">{text}</p>
    </div>
  );
}

function Catalogue() {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId(openId === id ? null : id);
  return (
    <div className="content">
      <div className="info">
        <button onClick={() => toggle(1)} className="info-button">
          Kuidas saagikastid töötavad ?
        </button>
      </div>
      <Overlay
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
        <li className="lootbox">
          <div className="lootbox-image">
            <img className="rare" src="/karp.png" alt="Saagikast" />
          </div>
          <div className="lootbox-content">
            <div className="lootbox-name">
              <p>Haruldane Saagikast</p>
            </div>
            <div className="lootbox-price">
              <p>Hind: 5 - 10 €</p>
            </div>
            <button className="prizes">Võimalikud auhinnad ?</button>
            <button className="add-to-cart">Lisa ostukorvi</button>
          </div>
        </li>
        <li className="lootbox">
          <div className="lootbox-content">
            <div className="lootbox-name">
              <p>Müstiline Saagikast</p>
            </div>
            <div className="lootbox-price">
              <p>Hind: 10 - 25 €</p>
            </div>
            <button className="prizes">Võimalikud auhinnad ?</button>
            <button className="add-to-cart">Lisa ostukorvi</button>
          </div>
          <div className="lootbox-image">
            <img className="mystic" src="/karp.png" alt="Saagikast" />
          </div>
        </li>
        <li className="lootbox">
          <div className="lootbox-image">
            <img className="epic" src="/karp.png" alt="Saagikast" />
          </div>
          <div className="lootbox-content">
            <div className="lootbox-name">
              <p>Eepiline Saagikast</p>
            </div>
            <div className="lootbox-price">
              <p>Hind: 25 - 50 €</p>
            </div>
            <button className="prizes">Võimalikud auhinnad ?</button>
            <button className="add-to-cart">Lisa ostukorvi</button>
          </div>
        </li>
        <li className="lootbox">
          <div className="lootbox-content">
            <div className="lootbox-name">
              <p>Legendaarne Saagikast</p>
            </div>
            <div className="lootbox-price">
              <p>Hind: 50 - 100 €</p>
            </div>
            <button className="prizes">Võimalikud auhinnad ?</button>
            <button className="add-to-cart">Lisa ostukorvi</button>
          </div>
          <div className="lootbox-image">
            <img className="legendary" src="/karp.png" alt="Saagikast" />
          </div>
        </li>
      </ul>
      <div className="bottom">
        <p>© Tiim Veebipingviinid 2025</p>
      </div>
    </div>
  );
}

export default Catalogue;
