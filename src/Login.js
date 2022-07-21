import './Login.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  let navigate = useNavigate();
  const PATTERN = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

  async function handleLoginIn(e) {
    e.preventDefault();
    const form = document.getElementById("login-form");
    const invalidMessage = document.getElementsByClassName("invalid-submission")[0];

    if (!form.email.value) {
      invalidMessage.innerHTML = "Invalid submission: Email was not provided";
      invalidMessage.style.display = "block";
      return;
    }

    if (!form.password.value) {
      invalidMessage.innerHTML = "Invalid submission: Password was not provided";
      invalidMessage.style.display = "block";
      return;
    }

    const response = await fetch('/api/login.php', {
      method: 'POST',
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value
      })
    });

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status === 200) {
      localStorage.setItem("api_key", obj.api_key);
      navigate("/menu");
    } else {
      invalidMessage.innerHTML = "Invalid submission: " + obj.message;
      invalidMessage.style.display = "block";
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    const form = document.getElementById("signup-form");
    const invalidMessage = document.getElementsByClassName("invalid-submission")[1];

    if (!PATTERN.exec(form.email.value)) {
      invalidMessage.innerHTML = "Invalid submission: Email address isn't valid";
      invalidMessage.style.display = "block";
      return;
    }

    if (form.password.value !== form.reenterPassword.value) {
      invalidMessage.innerHTML = "Invalid submission: Password and re-entry fields don't match";
      invalidMessage.style.display = "block";
      return;
    }

    const response = await fetch('/api/register.php', {
      method: 'POST',
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value
      })
    });

    const json = await response.text();
    const obj = JSON.parse(json);

    if (response.status === 200) {
      localStorage.setItem("api_key", obj.api_key);
      navigate("/menu");
    } else {
      invalidMessage.style.display = "block";
      invalidMessage.innerHTML = "Invalid submission: " + obj.message;
    }
  }

  return (
    <div>
      <header className="navbar">
        <h1>Minecraft Coordinate Storage System</h1>
      </header>

      <section className="login">
        <div className="signin">
          <form action='' id="login-form">
            <div className="form-group">
              <label>Email: </label><br />
              <input name='email' type="email" placeholder='Enter Email'></input>
            </div>
            <div className="form-group">
              <label>Password: </label><br />
              <input name='password' type="password" placeholder='Enter Password'></input>
            </div>
            <div className="login-message">
              Don't have an account? Sign up instead
            </div>
            <div className="invalid-submission" />
            <div className="form-group">
              <button type="submit" className="btn" onClick={(e) => handleLoginIn(e)}>Sign in</button>
            </div>
          </form>
        </div>
        <div className="signup">
          <form action='' id="signup-form">
            <div className="form-group">
              <label>Email: </label><br />
              <input name='email' type="email" placeholder='Enter Email'></input>
            </div>
            <div className="form-group">
              <label>Password: </label><br />
              <input name='password' type="password" placeholder='Enter Password'></input>
            </div>
            <div className="form-group">
              <label>Re-enter password: </label><br />
              <input name='reenterPassword' type="password" placeholder='Re-enter password'></input>
            </div>
            <div className="login-message">
              Already have an account? Sign in instead
            </div>
            <div className="invalid-submission">
              Invalid submission: Email or password entered was incorrect
            </div>
            <div className="form-group">
              <button type="submit" className="btn" onClick={(e) => handleSignUp(e)}>Sign up</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
