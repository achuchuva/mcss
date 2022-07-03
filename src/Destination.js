import './Destination.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { EditText, EditTextarea } from 'react-edit-text';

function Destination() {

  const [editModeActive, setEditModeActive] = useState(false);

  return (
    <div>
      <header className="destination-navbar">
        <div className="destination-overlay">
          <div>
            <Link to="/menu"><button className="btn">Menu</button></Link>
            <Link to="/map"><button className="btn">Map</button></Link>
          </div>
          <div className="destination-title">
            <h1>Overworld Village <FontAwesomeIcon icon={faPenToSquare} /></h1>
            <EditText 
              className="title-text"
              defaultValue="Overworld Village"
              style={{
                fontSize: "48px",
                width: "inherit",
              }}
              inputProps={{ maxLength: 5 }} />
          </div>
          <Link to="/map"><button className="btn">Save Changes</button></Link>
        </div>
      </header>

      <section className="destination">
        <div className="destination-coordinates">
          <h1>Coordinates:</h1>
          <p>XYZ: 1.0 / 1.0 / 1.0</p>
          <h1>Type of structure</h1>
          <p>Village</p>
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
        <div className="destination-contains">
          <h1>Contains:</h1>
          <ul>
            <li>Iron Ingots</li>
            <li>Wheat Farm</li>
            <li>Leather Trader</li>
          </ul>
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
        <div className="destination-notes">
          <h1>Notes and Comments</h1>
          <p>Village is next to lava pool. Can be easy to make nether portal next to village in future.</p>
          <EditTextarea
            style={{
              fontSize: "16px",
              width: "100%",
            }}
            id="listTitle"
            name="NotesTextarea"
            defaultValue="Village is next to lava pool. Can be easy to make nether portal next to village in future."
          />
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
      </section>
    </div>
  );
}

export default Destination;
