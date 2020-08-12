import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

const URI = "http://localhost:4200";

const App: React.FC = () => {
  const socketRef: React.MutableRefObject<any> = useRef();
  const [messages, setMessages] = useState([""]);
  const [newMessage, setNewMessage] = useState("");
  //const [users, setUsers] = useState([""]);

  useEffect(() => {
    socketRef.current = socketIOClient(URI);
    socketRef.current.emit("username", "username");

    socketRef.current.on("allUsers", (allUsers: string[]) => {
      //setUsers(allUsers);
    });

    socketRef.current.on("message", (message: any) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (message: string) => {
    socketRef.current.emit("message", message);
  };
  return (
    <div className="container">
      <div className="chat-header">
        <h3>Live Chat App</h3>
      </div>
      <div className="chat-main">
        <div className="chat-users">
          <h6>Connected Users</h6>
          {/* {users.map((user) => {
            return <p>{user}</p>;
          })} */}
          <p>user1</p>
          <p>user2</p>
        </div>
        <div className="chat-message">
          {messages.map((message, index) => {
            return <p key={index}>{message}</p>;
          })}
        </div>
      </div>
      <div className="chat-input">
        <input
          className="message"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage(newMessage);
              setNewMessage("");
            }
          }}
        />
      </div>
    </div>
  );
};

export default App;
