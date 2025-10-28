function ButtonHomepage({ fill = null, text, textColor = "black" }) {
  return (
    <div
      style={{
        width: "330px",
        height: "80px",
        backgroundColor: fill,
        border: "3px solid #6F0013",
        borderRadius: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: textColor,
        fontSize: "40px",
      }}
    >
      <p style={{ color: textColor, margin: 0 }}>{text}</p>
    </div>
  );
}

export default ButtonHomepage;
