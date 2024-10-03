import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserList from './components/UserList';
import 'bootstrap/dist/css/bootstrap.min.css';
import VerifyEmail from './components/VerifyEmail';

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/users" component={UserList} />
          <Route path="/verify/:token" component={VerifyEmail} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;