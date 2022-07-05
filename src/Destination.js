import './Destination.css';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { EditText, EditTextarea } from 'react-edit-text';

function Destination() {
  const data = useLocation();
  const { destination } = data.state;

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
            <EditText
              className="title-text"
              defaultValue={destination.name}
              style={{
                fontSize: "48px",
                width: "inherit",
              }}
              inline
              editButtonProps={{ style: { width: '48px' } }}  
              showEditButton />
          </div>
          <Link to="/map"><button className="btn">Save Changes</button></Link>
        </div>
      </header>

      <section className="destination">
        <div className="destination-coordinates">
          <h1>Coordinates:</h1>
          <p>XYZ: {destination.coordinates.x} / {destination.coordinates.y} / {destination.coordinates.z}</p>
          <h1>Type of structure</h1>
          <p>{destination.structure}</p>
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
        <div className="destination-contains">
          <h1>Contains:</h1>
          <ul>
            {destination.contains.map((object) =>
              <li>{object}</li>
            )}
          </ul>
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
        <div className="destination-notes">
          <h1>Notes and Comments</h1>
          <EditTextarea
            style={{
              fontSize: "16px",
              width: "100%",
            }}
            id="listTitle"
            name="NotesTextarea"
            defaultValue={destination.notes}
          />
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
      </section>
    </div>
  );
}

export default Destination;
