import React, { createContext, useState } from "react";
import { Switch, Route } from "react-router-dom";
import LoginPage from "./components/loginPage/LoginPage";
import StudentPage from "./components/mainPage/StudentPage";
import MentorPage from "./components/mainPage/MentorPage";
import AdminPage from "./components/mainPage/AdminPage";
import CohortPage from "./components/cohort/cohortQueue/CohortPage";
import NotFound from "./components/tools/NotFound";
import Team from "./components/tools/Team";

export const newUserContext = createContext(null);
const Routes = props => {
  const [isNew, setisNew] = useState(false);
  return (
    <newUserContext.Provider value={{ isNew, setisNew }}>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route
          exact
          path="/admin-page"
          render={() => <AdminPage tabIndex={"admin-cohorts"} />}
        />
        <Route
          exact
          path="/admin-page/users"
          render={() => <AdminPage tabIndex={"admin-users"} />}
        />
        <Route
          exact
          path="/admin-page/approval"
          render={() => <AdminPage tabIndex={"admin-approval"} />}
        />
        <Route
          exact
          path="/mentor-page"
          render={() => <MentorPage value={0} tabIndex={"student-page"} />}
        />
        <Route
          path="/mentor-page/my-cohort"
          render={() => <MentorPage value={1} tabIndex={"student-page"} />}
        />
        <Route
          exact
          path="/student-page"
          render={() => (
            <StudentPage value={0} tabIndex={"student-page"} location={props} />
          )}
        />
        <Route
          path="/student-page/my-cohort"
          render={() => (
            <StudentPage value={1} tabIndex={"student-page"} location={props} />
          )}
        />
        <Route exact path="/cohort/:id" component={CohortPage} />
        <Route
          exact
          path="/cohort/details/:id"
          render={({ match }) => <CohortPage value={1} match={match} />}
        />
        <Route
          exact
          path="/cohort/log/:id"
          render={({ match }) => <CohortPage value={2} match={match} />}
        />
        <Route path="/team" render={() => <Team tabIndex={"team"} />} />
        <Route component={NotFound} />
      </Switch>
    </newUserContext.Provider>
  );
};

export default Routes;
