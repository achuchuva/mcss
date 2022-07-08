import './Menu.css';
import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div>
      <header className="navbar">
        <Link to="/"><button className="btn">Log out</button></Link>
        <h1>Minecraft Coordinate Storage System</h1>
        <p>Welcome, Username</p>
      </header>

      <section className="menu-content">
        <div className="select-world">
          <h1>Select World</h1>
          <div className="holder">
            <Link to="/map">
            <img className="img-holder" src={"/images/menu_sample.jpg"} alt="menu_sample" />
            </Link>
            <div className="selector">
              <div className="world-name">First World</div>
            </div>
          </div>
          <input type="file" className="btn" />
        </div>
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
