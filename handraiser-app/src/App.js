import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./components/loginPage/LoginPage";
import StudentPage from "./components/mainPage/StudentPage";
import MentorPage from "./components/mainPage/MentorPage";
import AdminPage from "./components/mainPage/AdminPage";
import CohortPage from "./components/cohort/CohortPage";
import NotFound from './components/tools/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/admin-page" component={AdminPage} />
        <Route exact path="/mentor-page" component={MentorPage} />
        <Route exact path="/student-page" component={StudentPage} />
        <Route exact path="/cohort/:id" component={CohortPage} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}
