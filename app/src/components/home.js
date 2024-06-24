import React from 'react';
import {Link, Switch, Route, useRouteMatch } from 'react-router-dom';
import Info from './info';
import Albums from './albums';
import Posts from './posts';
import Todos from './todos';
import '../css/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  let { url, path } = useRouteMatch();

  return (
    <>
      <nav>
      <div class="navbar">
        <span className="navbar-name">{user.name}</span>
        <div class="container nav-container">
            <input class="checkbox" type="checkbox" name="" id="" />
            <div class="hamburger-lines">
              <span class="line line1"></span>
              <span class="line line2"></span>
              <span class="line line3"></span>
        </div>
          <div class="menu-items">
            <li>
              <Link to={`${url}/info`} className="navbar-link">Info</Link></li>
            <li>
              <Link to={`${url}/todos`} className="navbar-link">Todos</Link>
            </li>
            <li>
              <Link to={`${url}/posts`} className="navbar-link">Posts</Link>
            </li>
            <li>
              <Link to={`${url}/albums`} className="navbar-link">Albums</Link>
            </li>
            <Link
              to="/login"
              onClick={() => localStorage.setItem('user', null)}
              className="logout-link"
              >
              <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
    <div className="container">
        <div className="content">
          <Switch>
            <Route path={`${path}/info`} component={Info} />
            <Route path={`${path}/todos`} component={Todos} />
            <Route path={`${path}/posts`} component={Posts} />
            <Route path={`${path}/albums`} component={Albums} />
          </Switch>
        </div>
      </div>
    </>
  );
}

export default Home;
