import React from 'react';
import './App.css';
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';
import Albums from './components/albums';
import Info from './components/info';
import Posts from './components/posts';
import Todos from './components/todos';
import { Route, BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="login" />
          </Route>

          <Route exact path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/home" component={Home} />
          <Route path="/albums" component={Albums} />
          <Route path="/info" component={Info} />
          <Route path="/posts" component={Posts} />
          <Route path="/todos" component={Todos} />

        </Switch>
      </Router>
    </div>

  );

}

export default App;
