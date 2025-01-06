//instantiated once and used everywhere
import { useUnityContext } from "react-unity-webgl";
const useSharedUnityContext = () => {
    return useUnityContext({
    loaderUrl: "/garden8/Build/garden8.loader.js",
    dataUrl: "/garden8/Build/garden8.data",
    frameworkUrl: "/garden8/Build/garden8.framework.js",
    codeUrl: "/garden8/Build/garden8.wasm",
    })
};

export default useSharedUnityContext;