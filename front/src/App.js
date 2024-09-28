import React ,{useState} from "react";
import LoginPage from "./Components/LoginPage";
import UnityComponent from "./Components/UnityComponent";
import Navbar from "./Components/Navbar";
import Gemini from "./Components/gemini";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Set loggedIn to true after successful login
    setLoggedIn(true);
  };
  return (
    <div className="App">
    {/* Show login page if not logged in, otherwise show Unity and Navbar */}
    {!loggedIn ? (
      <LoginPage onLogin={handleLogin} />
    ) : (
      <>
      <UnityComponent/>
        <Navbar />
        <Gemini/>
      </>
    )}
  </div>
  );
}
export default App;
