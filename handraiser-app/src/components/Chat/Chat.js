import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
<<<<<<< HEAD
import jwtToken from "../tools/jwtToken";
let socket;
const Chat = () => {
  const userObj = jwtToken();
  // const [chatDetails, setChatDetails] = useState({
  //     name:"",
  //     room:"",
  //     avatar:"",
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
        setRoom(res.data.concern_id);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
    socket.emit("join", { username, room }, error => {});
  }, [username, room]);

  useEffect(() => {
    socket.on("message", message => {
      console.log(message);
      setMessages([...messages, message]);
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
=======
import jwtToken from '../tools/jwtToken'

let socket;
const Chat = () => {
    const username=`noe`, room="1";
    const userObj = jwtToken();
    // const [chatDetails, setChatDetails] = useState({
    //     name:"",
    //     room:"",
    //     avatar:"",
    // });
    // const [username, setUsername] = useState("");
    // const [room, setRoom] = useState("");
    const [oldChat, setOldChat] = useState([]);
    const [currentChat, setCurrentChat] = useState([]);
    const [message, setMessage] = useState("");
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

                // setUsername(res.data.users_concern.firstname + " " + res.data.users_concern.lastname);
                // setRoom(res.data.users_concern.concern_id);

                setOldChat(res.data.messages);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
        socket.emit("join", { username, room, userObj}, error => { });
    }, [ENDPOINT]);

    useEffect(() => {
        socket.on("message", message => {
            // console.log(message)
            setCurrentChat([...currentChat, message]);
        });
        socket.emit("saveChat", currentChat);

        return () => {
            socket.emit("disconnect");
            socket.off();
        };
    }, [currentChat]);

    const sendMessage = event => {
        event.preventDefault();
        if (message) {
            socket.emit("sendMessage", {message}, () => setMessage(""));
        }
>>>>>>> d9ec2994bab0e0ec2c74aba939cde8ed08b08e51
    };
  }, [messages]);

<<<<<<< HEAD
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
=======
    // console.log(message, currentChat);
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
            {oldChat.map((message, i) => (
                <div key={i}>
                    <div>{message.user + " " + message.text}</div>
                    <p style={{opacity:`0.5`, fontSize:`10px`, margin:`0`}}>{message.time_sent}</p>
                </div>
            ))}
            {currentChat.map((message, i) => (
                <div key={i}>
                    <div>{message.user + " " + message.text}</div>
                    <p style={{opacity:`0.5`, fontSize:`10px`, margin:`0`}}>{message.time_sent}</p>
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
>>>>>>> d9ec2994bab0e0ec2c74aba939cde8ed08b08e51
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
