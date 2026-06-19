import React, { useState } from 'react';

export default function DecisionInput({ onSubmit, isLoading }) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSubmit(inputText);
  };

  const handleSuggest = (text) => {
    setInputText(text);
  };

  return (
    <div className="premium-card" style={{
      width: '100%',
      maxWidth: '750px',
      margin: '2rem auto',
      padding: '2.5rem',
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-hairline)'
    }}>
      <h2 className="font-serif" style={{
        fontSize: '2rem',
        fontWeight: '300',
        marginBottom: '0.5rem',
        color: '#000000'
      }}>
        What decision is <span className="motif-literary">weighing</span> on you?
      </h2>
      <p style={{
        fontSize: '0.95rem',
        color: 'var(--text-muted)',
        marginBottom: '2rem'
      }}>
        State the parameters clearly (salaries, terms, cliffs, stakes).
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. I got offered a Senior Product Manager role at a Series B startup with a base salary of $135,000, 0.3% equity vesting over 4 years with a 1-year cliff. I currently earn $115,000 at a stable enterprise. Should I accept this?"
          required
          rows={5}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '1.2rem',
            fontSize: '1rem',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)',
            borderRadius: '10px',
            outline: 'none',
            resize: 'vertical',
            transition: 'border-color var(--transition-fast)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-hairline)'}
        />

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading || !inputText.trim()}
          style={{
            alignSelf: 'flex-end',
            minWidth: '160px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoading || !inputText.trim() ? '0.6' : '1'
          }}
        >
          {isLoading ? (
            <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
          ) : "Convene The Council"}
        </button>
      </form>

      {/* Suggested prompts helper */}
      <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-hairline)', paddingTop: '1.5rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Or try a template:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            onClick={() => handleSuggest("I got offered $95K base with 0.4% equity, 4-year vest, one-year cliff at a Series B startup. I currently make $82K at a stable company. Should I take it?")}
            disabled={isLoading}
            style={{
              textAlign: 'left',
              background: 'none',
              border: 'none',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--bg-surface)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            💼 <span className="motif-literary">Career Startup Leap:</span> $95K base + 0.4% equity vs stable $82K.
          </button>
          <button 
            onClick={() => handleSuggest("Should I invest $50,000 of my personal savings into a commercial real estate syndication promising 8% preferred return, but with a 5-year capital lockup?")}
            disabled={isLoading}
            style={{
              textAlign: 'left',
              background: 'none',
              border: 'none',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--bg-surface)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            📉 <span className="motif-literary">High Stakes Syndication:</span> $50K into real estate syndication, 5-year lockup.
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
