function ProfileButton({width, height, text, color = 'black', fontSize='1vw'}) {
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
            <p style={{color:color, fontSize:fontSize, margin:'5vh'}}>{text}</p>
        </div>
    );
}

export default ProfileButton;