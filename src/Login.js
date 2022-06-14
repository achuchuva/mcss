import './Login.css';
import React from 'react';

function Login() {
  return (
    <div>
      <header className="navbar">
        <h1>Minecraft Coordinate Storage System</h1>
      </header>

      <section className="login">
        <div className="signin">
          <form action=''>
            <div className="form-group">
              <label>Username: </label><br />
              <input name='username' type="text" placeholder='Enter Username'></input>
            </div>
            <div className="form-group">
              <label>Password: </label><br />
              <input name='password' type="password" placeholder='Enter Password'></input>
            </div>
            <div className="login-message">
              Don't have an account? <a href="https://google.com" className="signup-link">Sign up</a>
            </div>
            <div className="form-group">
              <button type="submit" class="btn">Sign in</button>
            </div>
          </form>
        </div>
        <div className="signup">
          <form action=''>
            <div className="form-group">
              <label>Username: </label><br />
              <input name='username' type="text" placeholder='Enter Username'></input>
            </div>
            <div className="form-group">
              <label>Password: </label><br />
              <input name='password' type="password" placeholder='Enter Password'></input>
            </div>
            <div className="form-group">
              <label>Re-enter password: </label><br />
              <input name='reenter-password' type="password" placeholder='Re-enter password'></input>
            </div>
            <div className="form-group">
              <label>Email: </label><br />
              <input name='email' type="email" placeholder='Enter Email'></input>
            </div>
            <div className="login-message">
                Already have an account? <a href="https://google.com" className="signin-link">Sign in</a>
            </div>
            <div className="form-group">
              <button type="submit" class="btn">Sign up</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
