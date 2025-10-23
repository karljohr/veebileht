function ProfileButton({width, height, text, color = 'black', fontSize='75%'}) {
    return (
        <div
            className="boxes button"
            style={{
                border:"2px solid rgba(0, 0, 0, 0.25)",
                boxShadow:"10px 10px 10px lightgray",
                borderRadius:"15px",
                width:width,
                height:height,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                margin:"0",
            }}
        >
            <p style={{color:color, fontSize:fontSize}}>{text}</p>
        </div>
    );
}

export default ProfileButton;