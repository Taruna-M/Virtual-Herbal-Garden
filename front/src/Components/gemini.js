import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './gemini.css';

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
            // Start the spark animation
            startSparkAnimation();
        }
    };

    const startSparkAnimation = () => {
        sparkRef.current.classList.add('spark-animation');
        setTimeout(() => {
            sparkRef.current.classList.remove('spark-animation');
        }, 4000); // Duration of the spark animation
    };

    const handleSubmit = async () => {
        if (inputText.trim() === '') return;

        // Add user's message to the chat
        setMessages(prevMessages => [
            ...prevMessages,
            { text: inputText, type: 'user' }
        ]);

        setIsLoading(true);
        setFlowerCount(1); // Start with one flower

        flowerInterval.current = setInterval(() => {
            setFlowerCount(prevCount => (prevCount === 3 ? 1 : prevCount + 1));
        }, 500); // Change flower count every 500ms

        try {
            const response = await axios.post('http://localhost:5000/api/generate-content', {
                text: inputText,
            });
            const yo = response.data.candidates[0].content.parts[0].text;
            const formattedText = yo
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            // Add a delay before showing the API response
            setTimeout(() => {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: formattedText, type: 'api' }
                ]);
                setIsLoading(false);
                clearInterval(flowerInterval.current); // Clear the interval
            }, 1000);
        } catch (error) {
            console.error('Error making API request:', error);
            setIsLoading(false);
            clearInterval(flowerInterval.current); // Clear the interval
        } finally {
            setInputText('');
        }
    };

    return (
        <div className="gemini">
            <div className="gemini-icon" onClick={handleToggleChatbox}>
                <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxVpnh7BKIqqNW9bIXAXMo34olLvPA0CxXfg&s" 
                    alt="Gemini Logo" 
                    style={{height:"50px"}} 
                    className="glow-effect" // Add the glow effect
                />
                {showChatBubble && (
                    <div className="chat-bubble">Hey! Any help?</div>
                )}
            </div>
            <div className={`gemini-chatbox ${isChatboxActive ? 'active' : ''}`} ref={sparkRef}>
                <div className="spark"></div> {/* Spark animation */}
                <div className="response-area">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.type === 'user' ? 'user-message' : 'api-response'}`}>
                            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                        </div>
                    ))}
                    {isLoading && <FlowerIndicator count={flowerCount} />} {/* Pass flowerCount to the indicator */}
                </div>
                <div className="input-area">
                    <textarea
                        className="input-box"
                        ref={inputRef}
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button className="send-button" onClick={handleSubmit}>
                        <img 
                            src="https://www.shutterstock.com/image-vector/green-fill-message-send-icon-260nw-2396311513.jpg" 
                            alt="Send" 
                            style={{height:"40px",width:"100px",borderRadius:"50%"}}
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
            <span className={`flower flower-1 ${count === 1 ? 'bounce' : ''}`}>🌼</span>
            <span className={`flower flower-2 ${count === 2 ? 'bounce' : ''}`}>🌼</span>
            <span className={`flower flower-3 ${count === 3 ? 'bounce' : ''}`}>🌼</span>
        </div>
    );
};

export default GeminiComponent;
