import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import jwtToken from "../tools/jwtToken";
let socket;
const Chat = () => {
  const userObj = jwtToken();
  // const [chatDetails, setChatDetails] = useState({
  //     name:"",
  //     room:"",
  //     avater:"",
  // });
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:4000";
  useEffect(() => {
    axios({
      method: "get",
      url: `/api/users/${userObj.user_id}?chat=true`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        // console.log(res.data)
        // setChatDetails({
        //     name: res.data.firstname + " " + res.data.lastname,
        //     room: `'${res.data.concern_id}'`,
        //     avatar: res.data.avatar
        // })
        setUsername(res.data.firstname + " " + res.data.lastname);
        setRoom(`WebSocket`);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("join", { username, room }, error => {});
  }, [ENDPOINT, username, room]);
  useEffect(() => {
    socket.on("message", message => {
      setMessages([...messages, message]);
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);
  const sendMessage = event => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  console.log(message, messages);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        padding: "100px",
        flexWrap: "wrap"
      }}
    >
      <h1>Chat</h1>
      <p>{"Name: " + username}</p>
      <p style={{ paddingBottom: "80px" }}>{"Room: " + room}</p>
      {messages.map((message, i) => (
        <div key={i}>
          <div>{message.user + " " + message.text}</div>
          <p style={{ opacity: `0.5`, fontSize: `10px`, margin: `0` }}>
            {message.time_sent}
          </p>
        </div>
      ))}
      <input
        style={{ marginTop: "50px", padding: "30px" }}
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyPress={event =>
          event.key === "Enter" ? sendMessage(event) : null
        }
      />
    </div>
  );
};
export default Chat;
