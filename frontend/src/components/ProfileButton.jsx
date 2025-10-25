function ProfileButton({width, height, text, color = 'black', fontSize='75%', shadow = "10px 10px 10px lightgray", bcolor = "white"}) {
    return (
        <button
            className="boxes button"
            style={{
                border:"2px solid rgba(0, 0, 0, 0.25)",
                boxShadow:shadow,
                borderRadius:"15px",
                width:width,
                height:height,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                margin:"0",
                backgroundColor: bcolor,
                cursor: "pointer",
            }}
        >
            <p style={{color:color, fontSize:fontSize}}>{text}</p>
        </button>
    );
}

export default ProfileButton;