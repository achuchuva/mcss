import './Map.css';
import AddDestination from './AddDestination';
import React from 'react';
import { Link } from 'react-router-dom';
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
            <li><Link to="/destination">Dirt House</Link></li>
            <li><Link to="/destination">Woodland Mansion</Link></li>
            <li><Link to="/destination">Lava Pool</Link></li>
            <li><Link to="/destination">Village</Link></li>
            <li><Link to="/destination">Cave Entrance</Link></li>
          </ul>
        </div>
        <div className="map-bottom">
          <div>World ID: 12345</div>
          <div><button className='btn'>Share World</button></div>
          <div>
            <button className='btn'>Add Destination</button>
          </div>
          <div>
            <Link to="/menu">
              <button className='btn'>Menu</button>
            </Link>
          </div>
        </div>
      </section>
      <AddDestination />
    </div>
  );
}

export default Map;