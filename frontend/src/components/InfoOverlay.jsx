import "../style/InfoOverlay.css";

function InfoOverlay({ text, imageClass, boldText, isOpen, onClose }) {
  return (
    <div className={`overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
        {imageClass && (
      <div>
        <img src="/karp2.png" alt="" className={imageClass} id="imgIO"/>
      </div>
         )}
      <div id="text_div">
        <p className="text">{text}</p>
        <h3>{boldText}</h3>
      </div>
    </div>
  );
}

export default InfoOverlay;
