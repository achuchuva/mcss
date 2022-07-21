import './Map.css';
import AddDestination from './AddDestination';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPlus, faMinus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Map() {
  const data = useLocation();
  let navigate = useNavigate();

  const [shared, setShared] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState(null);
  const [currentRealm, setCurrentRealm] = useState("Overworld");

  const fetchDestinations = async () => {
    const response = await fetch(`api/destinations/?world_id=${data.state.world.id}`, {
      method: 'GET',
      headers: {
        "x-api-key": localStorage.getItem("api_key")
      }
    });

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status == 200) {
      setDestinations(obj);
    } else {
      alert(obj.message);
      navigate(-1);
    }
  }

  useEffect(() => {
    fetchDestinations();
  }, [isModalActive]);

  const [isModalActive, setModalActive] = useState(false);
  const [isSidebarActive, setSidebarActive] = useState(true);

  function getBackgroundImage() {
    switch (currentRealm) {
      case "Overworld":
        return "/images/map_sample.webp";
      case "Nether":
        return "/images/nether_map.png";
      case "The End":
        return "/images/end_map.webp";
    }
  }

  function changeModal(v) {
    setModalActive(v);
    fetchDestinations();
  }

  const shareWorld = async (e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to share this world? This cannot be undone"))
      return;

    const response = await fetch(`api/worlds/${data.state.world.id}`, {
      method: 'PATCH',
      headers: {
        "x-api-key": localStorage.getItem("api_key")
      },
      body: JSON.stringify({
        shared: "1"
      })
    });

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status !== 200) {
      alert("An error occured with sharing the world");
      console.log(obj);
    } else {
      setShared(true);
    }
  }

  // Finds the center in the destination array for either x or z values
  function findCenterCoordinate(dataArray, isX) {
    let lowest = Infinity;
    let highest = -Infinity;

    for (let i = 0; i < dataArray.length; i++) {
      let value = isX ? dataArray[i].coordinate_x : dataArray[i].coordinate_z;
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
    let realmDestinations = [];

    for (let i = 0; i < destinations.length; i++) {
      if (destinations[i].realm === currentRealm) {
        realmDestinations.push(destinations[i]);
      }
    }

    if (realmDestinations.length === 1) {
      return {
        position: "absolute",
        fontSize: "2rem",
        left: `${window.innerWidth / 2}px`,
        bottom: `${window.innerHeight / 2}px`,
      };
    }

    let widthBounds = findCenterCoordinate(realmDestinations, true);
    let heightBounds = findCenterCoordinate(realmDestinations, false);

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

    let zOffset = (centerDestinationCoordinate[1] - coordinates.z) * destinationToScreenRatio;
    if (coordinates.z > centerDestinationCoordinate[1]) {
      // We need to offset the z to the top as the original coordinate is upwards of the center
      zOffset = Math.abs(zOffset);
    } else {
      zOffset = -Math.abs(zOffset);
    }

    // "Possible" TODO: Fix positioning of icons due to the icons spawning from the top left

    return {
      position: "absolute",
      fontSize: "2rem",
      left: `${centerScreenCoordinate[0] + xOffset}px`,
      bottom: `${centerScreenCoordinate[1] + zOffset}px`,
    };
  }

  function filterDestinations(searchValue) {
    if (searchValue !== "") {
      let newDestinations = [];
      for (let i = 0; i < destinations.length; i++) {
        if (destinations[i].name.toUpperCase().indexOf(searchValue) > -1) {
          newDestinations.push(destinations[i]);
        }
      }

      setFilteredDestinations(newDestinations);
    } else {
      setFilteredDestinations(null);
    }
  }

  return (
    <div>
      <section className="map"
        style={{
          background: `url(${getBackgroundImage()}) 
            no-repeat center center/cover`,
        }}>
        <div className="map-overlay">
          <FontAwesomeIcon icon={faPlus} />
          <FontAwesomeIcon icon={faMinus} />
          <div className="map-destinations">
            {destinations && destinations.length > 0 &&
              destinations.map((destination) =>
                destination.realm === currentRealm &&
                <Link to="/destination" state={{ destination: destination }}>
                  <div className="destination-icon" style={positionIcon(
                    {
                      x: destination.coordinate_x,
                      y: destination.coordinate_y,
                      z: destination.coordinate_z
                    }
                  )}>
                    <span className="primary-tooltip">
                      <div className="secondary-tooltip">
                        <p>{destination.name}</p>
                        <p>{`(${destination.coordinate_x}, ${destination.coordinate_y}, ${destination.coordinate_z})`}</p>
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
              <input name="search" type="search" placeholder='Search' onChange={(e) => filterDestinations(e.target.value.toUpperCase())}></input>
              <div onClick={() => setSidebarActive(false)}>
                <FontAwesomeIcon icon={faEyeSlash} className="eye-slash" />
              </div>
            </div>
            <div className="select-group">
              <select name="realm" className="realm-select" onChange={(e) => setCurrentRealm(e.target.value)}>
                <option value="" disabled selected hidden>Select realm</option>
                <option value="Overworld">Overworld</option>
                <option value="Nether">Nether</option>
                <option value="The End">The End</option>
              </select>
            </div>
            <ul className="map-list">
              {filteredDestinations ?
                (
                  filteredDestinations.map((destination) =>
                    destination.realm === currentRealm &&
                    <li><Link to="/destination" state={{ destination: destination }}>{destination.name}</Link></li>
                  )
                ) : (
                  destinations && destinations.length > 0 &&
                  destinations.map((destination) =>
                    destination.realm === currentRealm &&
                    <li><Link to="/destination" state={{ destination: destination }}>{destination.name}</Link></li>
                  )
                )}
            </ul>
          </div>
          <div className="map-bottom">
            <div>World ID: {data.state.world.share_id}</div>
            {data.state.world.shared || shared ? (
              <div><button className='btn' onClick={(e) => shareWorld(e)} disabled>Share World</button></div>
            ) : (
              <div><button className='btn' onClick={(e) => shareWorld(e)}>Share World</button></div>
            )}
            <div>
              <button className='btn' onClick={() => setModalActive(true)}>Add Destination</button>
            </div>
            <div>
              <Link to="/menu">
                <button className='btn'>Menu</button>
              </Link>
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
      {isModalActive &&
        <AddDestination setVisibility={(v) => changeModal(v)} world_id={data.state.world.id} realm={currentRealm} />
      }
    </div>
  );
}

export default Map;