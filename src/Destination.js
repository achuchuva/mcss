import './Destination.css';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { EditText, EditTextarea } from 'react-edit-text';

const structureTypes = ["Village", "Cave", "Dungeon", "Stronghold", "Ocean Monument", "Desert Temple", "Igloo", "Shipwreck", "Woodland Mansion", "Bastion", "Nether Fortress", "Ruined Portal", "End Gateway", "End City", "End Ship", "End Portal"];
const objectTypes = ["Crafting Table", "Furnace", "Chest", "Ender Chest", "Enchanting Table", "Brewing Stand", "Jukebox", "Dispenser", "Piston", "Bed", "Anvil"];

function Destination() {
  const data = useLocation();
  const { destination } = data.state;

  let navigate = useNavigate();

  const [objects, setObjects] = useState([]);
  const [updatedName, setUpdatedName] = useState();
  const [updatedX, setUpdatedX] = useState();
  const [updatedY, setUpdatedY] = useState();
  const [updatedZ, setUpdatedZ] = useState();
  const [updatedStructure, setUpdatedStructure] = useState();
  const [updatedObjects, setUpdatedObjects] = useState(null);
  const [updatedNotes, setUpdatedNotes] = useState();

  const [editCoords, setEditCoords] = useState(false);
  const [editObjects, setEditObjects] = useState(false);

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

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status !== 200) {
      alert(obj.message);
      return;
    }

    navigate(-1);
  }

  const deleteDestination = async () => {
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
        alert(obj.message);
        return;
      }

      navigate(-1);
    }
  }

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
                <FontAwesomeIcon icon={faPenToSquare} size="2x" />
              </div>
            </>
          ) : (
            <form>
              <h1>Coordinates:</h1>
              <label>X: </label>
              <input type="number" name="x" onChange={handleCoordChange} /><br />
              <label>Y: </label>
              <input type="number" name="y" onChange={handleCoordChange} /><br />
              <label>Z: </label>
              <input type="number" name="z" onChange={handleCoordChange} /><br />
              <h1>Structure:</h1>
              <input type="text" className="structure-select" list="structures"
                placeholder='Enter structure type' onChange={(e) => setUpdatedStructure(e.target.value)} />
              <datalist id="structures">
                {structureTypes.map((structure) => (
                  <option value={structure}>{structure}</option>
                ))}
              </datalist><br />
              <button onClick={() => setEditCoords(false)}>
                <FontAwesomeIcon icon={faFloppyDisk} size="2x" />
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
                <FontAwesomeIcon icon={faPenToSquare} size="2x" />
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
              <button onClick={() => setEditObjects(false)}>
                <FontAwesomeIcon icon={faFloppyDisk} size="2x" />
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
