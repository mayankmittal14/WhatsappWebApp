import axios from 'axios';                                      //Used to make HTTP requests from node. js

const instance = axios.create({                                 //Creates a new Axios instance(global config)
    baseURL: "https://whatsapp-web-m14.herokuapp.com/"          //Acts as a prefix
});

export default instance;