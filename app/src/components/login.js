import React from 'react';
import { useState } from 'react';
import '../css/authentication.css';
import { useHistory, Link  } from 'react-router-dom';

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();


    const loginButtonClicked = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/users`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const user = data.find(user => user.username === username && user.password === password);
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                history.push('/home');
            } else {
                throw new Error('Unauthorized user');
            }
        } catch (error) {
            alert(error.message);
        }
    }
    
    const handleUsernameChanged = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChanged = (event) => {
        setPassword(event.target.value)
    }


    return (
        <div className="container">
          <form className="form" onSubmit={loginButtonClicked}>
            <input
              className="input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChanged}
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChanged}
            />
            <button className="button">Login</button>
            <Link to="/register" className="register-link">Don't have an account? Register here.</Link>
          </form>
        </div>
      );


}
export default Login;