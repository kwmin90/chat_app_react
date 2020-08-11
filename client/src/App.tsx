import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

const URI = "http://localhost:4200";

const App: React.FC = () => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(URI);
    socket.on("message", (message: string) => {
      setResponse(message);
    });
  }, []);
  return (
    <div className="container">
      <div className="chat-header">
        <h3>Live Chat App</h3>
      </div>
      <div className="chat-main">
        <div className="chat-users">
          <h6>Connected Users</h6>
          <p>user 1</p>
          <p>user 2</p>
          <p>user 3</p>
        </div>
        <div className="chat-message">
          <p>messages</p>
        </div>
      </div>
      <div className="chat-input">
        <input className="message" type="text" />
      </div>
    </div>
  );
};

export default App;
