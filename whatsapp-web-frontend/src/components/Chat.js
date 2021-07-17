import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, SearchOutlined, MoreVert, InsertEmoticon, Send, Mic } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';                           //Inbuilt Hook(returns URL parameters)
import '../stylesheets/Chat.css';
import axios from '../axios';
import { useStateValue } from '../StateProvider';

function Chat({ messages }) {                                           //messages is passed as props by App Component
    const [input, setInput] = useState('');
    const [roomName, setRoomName] = useState("");
    const { roomId } = useParams();
    const [{user}, dispatch] = useStateValue();

    useEffect(() => {                                                   //Storing room data in roomName
        axios.get(`/rooms/${roomId}`)                                   //axios give data in json format
        .then(response => {
            setRoomName(response.data);
        })
    }, [roomId]);
    
    const sendMessage = async (e) => {
        e.preventDefault();                                             //prevets the default action

        if(input){
            await axios.post("/messages/new", {                         //creates a new msg
                roomId,
                name: user.displayName,
                message: input,
                timestamp: new Date().toString(),                       //Converts current date to a string
                received: false
            });
        }
        
        setInput("");
    };

    return (
        <div className="chat">
            <div className="chat_header">
                <Avatar src={roomName.image} />

                <div className="chat_header_info">
                    <h3>{roomName.name}</h3>
                    <p>last seen {new Date().toString()}</p>
                </div>

                <div className="chat_header_right">
                    <IconButton>                                {/* Make the icon a clickable button */}
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div className="chat_body">
                {messages.map((message) => {
                    return (
                        <div>
                            {(message.roomId === roomId) ? 
                                (
                                    <p className={`chat_message ${message.name === user.displayName && "chat_receiver"}`}>           {/*if message.received is true then apply chat_receiver class*/}
                                        <span className="chat_name">{message.name}</span>
                                            {message.message}
                                        <span className="chat_timestamp">{message.timestamp}</span>
                                    </p>
                                ) : (
                                    <p></p>
                                )
                            }
                        </div>
                    )
                })}
            </div>

            <div className="chat_footer">
                <InsertEmoticon />
                
                <form>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={sendMessage} type="submit">
                        <Send />
                    </button>
                </form>

                <Mic />
            </div>
        </div>
    )
}

export default Chat;
