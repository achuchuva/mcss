import './Menu.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft, faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

function Menu() {
  let navigate = useNavigate();

  const [worlds, setWorlds] = useState([]);
  const [worldIndex, setWorldIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  function logOut(e) {
    e.preventDefault();

    localStorage.clear("api_key");
    navigate("/");
  }

  function changeWorlds(direction) {
    if (worldIndex + direction >= worlds.length || worldIndex + direction < 0) {
      return;
    }

    setWorldIndex(worldIndex + direction);
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
              <Link to="/map" state={{world_id: worlds[worldIndex].id}}>
                <img className="img-holder" src={"/images/menu_sample.jpg"} alt="menu_sample" />
              </Link>
              <div className="selector">
                <div onClick={() => changeWorlds(-1)}>
                  <FontAwesomeIcon icon={faCircleLeft} size="2x" />
                </div>
                <div className="world-name">{worlds[worldIndex].name}</div>
                <div onClick={() => changeWorlds(1)}>
                  <FontAwesomeIcon icon={faCircleRight} size="2x" />
                </div>
              </div>
            </div>
            <input type="file" className="btn" />
          </div>
        }
        <div className="change-world">
          <div className="create-world">
            <h1>Create New World</h1>
            <div className="holder">
              <div className="form-group">
                <label>World Name: </label><br />
                <input name='world-name' type="text" placeholder='Enter World Name'></input>
              </div>
              <div className="form-group">
                <button type="submit" className="btn">Add World</button>
              </div>
            </div>
          </div>
          <div className="add-world">
            <h1>Add Shared World</h1>
            <div className="holder">
              <div className="form-group">
                <label>World ID: </label><br />
                <input name='world-name' type="text" placeholder='Enter World ID'></input>
              </div>
              <div className="form-group">
                <button type="submit" className="btn">Add World</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Menu;
