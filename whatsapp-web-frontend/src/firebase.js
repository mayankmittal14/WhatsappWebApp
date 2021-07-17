import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyA63Tg7wXuq_55QYXvl3BRNZivpKIKj5o4",
    authDomain: "whatsapp-web-m14.firebaseapp.com",
    projectId: "whatsapp-web-m14",
    storageBucket: "whatsapp-web-m14.appspot.com",
    messagingSenderId: "696850612061",
    appId: "1:696850612061:web:8cc7e1dedbefdfe00a72b4"
};

firebase.initializeApp(firebaseConfig);                         //Creates and initializes a Firebase app instance
const auth = firebase.auth();                                   //Firebase Authentication
const provider = new firebase.auth.GoogleAuthProvider();        //Represents the Google Sign-In authentication provider

export {auth,provider};