import React from 'react';

export default function VerdictPanel({ verdict }) {
  if (!verdict) return null;

  const {
    recommendation,
    reasoning,
    dissent,
    dissent_advisor,
    action_items,
    convergence_score,
    hash,
    prev_hash
  } = verdict;

  const ADVISOR_NAMES = {
    skeptic: 'The Skeptic',
    strategist: 'The Strategist',
    numbers: 'The Numbers',
    devils_advocate: "The Devil's Advocate",
    chair: 'The Chair'
  };

  return (
    <div className="page-enter" style={{
      width: '100%',
      maxWidth: '750px',
      margin: '3rem auto',
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-hairline)',
      borderRadius: '16px',
      boxShadow: 'var(--shadow-premium)',
      padding: '2.5rem',
      position: 'relative'
    }}>
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <img 
          src="/Logo.png" 
          alt="The Council Logo" 
          style={{ width: '48px', height: '48px', marginBottom: '1rem' }}
        />
        <h2 className="font-serif" style={{
          fontSize: '2.2rem',
          fontWeight: '300',
          letterSpacing: '-0.02em',
          color: '#000000'
        }}>
          The Final <span className="motif-literary">Verdict</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.5rem' }}>
          Consensus Level: {(convergence_score * 100).toFixed(0)}%
        </p>
      </div>

      {/* Recommendation Block */}
      <div style={{
        borderLeft: '3px solid #000000',
        paddingLeft: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Recommendation
        </h4>
        <p className="font-serif" style={{
          fontSize: '1.4rem',
          fontWeight: '400',
          lineHeight: '1.5',
          color: '#000000'
        }}>
          {recommendation}
        </p>
      </div>

      {/* Reasoning Block */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
          Synthesis & Reasoning
        </h4>
        <div style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap'
        }}>
          {reasoning}
        </div>
      </div>

      {/* Preserved Dissent Section - Visually Separated */}
      {dissent && (
        <div style={{
          backgroundColor: '#FFFDF5',
          border: '1px solid #F5E8C4',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem' }}>⚖️</span>
            <h4 style={{
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#8A6D1C',
              fontWeight: '700'
            }}>
              Preserved Dissent Stance ({ADVISOR_NAMES[dissent_advisor] || dissent_advisor})
            </h4>
          </div>
          <p className="font-serif" style={{
            fontSize: '1rem',
            fontStyle: 'italic',
            lineHeight: '1.6',
            color: '#5C4A14'
          }}>
            {dissent}
          </p>
        </div>
      )}

      {/* Action Items List */}
      {action_items && action_items.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '2rem',
          marginBottom: '2.5rem'
        }}>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Your Next Steps
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {action_items.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span className="font-display" style={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </span>
                <p style={{
                  fontSize: '0.98rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  paddingTop: '0.15rem'
                }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cryptographic Chain Integrity Section */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-hairline)',
        borderRadius: '8px',
        padding: '1.2rem',
        fontSize: '0.78rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        lineHeight: '1.5'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.4rem' }}>
          <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>🔒 Cryptographic Audit Trail</span>
          <span style={{ color: '#00796B', fontWeight: '700' }}>● SECURED BY HASH-CHAIN</span>
        </div>
        <div style={{ wordBreak: 'break-all' }}>
          <strong>VERDICT SHA-256:</strong> {hash}
        </div>
        <div style={{ wordBreak: 'break-all', marginTop: '0.4rem' }}>
          <strong>PREVIOUS HASH:</strong> {prev_hash}
        </div>
      </div>
    </div>
  );
}
