import './Destination.css';
import React from 'react';

function Destination() {
  return (
    <div>
      <header className="destination-navbar">
        <div className="destination-overlay">
          <div>
            <button className="btn">Menu</button>
            <button className="btn">Map</button>
          </div>
          <h1>Overworld Village</h1>
          <button className="btn">Save Changes</button>
        </div>
      </header>

      <section className="destination">
        <div className="destination-coordinates">
          <h1>Coordinates:</h1>
          <p>XYZ: 1.0 / 1.0 / 1.0</p>
          <h1>Type of structure</h1>
          <p>Village</p>
        </div>
        <div className="destination-contains">
          <h1>Contains:</h1>
          <ul>
            <li>Iron Ingots</li>
            <li>Wheat Farm</li>
            <li>Leather Trader</li>
          </ul>
        </div>
        <div className="destination-notes">
          <h1>Notes and Comments</h1>
          <p>Village is next to lava pool. Can be easy to make nether portal next to village in future.</p>
        </div>
      </section>
    </div>
  );
}

export default Destination;
