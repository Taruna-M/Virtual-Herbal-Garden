//Context is used to share data without passing props down the component tree irritating so do usecontext
//so we initialise unity context once and use it wherever the data is needed such as the UnityComponent, useHideBtn, useHandleUnityInput
import React, { createContext, useContext } from "react";
import useSharedUnityContext from "../Hooks/useSharedUnityContext";;

const UnityContext = createContext();

export const UnityProvider = ({ children }) => {
  const unityContext = useSharedUnityContext(); //one time instantiated bring here

  return (
    //decides which component will have access to the unity context -> so we giving to all hence in App.js it wraps all the components
    //which ever component is under this will have access to 'value' -> unityContext which is the one time instance of unity
    <UnityContext.Provider value={unityContext}>
      {children}
    </UnityContext.Provider>
  );
};

export const useUnity = () => {
  const context = useContext(UnityContext); //Consumer -> for ease usage made it a seperate method 
  return context;
};
