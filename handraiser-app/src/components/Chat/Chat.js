import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

let socket;
const Chat = () => {
  // const [username, setUsername] = useState("");
  // const [room, setRoom] = useState("");
  const [chatDetails, setChatDetails] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/users/${localStorage.getItem(`id`)}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken")
      }
    })
      .then(res => {
        setChatDetails({
          name: res.data.firstname + " " + res.data.lastname,
          room: "Websocket"
        });
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    socket = io("localhost:4000");
    socket.emit(
      "join",
      { name: chatDetails.name, room: chatDetails.room },
      error => {}
    );
  }, [chatDetails]);

  useEffect(() => {
    socket.on("message", message => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [messages]);

  const sendMessage = event => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  // console.log(message, messages);
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
      <p>{"Name: " + chatDetails.name}</p>
      <p style={{ paddingBottom: "80px" }}>{"Room: " + chatDetails.room}</p>
      {messages.map((message, i) => (
        <div key={i}>
          {message.user + " " + message.text + " " + message.time_sent}
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
