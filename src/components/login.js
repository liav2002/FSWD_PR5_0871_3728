import React from 'react';
import { useEffect, useState } from 'react';
// import Home from './home';
import '../css/login.css';
import { useHistory } from 'react-router-dom';

function Login() {

    const [username, setUsername] = useState("Samantha");
    const [password, setPassword] = useState("6102");
    const history = useHistory();


    const handleSubmit = async (event) => {
        event.preventDefault();
        await fetch(`https://jsonplaceholder.typicode.com/users`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                for (let i =0; i < 10; ++i) {
                    console.log(data[i].username)
                    if (data[i].username===username && data[i].address.geo.lat.slice(-4) == password) {
                        localStorage.setItem('user', JSON.stringify(data[i]));
                        history.push('/home') 
                        return;
                    }
                }

            })
            .catch(() => alert("Unauthorized user"))
        
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