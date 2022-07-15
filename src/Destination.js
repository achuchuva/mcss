import './Destination.css';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { EditText, EditTextarea } from 'react-edit-text';

function Destination() {
  const data = useLocation();
  const { destination } = data.state;

  let navigate = useNavigate();

  const [objects, setObjects] = useState([]);
  const [updatedName, setUpdatedName] = useState(null);
  const [updatedCoordinates, setUpdateCoordinates] = useState(null);
  const [updatedStructure, setUpdatedStructure] = useState(null);
  const [updatedObjects, setUpdatedObjects] = useState(null);
  const [updatedNotes, setUpdatedNotes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`api/objects/?destination_id=${destination.id}`, {
        method: 'GET',
        headers: {
          "x-api-key": localStorage.getItem("api_key")
        }
      });

      const json = await response.text();
      const obj = JSON.parse(json);

      if (response.status == 200) {
        setObjects(obj);
      } else {
        alert(obj.message);
      }
    }

    fetchData();
  }, []);

  function saveChanges() {

    navigate(-1);
  }

  return (
    <div>
      <header className="destination-navbar">
        <div className="destination-overlay">
          <div>
            <Link to="/menu"><button className="btn">Menu</button></Link>
            <button className="btn" onClick={() => navigate(-1)}>Map</button>
          </div>
          <div className="destination-title">
            <EditText
              className="title-text"
              defaultValue={destination.name}
              style={{
                fontSize: "48px",
                width: "inherit",
                fontWeight: "bold",
                display: "flex"
              }}
              onSave={({ value }) => setUpdatedName(value)}
              inline
              editButtonProps={{ style: { width: '48px' } }}
              showEditButton />
          </div>
          <button className="btn" onClick={() => saveChanges()}>Save Changes</button>
        </div>
      </header>

      <section className="destination">
        <div className="destination-coordinates">
          <h1>Coordinates:</h1>
          <p>XYZ: {destination.coordinate_x} / {destination.coordinate_y} / {destination.coordinate_z}</p>
          <h1>Type of structure</h1>
          <p>{destination.structure}</p>
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
        <div className="destination-contains">
          <h1>Contains:</h1>
          <ul>
            {objects && objects.length > 0 &&
              objects.map((object) =>
                <li>{object.name}</li>
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
              overflow: "scroll",
              overflowX: "hidden",
              height: "80%"
            }}
            id="listTitle"
            name="NotesTextarea"
            defaultValue={destination.notes}
            className="notes-area"
            inline
            editButtonProps={{ style: { width: '48px' } }}
            showEditButton
          />
          {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
        </div>
      </section>
    </div>
  );
}

export default Destination;
