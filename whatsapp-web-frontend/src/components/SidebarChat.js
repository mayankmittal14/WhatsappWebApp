import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';

import '../stylesheets/SidebarChat.css';

function SidebarChat({ id, name, image }) {                             //Props passed by Sidebar
    return (
        <Link to={`/rooms/${id}`}>                                      {/* Provides declarative and accessible navigation */}
            <div className="sidebar_chat">
                <Avatar src={image} />
                <div className="sidebar_chat_info">
                    <h2>{name}</h2>
                </div>
            </div>
        </Link>
    )
}

export default SidebarChat;
