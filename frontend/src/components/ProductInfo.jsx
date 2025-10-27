import React from "react";

const ProductInfo = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .close-button {
                    background: none;
                    border: none;
                    color: #8B0000;
                    font-size: 1em;
                    font-weight: bold;
                    cursor: pointer;
                    padding: 5px 10px;
                }
                .close-button:hover {
                    color: #CC0000;
                }
            `}</style>

            <div className="modal-overlay" onClick={onClose}>

                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        maxWidth: '450px',
                        width: '90%',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <div className="info-box">
                        <h3 style={{
                            color: '#333',
                            fontSize: '1.1em',
                            marginBottom: '20px',
                        }}>
                            Meie päevatoode on ainult üheks päevaks kehtiv eripakkumine soodushinnaga:
                        </h3>

                        <ul className="info-list" style={{
                            textAlign: 'left',
                            listStyle: 'disc inside',
                            marginBottom: '25px',
                            color: '#555',
                            lineHeight: '1.6',
                        }}>
                            <li>Pakkumine kehtib kuni toote väljamüügini või päeva lõpuni.</li>
                            <li>Tooted on saadaval piiratud koguses, seega tasub tegutseda kiiresti.</li>
                            <li>Iga päev uuendame valikut, et pakkuda midagi uut ja huvitavat.</li>
                        </ul>

                        <button className="close-button" onClick={onClose}>
                            Sulge
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductInfo
