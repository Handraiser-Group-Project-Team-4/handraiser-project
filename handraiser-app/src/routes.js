import React, { createContext, useState } from "react";
import { Switch, Route } from "react-router-dom";
import LoginPage from "./components/loginPage/LoginPage";
import StudentPage from "./components/mainPage/StudentPage";
import MentorPage from "./components/mainPage/MentorPage";
import AdminPage from "./components/mainPage/AdminPage";
import CohortPage, { UserContext } from "./components/cohort/cohortQueue/CohortPage";
import NotFound from "./components/tools/NotFound";
import Team from "./components/tools/Team";

export const newUserContext = createContext(null)
const Routes = props => {
  const [isNew, setisNew] = useState(false)
  return (
    <newUserContext.Provider value={{ isNew, setisNew }}>
      <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route path="/admin-page" component={AdminPage} />
          <Route
            exact
            path="/mentor-page"
            render={() => <MentorPage value={0} />}
          />
          <Route
            path="/mentor-page/my-cohort"
            render={() => <MentorPage value={1}  />}
          />
          <Route
            exact
            path="/student-page"
            render={() =>
              <StudentPage value={0} location={props} />
            }
          />
          <Route
            path="/student-page/my-cohort"
            render={() => <StudentPage value={1} location={props} />}
          />
          <Route path="/cohort/:id" component={CohortPage} />
          <Route path="/team" component={Team} />
          <Route component={NotFound} />
      </Switch>
    </newUserContext.Provider>
  );
};

export default Routes;
