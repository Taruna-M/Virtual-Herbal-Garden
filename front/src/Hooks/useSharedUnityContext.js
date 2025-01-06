//instantiated once and used everywhere
import { useUnityContext } from "react-unity-webgl";
const useSharedUnityContext = () => {
    return useUnityContext({
    loaderUrl: "/garden5/Build/garden5.loader.js",
    dataUrl: "/garden5/Build/garden5.data",
    frameworkUrl: "/garden5/Build/garden5.framework.js",
    codeUrl: "/garden5/Build/garden5.wasm",
    })
};

export default useSharedUnityContext;