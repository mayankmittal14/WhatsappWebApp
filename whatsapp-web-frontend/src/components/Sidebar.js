import React, { useEffect, useState } from 'react'
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { Avatar, IconButton } from '@material-ui/core';
import Pusher from 'pusher-js';

import '../stylesheets/Sidebar.css';
import SidebarChat from './SidebarChat';
import axios from '../axios';
import { useStateValue } from '../StateProvider';

function Sidebar({ messages }) {
    const [seed, setSeed] = useState('');                               // For Avatar
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState('');                           //For getting search results
	const [{user}, dispatch] = useStateValue();			                //Pulling the user from the context

    useEffect(() => {
        setSeed(Math.floor(Math.random()*11000))
    }, [])

    useEffect(() => {
        axios.get('/rooms/sync')                                        //Used to sync messages from backend servers
            .then(response => {
                setRooms(response.data);
            })
    }, []);

	useEffect(() => {
		const pusher = new Pusher('4aedae654b3783ef2327', {
			cluster: 'ap2'
		});

		//Whenever there is a change in the backend, pusher notifies here(Get realtime updates)
		const channel = pusher.subscribe('roomsChannel');               //Name of the channel that we used in triggering pusher in backend

		channel.bind('inserted', (newRoom) => {
			setRooms([...rooms, newRoom])					            //Inserting new room to rooms using spread operator
		});

		return () => {								                    //Unsubscribing the event listener to prevent memory leak
			channel.unbind_all();
			channel.unsubscribe();
		};

	}, [rooms]);

    const createChatRoom = () => {
        const roomName = prompt("Please enter the name for the Chat Room");

        if(roomName){
            axios.post('/rooms/new', {
                name: roomName,
                image: `https://avatars.dicebear.com/api/jdenticon/${seed}.svg`         // This api will give an avatar according to the seed
            });

            window.location.reload(true);                               //Reloads a fresh copy from the server
        }
    };

    const filterRooms = rooms.filter((room) => {
        return room.name.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="sidebar">
            <div className="sidebar_header">
                <Avatar src={user?.photoURL} />                         {/* Display google account pic if defined */}

                <div className="sidebar_header_right">
                    <IconButton>                                        {/* Make the icon a clickable button(Add a ripple effect) */}
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton onClick={createChatRoom} >
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="sidebar_search">
                <div className="sidebar_search_container">
                    <SearchOutlinedIcon />
                    <input 
                        type="text"
                        placeholder="Search or Start New Chat"
                        onChange={ (e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="sidebar_chats">
                {filterRooms.map((room) => (                            // Displaying filter rooms in Sidebar
                    <SidebarChat 
                        key={room._id}
                        id={room._id}
                        name={room.name}
                        image={room.image}
                    />
                ))}
            </div>

        </div>
    );
}

export default Sidebar;
