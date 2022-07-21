import './Menu.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft, faCircleRight, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { EditText } from 'react-edit-text';

function Menu() {
  let navigate = useNavigate();

  const [worlds, setWorlds] = useState([]);
  const [worldIndex, setWorldIndex] = useState(0);

  const [newWorld, setNewWorld] = useState(null);
  const [worldImage, setWorldImage] = useState("/images/menu_sample.jpg")

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

  useEffect(() => {
    fetchWorlds();
  }, []);

  function logOut(e) {
    e.preventDefault();

    localStorage.clear("api_key");
    navigate("/");
  }

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

    if (response.status == 201) {
      setWorlds(obj);
    } else {
      alert("An error has occured");
      console.log(obj);
      return;
    }

    fetchWorlds();
  }

  const deleteWorld = async () => {
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
        alert("An error occured");
        console.log(obj);
      }

      fetchWorlds();
    }
  }

  const updateWorldName = async (name) => {
    const response = await fetch(`api/worlds/${worlds[worldIndex].id}`, {
      method: 'PATCH',
      headers: {
        "x-api-key": localStorage.getItem("api_key")
      },
      body: JSON.stringify({
        "name": name,
      })
    });

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status != 200) {
      alert("An error has occured");
      console.log(obj);
      return;
    }

    fetchWorlds();
  }
  
  function loadFile(e) {
    let image = document.getElementsByClassName("img-holder");
    console.log("before", image.src);
    setWorldImage(URL.createObjectURL(e.target.files[0]));
    console.log("after", image.src);
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
                <FontAwesomeIcon icon={faTrashCan} size="2x" />
              </div>
              <Link to="/map" state={{ world: worlds[worldIndex] }}>
                <img className="img-holder" src={worldImage} alt="menu_sample" />
              </Link>
              <div className="selector">
                <div onClick={() => changeWorlds(-1)}>
                  <FontAwesomeIcon icon={faCircleLeft} size="2x" />
                </div>
                <EditText
                  className="world-name"
                  defaultValue={worlds[worldIndex].name}
                  onSave={({ value }) => updateWorldName(value)}
                  inline />
                <div onClick={() => changeWorlds(1)}>
                  <FontAwesomeIcon icon={faCircleRight} size="2x" />
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
                <input type="text" placeholder='Enter World ID'></input>
              </div>
              <div className="form-group">
                <button type="submit" className="btn">Join World</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Menu;
