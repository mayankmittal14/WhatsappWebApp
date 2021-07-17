import React from 'react';
import { Button } from '@material-ui/core';

import "../stylesheets/Welcome.css";

function Welcome() {
    return (
        <div className="welcome">
            <div className="welcome_container">
                <img src="https://cdn.usbrandcolors.com/images/logos/whatsapp-logo.svg" alt="" />

                <div className="welcome_text">
                    <h2>Welcome to Whatsapp Web</h2>
                </div>

                <div className="btns">
                    <Button>Google Authentication</Button>
                    <Button>Create Room</Button>
                    <Button>Search Room</Button>
                    <Button>Chat with People</Button>
                </div>
            </div>
        </div>
    )
}

export default Welcome;
