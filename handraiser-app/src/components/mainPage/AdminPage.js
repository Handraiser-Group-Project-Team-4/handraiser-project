import React from "react";
import { Redirect } from "react-router-dom";

// COMPONENTS
import jwtToken from "../tools/assets/jwtToken";
import MainpageTemplate from "../tools/MainpageTemplate";
import Tabs from "../adminPage/Tabs";

export default function AdminPage({ tabIndex }) {
  const userObj = jwtToken();
  if (userObj) {
    if (userObj.user_role_id === 2) return <Redirect to="/mentor-page" />;
    else if (userObj.user_role_id === 3) return <Redirect to="/student-page" />;
  } else return <Redirect to="/" />;
  return (
    <MainpageTemplate tabIndex={tabIndex}>
      <Tabs value={tabIndex} />
    </MainpageTemplate>
  );
}
