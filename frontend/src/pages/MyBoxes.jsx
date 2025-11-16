import "../style/MyBoxes.css";
import Box from "../components/Box.jsx"
import {useState} from "react";
import InfoOverlay from "../components/InfoOverlay.jsx";

function MyBoxes() {
    const [openId, setOpenId] = useState(null);
    const [boxClass, setBoxClass] = useState("");
    const [prize, setPrize] = useState("");
    const [boxes, setBoxes] = useState([]);
    const toggle = (id) => setOpenId(openId === id ? null : id);

    // Fetch user boxes and display them
    useEffect(() => {
        if (!token) return;

    const addBox = (img_class) => {
        setBoxes(prev =>[...prev, img_class])
    };
    // Need to fetch user boxes and display them.

    function handler(box) {
        // Open overlay
        toggle(2)
        // Choose the right colored box for overlay
        setBoxClass(box)
        // Need to implement backend ( Random prize from the prize pool, send it here, display on overlay )
        setPrize("TEST")
        // Delete the box from the inventory

    }

    return (
        <div id="myboxes_body">
            <div id="myboxes_title">
                <h1>SINU KASTID</h1>
            </div>
            <InfoOverlay
                isOpen={openId === 2}
                onClose={() => toggle(null)}
                text={"Palju õnne, te võitsite:"}
                boldText={prize}
                imageClass={boxClass}/>
            <div id="inventory">
                {boxes.map((box, index) => (
                    <Box
                        img_class={box.img_class}
                        onClick={() => {handle(box.img_class)}}/>
                ))}
                <Box img_class="rare" onClick={() => handler("rare")}/>
                <Box img_class="mystic" onClick={() => handler("mystic")}/>
                <Box img_class="epic" onClick={() => handler("epic")}/>
                <Box img_class="legendary" onClick={() => handler("legendary")}/>
            </div>
        </div>
    )
}

export default MyBoxes;