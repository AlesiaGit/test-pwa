import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home.js';
import AuthForm from './components/AuthForm.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/form">
            <AuthForm />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
