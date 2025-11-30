import "../style/ProfileButton.css";

function ProfileButton({ text, onClickOptions, style, disabled }) {
  return (
    <button
      className="profilebutton"
      onClick={onClickOptions}
      style={style}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default ProfileButton;
