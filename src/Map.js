import './Map.css';
import AddDestination from './AddDestination';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPlus, faMinus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Map() {
  // Using location from react router, state params are passed down from the Menu component
  const data = useLocation();

  let navigate = useNavigate();

  // Declare all state variables required
  const [shared, setShared] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState(null);
  const [currentRealm, setCurrentRealm] = useState("Overworld");

  // Function requesting all destinations for the given world id selected by the user
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
      // An error occured and the user is navigated back to the menu
      alert(obj.message);
      navigate(-1);
    }
  }

  // When component mounts fetch destinations
  // When the state isModalActive changes, fetch destinations
  useEffect(() => {
    fetchDestinations();
  }, [isModalActive]);

  // States to determine whether modal (Add Destination popup) and sidebar is active
  const [isModalActive, setModalActive] = useState(false);
  const [isSidebarActive, setSidebarActive] = useState(true);

  // Depending on the current realm state, the background image of the map changes
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

  // Function for when the modal visibility changes
  // Fetch destinations again in case the destinations updated
  function changeModal(visibility) {
    setModalActive(visibility);
    fetchDestinations();
  }

  // Request the backend to allow the world to be shared with others
  const shareWorld = async (e) => {
    e.preventDefault();

    // Confirm for user
    if (!window.confirm("Are you sure you want to share this world? This cannot be undone"))
      return;

    const response = await fetch(`api/worlds/${data.state.world.id}`, {
      method: 'PATCH',
      headers: {
        "x-api-key": localStorage.getItem("api_key")
      },
      body: JSON.stringify({
        shared: "1" // MySQL doesn't understand bools, use 1 / 0 instead
      })
    });

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status !== 200) {
      // An issue occured, inform the user
      alert("An error occured with sharing the world");
      console.log(obj);
    } else {
      setShared(true);
    }
  }

  // Finds the bounds in the destination array for either x or z values
  function findCoordinateBounds(dataArray, isX) {
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

    // Returns the lowest and highest values in an array
    return [lowest, highest];
  }

  function positionIcon(coordinates) {
    let realmDestinations = [];

    // Loop through destinations and filter out whose realm doesn't match the currently selected realm
    for (let i = 0; i < destinations.length; i++) {
      if (destinations[i].realm === currentRealm) {
        realmDestinations.push(destinations[i]);
      }
    }

    // If there is only one destination, completely center the coordinate and return
    if (realmDestinations.length === 1) {
      return {
        position: "absolute",
        fontSize: "2rem",
        left: `${window.innerWidth / 2}px`,
        bottom: `${window.innerHeight / 2}px`,
      };
    }

    // Find the two x coordinate values that are the furthest apart (lowest and highest)
    let widthBounds = findCoordinateBounds(realmDestinations, true);

    // Find the two z coordinate values that are the furthest apart (lowest and highest)
    let heightBounds = findCoordinateBounds(realmDestinations, false);

    // Find the center coordinate of the destinations based on the largest difference found by the bounds
    let centerDestinationCoordinate = [(widthBounds[0] + widthBounds[1]) / 2, (heightBounds[0] + heightBounds[1]) / 2];

    // Find the center coordinate of the screen
    let centerScreenCoordinate = [window.innerWidth / 2, window.innerHeight / 2];

    // Find the destination to screen ratio to convert coordinate values to pixels
    let destinationToScreenRatio;

    // Whichever bound difference is greatest
    // i.e. is the difference between the largest x values greater than the difference between the larget z values?
    // is then used to set the ratio
    if (widthBounds[1] - widthBounds[0] > heightBounds[1] - heightBounds[0]) {
      destinationToScreenRatio = window.innerWidth / (widthBounds[1] - widthBounds[0]);
    } else {
      destinationToScreenRatio = window.innerHeight / (heightBounds[1] - heightBounds[0]);
    }

    // Push the destinations inwards so that the edge coordinates don't make contact with the border
    destinationToScreenRatio *= 0.5;

    // Find the offset of the coordinates from the center along the x axis
    let xOffset = (centerDestinationCoordinate[0] - coordinates.x) * destinationToScreenRatio;
    if (coordinates.x > centerDestinationCoordinate[0]) {
      // We need to offset the x to the right as the original coordinate is to the right of the center
      xOffset = Math.abs(xOffset);
    } else {
      xOffset = -Math.abs(xOffset);
    }

    // Find the offset of the coordinates from the center along the z axis
    let zOffset = (centerDestinationCoordinate[1] - coordinates.z) * destinationToScreenRatio;
    if (coordinates.z > centerDestinationCoordinate[1]) {
      // We need to offset the z to the top as the original coordinate is upwards of the center
      zOffset = Math.abs(zOffset);
    } else {
      zOffset = -Math.abs(zOffset);
    }

    // As the coordinate bounds are used to find the center, they should all fit onto the map

    // "Possible" TODO: Fix positioning of icons due to the icons spawning from the top left

    // Return the position as a style using left and bottom
    return {
      position: "absolute",
      fontSize: "2rem",
      left: `${centerScreenCoordinate[0] + xOffset}px`,
      bottom: `${centerScreenCoordinate[1] + zOffset}px`,
    };
  }

  // Search function for the sidebar
  function filterDestinations(searchValue) {
    if (searchValue !== "") {
      let newDestinations = [];
      for (let i = 0; i < destinations.length; i++) {
        if (destinations[i].name.toUpperCase().indexOf(searchValue) > -1) {
          // The search value is found to match the destination name
          newDestinations.push(destinations[i]);
        }
      }

      setFilteredDestinations(newDestinations);
    } else {
      // If the search value is blank, null the filtered destinations to display all destinations
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
          <FontAwesomeIcon icon={faPlus} className="icon" />
          <FontAwesomeIcon icon={faMinus} className="icon" />
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
                    <FontAwesomeIcon className="icon" icon={faLocationDot}/>
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
                <FontAwesomeIcon icon={faEyeSlash} className="eye-slash icon"/>
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
