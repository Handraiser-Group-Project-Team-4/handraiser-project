import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

export default function MainpageTemplate({ children }) {
  const [user, setUser] = useState();
  useEffect(() => {
    axios({
      method: "get",
      url: `/api/users/${localStorage.getItem(`id`)}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken")
      }
    })
      .then(res => {
        // console.log(res.data)
        setUser(res.data);
      })
      .catch(err => {
        console.log(err);
      });

    return () => {};
  }, []);

  if (!localStorage.getItem(`id`)) return <Redirect to="/" />;

  return (
    <div style={{ backgroundColor: `lightgrey` }}>
      <header
        style={{
          background: `grey`,
          color: `white`,
          padding: `20px`,
          display: `flex`,
          justifyContent: `space-between`
        }}
      >
        <h3>This is a header</h3>

        {user && (
          <div style={{ display: `flex`, alignItems: `center` }}>
            {user.firstname} {user.lastname}
            <img
              src={user.avatar}
              alt="profile_pic"
              width="50"
              style={{ borderRadius: `50%`, margin: `0 20px` }}
            />
            <a href="#home" onClick={() => localStorage.clear()}>
              Log out
            </a>
            {/* <h2>{user.firstname} {user.lastname}</h2> */}
            {/* <p>{user.email}</p> */}
          </div>
        )}
      </header>

      {children}

      <footer
        style={{
          background: `grey`,
          color: `white`,
          padding: `20px`,
          textAlign: `center`
        }}
      >
        This is a footer
      </footer>
    </div>
  );
}
