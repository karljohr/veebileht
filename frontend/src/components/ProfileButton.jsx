function ProfileButton({width, height, text, color = 'black', fontSize='375%'}) {
    return (
        <div
            className="boxes button"
            style={{
                border:"5px solid rgba(0, 0, 0, 0.25)",
                boxShadow:"20px 20px 10px lightgray",
                borderRadius:"50px",
                width:width,
                height:height,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                margin:"0"
            }}
        >
            <p style={{color:color, fontSize:fontSize}}>{text}</p>
        </div>
    );
}

export default ProfileButton;