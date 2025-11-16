import "../style/MyBoxes.css";
import Box from "../components/Box.jsx"
import {useEffect, useState} from "react";
import InfoOverlay from "../components/InfoOverlay.jsx";

function MyBoxes() {
    const [openId, setOpenId] = useState(null);
    const [boxClass, setBoxClass] = useState("");
    const [prize, setPrize] = useState("");
    const [boxes, setBoxes] = useState([]);
    const token = localStorage.getItem("token");
    const toggle = (id) => setOpenId(openId === id ? null : id);

    // Fetch user boxes and display them.
    useEffect(() => {
        if (!token) return;

        // Get user boxes
        fetch("http://localhost:5000/api/user-boxes", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-store",
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error(res.status);
                return res.json();
            })
            .then(data => {
                const loadedBoxes = [];
                if (data.boxh) for (let i = 0; i < data.boxh; i++) loadedBoxes.push("rare")
                if (data.boxm) for (let i = 0; i < data.boxm; i++) loadedBoxes.push("mystic")
                if (data.boxe) for (let i = 0; i < data.boxe; i++) loadedBoxes.push("epic")
                if (data.boxl) for (let i = 0; i < data.boxl; i++) loadedBoxes.push("legendary")
                setBoxes(loadedBoxes);
            })
            .catch((err) => console.error(err));

    }, [token]);

    function updateDatabase(newBoxes) {
        // Update database
        let boxh = newBoxes.filter(box => box === "rare").length;
        let boxm = newBoxes.filter(box => box === "mystic").length;
        let boxe = newBoxes.filter(box => box === "epic").length;
        let boxl = newBoxes.filter(box => box === "legendary").length;

        fetch("http://localhost:5000/api/update-inventory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-store",
            },
            body: JSON.stringify({boxh, boxm, boxe, boxl}),
        })
            .catch(err => console.error(err));
    }

    function handler(box) {

        // Convert box type to box id
        let boxId;
        switch(box) {
            case "rare":
                boxId = 1;
                break
            case "mystic":
                boxId = 2;
                break
            case "epic":
                boxId = 3;
                break
            case "legendary":
                boxId = 4;
                break
            default:
                boxId = 0;
        }

        // Open overlay
        toggle(2)
        // Choose the right colored box for overlay
        setBoxClass(box)
        // Random prize from the prize pool, send it here, display on overlay
        fetch("http://localhost:5000/api/prize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({boxId}),
        })
        .then(res => res.json())
            .then(data => setPrize(data.prize))
        .catch((err) => console.error(err));

        // Delete the box from the inventory
       setBoxes(prev => {
            const index = prev.indexOf(box);
            const newBoxes = [...prev]
            newBoxes.splice(index, 1);

            updateDatabase(newBoxes);

            return newBoxes;
        });
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
                        key={index}
                        img_class={box}
                        onClick={() => {handler(box)}}/>
                ))}
            </div>
        </div>
    )
}

export default MyBoxes;