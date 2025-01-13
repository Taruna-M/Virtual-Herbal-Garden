import React, { useState } from "react";
import { FaPlus, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./IconMenu.css";
import GeminiComponent from "./gemini";
import Notes from "./Notes";
import { FaRobot } from "react-icons/fa";
import PlantSearch from "./scan";
import Discussion from "./Discussion";
const IconMenu = () => {
  const [clicked, setClicked] = useState(false);

  const toggleIcons = () => {
    setClicked(!clicked);
  };

  return (
    <div className="icon-container">
      {/* Main Icon */}
      <div className="main-icon" onClick={toggleIcons}>
        <FaPlus size={20} color="white" />
      </div>
      {/* Sub Icons */}
      <div className={`sub-icon sub1 ${clicked ? "visible" : ""}`}>
        <GeminiComponent/>
      </div>
      <div className={`sub-icon sub2 ${clicked ? "visible" : ""}`}>
        <PlantSearch/>
      </div>
      <div className={`sub-icon sub3 ${clicked ? "visible" : ""}`}>
        <Notes/>
      </div>
      <div className={`sub-icon sub4 ${clicked ? "visible" : ""}`}>
        <Discussion/>
      </div>
    </div>
  );
};

export default IconMenu;
