import React from 'react';

export default function ConvergenceMeter({ score }) {
  const normalizedScore = score !== undefined ? score : 0.5;
  const percentage = (normalizedScore * 100).toFixed(0);

  // SVG parameters
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore * circumference);

  const getLabel = (sc) => {
    if (sc >= 0.75) return 'Consensus Stance';
    if (sc >= 0.45) return 'Divided Stance';
    return 'Sharp Conflict';
  };

  const getColor = (sc) => {
    if (sc >= 0.75) return '#00796B'; // Teal
    if (sc >= 0.45) return '#E65100'; // Amber
    return '#C62828'; // Crimson
  };

  const activeColor = getColor(normalizedScore);

  return (
    <div className="premium-card" style={{
      padding: '1.5rem',
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-hairline)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      textAlign: 'center',
      minWidth: '200px'
    }}>
      <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
        Council Consensus
      </h4>

      {/* SVG Circle Progress */}
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="var(--bg-elevated)"
            strokeWidth={strokeWidth}
          />
          {/* Active colored path */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s var(--transition-smooth)'
            }}
          />
        </svg>
        {/* Percentage Label in center */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1.25rem',
          fontWeight: '800',
          color: activeColor,
          fontFamily: 'var(--font-display)'
        }}>
          {percentage}%
        </div>
      </div>

      <div>
        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: activeColor }}>
          {getLabel(normalizedScore)}
        </div>
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginTop: '0.25rem',
          maxWidth: '160px',
          lineHeight: '1.4'
        }}>
          {normalizedScore >= 0.75 
            ? 'Advisors are converging on a single unified path.' 
            : normalizedScore >= 0.45 
            ? 'Moderate alignment with elements of critical dissent.' 
            : 'Strong structural split. The dissent is highly vital.'}
        </p>
      </div>
    </div>
  );
}
