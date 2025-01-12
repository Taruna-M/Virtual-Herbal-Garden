import React, { useState, useEffect } from 'react';
import HybridEditor from './HybridEditor.jsx';
import './df.css';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import axios from 'axios';

import { useLocation } from "react-router-dom";
import useHandleUnityInput from '../Hooks/useHandleUnityInput';

import {ChevronLeft, ChevronRight ,ThumbsUp,
  Search, Clock, Tag,Send,MessageSquarePlus,MessageCircle,Columns, ChevronUpCircle} from "lucide-react";


const Discussion=()=> {
  //variables
  const location = useLocation();
  const user = location.state;
  const REACT_APP_API_URL=process.env.REACT_APP_API_URL
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: '', description: '', tags: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionComments, setQuestionComments] = useState([]);
  const [answerComments, setAnswerComments] = useState({});
  const [showQuestionComments, setShowQuestionComments] = useState(false);
  const [showAnswerComments, setShowAnswerComments] = useState({});
  const [savedContent, setSavedContent] = useState('');
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [discussOpen, setDiscussOpen] = useState(false);
  const [isAddingQuestion,setIsAddingQuestion]=useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(40);
  const PANEL_MODES = {
    LEFT_COLLAPSED: 0,    // Question list hidden
    SPLIT: 40,           // Default 40-60 split
    RIGHT_COLLAPSED: 100  // Question/answer view hidden
  };

  //unity person 
  const [unityInputStatus, setUnityInputStatus] = useState('enable');
  useHandleUnityInput(unityInputStatus);
  //use Effects may need to change
  useEffect(() => {
    if (discussOpen) { 
      setUnityInputStatus(discussOpen ? 'disable' : 'enable');// Update the user state if necessary
      fetchQuestions(); // Fetch questions only when discussOpen is true
    }
  }, [discussOpen, user]);


  useEffect(() => {
    if (shouldSubmit && savedContent !== '') {
      submitAnswer();
      setShouldSubmit(false);
    }
  }, [savedContent, shouldSubmit]);

  const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/api/df/questions`); // API route
        setQuestions(response.data); // Set the fetched questions
      } catch (err) {
        console.error('Error fetching questions:', err);
      }
    };

  const handleAnswerSave = (content) => {
    setSavedContent(content.content);
    setShouldSubmit(true);
  };

  const handleCommentSave = (content) => {
    setSavedContent(content.content)
    }

  const handleInputChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  //For formatting the answers bold etc 
  const SafeHtmlParserComponent = (rawHtml) => {
    // Sanitize the raw HTML to prevent XSS attacks
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);

    // Parse the sanitized HTML into JSX elements
    const parsedHtml = parse(sanitizedHtml);
    return <div>{parsedHtml}</div>;
  };

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleQuestionComments = () => {
    setShowQuestionComments(prevState => !prevState);
  };

  const toggleAnswerComments = (answerId) => {
    setShowAnswerComments(prevState => ({
      ...prevState,
      [answerId]: !prevState[answerId]
    }));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startLeftPanelWidth = leftPanelWidth;
  
    const onMouseMove = (e) => {
      const newWidth = Math.max(
        0, // Allow complete collapse
        Math.min(100, startLeftPanelWidth + ((e.clientX - startX) / window.innerWidth) * 100)
      );
      setLeftPanelWidth(newWidth);
    };
  
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

const submitQuestion = async (e) => {
  e.preventDefault();
  if (user) {
    try {
      const questionData = {
        title: newQuestion.title,
        description: newQuestion.description,
        tags: newQuestion.tags, // Ensure this is an array if needed
        authorId: user.uid, // Firebase UID of the current user
        authorName: user.userName, // Firebase user's display name
      };

      // Make POST request to your backend
      const response = await axios.post(`${REACT_APP_API_URL}/api/df/questions`, questionData);

      //console.log('Question created successfully:', response.data);

      // Reset the question form
      setNewQuestion({ title: '', description: '', tags: '' });

      // Fetch the updated list of questions
      fetchQuestions();
      setIsAddingQuestion(false);
    } catch (error) {
      console.error('Failed to create question:', error.response?.data || error.message);
    }
  }
};

  const viewQuestionDetails = async (id) => {
    try {
      // Make a GET request to the backend API
      const response = await axios.get(`${REACT_APP_API_URL}/api/df/questions/${id}`);
      const { question, answers, comments, answerComments } = response.data;
  
      // Process and update your states accordingly
      setSelectedQuestion({
        ...question, // Question details
        answers, // List of answers
      });
  
      setQuestionComments(comments); // List of comments on the question
      setAnswerComments(answerComments); // Nested comments for each answer
    } catch (error) {
      console.error('Error fetching question details:', error.response?.data || error.message);
    }
  };
  const submitAnswer = async () => {
    if (savedContent === '') {
      alert('No content to submit');
      return;
    }
  
    if (selectedQuestion && user) {
      try {
        const response = await axios.post(`${REACT_APP_API_URL}/api/df/answers`, {
          questionId: selectedQuestion._id, // Pass the question ID
          content: savedContent, // The answer content
          authorId: user.uid, // Current user's ID
          authorName: user.userName, // Current user's name
        });
  
        // Clear inputs and refresh view
        setSavedContent('');
        viewQuestionDetails(selectedQuestion._id); // Refresh question details
        //console.log('Answer submitted successfully!', response.data);
      } catch (error) {
        console.error('Error submitting answer:', error.response?.data || error.message);
      }
    } else {
      console.log('Missing user or selected question');
    }
  };

  const submitCommentOnQuestion = async (savedContent, selectedQuestion, user) => {

    if (!savedContent) {
      alert('No content to submit');
      return;
    }
  
    if (selectedQuestion && user) {
      try {
        const payload = {
          parentId: selectedQuestion._id, 
          parentType: 'Question',
          content: savedContent,
          authorId: user.uid,
          authorName: user.userName,
        };

        const response = await axios.post(`${REACT_APP_API_URL}/api/df/comments`, payload);
        //alert('Comment submitted successfully!');
        //console.log('Response:', response.data);
        // Optionally refresh question details
        
      setSavedContent('');
        viewQuestionDetails(selectedQuestion._id);
      } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Failed to submit comment.');
      }
    }
  };

  const submitCommentOnAnswer = async (savedContent, selectedQuestion, answerId, user) => {
    if (!savedContent) {
      alert('No content to submit');
      return;
    }
    if (selectedQuestion && user) {
      try {
        const payload = {
          parentId: answerId, 
          parentType: 'Answer',
          content: savedContent,
          authorId: user.uid,
          authorName: user.userName,
        };
        const response = await axios.post(`${REACT_APP_API_URL}/api/df/comments`, payload);
        //alert('Comment submitted successfully!');
        //console.log('Response:', response.data);
        // Optionally refresh question details
        viewQuestionDetails(selectedQuestion._id);
      } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Failed to submit comment.');
      }
    }
  };
  const formatTimestamp = (isoTimestamp) => {
    if (!isoTimestamp) {
      return 'N/A';
    }
    
  
    const now = new Date();
    const date = new Date(isoTimestamp); // Convert ISO timestamp to a Date object
    const diffInSeconds = Math.floor((now - date) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days > 1 ? 'days' : 'day'} ago`;
    }
  };
  
  


  return (
    <div style={{ position: "relative", zIndex: 99999 }}>
      
    <div className="fixed bottom-4 right-4 z-50">
    {!discussOpen && (
    <button
      onClick={() => setDiscussOpen(true)}
      style={{
        position: "fixed",
        bottom: "230px",
        right: "16px",
        width: "54px",
        height: "54px",
        backgroundColor: "#2ea043", // Lime green to match the image
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        zIndex: 99999,
        transition: "all 0.3s ease",
      }}
      aria-label="Open Discussion"
    >
      <MessageCircle size={24} color="white" />
    </button>
  )}

      {discussOpen && (
        <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100000,
        }}
      >
        <div className="fixed inset-0 bg-stone/50 flex items-center justify-center z-50">
          <div className="w-[800px] h-[650px] bg-stone rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-emerald-700 text-stone-50 p-3 flex items-center">
              <button 
                className="text-white hover:bg-white/20 px-3 w-fit py-0.5 rounded-md flex items-center"
                onClick={() => {setDiscussOpen(false);
                  setUnityInputStatus('enable')
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <h2 className="text-white text-lg w-full text-center font-semibold gap-3">Discussion Forum</h2>
              <button 
                className="bg-emerald-600 hover:bg-emerald-800 px-2 py-0.5 rounded-md transition-colors text-center  w-fit flex items-center"
                onClick={()=>setIsAddingQuestion(true)}
              >
                <MessageSquarePlus size={18} />
                <span>New Post</span>
              </button>
          

            </div>

            {/* Search Section */}
            <div className="p-4 bg-stone-100 shadow-sm">
            <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input
              type="text"
              placeholder="Search by title or tags"
              value={searchQuery}
              className="w-full pl-10 pr-4 py-2 border-2 border-stone-200 rounded-lg 
                     focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                     outline-none bg-white text-stone-800 placeholder-stone-400"
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
            />
            </div>
            </div>
            
            {/* Question List Area */}
            <div className="flex-1 p-3 bg-white" style={{ height: 'calc(650px - 140px)' }}>
              {isAddingQuestion &&(
  
  <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border border-stone-200">
  <form onSubmit={submitQuestion} className="space-y-6">
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold text-stone-800">Post a New Question</h2>
      <p className="text-stone-600 text-sm">Share your question with the community</p>
    </div>

    {/* Title Input */}
    <div className="space-y-2">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={newQuestion.title}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg
                 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                 outline-none bg-white text-stone-800 placeholder-stone-400
                 transition-colors"
        required
      />
    </div>

    {/* Description Input */}
    <div className="space-y-2">
      <textarea
        name="description"
        placeholder="Description"
        value={newQuestion.description}
        onChange={handleInputChange}
        rows={5}
        className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg
                 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                 outline-none bg-white text-stone-800 placeholder-stone-400
                 transition-colors resize-none"
        required
      />
    </div>

    {/* Tags Input */}
    <div className="space-y-2">
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma separated)"
        value={newQuestion.tags}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg
                 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                 outline-none bg-white text-stone-800 placeholder-stone-400
                 transition-colors"
      />
    </div>

    {/* Submit Button */}
    <div className="flex justify-between">
    <button
    onClick={()=>setIsAddingQuestion(false)}
        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white 
                 rounded-lg hover:bg-emerald-700 transition-colors font-medium w-fit"
      >
        <ChevronUpCircle size={18} />
        view Forum
      </button>

      <button
        type="submit"
        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white 
                 rounded-lg hover:bg-emerald-700 transition-colors font-medium w-fit"
      >
        <Send size={18} />
        Post Question
      </button>
    </div>
  </form>
</div>)
              }
              {!isAddingQuestion&&(
              <div className="split-view border border-purple-200 rounded-lg h-full flex items-center justify-center text-black-500">
              <div className="panel left-panel h-full overflow-y-auto py-1 scrollbar-container"  style={{ width: `${leftPanelWidth}%` }}>
        <ul className="space-y-3 h-full pr-1" style={{width: "95%"}}>
          {filteredQuestions.map(question => (
            <li
              key={question._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
              onClick={() => viewQuestionDetails(question._id)}
            >
              <div className="flex items-start ">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {question.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTimestamp(question.updatedAt)}
                    </div>
                    {/* <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {question.replies || 0} replies
                    </div> */}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {question.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div
  className="relative w-6 bg-gray-200 cursor-col-resize hover:bg-gray-300 transition-colors"
  onMouseDown={handleMouseDown}
>
  {/* Mode toggle buttons */}
  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col gap-2">
    <button
      onClick={() => setLeftPanelWidth(PANEL_MODES.LEFT_COLLAPSED)}
      className="p-1 rounded bg-white shadow hover:bg-gray-50"
      title="Hide question list"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
    <button
      onClick={() => setLeftPanelWidth(PANEL_MODES.SPLIT)}
      className="p-1 rounded bg-white shadow hover:bg-gray-50"
      title="Default split view"
    >
      <Columns className="w-4 h-4" />
    </button>
    
    <button
      onClick={() => setLeftPanelWidth(PANEL_MODES.RIGHT_COLLAPSED)}
      className="p-1 rounded bg-white shadow hover:bg-gray-50"
      title="Hide question view"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
</div>

        <>

        <div className="h-full panel right-panel overflow-y-auto px-4 py-3 scrollbar-container"  style={{ width: `${100 - leftPanelWidth}%` }}>
          
          {/* Question Details & Answers */}
          {selectedQuestion && (
            <>
              <div className="question-details">
              <div className="question-header">
                <div className="question-title">{selectedQuestion.title}</div>
                <div className="author-name">{selectedQuestion.authorName}</div>
              </div>

              <div className="question-content">
                <p>{selectedQuestion.description}<br/>{formatTimestamp(selectedQuestion.updatedAt)}</p>
                <button onClick={toggleQuestionComments} className="text-darkgreen hover:text-white">
                {showQuestionComments ? 'Hide Comments' : 'Show Comments'}
              </button>
              
              {showQuestionComments && (
        <div className="mt-4 bg-gray-50 rounded-lg p-5">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Comments</h4>
          
          <div className="space-y-3">
            {questionComments.map(comment => (
              <div 
                key={comment._id} 
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="prose prose-sm max-w-none">
                  {SafeHtmlParserComponent(comment.content)}
                </div>
                
                <div className="mt-2 flex items-center space-x-3 text-sm text-gray-600">
                  <span className="font-medium">{comment.authorName}</span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimestamp(comment.updatedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Controls */}
          <div className="mt-4 mr-2 w-full flex items-center" style={{width:'70%',padding:'1'}}>
            {(<HybridEditor
            onSave={handleCommentSave}
            placeholder="Add a comment..."
            type="comment"
            toolbarConfig={{
              basic: true,
              links: true,clear: true,
              heading: false,quote: false
              }}
              />)}

                  <button 
                    onClick={() => submitCommentOnQuestion(savedContent, selectedQuestion, user)}
                    disabled={!savedContent} // Button disabled if savedContent is empty
                    className={`flex items-center px-2 py-2 ml-2 text-sm rounded-lg transition-colors 
                      ${
                        savedContent  ? "bg-blue-600 text-white hover:bg-blue-700" // Active style
                        : "bg-gray-400 text-gray-300 cursor-not-allowed" // Disabled style
                        }`}
                  >
                    <Send className="w-3 h-3 " />
                    Add Comment
                  </button>
                  </div>
                </div>
              )}
              </div>

              <div className="tags-and-votes">
              <div className="tags">
                {selectedQuestion.tags.split(',').map((tag, index) => (
                  <div key={index} className="tag">{tag.trim()}</div>  // trim removes extra spaces
                ))}
              </div>
                <div className="votes">
                  <span>Votes</span>
                  <button className="vote-btn">👍</button>
                </div>
              </div>

              <div className="answers-section  p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Answers</h3>
      <div className="mt-6 flex items-center space-x-4">
        <HybridEditor
          onSave={handleAnswerSave}
          placeholder="Write your answer..."
          type="answer"
          expandedByDefault={true}
          minHeight="200px"
          toolbarConfig={{
            basic: true,
            links: true,
            clear: true,
            heading: true,
            quote: true
          }}
        />
        
      </div> 
      <div className="space-y-6 pt-2">
        {selectedQuestion.answers.map(answer => (
          <div key={answer._id} className="bg-white rounded-lg shadow-sm p-6">
            {/* Answer Content */}
            <div className="mb-4">
              <div className="prose max-w-none">
                {SafeHtmlParserComponent(answer.content)}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="font-medium">{answer.authorName}</span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimestamp(answer.updatedAt)}
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleAnswerComments(answer._id)}
                  className="flex items-center text-sm text-blue-600 hover:text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {showAnswerComments[answer._id] ? 'Hide Comments' : 'Show Comments'}
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {showAnswerComments[answer._id] && (
              <div className="mt-4 pl-6 border-l-2 border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Comments</h4>
                
                <div className="space-y-3">
                  {(answerComments[answer._id] || []).map(comment => (
                    <div 
                      key={comment._id} 
                      className="bg-gray-50 rounded-lg p-3 text-sm"
                    >
                      <div className="prose prose-sm">
                        {SafeHtmlParserComponent(comment.content)}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-3 text-gray-600">
                          <span className="font-medium">{comment.authorName}</span>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimestamp(comment.updatedAt)}
                          </div>
                        </div>
                         
                        {/*<button className="flex items-center text-gray-500 hover:text-blue-600">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          <span className="text-xs">Vote</span>
                        </button> */}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment Section */}
                <div className="mt-4 items-center space-x-3">
                  
                  
                  {(<HybridEditor
                  onSave={handleCommentSave}
                  placeholder="Add a comment..."
                  type="comment"
                  toolbarConfig={{
                    basic: true,
                    links: true,
                    clear: true,
                    heading: false,
                    quote: false
                    }}
                  />)}
                  <button 
                    onClick={() => submitCommentOnAnswer(savedContent,selectedQuestion,answer._id,user)}
                    disabled={!savedContent} // Button disabled if savedContent is empty
                      className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors 
                        ${
                          savedContent
                            ? "bg-blue-600 text-white hover:bg-blue-700" // Active style
                            : "bg-gray-400 text-gray-300 cursor-not-allowed" // Disabled style
                        }`}
                  >
                    <Send className="w-2 h-3 mr-2" />
                    Add Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
              </div>
            </>
          )}
          </div>
        </>
              </div>)}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default Discussion;