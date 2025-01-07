//this is used to hide all react buttons when unity full screen UI is opened 
import { useUnity } from "../Context/UnityProvider";
import {useEffect, useCallback } from 'react';
const useHideBtn = (element) => {
  const { addEventListener, removeEventListener } = useUnity();
  let hide = false;
  let ogDisplay;
  const handleBtnHide = useCallback((trialTxt) => {
    if (hide===false) {
      // eslint-disable-next-line
      ogDisplay = element.current.style["display"];
      element.current.style["display"] = "none"; //hide it
      // eslint-disable-next-line
      hide = true;
    }
    else if (hide === true){
      element.current.style["display"] = ogDisplay; //show it
      hide = false;
    }
  }, []);
  
  useEffect(() => {
    addEventListener("removeReactBtn", handleBtnHide);
    return () => {
      removeEventListener("removeReactBtn", handleBtnHide);
    };
  }, [addEventListener, removeEventListener, handleBtnHide]);
};

export default useHideBtn;

