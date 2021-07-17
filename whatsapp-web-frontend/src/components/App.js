import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Pusher from 'pusher-js';											//pusher-js for frontend and pusher for backend

import '../stylesheets/App.css';
import Login from './Login';
import Welcome from './Welcome';
import Sidebar from './Sidebar';
import Chat from './Chat';
import axios from '../axios';
import { useStateValue } from '../StateProvider';

function App() {
	const [{user}, dispatch] = useStateValue();							//Pulling the user from the context
	const [messages, setMessages] = useState([]);

	//Called after the initial render only(empty array)
	useEffect(() => {													//Responsible for fetching initial information
		axios.get('/messages/sync')										//Used to sync messages from backend servers
			.then(response => {
				setMessages(response.data);
			})
	}, []);

	//Called whenever the App component loads and re-renders on changing of dependencies(messages) only
	useEffect(() => {
		const pusher = new Pusher('4aedae654b3783ef2327', {
			cluster: 'ap2'
		});

		//Pusher notifies here after any change in the backend(Realtime Updates)
		const channel = pusher.subscribe('messagesChannel');			//Name of the channel that we used in triggering pusher in backend

		channel.bind('inserted', (newMessage) => {
			setMessages([...messages, newMessage])						//Inserting new message to messages using spread operator
		});

		return () => {													//Unsubscribing the event listener to prevent memory leak
			channel.unbind_all();
			channel.unsubscribe();
		};

	}, [messages]);

	return (
		<div className="app">
			{!user ? (													//If no user is signed in, render the Login Page
				<Login />
			) : (
				<div className="app_body">
					<Router>											{/* Keep UI in sync with the URL(without refreshing) */}
						<Sidebar messages={messages} />
						
						<Switch>										{/* Switch Case: Renders UI when the first child <Route> path matches the current URL */}
							<Route path="/rooms/:roomId">
								<Chat messages={messages} />
							</Route>
							<Route path="/">
								<Welcome />
							</Route>
						</Switch>
					</Router>
				</div>
			)}
		</div>
	);
}

export default App;