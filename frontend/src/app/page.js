'use client';

import React, { useState, useEffect, useRef } from 'react';
import HeroSection from '../components/HeroSection';
import DecisionInput from '../components/DecisionInput';
import CouncilTable from '../components/CouncilTable';
import DebateStream from '../components/DebateStream';
import VerdictPanel from '../components/VerdictPanel';
import StakesIndicator from '../components/StakesIndicator';
import ConvergenceMeter from '../components/ConvergenceMeter';

export default function Home() {
  const [view, setView] = useState('landing'); // 'landing' | 'input' | 'chamber'
  const [isLoading, setIsLoading] = useState(false);
  
  // Decision Details
  const [decisionId, setDecisionId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [category, setCategory] = useState("");
  const [stakesLevel, setStakesLevel] = useState(3);
  const [factors, setFactors] = useState([]);
  
  // Debate Live Feed
  const [argumentsList, setArgumentsList] = useState([]);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [bandRoomId, setBandRoomId] = useState(null);

  const socketRef = useRef(null);

  const handleStart = () => {
    setView('input');
  };

  const handleDecisionSubmit = async (text) => {
    setIsLoading(true);
    setInputText(text);
    setArgumentsList([]);
    setVerdict(null);
    setActiveSpeaker(null);
    
    try {
      // Create decision on backend
      const response = await fetch('http://localhost:8000/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: text })
      });
      
      if (!response.ok) {
        throw new Error("Failed to initialize decision with the Council.");
      }
      
      const data = await response.json();
      setDecisionId(data.decision_id);
      setCategory(data.category);
      setStakesLevel(data.stakes_level);
      setFactors(data.factors);
      
      // Move to chamber view and start websocket connection
      setView('chamber');
      setIsOrchestrating(true);
      connectWebSocket(data.decision_id);
    } catch (err) {
      alert(err.message || "Connection error. Make sure your FastAPI backend is running.");
      setIsLoading(false);
    }
  };

  const connectWebSocket = (id) => {
    const wsUrl = `ws://localhost:8000/ws/debate/${id}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected successfully.");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("WS Event:", msg);

      if (msg.type === 'status') {
        setBandRoomId(msg.band_room_id);
      } else if (msg.type === 'typing') {
        setActiveSpeaker(msg.advisor);
      } else if (msg.type === 'argument') {
        // Add to arguments list for the stream component queue
        setArgumentsList(prev => {
          // Check if argument already exists to prevent duplicate renders
          const exists = prev.some(a => a.advisor === msg.advisor && a.round === msg.round);
          if (exists) return prev;
          
          return [...prev, {
            id: `${msg.advisor}-${msg.round}-${Date.now()}`,
            advisor: msg.advisor,
            content: msg.content,
            round: msg.round,
            isTyped: false // Queue will flip this to true
          }];
        });
        setActiveSpeaker(msg.advisor);
      } else if (msg.type === 'verdict') {
        setVerdict(msg);
        setIsOrchestrating(false);
        setActiveSpeaker(null);
        setIsLoading(false);
      }
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected.");
    };
  };

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const handleTypingFinished = (typedArg) => {
    // Mark the message as finished in main state
    setArgumentsList(prev => prev.map(arg => {
      if (arg.id === typedArg.id) {
        return { ...arg, isTyped: true };
      }
      return arg;
    }));
  };

  const resetPlatform = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    setView('landing');
    setDecisionId(null);
    setInputText("");
    setArgumentsList([]);
    setVerdict(null);
    setActiveSpeaker(null);
    setIsLoading(false);
    setIsOrchestrating(false);
    setBandRoomId(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      {/* Editorial Navigation Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--border-hairline)',
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={resetPlatform}>
          <img src="/Logo.png" alt="The Council Logo" style={{ width: '28px', height: '28px' }} />
          <span className="font-display" style={{ fontWeight: '800', fontSize: '1rem', letterSpacing: '-0.02em' }}>
            THE COUNCIL
          </span>
        </div>
        
        {view !== 'landing' && (
          <button className="btn-secondary" onClick={resetPlatform} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            New Decision
          </button>
        )}
      </header>

      {/* Main Dynamic View Layout */}
      <main style={{ flex: 1 }}>
        {view === 'landing' && (
          <HeroSection onStart={handleStart} />
        )}

        {view === 'input' && (
          <div className="page-enter" style={{ padding: '2rem 1rem' }}>
            <DecisionInput onSubmit={handleDecisionSubmit} isLoading={isLoading} />
          </div>
        )}

        {view === 'chamber' && (
          <div className="page-enter" style={{ padding: '2rem 0' }}>
            {/* The Chamber Table */}
            <CouncilTable activeSpeaker={activeSpeaker} />

            {/* Live Metrics Row */}
            <div className="premium-container" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              marginTop: '2rem'
            }}>
              <StakesIndicator level={stakesLevel} factors={factors} />
              {verdict && <ConvergenceMeter score={verdict.convergence_score} />}
            </div>

            {/* Display user input decision summary */}
            <div className="premium-card" style={{
              maxWidth: '750px',
              margin: '3rem auto 1rem auto',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              padding: '1.5rem 2rem'
            }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Your Decision Query
              </h4>
              <p className="font-serif" style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                "{inputText}"
              </p>
              {bandRoomId && (
                <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: '#00796B', fontWeight: '600' }}>
                  💬 Band Room Created: <a href={`https://app.band.ai/chats/${bandRoomId}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{bandRoomId}</a>
                </div>
              )}
            </div>

            {/* Debate Feed */}
            <DebateStream 
              argumentsList={argumentsList} 
              isOrchestrating={isOrchestrating}
              activeSpeaker={activeSpeaker}
              onTypingFinished={handleTypingFinished}
            />

            {/* Synhesized Verdict */}
            {verdict && (
              <VerdictPanel verdict={verdict} />
            )}
          </div>
        )}
      </main>

      {/* Sponser Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        borderTop: '1px solid var(--border-hairline)',
        backgroundColor: '#FFFFFF',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span>Powered by <strong>Band.ai</strong></span>
          <span>•</span>
          <span>Models via <strong>Featherless.ai</strong></span>
          <span>•</span>
          <span>Synthesis by <strong>AI/ML API</strong></span>
          <span>•</span>
          <span>Grounding by <strong>Brightdata</strong></span>
        </div>
        <p>© 2026 The Council. Built by Shree Shah. Designed for Rank 1.</p>
      </footer>
    </div>
  );
}
