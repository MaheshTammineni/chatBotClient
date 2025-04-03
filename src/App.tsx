/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import ChatApp from './ChatApp'
import { ThemeProvider } from './ThemeContext';

function App() {
  return (
    <>
        <ThemeProvider>
        <ChatApp />
        </ThemeProvider>
    </>
  )
}

export default App


// import React from "react";
// import { ThemeProvider } from "./ThemeContext";
// import ThemeToggle from "./ThemeToggle";

// const App = () => {
//   return (
//     <ThemeProvider>
//       <ThemeToggle />
//     </ThemeProvider>
//   );
// };

// export default App;


// import React, { useState, useEffect } from "react";
// import io from "socket.io-client";

// const socket = io.connect("http://localhost:5000");

// const App = () => {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);

//   useEffect(() => {
//     socket.on("receiveMessage", (message:any) => {
//       setChat((prevChat) => [...prevChat, message] as any);
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, []);

//   const sendMessage = () => {
//     if (message.trim()) {
//       socket.emit("sendMessage", message);
//       setMessage("");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h2>💬 Real-time Chat</h2>
//       <div>
//         {chat.map((msg, index) => (
//           <p key={index}>{msg}</p>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type a message..."
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// };

// export default App;
