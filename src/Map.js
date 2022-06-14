import './Map.css';
import './AddDestination.css'
import React from 'react';
import Modal from 'react-modal';

function Map() {
  return (
    <div>
      <section className="map">
        <div className="map-overlay">

        </div>
      </section>
      <section className="map-sidebar">
        <div className="map-top">
          <div className="form-group">
            <input name="search" type="search" placeholder='Search'></input>
          </div>
          <div className="select-group">
            <select name="realm" className="realm-select">
              <option value="" disabled selected hidden>Select realm</option>
              <option value="overworld">Overworld</option>
              <option value="nether">Nether</option>
              <option value="end">The End</option>
            </select>
          </div>
          <ul className="map-list">
            <li><a href="https://google.com">Dirt House</a></li>
            <li><a href="https://google.com">Woodland Mansion</a></li>
            <li><a href="https://google.com">Lava Pool</a></li>
            <li><a href="https://google.com">Village</a></li>
            <li><a href="https://google.com">Cave Entrance</a></li>
          </ul>
        </div>
        <div className="map-bottom">
          <div>World ID: 12345</div>
          <div><button className='btn'>Share World</button></div>
          <div><button className='btn'>Add Destination</button></div>
          <div><button className='btn'>Menu</button></div>
        </div>
      </section>

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
        <button className="btn">Cancel</button>
        <button type="submit" className="btn">Add Destination</button>
      </Modal>
    </div>
  );
}

export default Map;