import "../style/ProfileButton.css";

function ProfileButton({ text, onClickOptions, style }) {
  return (
    <button className="profilebutton" onClick={onClickOptions} style={style}>
      {text}
    </button>
  );
}

export default ProfileButton;
