import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginPage from './components/loginPage/LoginPage';
import StudentPage from './components/mainPage/StudentPage';
import MentorPage from './components/mainPage/MentorPage';
import AdminPage from './components/mainPage/AdminPage';
import CohortPage from './components/cohort/CohortPage';
import Chat from './components/Chat/Chat';
import Design from './components/Chat/design';
import NotFound from './components/tools/NotFound';

const Routes = props => {
	return (
		<Switch>
			<Route exact path="/" component={LoginPage} />
			<Route exact path="/admin-page" component={AdminPage} />
			<Route exact path="/mentor-page" component={MentorPage} />
			<Route exact path="/student-page" component={StudentPage} />
			<Route exact path="/cohort/:id" component={CohortPage} />
			<Route path="/chat" render={() => <Chat data={props} />} />
			<Route path="/design" render={() => <Design />} />
			<Route component={NotFound} />
		</Switch>
	);
};

export default Routes;
