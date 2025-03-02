import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './gemini.css';
import { FaRobot } from 'react-icons/fa';
//unity to react communication
import useHideBtn  from '../Hooks/useHideBtn'

//react to unity communication
import useHandleUnityInput from '../Hooks/useHandleUnityInput';
const GeminiComponent = () => {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const [isChatboxActive, setIsChatboxActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [flowerCount, setFlowerCount] = useState(0); // To control flower display
    const [showChatBubble, setShowChatBubble] = useState(true); // Show chat bubble on load for 5 seconds
    const inputRef = useRef(null);
    const flowerInterval = useRef(null); // For managing interval
    const sparkRef = useRef(null); // For managing spark animation
    const geminiIcon = useRef(null); // For icon display from unity control
    const [unityInputStatus, setUnityInputStatus] = useState('enable');

    useHideBtn(geminiIcon);
    useHandleUnityInput(unityInputStatus);

    // Show chat bubble for 5 seconds on load
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowChatBubble(false);
        }, 5000); // 5 seconds

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    const handleToggleChatbox = () => {
        setIsChatboxActive(!isChatboxActive);
        if (!isChatboxActive) {
            startSparkAnimation();
        }
    };

    const handleCloseChatbox = () => {
        setIsChatboxActive(false);
    };

    const startSparkAnimation = () => {
        sparkRef.current.classList.add('spark-animation');
        setTimeout(() => {
            sparkRef.current.classList.remove('spark-animation');
        }, 4000); // Duration of the spark animation
    };

    const handleSubmit = async () => {
        if (inputText.trim() === '') return;
        setInputText('');

        setMessages((prevMessages) => [
            ...prevMessages,
            { text: inputText, type: 'user' },
        ]);

        setIsLoading(true);
        setFlowerCount(1);

        flowerInterval.current = setInterval(() => {
            setFlowerCount((prevCount) => (prevCount === 3 ? 1 : prevCount + 1));
        }, 500);

        try {
            const response = await axios.post('http://localhost:5001/api/generate-content', {
                text: inputText,
            });
            const yo = response.data.candidates[0].content.parts[0].text;
            console.log(yo);
            const formattedText = yo
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: formattedText, type: 'api' },
                ]);
                setIsLoading(false);
                clearInterval(flowerInterval.current);
            }, 1000);
        } catch (error) {
            console.error('Error making API request:', error);
            setIsLoading(false);
            clearInterval(flowerInterval.current);
        } finally {
            setInputText('');
        }
    };

    return (
        <div className="gemini">
            <div onClick={handleToggleChatbox} ref={geminiIcon}>
                <div className="icon-circle">
                    <FaRobot size={14} color="white" />
                </div>
                {showChatBubble && <div className="chat-bubble">Hey! Any help?</div>}
            </div>
            <div
                className={`gemini-chatbox ${isChatboxActive ? 'active' : ''}`}
                ref={sparkRef}
            >
                <button
                    style={{color:"white",marginLeft:"530px",width:"40px",background:"none"}}
                    onClick={handleCloseChatbox}
                >
                    Close
                </button>
                <div className="spark"></div>
                <div className="response-area">
                    <b
                        style={{
                            fontSize: '30px',
                            textAlign: 'center',
                            color: 'white',
                            marginLeft: '90px',
                        }}
                    >
                        Hello there! Talk to our bot!
                    </b>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${
                                msg.type === 'user' ? 'user-message' : 'api-response'
                            }`}
                        >
                            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                        </div>
                    ))}
                    {isLoading && <FlowerIndicator count={flowerCount} />}
                </div>
                <div className="input-area">
                    <textarea
                        className="input-box"
                        ref={inputRef}
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onFocus={() => setUnityInputStatus('disable')}
                        onBlur={() => setUnityInputStatus('enable')}
                    />
                    <button
                        className="send-button"
                        onClick={handleSubmit}
                        style={{ zIndex: '2000' }}
                    >
                        <img
                            src="https://www.shutterstock.com/image-vector/green-fill-message-send-icon-260nw-2396311513.jpg"
                            alt="Send"
                            style={{ height: '40px', width: '100px', borderRadius: '50%' }}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Flower Indicator Component
const FlowerIndicator = ({ count }) => {
    return (
        <div className="flower-indicator">
            <span
                className={`flower flower-1 ${count === 1 ? 'bounce' : ''}`}
            >
                🌼
            </span>
            <span
                className={`flower flower-2 ${count === 2 ? 'bounce' : ''}`}
            >
                🌼
            </span>
            <span
                className={`flower flower-3 ${count === 3 ? 'bounce' : ''}`}
            >
                🌼
            </span>
        </div>
    );
};

export default GeminiComponent;
