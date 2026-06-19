import React, { useState, useEffect, useRef } from 'react';

// Single message typing component
function TypingBubble({ text, speed = 8, onDone }) {
  const [displayedText, setDisplayedText] = useState("");
  const index = useRef(0);

  useEffect(() => {
    setDisplayedText("");
    index.current = 0;
  }, [text]);

  useEffect(() => {
    if (!text) return;
    
    const interval = setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current++;
      } else {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onDone]);

  // Format motifs dynamically
  const formatMotifs = (rawText) => {
    if (!rawText) return "";
    
    let formatted = rawText;
    
    // 1. Advisor Mentions
    formatted = formatted.replace(/@Skeptic/gi, '<span class="motif-advisor-skeptic">@Skeptic</span>');
    formatted = formatted.replace(/@Strategist/gi, '<span class="motif-advisor-strategist">@Strategist</span>');
    formatted = formatted.replace(/@Numbers/gi, '<span class="motif-advisor-numbers">@Numbers</span>');
    formatted = formatted.replace(/@DevilsAdvocate/gi, '<span class="motif-advisor-devils">@Devil\'s Advocate</span>');
    formatted = formatted.replace(/@Chair/gi, '<span class="motif-advisor-chair">@Chair</span>');

    // 2. Financial Metrics (Percentages, Dollar amounts, Cliffs, Vesting terms)
    formatted = formatted.replace(/(\$[\d,]+k?|[\d\.]+%|\b\d+-(?:year|month|cliff)\b)/gi, '<span class="motif-precise">$1</span>');

    // 3. Highlighted Quotes (Editorial contrast)
    formatted = formatted.replace(/"([^"]+)"/g, '<span class="motif-literary">"$1"</span>');

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return <div style={{ lineHeight: '1.65' }}>{formatMotifs(displayedText)}</div>;
}

export default function DebateStream({ argumentsList, isOrchestrating, activeSpeaker, onTypingFinished }) {
  const [messageQueue, setMessageQueue] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const processedMessageIds = useRef(new Set());
  const listEndRef = useRef(null);

  // Sync new arguments with queue
  useEffect(() => {
    const unread = argumentsList.filter(arg => !processedMessageIds.current.has(arg.id || arg.content.slice(0, 20)));
    if (unread.length > 0) {
      unread.forEach(arg => {
        processedMessageIds.current.add(arg.id || arg.content.slice(0, 20));
      });
      setMessageQueue(prev => [...prev, ...unread]);
    }
  }, [argumentsList]);

  // Process queue sequentially
  useEffect(() => {
    if (!activeMessage && messageQueue.length > 0) {
      const nextMsg = messageQueue[0];
      setActiveMessage(nextMsg);
      setMessageQueue(prev => prev.slice(1));
    }
  }, [messageQueue, activeMessage]);

  useEffect(() => {
    if (listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessage, messageQueue]);

  const handleMessageDone = () => {
    if (activeMessage) {
      // Add active message to fully typed list and clean up
      onTypingFinished(activeMessage);
      setActiveMessage(null);
    }
  };

  const ADVISOR_META = {
    skeptic: { name: 'The Skeptic', color: 'var(--skeptic)', img: '/The Skeptic.png' },
    strategist: { name: 'The Strategist', color: 'var(--strategist)', img: '/The Strategist.png' },
    numbers: { name: 'The Numbers', color: 'var(--numbers)', img: '/The Numbers.png' },
    devils_advocate: { name: "The Devil's Advocate", color: 'var(--devils-advocate)', img: "/The Devil's Advocate.png" },
    chair: { name: 'The Chair', color: 'var(--chair)', img: '/The Chair.png' },
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '750px',
      margin: '2rem auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      backgroundColor: '#FFFFFF',
      padding: '1rem 0'
    }}>
      {/* Display already typed arguments */}
      {argumentsList.map((arg, idx) => {
        // Only show if it's already typed (onTypingFinished updates page.js arguments list status)
        if (!arg.isTyped) return null;
        
        const meta = ADVISOR_META[arg.advisor] || { name: arg.advisor, color: '#000', img: '/Logo.png' };
        
        const formatMotifs = (rawText) => {
          if (!rawText) return "";
          let formatted = rawText;
          formatted = formatted.replace(/@Skeptic/gi, '<span class="motif-advisor-skeptic">@Skeptic</span>');
          formatted = formatted.replace(/@Strategist/gi, '<span class="motif-advisor-strategist">@Strategist</span>');
          formatted = formatted.replace(/@Numbers/gi, '<span class="motif-advisor-numbers">@Numbers</span>');
          formatted = formatted.replace(/@DevilsAdvocate/gi, '<span class="motif-advisor-devils">@Devil\'s Advocate</span>');
          formatted = formatted.replace(/@Chair/gi, '<span class="motif-advisor-chair">@Chair</span>');
          formatted = formatted.replace(/(\$[\d,]+k?|[\d\.]+%|\b\d+-(?:year|month|cliff)\b)/gi, '<span class="motif-precise">$1</span>');
          formatted = formatted.replace(/"([^"]+)"/g, '<span class="motif-literary">"$1"</span>');
          return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
        };

        return (
          <div key={idx} className="page-enter" style={{
            display: 'flex',
            gap: '1.25rem',
            alignItems: 'flex-start',
            padding: '1rem',
            borderBottom: '1px solid var(--border-hairline)'
          }}>
            <img 
              src={meta.img} 
              alt={meta.name} 
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--border-hairline)'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="font-display" style={{ fontWeight: '700', fontSize: '0.85rem', color: meta.color }}>
                  {meta.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Round {arg.round}
                </span>
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                {formatMotifs(arg.content)}
              </div>
            </div>
          </div>
        );
      })}

      {/* Display active typing message */}
      {activeMessage && (
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'flex-start',
          padding: '1rem',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '8px'
        }}>
          <img 
            src={ADVISOR_META[activeMessage.advisor]?.img || '/Logo.png'} 
            alt={activeMessage.advisor} 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid ' + (ADVISOR_META[activeMessage.advisor]?.color || '#000')
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="font-display" style={{ fontWeight: '700', fontSize: '0.85rem', color: ADVISOR_META[activeMessage.advisor]?.color }}>
                {ADVISOR_META[activeMessage.advisor]?.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Round {activeMessage.round} (typing...)
              </span>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <TypingBubble 
                text={activeMessage.content} 
                onDone={handleMessageDone}
              />
            </div>
          </div>
        </div>
      )}

      {/* Show typing placeholders if waiting for server response */}
      {!activeMessage && isOrchestrating && activeSpeaker && (
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'center',
          padding: '1rem',
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          <div className="typing-dots" style={{ display: 'flex', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: ADVISOR_META[activeSpeaker]?.color || '#000', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
            <span style={{ width: '6px', height: '6px', backgroundColor: ADVISOR_META[activeSpeaker]?.color || '#000', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both 0.2s' }}></span>
            <span style={{ width: '6px', height: '6px', backgroundColor: ADVISOR_META[activeSpeaker]?.color || '#000', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both 0.4s' }}></span>
          </div>
          <span className="motif-literary">{ADVISOR_META[activeSpeaker]?.name} is drafting their thoughts...</span>
        </div>
      )}

      <div ref={listEndRef} />

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
}
