import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import io from "socket.io-client";
import { UserContext } from "./CohortPage";
import jwtToken from "../tools/assets/jwtToken";

let socket;
export default function Help() {
  const [value, setValue] = useState("");
  const [isTrue, setIsTrue] = useState(false);
  const { id, data, setData, user } = useContext(UserContext);
  const userObj = jwtToken();
  const ENDPOINT = "localhost:3001";

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  }, [ENDPOINT]);

  const sendConcern = event => {
    event.preventDefault();
    const concern = {
      class_id: id,
      mentor_id: null,
      student_id: userObj.user_id,
      concern_title: value,
      concern_status: "pending"
    };

    socket.emit("sendConcern", { concern }, () => {});
  };
  useEffect(() => {
    if (user) {
      let isNull = false;
      data.map(student => {
        if (user.user_id === student.student_id) {
          isNull = true;
        }
        return isNull;
      });
      setIsTrue(isNull);
    }
  });

  // const handleClick = () => {
  //   Axios({
  //     method: "post",
  //     url: `/api/concern`,
  //     data: {
  //       class_id: id,
  //       mentor_id: null,
  //       student_id: user.user_id,
  //       concern_title: value,
  //       concern_status: "pending"
  //     },
  //     headers: {
  //       Authorization: "Bearer " + sessionStorage.getItem("accessToken")
  //     }
  //   })
  //     .then(res => {
  //       setData([...data, res.data]);
  //       setValue("");
  //       setIsTrue(true);
  //     })
  //     .catch(err => console.log(err));
  // };

  return (
    <>
      {user ? (
        user.user_role_id === 3 ? (
          <>
            <button onClick={e => sendConcern(e)} disabled={isTrue}>
              Help
            </button>
            <input
              value={value}
              type="text"
              onChange={e => {
                setValue(e.target.value);
              }}
              disabled={isTrue}
            />
          </>
        ) : null
      ) : null}
    </>
  );
}
