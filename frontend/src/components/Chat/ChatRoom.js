import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import HostAvatar from '../Event/Avatar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 700px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  overflow: hidden;
  border: 1px solid #eee;
`;

const AvatarSection = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  height: 250px;
  position: relative;
`;

const ChatHeader = styled.div`
  padding: 16px;
  background-color: #ff5e3a;
  color: white;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  z-index: 10;
`;

const MessageList = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #f4f6f8;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  align-self: ${props => props.isSent ? 'flex-end' : 'flex-start'};
  background-color: ${props => {
    if (props.isSent) return '#ff5e3a';
    if (props.isAI) return '#1a1a2e';
    return 'white';
  }};
  color: ${props => (props.isSent || props.isAI) ? 'white' : '#333'};
  border-bottom-right-radius: ${props => props.isSent ? '4px' : '16px'};
  border-bottom-left-radius: ${props => (!props.isSent && !props.isAI) ? '4px' : '16px'};
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);

  .sender-name {
    font-size: 10px;
    font-weight: 700;
    margin-bottom: 4px;
    display: block;
    opacity: 0.8;
  }

  .time {
    font-size: 10px;
    opacity: 0.6;
    margin-top: 6px;
    display: block;
    text-align: right;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  overflow-x: auto;
  background: white;
  border-top: 1px solid #eee;

  button {
    white-space: nowrap;
    background: #f0f2f5;
    border: 1px solid #ddd;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    &:hover { background: #e4e6e9; border-color: #ff5e3a; color: #ff5e3a; }
  }
`;

const ChatInputArea = styled.div`
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
  background: white;

  input {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 24px;
    padding: 12px 20px;
    outline: none;
    font-size: 14px;
    &:focus { border-color: #ff5e3a; box-shadow: 0 0 0 2px rgba(255,94,58,0.1); }
  }

  button {
    background-color: #ff5e3a;
    color: white;
    border: none;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s;
    &:hover { transform: scale(1.05); }
  }
`;

const ChatRoom = ({ attendeeId, eventId, adminId, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [hostAction, setHostAction] = useState('idle');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const socketRef = useRef();
  const scrollRef = useRef();

  const QUICK_QUERIES = [
    "Ask about schedule",
    "Where is booth X?",
    "How to join session?",
    "Who is the next speaker?"
  ];

  useEffect(() => {
    const authData = localStorage.getItem('vep_auth');
    const token = authData ? JSON.parse(authData).token : null;
    
    socketRef.current = io('http://localhost:5000', {
      query: { token }
    });

    socketRef.current.emit('join_room', { attendeeId, eventId });
    socketRef.current.emit('fetch_history', { attendeeId, eventId });

    socketRef.current.on('history', (history) => setMessages(history));
    socketRef.current.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender === 'ai_host') {
        setHostAction('wave'); // Trigger avatar animation on AI message
        setTimeout(() => setHostAction('idle'), 3000);
      }
    });

    socketRef.current.on('host-speak', (data) => {
      setHostAction(data.action || 'greet');
      setTimeout(() => setHostAction('idle'), 4000);
    });

    socketRef.current.on('ai_typing', (data) => {
      setIsAiTyping(data.isTyping);
    });

    socketRef.current.on('chat-error', (err) => {
      toast.error(err.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [attendeeId, eventId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const sendMessage = (text = input) => {
    if (!text.trim()) return;

    const receiverId = text.toLowerCase().startsWith('@host') ? 'ai_host' : (currentUserId === attendeeId ? adminId : attendeeId);
    
    socketRef.current.emit('send_message', {
      receiverId,
      eventId,
      content: text
    });
    
    if (text === input) setInput('');
  };

  const handleQuickAction = (query) => {
    sendMessage(`@host ${query}`);
  };

  return (
    <ChatContainer>
      <ToastContainer position="top-right" autoClose={3000} />
      <AvatarSection>
        <HostAvatar action={hostAction} />
        <div style={{ position: 'absolute', bottom: '10px', left: '16px', color: 'white', fontSize: '12px', fontWeight: 'bold', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px' }}>
          Virtual Host: AI Assistant
        </div>
      </AvatarSection>
      <ChatHeader>
        <span>Event Chat</span>
        <span style={{ fontSize: '12px', opacity: 0.8 }}>● Live Interaction</span>
      </ChatHeader>
      
      <MessageList>
        {messages.map((msg, idx) => {
          const isSent = msg.sender === currentUserId;
          const isAI = msg.sender === 'ai_host';
          return (
            <MessageBubble key={idx} isSent={isSent} isAI={isAI}>
              {!isSent && <span className="sender-name">{isAI ? 'Virtual Host' : 'Staff'}</span>}
              {msg.content}
              <span className="time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </MessageBubble>
          );
        })}
        {isAiTyping && (
          <div style={{ alignSelf: 'flex-start', background: '#e0e0e0', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
            Virtual Host is typing...
          </div>
        )}
        <div ref={scrollRef} />
      </MessageList>

      <QuickActions>
        {QUICK_QUERIES.map((q, i) => (
          <button key={i} onClick={() => handleQuickAction(q)}>{q}</button>
        ))}
      </QuickActions>

      <ChatInputArea>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type @host to ask AI..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={() => sendMessage()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </ChatInputArea>
    </ChatContainer>
  );
};

export default ChatRoom;
