/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"

const ChatApp = () => {
    const [input, setinput] = useState("");
    const [messages, setMessage] = useState([]);
    const socketRef : any = useRef(null);

    useEffect(()=> {
     socketRef.current = new WebSocket('https://chatbotserver-production-ef2.up.railway.app/')
     socketRef.current.onmessage = (event: any)=> {
        setMessage((prev:any) =>[...prev,{type: 'bot', text: event.data}])
     }

     return () => {
        socketRef.current.close();
     }
    }, [])

    const sendMessage = () => {
        if(input.trim()){
            socketRef.current.send(input);
            setMessage((prev: any) => [...prev,{type: 'user', text: input}])
            setinput("")
        }
    }

    return(
        <>
        <h2>Chat BOT App</h2>
        <div style={{height: 500, width: 400, overflowY: 'scroll', border: '1px solid #ccc', padding: "10px"}}>
           { messages.map((msg:any, index) => {
            return(
                <div style={{ textAlign: msg.type === "user" ? "right" : "left"}} key={index}>
                <span style={{backgroundColor: "lightgreen", border: '1px solid gray', borderRadius: 10}}>
                <strong>{msg.type === "user"? "YOU": "BOT"}:</strong>{msg.text}
                </span>
                </div>
            )
           })}
        </div>

        <input type="text" style={{width: 300, padding: 10,margin: 10, marginLeft: -5}} value = {input} onChange={(event) => setinput(event.target.value)} onKeyDown={(e)=> e.key === "Enter" && sendMessage()}/>
        <button style={{backgroundColor: "lightblue"}} onClick={sendMessage}>Send</button>
        </>
    )
}

export default ChatApp;