import React from 'react';
import './App.css';

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './components/loginPage/Login'
import FirstLogin from './components/loginPage/FirstLogin'

function App() {
	return (
    <BrowserRouter>
		<Switch>
			<Route exact path="/" component={Login} />
			<Route exact path="/first-login" component={FirstLogin} />
		</Switch>
	</BrowserRouter>
  );
}

export default App;