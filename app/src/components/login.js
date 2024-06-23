import React from 'react';
import { useEffect, useState } from 'react';
// import Home from './home';
import '../css/login.css';
import { useHistory } from 'react-router-dom';

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
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


    
    const handleChangeUsername = (event) => {
        setUsername(event.target.value);
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value)
    }


    return (
        <div className="container">
          <form className="form" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={handleChangeUsername}
            />
            <input
              className="input"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={handleChangePassword}
            />
            <button className="button">Se connecter</button>
          </form>
        </div>
      );


}
export default Login;