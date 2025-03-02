import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleButton from 'react-google-button'
import './login.css'; 

const LoginPage = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const hasloggedIn = useRef(false); //used to make sure useEffect doesnt render multiple times
  const navigate = useNavigate();

  useEffect(() => {
    if (hasloggedIn.current) return;
    hasloggedIn.current = true;

    const queryParams = new URLSearchParams(window.location.search);
    const uid = queryParams.get('uid');

    if (uid) {
      alert('Login Successful');
      sessionStorage.setItem('uid', uid);
      setFadeOut(true);
      axios.get(`${process.env.REACT_APP_API_URL}/acc/${uid}`, { withCredentials: true }) //withCredentials sends cookies
      .then((res) => {
        if (res.data) {
          setTimeout(() => {
            navigate(`/garden/${uid}`, {state: res.data.payload});
          }, 500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [navigate]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `http://localhost:5001/auth/google`
  };
  
  return (
    <div className={`login-container ${fadeOut ? 'fade-out' : ''}`}>
       <GoogleButton onClick={handleSubmit}/>
    </div>
  );
};

export default LoginPage;
