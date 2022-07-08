import './Map.css';
import AddDestination from './AddDestination';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faLocationDot, faPlus, faMinus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Map() {

  const [isModalActive, setModalActive] = useState(false);
  const [isSidebarActive, setSidebarActive] = useState(false);

  // Finds the center in the destination array for either x or y values
  function findCenterCoordinate(dataArray, isX) {
    let lowest = Infinity;
    let highest = -Infinity;

    for (let i = 0; i < dataArray.length; i++) {
      let value = isX ? dataArray[i].coordinates.x : dataArray[i].coordinates.y;
      if (lowest > value) {
        lowest = value;
      }

      if (highest < value) {
        highest = value;
      }
    }

    // Returns the middle between the lowest and highest value
    return [lowest, highest];
  }

  function positionIcon(coordinates) {
    let widthBounds = findCenterCoordinate(data, true);
    let heightBounds = findCenterCoordinate(data, false);

    let centerDestinationCoordinate = [(widthBounds[0] + widthBounds[1]) / 2, (heightBounds[0] + heightBounds[1]) / 2];
    let centerScreenCoordinate = [window.innerWidth / 2, window.innerHeight / 2];

    let destinationToScreenRatio;
    if (widthBounds[1] - widthBounds[0] > heightBounds[1] - heightBounds[0]) {
      destinationToScreenRatio = window.innerWidth / (widthBounds[1] - widthBounds[0]);
    } else {
      destinationToScreenRatio = window.innerHeight / (heightBounds[1] - heightBounds[0]);
    }

    // Push the destinations inwards so that the edge coordinates don't make contact with the border
    destinationToScreenRatio *= 0.4;

    let xOffset = (centerDestinationCoordinate[0] - coordinates.x) * destinationToScreenRatio;
    if (coordinates.x > centerDestinationCoordinate[0]) {
      // We need to offset the x to the right as the original coordinate is to the right of the center
      xOffset = Math.abs(xOffset);
    } else {
      xOffset = -Math.abs(xOffset);
    }

    let yOffset = (centerDestinationCoordinate[1] - coordinates.y) * destinationToScreenRatio;
    if (coordinates.y > centerDestinationCoordinate[1]) {
      // We need to offset the y to the top as the original coordinate is upwards of the center
      yOffset = Math.abs(yOffset);
    } else {
      yOffset = -Math.abs(yOffset);
    }

    // "Possible" TODO: Fix positioning of icons due to the icons spawning from the top left

    return {
      position: "absolute",
      fontSize: "2rem",
      left: `${centerScreenCoordinate[0] + xOffset}px`,
      bottom: `${centerScreenCoordinate[1] + yOffset}px`,
    };
  }

  // Sample destination data
  const data = [
    {
      "name": "Dirt House",
      "coordinates": {
        "x": -10000,
        "y": 1879,
        "z": 0,
      },
      "structure": "Village",
      "contains": [
        "Iron Ingots",
        "Wheat Farm",
        "Leather Trader",
      ],
      "notes":
        "Village is next to lava pool. Can be easy to make nether portal next to village in future."
    },
    {
      "name": "Woodland Mansion",
      "coordinates": {
        "x": 6969,
        "y": -5000,
        "z": 0,
      },
      "structure": "Village",
      "contains": [
        "Iron Ingots",
        "Wheat Farm",
        "Leather Trader",
      ],
      "notes":
        "Village is next to lava pool. Can be easy to make nether portal next to village in future."
    },
    {
      "name": "Lava Pool",
      "coordinates": {
        "x": 2145,
        "y": -80,
        "z": 0,
      },
      "structure": "Village",
      "contains": [
        "Iron Ingots",
        "Wheat Farm",
        "Leather Trader",
      ],
      "notes":
        "Village is next to lava pool. Can be easy to make nether portal next to village in future."
    },
    {
      "name": "Village",
      "coordinates": {
        "x": -1000,
        "y": 3000,
        "z": 0,
      },
      "structure": "Village",
      "contains": [
        "Iron Ingots",
        "Wheat Farm",
        "Leather Trader",
      ],
      "notes":
        "Village is next to lava pool. Can be easy to make nether portal next to village in future."
    },
    {
      "name": "Cave Entrance",
      "coordinates": {
        "x": -500,
        "y": 10,
        "z": 0,
      },
      "structure": "Village",
      "contains": [
        "Iron Ingots",
        "Wheat Farm",
        "Leather Trader",
      ],
      "notes":
        "Village is next to lava pool. Can be easy to make nether portal next to village in future."
    }
  ];

  return (
    <div>
      <section className="map">
        <div className="map-overlay">
          <FontAwesomeIcon icon={faPlus} />
          <FontAwesomeIcon icon={faMinus} />
          <div className="map-destinations">
            {data.map((destination) =>
              <Link to="/destination" state={{destination: destination}}>
                <div className="destination-icon" style={positionIcon(destination.coordinates)}>
                  <span className="primary-tooltip">
                    <div className="secondary-tooltip">
                      <p>{destination.name}</p>
                      <p>{`(${destination.coordinates.x}, ${destination.coordinates.y}, ${destination.coordinates.z})`}</p>
                    </div>
                  </span>
                  <FontAwesomeIcon className="icon" icon={faLocationDot} />
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
      {isSidebarActive ? (
        <section className="map-sidebar">
          <div className="map-top">
            <div className="form-group">
              <input name="search" type="search" placeholder='Search'></input>
              <div onClick={() => setSidebarActive(false)}>
                <FontAwesomeIcon icon={faEyeSlash} className="eye-slash" />
              </div>
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
              {data.map((destination) =>
                <li><Link to="/destination" state={{destination: destination}}>{destination.name}</Link></li>
              )}
            </ul>
          </div>
          <div className="map-bottom">
            <div>World ID: 12345</div>
            <div><button className='btn'>Share World</button></div>
            <div>
              <button className='btn' onClick={() => setModalActive(true)}>Add Destination</button>
            </div>
            <div>
              <Link to="/menu">
                <button className='btn'>Menu</button>
              </Link>
            </div>
            <div>
              <FontAwesomeIcon icon={faPenToSquare} />
            </div>
          </div>
        </section>
      ) : (
        <section className="map-sidebar-collapsed">
          <div onClick={() => setSidebarActive(true)}>
            <FontAwesomeIcon icon={faEye} className="eye" />
          </div>
        </section>
      )}
      <AddDestination isVisible={isModalActive} setVisibility={(v) => setModalActive(v)} />
    </div>
  );
}

export default Map;