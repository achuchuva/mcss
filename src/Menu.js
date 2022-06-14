import './Menu.css';
import React from 'react';

function Menu() {
  return (
    <div>
      <header className="navbar">
        <button className="btn">Log out</button>
        <h1>Minecraft Coordinate Storage System</h1>
        <p>Welcome, Username</p>
      </header>

      <section className="menu-content">
        <div className="select-world">
          <h1>Select World</h1>
          <div className="holder">
            <img className="img-holder" src={"/images/menu_sample.jpg"} alt="menu_sample" />
            <div className="selector">
              <div className="world-name">First World</div>
            </div>
          </div>
          <button className="btn">Upload Custom Image</button>
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
                <button type="submit" class="btn">Add World</button>
              </div>
            </div>
          </div>
          <div className="add-world">
            <h1>Add Shared World</h1>
            <div className="holder">
              <div className="form-group">
                <label>World Name: </label><br />
                <input name='world-name' type="text" placeholder='Enter World Name'></input>
              </div>
              <div className="form-group">
                <button type="submit" class="btn">Add World</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Menu;
