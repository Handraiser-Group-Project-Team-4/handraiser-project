import React from 'react';
import './App.css';

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './components/loginPage/Login'
import StudentPage from './components/mainPage/StudentPage'
import MentorPage from './components/mainPage/MentorPage'
import AdminPage from './components/mainPage/AdminPage'

function App() {
	return (
    <BrowserRouter>
		<Switch>
			<Route exact path="/" component={Login} />
			<Route exact path="/admin-page" component={AdminPage} />
			<Route exact path="/mentor-page" component={MentorPage} />
			<Route exact path="/student-page" component={StudentPage} />
			{/* <Route exact path="/cohort" component={} /> */}
			{/* <Route exact path="/cohort-mentor-page" component={} /> */}

		</Switch>
	</BrowserRouter>
  );
}

export default App;