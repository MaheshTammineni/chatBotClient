/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useContext } from "react";
import sendIconImg from "../src/assets/icon-send.png";
import personImage from "../src/assets/personImage.jpeg";
import chatBotImage from "../src/assets/chatBotImage.png";
import { ThemeContext } from "./ThemeContext";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

const ChatApp = () => {
  const [input, setinput] = useState("");
  const [chat, setChat] = useState([]) as any;
  const socketRef: any = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext) as any;
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  // 👇 Scroll to bottom whenever chat changes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, isTyping]);

  useEffect(() => {
    const savedChat =
    JSON.parse(localStorage.getItem("chatHistory") as any) || [];
    setChat(savedChat);
    socketRef.current = new WebSocket('https://chatbotserver-production-ef2.up.railway.app/')
    // When connection is open
    socketRef.current.onopen = () => {
      setIsConnected(true);
    };
    // When connection is closed
    socketRef.current.onclose = () => {
      setIsConnected(false);
    };

    socketRef.current.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      if (data.type === "typing") {
        setIsTyping(data.status);
      }
      if (data.type === "message") {
        setChat((prev: any) => {
          const now = new Date();
          const time = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
          const updatedChat: any = [
            ...prev,
            { from: "bot", text: data.text, timestamp: time, weekday: weekday },
          ];
          localStorage.setItem("chatHistory", JSON.stringify(updatedChat));
          return updatedChat;
        });
      }
    };

    return () => {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socketRef.current.send(input);
      setChat((prev: any) => {
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
        const updatedChat: any = [
          ...prev,
          { from: "user", text: input, timestamp: time, weekday: weekday },
        ];

        localStorage.setItem("chatHistory", JSON.stringify(updatedChat));
        return updatedChat;
      });
      setinput("");
    }
  };

  return (
    <>
      <h2>
        <span style={{ backgroundColor: "green" }}>💬</span> Real-time Chat Bot
        App
        <span
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "2rem",
            color: theme === "light" ? "dark" : "light",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <div
            style={{
              marginRight: "500px",
              fontSize: "1rem",
              fontWeight: "bold",
              color: isConnected ? "green" : "red",
            }}
          >
            {isConnected ? "🟢 Online" : "🔴 Offline"}
          </div>
          {theme === "light" ? <FaToggleOff /> : <FaToggleOn />}
        </span>
      </h2>
      <div
        style={{
          height: 500,
          width: 600,
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          background: theme === "light" ? "#fff" : "#333",
          color: theme === "light" ? "#000" : "#fff",
        }}
      >
        {chat.map((msg: any, index: number) => {
          const showWeekday: any =
            index === 0 || msg.weekday !== chat[index - 1].weekday;
          return (
            <>
              {showWeekday && <h2 style={{ fontSize: 15 }}>{msg.weekday}</h2>}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    msg.from === "user" ? "flex-end" : "flex-start",
                  marginTop: "10px",
                  marginBottom: "10px",
                  color: "white",
                  padding: "10px",
                  borderRadius: "10px",
                }}
                key={index}
              >
                {msg.from !== "user" && (
                  <img
                    src={chatBotImage}
                    alt="chat Bot Avatar"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginTop: 10,
                      marginLeft: -10,
                    }}
                  />
                )}
                <span
                  style={{
                    backgroundColor: msg.from === "user" ? "#e57742" : "gray",
                    padding: "8px",
                    marginLeft: 2,
                    borderRadius: "10px",
                    borderBottomRightRadius:
                      msg.from === "user" ? "0px" : "10px",
                    borderBottomLeftRadius:
                      msg.from !== "user" ? "0px" : "10px",
                  }}
                >
                  {msg.text}
                  <span style={{ fontSize: "8px", marginLeft: 20 }}>
                    {msg.timestamp}
                  </span>
                </span>
                {msg.from === "user" && (
                  <img
                    src={personImage}
                    alt="User Avatar"
                    style={{
                      width: 40,
                      height: 30,
                      marginTop: 10,
                      marginLeft: 2,
                      borderRadius: "50%",
                      marginRight: -18,
                    }}
                  />
                )}
              </div>
            </>
          );
        })}
        {isTyping && (
          <p>
            <em>Bot is typing...</em>
          </p>
        )}
        <div ref={chatEndRef} />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Type the message"
          style={{
            width: 340,
            padding: 10,
            margin: 5,
            marginLeft: -1,
            flex: 1, // Allows the input to take available space
          }}
          value={input}
          onChange={(event) => setinput(event.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <span
          onClick={sendMessage}
          style={{ cursor: "pointer", marginLeft: 6 }}
        >
          <img src={sendIconImg} style={{ height: "40px" }} alt="Send" />
        </span>
      </div>
    </>
  );
};

export default ChatApp;
