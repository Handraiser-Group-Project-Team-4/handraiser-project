import React from "react";
import { Switch, Route } from "react-router-dom";
import LoginPage from "./components/loginPage/LoginPage";
import StudentPage from "./components/mainPage/StudentPage";
import MentorPage from "./components/mainPage/MentorPage";
import AdminPage from "./components/mainPage/AdminPage";
// import CohortPage from "./components/cohort/CohortPageOld";
import CohortPage from "./components/cohort/CohortPage";
import Chat from "./components/Chat/Chat";
import Design from "./components/Chat/design";
import NotFound from "./components/tools/NotFound";
import Team from "./components/tools/Team";

const Routes = props => {
  return (
    <Switch>
      <Route exact path="/" component={LoginPage} />
      <Route exact path="/admin-page" component={AdminPage} />
      <Route exact path="/mentor-page" component={MentorPage} />
      <Route
        exact
        path="/mentor-page"
        render={() => <MentorPage value={0} />}
      />
      <Route
        exact
        path="/mentor-page/my-cohort"
        render={() => <MentorPage value={1} />}
      />
      <Route
        exact
        path="/student-page"
        render={() => <StudentPage value={0} location={props} />}
      />
      <Route
        exact
        path="/student-page/my-cohort"
        render={() => <StudentPage value={1} location={props} />}
      />
      <Route exact path="/cohort/:id" component={CohortPage} />
      <Route exact path="/team" component={Team} />
      <Route path="/design" render={() => <Design />} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
