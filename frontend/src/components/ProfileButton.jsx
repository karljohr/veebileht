import {useState} from "react";

function ProfileButton({
                           width,
                           height,
                           text,
                           color = 'black',
                           fontSize='100%',
                           shadow = "5px 5px 10px lightgray",
                           bcolor = "rgb(255, 255, 255)"})
{
    const [hover, setHover] = useState(false);
    var hbcolor
    if (bcolor === "rgb(255, 255, 255)") { hbcolor = "rgb(225, 225, 225)" }
    else { hbcolor = "rgb(40, 40, 40)" }

    return (
        <button
            className="boxes button"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                border:"2px solid rgba(0, 0, 0, 0.25)",
                boxShadow:shadow,
                borderRadius:"10px",
                width:width,
                height:height,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                margin:"0",
                backgroundColor: hover ? hbcolor : bcolor,
                cursor: "pointer",
            }}
        >
            <p style={{color:color, fontSize:fontSize}}><b>{text}</b></p>
        </button>
    );
}

export default ProfileButton;