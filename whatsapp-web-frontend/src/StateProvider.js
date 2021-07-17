import React, { createContext, useReducer, useContext } from 'react';

export const StateContext = createContext();                                        //Creates a Context object

export const StateProvider = ({ reducer, initialState, children }) => (             //Higher Order Component
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);