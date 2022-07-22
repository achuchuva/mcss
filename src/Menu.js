import './Menu.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft, faCircleRight, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { EditText } from 'react-edit-text';

function Menu() {
  let navigate = useNavigate();

  // Declaring all variables as states
  const [worlds, setWorlds] = useState([]);
  const [worldIndex, setWorldIndex] = useState(0);

  const [newWorld, setNewWorld] = useState(null);
  const [joinWorldID, setJoinWorldID] = useState(null);
  const [worldImage, setWorldImage] = useState("/images/menu_sample.jpg");

  // Async function for fetching worlds
  const fetchWorlds = async () => {
    const response = await fetch('api/worlds', {
      method: 'GET',
      headers: {
        "x-api-key": localStorage.getItem("api_key")
      }
    });

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status == 200) {
      setWorlds(obj);
    } else {
      alert(obj.message);
    }
  }

  // useEffect to fetchWorlds() when the page loads
  useEffect(() => {
    fetchWorlds();
  }, []);

  // Return the user to the login page and remove their authentication (delete API key)
  function logOut(e) {
    e.preventDefault();

    localStorage.clear("api_key");
    navigate("/");
  }

  // Display different world based on the direction the user clicked
  // Left is -1 and right is 1
  function changeWorlds(direction) {
    if (worldIndex + direction >= worlds.length) {
      setWorldIndex(0);
      return;
    }

    if (worldIndex + direction < 0) {
      setWorldIndex(worlds.length - 1);
      return;
    }

    setWorldIndex(worldIndex + direction);
  }

  // Request method to create a new world
  // Using the state variable to send the world name as JSON
  const createNewWorld = async () => {
    const response = await fetch('api/worlds', {
      method: 'POST',
      headers: {
        "x-api-key": localStorage.getItem("api_key")
      },
      body: JSON.stringify({
        "name": newWorld,
        "image_url": "https://google.com"
      })
    });

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status != 201) {
      alert(obj.errors[0]);
      console.log(obj);
      return;
    }

    fetchWorlds();
  }

  // Request to join a world of a different user
  // Using the state variable to send the world ID as JSON 
  const joinWorld = async () => {
    const response = await fetch('api/worlds/join', {
      method: 'POST',
      headers: {
        "x-api-key": localStorage.getItem("api_key")
      },
      body: JSON.stringify({
        "share_id": joinWorldID
      })
    });

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status != 200) {
      alert(obj.errors[0]);
      console.log(obj);
      return;
    }

    fetchWorlds();
  }

  // Request to delete the world
  const deleteWorld = async () => {
    // Only after the user has confirmed is the world deleted
    if (window.confirm("Are you sure you want to delete this world?")) {
      const response = await fetch(`api/worlds/${worlds[worldIndex].id}`, {
        method: 'DELETE',
        headers: {
          "x-api-key": localStorage.getItem("api_key")
        }
      });

      const json = await response.text();
      const obj = JSON.parse(json);

      if (response.status !== 200) {
        alert("An error occured, check your console");
        console.log(obj);
      }

      fetchWorlds();
    }
  }

  // Request to update the world name
  const updateWorldName = async (name) => {
    const response = await fetch(`api/worlds/${worlds[worldIndex].id}`, {
      method: 'PATCH',
      headers: {
        "x-api-key": localStorage.getItem("api_key")
      },
      body: JSON.stringify({
        "name": name, // Name is passed down as a parameter from input
      })
    });

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status != 200) {
      alert("An error occured, check your console");
      console.log(obj);
      return;
    }

    fetchWorlds();
  }
  
  // Function to set the state of the world image URL
  // The URL is then applied to the menu selection image
  function loadFile(e) {
    setWorldImage(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div>
      <header className="navbar">
        <button className="btn" onClick={(e) => logOut(e)}>Log out</button>
        <h1>Minecraft Coordinate Storage System</h1>
        <p>Successfully logged in</p>
      </header>
      <section className="menu-content">
        {worlds && worlds.length > 0 &&
          <div className="select-world">
            <h1>Select World</h1>
            <div className="holder">
              <div className="delete-icon" onClick={() => deleteWorld()}>
                <FontAwesomeIcon icon={faTrashCan} size="2x" className="icon" />
              </div>
              <Link to="/map" state={{ world: worlds[worldIndex] }}>
                <img className="img-holder" src={worldImage} alt="menu_sample" />
              </Link>
              <div className="selector">
                <div onClick={() => changeWorlds(-1)}>
                  <FontAwesomeIcon icon={faCircleLeft} size="2x" className="icon" />
                </div>
                <EditText
                  className="world-name"
                  defaultValue={worlds[worldIndex].name}
                  onSave={({ value }) => updateWorldName(value)}
                  style={{
                    fontSize: "25px",
                    width: "inherit",
                  }}
                  inline />
                <div onClick={() => changeWorlds(1)}>
                  <FontAwesomeIcon icon={faCircleRight} size="2x" className="icon" />
                </div>
              </div>
            </div>
            <input type="file" className="btn" accept='image/*' onChange={(e) => loadFile(e)} />
          </div>
        }
        <div className="change-world">
          <div className="create-world">
            <h1>Create New World</h1>
            <div className="holder">
              <div className="form-group">
                <label>World Name: </label><br />
                <input type="text" onChange={(e) => setNewWorld(e.target.value)} placeholder='Enter World Name'></input>
              </div>
              <div className="form-group">
                <button type="submit" className="btn" onClick={createNewWorld}>Create New World</button>
              </div>
            </div>
          </div>
          <div className="add-world">
            <h1>Join Shared World</h1>
            <div className="holder">
              <div className="form-group">
                <label>World ID: </label><br />
                <input type="text" onChange={(e) => setJoinWorldID(e.target.value)} placeholder='Enter World ID'></input>
              </div>
              <div className="form-group">
                <button type="submit" className="btn" onClick={() => joinWorld()}>Join World</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Menu;
