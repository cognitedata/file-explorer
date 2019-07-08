import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Main from '../containers/Main';
import Login from '../containers/Login';

export const history = createBrowserHistory();

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/:tenant" component={Main} />
      </Switch>
    </Router>
  );
}

export default Routes;
