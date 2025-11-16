function Box({img_class, onClick}) {

    // img_class can be rare, mystic, epic, legendary from Catalogue.css

    return (
        <div style={{
            width: "7rem",
            height: "7rem",
            background: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 0 0.5rem gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
             id="inventory_box"
             onClick={onClick}
        >
            <img src="/karp2.png" alt="Box" style={{width: "5.5rem"}} className={img_class}/>
        </div>
    )
}

export default Box;