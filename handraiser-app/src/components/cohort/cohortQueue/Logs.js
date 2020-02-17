import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import jwtToken from "../../tools/assets/jwtToken";

let socket;
const Logs = props => {
  const ENDPOINT = "localhost:3001";
  const { id } = props.match.params;
  const userObj = jwtToken();
  const [logs, setLogs] = useState();

  // useEffect(() => {
  //   socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  //   socket.emit("joinConcern", { id, userObj }, () => {});
  // }, [ENDPOINT]);

  // useEffect(() => {
  //   socket.on("fetchLogs", newLog => {
  //     setLogs([...logs, newLog]);
  //   });
  //   return () => {
  //     socket.emit("disconnectConcern", () => {});
  //     socket.off();
  //   };
  // }, [logs]);
  console.log(logs);
  return "Logs";
};

export default Logs;
