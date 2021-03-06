import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

const URI = `https://chat-app-kwmin.herokuapp.com/`;

const App: React.FC = () => {
  const socketRef: React.MutableRefObject<any> = useRef();
  const [messages, setMessages] = useState([""]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([""]);
  const [username, setUsername] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    socketRef.current = socketIOClient(URI);

    socketRef.current.on("allUsers", (allUsers: string[]) => {
      setUsers(allUsers);
    });

    socketRef.current.on("message", (message: any) => {
      setMessages((messages) => [...messages, message]);
      scrollToRef(scrollRef);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const scrollToRef = (ref: any) => {
    document.querySelector(".chat-message")!.scrollTo(0, ref.current.offsetTop);
  };

  const sendMessage = (message: string) => {
    socketRef.current.emit("message", message);
  };

  const submit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(newMessage);
      setNewMessage("");
    }
  };
  const submitUsername = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      socketRef.current.emit("username", username);
    }
  };

  return (
    <div className="container">
      <div className="chat-header">
        <h3>Live Chat App</h3>
      </div>
      <div className="chat-main">
        <div className="chat-users">
          <h5>Connected Users</h5>
          {users.map((user, index) => (
            <h6 key={index}>{user}</h6>
          ))}
        </div>
        <div className="chat-message">
          {messages.map((message, index) => {
            return <p key={index}>{message}</p>;
          })}
          <div ref={scrollRef} />
        </div>
      </div>
      <div className="username-input">
        <input
          className="username"
          type="text"
          value={username}
          placeholder="Type your Username and press Enter"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => submitUsername(e)}
        />
      </div>
      <div className="chat-input">
        <input
          className="message"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => submit(e)}
        />
      </div>
    </div>
  );
};

export default App;
