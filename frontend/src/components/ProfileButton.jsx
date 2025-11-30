import "../style/ProfileButton.css";

function ProfileButton({ text, onClick, style }) {
  return (
    <button className="profilebutton" onClick={onClick} style={style}>
      {text}
    </button>
  );
}

export default ProfileButton;
