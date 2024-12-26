import React, { useState, useEffect } from 'react';
import './navbar.css'; // Add the styling for the navbar

const Navbar = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showResults, setShowResults] = useState(false); // Add a state to track whether to show results or not

  useEffect(() => {
    // Fetch the JSON data
    fetch('/plants_data.json')
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData));
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = data.filter((item) => {
        return (
          item['Family'].toLowerCase().includes(searchQuery.toLowerCase()) ||
          item['Vernacular names'].toLowerCase().includes(searchQuery.toLowerCase()) ||
          item['Scientific Name'].toLowerCase().includes(searchQuery.toLowerCase()) ||
          item['Description'].toLowerCase().includes(searchQuery.toLowerCase()) ||  // Add description
          item['Properties & Uses'].toLowerCase().includes(searchQuery.toLowerCase())  // Add uses
        );
      });
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  }, [searchQuery, data]);

  const handleFocus = () => {
    setShowResults(true); // Show the results on focus
  };

  const handleBlur = () => {
    setShowResults(false); // Hide the results on blur
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? 
            <mark key={index}>{part}</mark> : 
            part
        )}
      </>
    );
  };
  
  
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item"><a href="#home">About</a></li>
        <li className="nav-item"><a href="#about">Discussion Forum</a></li>
        <li className="nav-item"><a href="#contact">Contact</a></li>
        <li className="nav-item"><a href="#profile">Account</a></li>
      </ul>
      <div className="search-engine">
        <input
          type="text"
          placeholder="Search by Family, Vernacular name, or Scientific name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus} // Add onFocus event
          onBlur={handleBlur} // Add onBlur event
        />
        {showResults && ( // Conditionally render the search results
          <div className="search-results">
            {filteredData.length > 0 ? (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {filteredData.map((item, index) => (
                  <li key={index}>
                    <h3>{highlightText(item['Scientific Name'].toUpperCase(), searchQuery)}</h3>
                    <p><strong>Family:</strong> {highlightText(item['Family'], searchQuery)}</p>
                    <p><strong>Vernacular names:</strong> {highlightText(item['Vernacular names'], searchQuery)}</p>
                    <p><strong>Distribution:</strong> {highlightText(item['Distribution'], searchQuery)}</p>
                    <p><strong>Description:</strong> {highlightText(item['Description'], searchQuery)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{paddingLeft: '10px'}}>No results found</p>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;