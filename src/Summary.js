// Summary.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Summary = () => {
  const [storeName, setStoreName] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [insight, setInsight] = useState('');
  const [revenueData, setRevenueData] = useState({});
  const [revenueSummary, setRevenueSummary] = useState({});
  const [cogsData, setcogsData] = useState({});
  const [cogssSummary, setcogsSummary] = useState({});
  const [expenseData, setexpenseData] = useState({});
  const [expenseSummary, setexpenseSummary] = useState({});
  const [profitData, setprofitData] = useState({});
  const [profitSummary, setprofitSummary] = useState({});
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleUserInput = (e) => {
    setUserMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (userMessage.trim() !== '') {
      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: userMessage }),
        });

        if (response.ok) {
          const data = await response.json();
          setChatHistory([...chatHistory, { user: userMessage, bot: data.answer }]);
          setUserMessage('');
        } else {
          const errorData = await response.json();
          console.error('Error sending message to chatbot:', errorData.error);
        }
      } catch (error) {
        console.error('Error sending message to chatbot:', error);
      }
    }
  };

  const toggleChatWindow = () => {
    setIsChatOpen(!isChatOpen);
  };




  const chatbotContainerStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '300px',
    height: '400px',
    backgroundColor: '#333', // Dark mode background color
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out',
    transform: isChatOpen ? 'translateY(0)' : 'translateY(calc(100% - 50px))',
    className: 'dark-mode-chatbot', // Apply the dark mode class
  };

  const chatHeaderStyle = {
    padding: '10px',
    backgroundColor: '#444', // Dark mode header background color
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    cursor: 'pointer',
    color: '#fff', // Dark mode header text color
    className: 'chat-header', // Apply the chat header class
  };

  const chatInputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#555', // Dark mode input container background color
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: '#ccc',
  };

  const chatInputStyle = {
    flex: 1,
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px 0 0 4px',
    backgroundColor: '#555', // Dark mode input background color
    color: '#fff', // Dark mode input text color
    className: 'chat-input', // Apply the chat input class
  };

  const sendButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#666', // Dark mode send button background color
    color: '#fff', // Dark mode send button text color
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    className: 'send-button', // Apply the send button class
  };

  const ChatHeader = ({ onClick }) => {
    return (
      <div style={chatHeaderStyle} onClick={onClick}>
        <h4>Chat</h4>
      </div>
    );
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`/api/summary/file.json`);
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        const insight = data["Summarize the Profit and Loss Data insights"].candidates[0].content.parts[0].text;
        setInsight(insight);

        const temp = data["Analyze the image and give me only revenue summary"].candidates[0].content.parts[0].text;
        const trimmedText = temp.trim();
        const linesWithoutHeader = trimmedText.split('\n').slice(2);
        const formattedLines = linesWithoutHeader.map(line => line.replace(/^- /, ''));
        const revenueData = formattedLines.join('\n');
        setRevenueData(revenueData);

        const tempx = data["Analyze the image and write me only revenue sumamary analysis"].candidates[0].content.parts[0].text;
        const tempxz = tempx.trim();
        const tempxy = tempxz.split('\n').slice(2);
        const tempxa = tempxy.map(line => line.trim());
        const revenueSummary = tempxa.join('\n');
        setRevenueSummary(revenueSummary)

        const temp_cogs = data["Analyze the image and give me only cost of goods summary"].candidates[0].content.parts[0].text;
        const cogsData = temp_cogs;
        setcogsData(cogsData);

        const temp_cogsd = data["Analyze the image and give me only detailed cost of goods analysis"].candidates[0].content.parts[0].text;
        let newString = temp_cogsd.replace("**Cost of Goods Analysis**", '');
        const cogssSummary = newString;
        setcogsSummary(cogssSummary);

        const temp_e = data["Analyze the image and give me only expense summary"].candidates[0].content.parts[0].text;
        let temp_eq = temp_e.replace("*", '');
        const temp_str = temp_eq.trim();
        const temp_split = temp_str.split('\n').slice(2);
        const temp_lines = temp_split.map(line => line.replace(/^- /, ''));
        const expenseData = temp_lines.join('\n');
        setexpenseData(expenseData);

        let temp_es = data["Analyze the image and give me only detailed expense analysis"].candidates[0].content.parts[0].text;
        let newString_es = temp_es.replace("*", '');
        let tempxz_es = newString_es.trim();
        let tempxy_es = tempxz_es.split('\n').slice(2);
        let tempxa_es = tempxy_es.map(line => line.trim());
        let expenseSummary = tempxa_es.join('\n');
        setexpenseSummary(expenseSummary);

        const temp_pd = data["Analyze the image and give me only Profit summary"].candidates[0].content.parts[0].text;
        const temp_str_pd = temp_pd.trim();
        const temp_split_pd = temp_str_pd.split('\n').slice(2);
        const temp_lines_pd = temp_split_pd.map(line => line.replace(/^- /, ''));
        const profitData = temp_lines_pd.join('\n');
        setprofitData(profitData);

        const temp_ps = data["Analyze the image and give me only detailed Profit analysis"].candidates[0].content.parts[0].text;
        let new_ps = temp_ps.replace("**Cost of Goods Analysis**", '');
        const profitSummary = new_ps;
        setprofitSummary(profitSummary);

        const contentText = data["Analyze the image and extract general information about the report date, company name, and reporting period."].candidates[0].content.parts[0].text;
        const storeNameMatch = contentText.match(/\*\*Company Name:\*\* ([^\n]+)/);
        const reportingPeriodMatch = contentText.match(/\*\*Reporting Period:\*\* ([^\n]+)/);

        if (storeNameMatch && storeNameMatch.length > 1) {
          setStoreName(storeNameMatch[1].trim());
        }
        if (reportingPeriodMatch && reportingPeriodMatch.length > 1) {
          setReportingPeriod(reportingPeriodMatch[1].trim());
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
        setError(`Failed to fetch summary: ${error.message}`);
        if (retryCount < 3) { // Retry up to 3 times
          setTimeout(() => {
            setRetryCount(retryCount + 1);
            fetchSummary();
          }, 2000); // Retry after 2 seconds
        } else {
          setLoading(false);
        }
      }
    };

    fetchSummary();
  }, [retryCount]);

  // if (loading) return <p>Loading...</p>;
  if (loading) return <div className="loader"></div>;  
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="summary-page">
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontWeight: 'normal' }}>{storeName}</h1>
        <p style={{ fontSize: 'smaller' }}>{reportingPeriod}</p>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <h2>Insights</h2>
          <p>{insight}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <div className="revenue-summary-box" style={{ flex: 1, marginRight: '10px' }}>
          <h3>Revenue</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{revenueData}</pre>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{revenueSummary}</pre>
        </div>

        <div className="revenue-summary-box" style={{ flex: 1 }}>
          <h3>Cost Of Goods (COGS)</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{cogsData}</pre>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{cogssSummary}</pre>
        </div>

        <div className="revenue-summary-box" style={{ flex: 1 }}>
          <h3>Expense</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{expenseData}</pre>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{expenseSummary}</pre>
        </div>

        <div className="revenue-summary-box" style={{ flex: 1 }}>
          <h3>Profit</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{profitData}</pre>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{profitSummary}</pre>
        </div>
      </div>

      <div style={chatbotContainerStyle}>
        <ChatHeader onClick={toggleChatWindow} />
        {isChatOpen && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {chatHistory.map((chat, index) => (
                <div key={index}>
                  <p>User: {chat.user}</p>
                  <p>Bot: {chat.bot}</p>
                </div>
              ))}
            </div>
            <div style={chatInputContainerStyle}>
              <input
                type="text"
                value={userMessage}
                onChange={handleUserInput}
                style={chatInputStyle}
                placeholder="Type your question..."
              />
              <button onClick={sendMessage} style={sendButtonStyle}>
                Send
              </button>
            </div>
          </>
        )}
      </div>

      <Link to="/">Go Back</Link>
    </div>
  );
};

export default Summary;