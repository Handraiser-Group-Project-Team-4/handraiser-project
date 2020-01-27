import React from 'react';
import './App.css';

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './components/loginPage/Login'
import FirstLogin from './components/loginPage/FirstLogin'
import CohortList from './components/mainPage/CohortList'

function App() {
	return (
    <BrowserRouter>
		<Switch>
			<Route exact path="/" component={Login} />
			<Route exact path="/first-login" component={FirstLogin} />
			<Route exact path="/cohort-list" component={CohortList} />
		</Switch>
	</BrowserRouter>
  );
}

export default App;