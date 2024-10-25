import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  
  const chatHistoryRef = useRef(null);

  // Scroll to the bottom of the chat history whenever new messages are added
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messageHistory]);

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();
    
    if (!question.trim()) return; // Prevent empty submissions

    const userMessage = { role: "user", content: question };
    setMessageHistory((prevHistory) => {
      const newHistory = [...prevHistory, userMessage];
      // Keep only the last 50 messages
      return newHistory.slice(-50);
    });

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          process.env.REACT_APP_OPENAI_API_KEY
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const botAnswer = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      const botMessage = { role: "bot", content: botAnswer };

      setMessageHistory((prevHistory) => {
        const newHistory = [...prevHistory, botMessage];
        // Keep only the last 50 messages
        return newHistory.slice(-50);
      });
    } catch (error) {
      console.log(error);
      const errorMessage = { role: "bot", content: "Sorry - Something went wrong. Please try again!" };
      setMessageHistory((prevHistory) => {
        const newHistory = [...prevHistory, errorMessage];
        // Keep only the last 50 messages
        return newHistory.slice(-50);
      });
    }

    setGeneratingAnswer(false);
    setQuestion(""); // Clear input field after submission
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents newline insertion
      generateAnswer(e);   // Trigger form submission
    }
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-history" ref={chatHistoryRef}>
        {messageHistory.map((message, index) => (
          <div key={index} className={`chatbot-message ${message.role}`}>
            <div className="message-role">{message.role === "user" ? "You" : "Bot"}:</div>
            <ReactMarkdown className="message-content">{message.content}</ReactMarkdown>
          </div>
        ))}
      </div>

      <form onSubmit={generateAnswer} className="chatbot-form">
        <div className="input-container">
          <textarea
            required
            className="chatbot-textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything"
            onKeyDown={handleKeyDown}
          ></textarea>
          <button
            type="submit"
            className={`chatbot-button ${generatingAnswer ? 'disabled' : ''}`}
            disabled={generatingAnswer}
          >
            ➤ 
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatBot;