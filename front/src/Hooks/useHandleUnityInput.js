//this sends message to unity to not take any input on unity side and consider only react and toggle back and forth
import { useEffect } from "react";
import { useUnity } from "../Context/UnityProvider";

const useHandleUnityInput = (status) => {
  const { sendMessage, isLoaded } = useUnity();
  
  useEffect(() => {
    if (isLoaded) {
      if (status === "disable") sendMessage("WebGLInputHandler", "DisableUnityInput");
      else if (status === "enable") sendMessage("WebGLInputHandler", "EnableUnityInput");
    }
  }, [isLoaded, status, sendMessage]);
};

export default useHandleUnityInput;
