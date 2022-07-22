import './AddDestination.css';
import React, { useState } from 'react';
import Modal from 'react-modal';

// Default structure types listed here
const structureTypes = ["Village", "Cave", "Dungeon", "Stronghold", "Ocean Monument", "Desert Temple", "Igloo", "Shipwreck", "Woodland Mansion", "Bastion", "Nether Fortress", "Ruined Portal", "End Gateway", "End City", "End Ship", "End Portal"];
// Options to choose different objects that the destination contains
const objectTypes = ["Crafting Table", "Furnace", "Chest", "Ender Chest", "Enchanting Table", "Brewing Stand", "Jukebox", "Dispenser", "Piston", "Bed", "Anvil"];

function AddDestination({ setVisibility, world_id, realm }) {

  // Set all the fields to states that the user could submit to the backend
  const [name, setName] = useState("");
  const [coordinateX, setCoordinateX] = useState("0");
  const [coordinateY, setCoordinateY] = useState("0");
  const [coordinateZ, setCoordinateZ] = useState("0");
  const [structure, setStructure] = useState("");
  const [objects, setObjects] = useState([]);
  const [notes, setNotes] = useState("");

  // Function for handling when the checkbox values for what the destination contains changes
  function handleContainsChange(e) {
    let array = objects;
    if (e.target.checked) {
      // Checked, add it to the array
      array.push(e.target.value);
    } else {
      // Unchecked, remove it from the array if it is present
      array.splice(array.indexOf(e.target.value), 1);
    }

    setObjects(array);
  }

  // Close the modal
  function cancel() {
    setVisibility(false);
  }

  // Send a request to add the destination to the backend
  const addDestination = async (e) => {
    e.preventDefault();

    // If the objects were checked and unchecked, it should be reset to null so the server
    // understands the request
    if (objects !== null) {
      if (objects.length === 0) {
        setObjects(null);
      }
    }

    const response = await fetch(`api/destinations/?world_id=${world_id}`, {
      method: 'POST',
      headers: {
        "x-api-key": localStorage.getItem("api_key")
      },
      body: JSON.stringify({
        "name": name,
        "realm": realm,
        "coordinate_x": coordinateX,
        "coordinate_y": coordinateY,
        "coordinate_z": coordinateZ,
        "structure": structure,
        "notes": notes,
        "objects": objects
      })
    });

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status !== 201) {
      // The request wasn't valid, inform the user of what needs to be fixed
      alert("The following error occured: " + obj.errors[0]);
      return;
    }

    setVisibility(false);
  }

  return (
    <Modal
      isOpen={true}
    >
      <div className="add-destination">
        <header className='navbar'>
          <h1>Add New Destination</h1>
        </header>
        <div className='form-group'>
          <label>Destination Coordinates:</label>
          <div className="coordinates">
            <div>X:</div><input value={coordinateX} min="-100000" max="100000" type="number" onChange={(e) => setCoordinateX(e.target.value)}></input>
            <div>Y:</div><input value={coordinateY} min="-100000" max="100000" type="number" onChange={(e) => setCoordinateY(e.target.value)}></input>
            <div>Z:</div><input value={coordinateZ} min="-100000" max="100000" type="number" onChange={(e) => setCoordinateZ(e.target.value)}></input>
          </div>
        </div>

      </div>
      <div className='form-group'>
        <label>Destination Name:</label><br />
        <input value={name} type="text" onChange={(e) => setName(e.target.value)} placeholder='Enter name'></input>
      </div>
      <div className='form-group'>
        <label>Type of structure:</label><br />
        <input type="text" className="structure-select" list="structures"
          placeholder='Enter structure type' onChange={(e) => setStructure(e.target.value)} />
        <datalist id="structures">
          {structureTypes.map((structure) => (
            <option value={structure}>{structure}</option>
          ))}
        </datalist>
      </div>
      <div className='form-group'>
        <label>Destination Contains:</label>
        <div>
          {objectTypes.map((object) => (
            <>
              <input type="checkbox" value={object} onChange={(e) => handleContainsChange(e)}></input>
              <label>{object}</label><br />
            </>
          ))}
        </div>
      </div>
      <div className='form-group'>
        <label>Additional Notes:</label><br />
        <textarea onChange={(e) => setNotes(e.target.value)}></textarea>
      </div>
      <button className="btn" onClick={cancel}>Cancel</button>
      <button type="submit" className="btn" onClick={(e) => addDestination(e)}>Add Destination</button>
    </Modal>
  );
}

export default AddDestination;
