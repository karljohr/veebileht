import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../style/Register.css';

function Register() {
  const [users, setUsers] = useState([])
  const [first_name, set_first_name] = useState("")
  const [last_name, set_last_name] = useState("")
  const [email, set_email] = useState("")
  const [password, set_password] = useState("")

  // Andmete laadimine serverist
  useEffect(() => {
      // Asünkroonne funktsioon, et pärida kasutajad serverist
      const fetchUsers = async () => {
          const response = await fetch("http://localhost:5000/users"); // Pärime serverilt kasutajate andmed      }
          const data = await response.json(); // Teisendame vastuse JSON-iks
          setUsers(data);
      };

      fetchUsers(); // Kutsume välja loodud funktsiooni
      }, []);

  // Uue kasutaja lisamine
  const addContact = async (event) => {
    event.preventDefault(); // Väldime lehe refreshi
    // Saadame backend POST endpointi päringu
    const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ first_name, last_name, email, password }), // Saadame kasutaja nime ja vanuse serverile
  });

    // Kui päring õnnestub, uuendame kontaktide loendit
    if (response.ok) {
      // Uuendame kontaktide loendit, lisades uue kasutaja olemasolevatele
      const newUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, newUser]);
      // Tühjendame vormi väljad
      set_first_name("");
      set_last_name("");
      set_email("");
      set_password("");
    }
    console.log('Registreerimise vorm esitati.');
    console.log({ first_name, last_name, email, password });
    window.location.href = "http://localhost:5173/register/confirmation";
  };

  return (
    <>
      <div className="register-container">
        <div className="form-box">

          <h2>Loo kasutaja</h2>

          <p className="secondary-text">
            Kui sul juba on kasutaja, siis
            <Link to="/login">
              Logi sisse
            </Link>
          </p>

          <form onSubmit={addContact}>

            <div className="input-group">
              <div className="input-field-wrapper">
                <p className="input-label">Eesnimi</p>
                <input
                  type="text"
                  value={first_name}
                  onChange={(e) => set_first_name(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Sisesta eesnimi"
                />
              </div>
              <div className="input-field-wrapper">
                <p className="input-label">Perekonnanimi</p>
                <input
                  type="text"
                  value={last_name}
                  onChange={(e) => set_last_name(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Sisesta perekonnanimi"
                />
              </div>
            </div>

            <div className="full-width-input">
              <p className="input-label">Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => set_email(e.target.value)}
                required
                className="input-field"
                placeholder="Sisesta email"
              />
            </div>

            <div className="full-width-input">
              <p className="input-label">Parool</p>
              <input
                type="password"
                value={password}
                onChange={(e) => set_password(e.target.value)}
                required
                className="input-field"
                placeholder="Sisesta parool"
              />
            </div>

            <button type="submit" className="submit-button">Loo kasutaja</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
