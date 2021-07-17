import React from 'react';
import { Button } from '@material-ui/core';

import '../stylesheets/Login.css';
import { auth, provider } from '../firebase';
import { actionTypes } from '../reducer';
import { useStateValue } from '../StateProvider';

function Login() {
    const [{}, dispatch] = useStateValue();

    const signIn = () => {
        auth.signInWithPopup(provider)                                  //Google Authentication
            .then((result) => {
                dispatch({                                              //Dispatching an action(Action Creator)
                    type: actionTypes.SET_USER,
                    user: result.user
                })
            })
            .catch((error) => {
                alert(error.message)
            });
    };

    return (
        <div className="login">
            <div className="login_container">
                <img src="https://cdn.usbrandcolors.com/images/logos/whatsapp-logo.svg" alt="" />

                <div className="login_text">
                    <h1>Sign In to Whatsapp Web</h1>
                </div>

                <Button onClick={signIn}>
                    Sign In With Google
                </Button>
            </div>
        </div>
    );
}

export default Login;
