import React from 'react';
import './App.css';
import Login from './components/login';
import Home from './components/home';
import { Route, BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="login" />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/home">
            <Home />
          </Route>
        
        </Switch>
      </Router>
    </div>

  );

}

export default App;
