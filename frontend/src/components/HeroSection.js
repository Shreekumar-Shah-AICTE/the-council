import React from 'react';

export default function HeroSection({ onStart }) {
  return (
    <section className="page-enter" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '85vh',
      textAlign: 'center',
      backgroundColor: '#FFFFFF',
      padding: '4rem 1.5rem',
      position: 'relative'
    }}>
      {/* Editorial Header */}
      <h1 className="font-serif" style={{
        fontSize: '4.5rem',
        fontWeight: '300',
        letterSpacing: '-0.04em',
        lineHeight: '1.05',
        marginBottom: '1rem',
        color: '#000000',
        maxWidth: '800px'
      }}>
        The Room <span className="motif-literary">Everyone</span> Deserves.
      </h1>

      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        maxWidth: '540px',
        lineHeight: '1.6',
        marginBottom: '3rem',
        fontWeight: '400'
      }}>
        Five distinct expert minds debate your most critical career, financial, and life choices in real-time. Grounded in live market data. Preserved dissent.
      </p>

      {/* Hero Central Subject Image - Inspired by White Space layout */}
      <div style={{
        width: '100%',
        maxWidth: '750px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-hairline)',
        boxShadow: 'var(--shadow-premium)',
        marginBottom: '3rem',
        backgroundColor: '#F9F9FB',
        position: 'relative',
        aspectRatio: '16/10'
      }}>
        <img 
          src="/Hero section.png" 
          alt="The Council Chamber" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>

      <button className="btn-primary" onClick={onStart} style={{
        padding: '1rem 2.5rem',
        fontSize: '1.05rem',
        borderRadius: '30px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
      }}>
        Convene The Council
      </button>
    </section>
  );
}
