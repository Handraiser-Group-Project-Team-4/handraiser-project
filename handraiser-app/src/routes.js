import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./components/loginPage/Login";
import StudentPage from "./components/mainPage/StudentPage";
import MentorPage from "./components/mainPage/MentorPage";
import AdminPage from "./components/mainPage/AdminPage";
import CohortPage from "./components/mainPage/CohortPage";
import LoginPageDesign from "./components/loginPage/LoginPageDesign";
import Chat from "./components/Chat/Chat";

const Routes = props => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/admin-page" component={AdminPage} />
      <Route exact path="/mentor-page" component={MentorPage} />
      <Route exact path="/student-page" component={StudentPage} />
      <Route exact path="/cohort/:id" component={CohortPage} />
      <Route exact path="/loginpage" component={LoginPageDesign} />
      <Route path="/chat" render={() => <Chat data={props} />} />
    </Switch>
  );
};

export default Routes;
