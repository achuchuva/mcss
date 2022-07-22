import './Destination.css';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { EditText, EditTextarea } from 'react-edit-text';

// Default structure types listed here
const structureTypes = ["Village", "Cave", "Dungeon", "Stronghold", "Ocean Monument", "Desert Temple", "Igloo", "Shipwreck", "Woodland Mansion", "Bastion", "Nether Fortress", "Ruined Portal", "End Gateway", "End City", "End Ship", "End Portal"];
// Options to choose different objects that the destination contains
const objectTypes = ["Crafting Table", "Furnace", "Chest", "Ender Chest", "Enchanting Table", "Brewing Stand", "Jukebox", "Dispenser", "Piston", "Bed", "Anvil"];

function Destination() {
  // Use location from react router to pass down params, in this case the destination data
  const data = useLocation();
  const { destination } = data.state;

  let navigate = useNavigate();

  // Declare all variables that can be updated as states
  const [objects, setObjects] = useState([]);
  const [updatedName, setUpdatedName] = useState();
  const [updatedX, setUpdatedX] = useState();
  const [updatedY, setUpdatedY] = useState();
  const [updatedZ, setUpdatedZ] = useState();
  const [updatedStructure, setUpdatedStructure] = useState();
  const [updatedObjects, setUpdatedObjects] = useState(null);
  const [updatedNotes, setUpdatedNotes] = useState();

  // States to determine whether the coordinates or objects are being modified
  const [editCoords, setEditCoords] = useState(false);
  const [editObjects, setEditObjects] = useState(false);

  // Initial async call to fetch the data of the destination using the id received from the params
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
        // An error occured, inform the user
        alert(obj.message);
      }
    }

    fetchData();
  }, []);

  // Function that updates different coordinates based on the name and value passed as an argument
  function handleCoordChange(e) {
    let name = e.target.name;
    switch (name) {
      case "x":
        setUpdatedX(e.target.value);
        break;
      case "y":
        setUpdatedY(e.target.value);
        break;
      case "z":
        setUpdatedZ(e.target.value);
        break;
    }
  }

  // Function that updates the objects the destination contains
  // Very similar to the function seen in AddDestination.js
  function handleContainsChange(e) {
    let array;
    if (updatedObjects !== null) {
      array = updatedObjects;
    } else {
      array = [];
    }

    if (e.target.checked) {
      array.push(e.target.value);
    } else {
      array.splice(array.indexOf(e.target.value), 1);
    }

    setUpdatedObjects(array);
  }

  // The user has clicked save changes, any changes that were made are now sent to the backend
  const saveChanges = async () => {
    const response = await fetch(`api/destinations/${destination.id}?world_id=${destination.world_id}`, {
      method: 'PATCH',
      headers: {
        "x-api-key": localStorage.getItem("api_key")
      },
      body: JSON.stringify({
        "name": updatedName,
        "coordinate_x": updatedX,
        "coordinate_y": updatedY,
        "coordinate_z": updatedZ,
        "structure": updatedStructure,
        "notes": updatedNotes,
        "objects": updatedObjects
      })
    });

    // If nothing was changed, no changes are made and the backend handles the request with no errors

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status !== 200) {
      // An error has occured, alert the user
      alert(obj.message);
      return;
    }

    // Everything was successful, the page navigates back to the Map component
    navigate(-1);
  }

  // Request to the backend to delete the destination
  const deleteDestination = async () => {
    // Ask the user if they want to continue
    if (window.confirm("Are you sure you want to delete this destination?")) {
      const response = await fetch(`api/destinations/${destination.id}?world_id=${destination.world_id}`, {
        method: 'DELETE',
        headers: {
          "x-api-key": localStorage.getItem("api_key")
        }
      });

      const json = await response.text();
      const obj = JSON.parse(json);

      if (response.status !== 200) {
        // If there was an error, alert the user
        alert(obj.message);
        return;
      }

      // Everything was successful, return to the Map component
      navigate(-1);
    }
  }

  // When the edit mode for destination objects is activated, reset the objects updated 
  // state so that multiple entries of the same name aren't made
  function enterEditObjectsMode(isEntering) {
    setUpdatedObjects([]);
    setEditObjects(isEntering);
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
          <div>
            <button className="btn" onClick={() => deleteDestination()}>Delete</button>
            <button className="btn" onClick={() => saveChanges()}>Save Changes</button>
          </div>
        </div>
      </header>

      <section className="destination">
        <div className="destination-coordinates">
          {!editCoords ? (
            <>
              <h1>Coordinates:</h1>
              <p>XYZ: {updatedX ? updatedX : destination.coordinate_x} / {updatedY ? updatedY : destination.coordinate_y} / {updatedZ ? updatedZ : destination.coordinate_z}
              </p>
              <h1>Type of structure</h1>
              <p>
                {updatedStructure ? (updatedStructure) : (destination.structure)}
              </p><br />
              <div onClick={() => setEditCoords(true)}>
                <FontAwesomeIcon icon={faPenToSquare} size="2x" className="icon" />
              </div>
            </>
          ) : (
            <form className="destination-form">
              <h1>Coordinates:</h1>
              <label>X: </label>
              <input type="number" min="-100000" max="100000" name="x" onChange={handleCoordChange} /><br />
              <label>Y: </label>
              <input type="number" min="-100000" max="100000" name="y" onChange={handleCoordChange} /><br />
              <label>Z: </label>
              <input type="number" min="-100000" max="100000" name="z" onChange={handleCoordChange} /><br />
              <h1>Structure:</h1>
              <input type="text" className="structure-select" list="structures"
                placeholder='Enter structure type' onChange={(e) => setUpdatedStructure(e.target.value)} />
              <datalist id="structures">
                {structureTypes.map((structure) => (
                  <option value={structure}>{structure}</option>
                ))}
              </datalist><br />
              <button onClick={() => setEditCoords(false)}>
                <FontAwesomeIcon icon={faFloppyDisk} size="2x" className="icon" />
              </button>
            </form>
          )}
        </div>
        <div className="destination-contains">
          <h1>Contains:</h1>
          {!editObjects ? (
            <>
              <ul>
                {(updatedObjects && updatedObjects.length > 0) ? (
                  updatedObjects.map((object) =>
                    <li>{object}</li>
                  )) : (
                  objects && objects.length > 0 &&
                  objects.map((object) =>
                    <li>{object.name}</li>
                  ))
                }
              </ul><br />
              <div onClick={() => enterEditObjectsMode(true)}>
                <FontAwesomeIcon icon={faPenToSquare} size="2x" className="icon" />
              </div>
            </>
          ) : (
            <form>
              {objectTypes.map((object) =>
                <>
                  <input type="checkbox" value={object} onChange={handleContainsChange} />
                  <label> {object}</label><br />
                </>
              )}
              <br />
              <button onClick={() => setEditObjects(false)} className="unstyled-button">
                <FontAwesomeIcon icon={faFloppyDisk} size="2x" className="icon" />
              </button>
            </form>
          )}
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
            onSave={(e) => setUpdatedNotes(e.value)}
            inline
            editButtonProps={{ style: { width: '48px' } }}
            showEditButton
          />
        </div>
      </section>
    </div>
  );
}

export default Destination;
