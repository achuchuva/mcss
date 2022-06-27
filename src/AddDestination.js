import './AddDestination.css';
import React, { useState } from 'react';
import Modal from 'react-modal';

function AddDestination() {

  const [isVisible, setIsVisible] = useState(true);

  function cancel() {
    setIsVisible(false);
  }

  return (
    <Modal
      isOpen={isVisible}
    >
      <div className="add-destination">
        <header className='navbar'>
          <h1>Add New Destination</h1>
        </header>
        <div className='form-group'>
          <label>Destination Coordinates:</label>
          <div className="coordinates">
            <div>X:</div><input name="x" type="number"></input>
            <div>Y:</div><input name="y" type="number"></input>
            <div>Z:</div><input name="z" type="number"></input>
          </div>
        </div>
      </div>
      <div className='form-group'>
        <label>Destination Name:</label>
        <input name="name" type="text" placeholder='Enter name'></input>
      </div>
      <div className='form-group'>
        <label>Type of structure:</label>
        <select name="structure-type" className="structure-select">
          <option value="" disabled selected hidden>Select Structure Type</option>
          <option value="village">Village</option>
          <option value="nether-portal">Nether Portal</option>
          <option value="cave">Cave</option>
        </select>
      </div>
      <div className='form-group'>
        <label>Destination Contains:</label>
        <div>
          <label>Furnace</label>
          <input type="checkbox" name="furnace" value="furnace"></input>
          <label>Chest</label>
          <input type="checkbox" name="chest" value="chest"></input>
          <label>Other...</label>
          <input type="checkbox" name="other" value="other"></input>
        </div>
      </div>
      <div className='form-group'>
        <label>Additional Notes:</label>
        <textarea></textarea>
      </div>
      <button className="btn" onClick={cancel}>Cancel</button>
      <button type="submit" className="btn">Add Destination</button>
    </Modal>
  );
}

export default AddDestination;