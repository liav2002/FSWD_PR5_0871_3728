import React from 'react';
import './App.css';
import Login from './components/login';
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
            <h1>Hello</h1>
          </Route>
        
        </Switch>
      </Router>
    </div>

  );

}

export default App;
