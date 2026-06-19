import React from 'react';

export default function CouncilTable({ activeSpeaker }) {
  const ADVISORS = [
    { role: 'skeptic', name: 'The Skeptic', img: '/The Skeptic.png', color: 'var(--skeptic)', pulseClass: 'active-pulse-skeptic' },
    { role: 'strategist', name: 'The Strategist', img: '/The Strategist.png', color: 'var(--strategist)', pulseClass: 'active-pulse-strategist' },
    { role: 'numbers', name: 'The Numbers', img: '/The Numbers.png', color: 'var(--numbers)', pulseClass: 'active-pulse-numbers' },
    { role: 'devils_advocate', name: "The Devil's Advocate", img: "/The Devil's Advocate.png", color: 'var(--devils-advocate)', pulseClass: 'active-pulse-devils' },
    { role: 'chair', name: 'The Chair', img: '/The Chair.png', color: 'var(--chair)', pulseClass: 'active-pulse-chair' },
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '850px',
      margin: '2rem auto',
      padding: '2rem 1.5rem',
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-hairline)',
      borderRadius: '16px',
      boxShadow: 'var(--shadow-premium)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Semicircle Backdrop Arc */}
      <div style={{
        position: 'absolute',
        bottom: '-25%',
        left: '10%',
        width: '80%',
        height: '130%',
        borderRadius: '50%',
        border: '1px dashed var(--border-hairline)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <h3 className="font-serif" style={{
        fontSize: '1.25rem',
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: '2.5rem',
        zIndex: 1,
        position: 'relative'
      }}>
        The <span className="motif-literary">Council Chamber</span>
      </h3>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '2rem',
        position: 'relative',
        zIndex: 1,
        minHeight: '160px'
      }}>
        {ADVISORS.map((advisor) => {
          const isSpeaking = activeSpeaker === advisor.role;
          return (
            <div 
              key={advisor.role}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '110px',
                transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {/* Circular Avatar Container */}
              <div 
                className={isSpeaking ? advisor.pulseClass : ''}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: isSpeaking ? `2px solid ${advisor.color}` : '1px solid var(--border-hairline)',
                  padding: '3px',
                  backgroundColor: '#FFFFFF',
                  transition: 'border-color 0.3s, transform 0.3s',
                  transform: isSpeaking ? 'scale(1.1) translateY(-6px)' : 'scale(1.0)',
                  boxShadow: isSpeaking ? '0 10px 25px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <img 
                  src={advisor.img} 
                  alt={advisor.name} 
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Label */}
              <span className="font-display" style={{
                fontSize: '0.8rem',
                fontWeight: isSpeaking ? '700' : '500',
                color: isSpeaking ? advisor.color : 'var(--text-secondary)',
                marginTop: '0.75rem',
                letterSpacing: '-0.01em',
                transition: 'color 0.3s'
              }}>
                {advisor.name}
              </span>
              
              {/* Speaking Indicator Badge */}
              {isSpeaking && (
                <span className="motif-literary" style={{
                  fontSize: '0.7rem',
                  color: advisor.color,
                  marginTop: '0.15rem',
                  letterSpacing: '0.05em',
                  textTransform: 'lowercase'
                }}>
                  speaking...
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Center Semicircle Table Overlay */}
      <div style={{
        width: '250px',
        height: '24px',
        border: '1px solid var(--border-hairline)',
        borderTopLeftRadius: '125px',
        borderTopRightRadius: '125px',
        backgroundColor: 'var(--bg-surface)',
        margin: '2rem auto 0 auto',
        zIndex: 1,
        position: 'relative'
      }} />
    </div>
  );
}
