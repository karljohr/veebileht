import "../style/InfoOverlay.css";

function InfoOverlay({ text, isOpen, onClose }) {
  return (
    <div className={`overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <p className="text">{text}</p>
    </div>
  );
}

export default InfoOverlay;
