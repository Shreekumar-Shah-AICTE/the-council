import React from 'react';

export default function StakesIndicator({ level, factors }) {
  // Ensure level is between 1 and 10
  const normalizedLevel = Math.min(Math.max(level || 1, 1), 10);
  
  // Color calculation
  const getColor = (lvl) => {
    if (lvl <= 3) return 'var(--stakes-low)';
    if (lvl <= 6) return 'var(--stakes-medium)';
    if (lvl <= 8) return 'var(--stakes-high)';
    return 'var(--stakes-critical)';
  };

  const getLabel = (lvl) => {
    if (lvl <= 3) return 'Low Stakes';
    if (lvl <= 6) return 'Moderate Stakes';
    if (lvl <= 8) return 'High Stakes';
    return 'CRITICAL STAKES';
  };

  const activeColor = getColor(normalizedLevel);

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
        Decision Stakes
      </h4>
      
      {/* Visual Level Gauge */}
      <div style={{ position: 'relative', width: '120px', height: '60px', overflow: 'hidden' }}>
        {/* Semi-circular track */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '12px solid var(--bg-elevated)',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          transform: 'rotate(-135deg)',
          boxSizing: 'border-box'
        }} />
        
        {/* Active colored arc */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: `12px solid ${activeColor}`,
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          transform: `rotate(${-135 + (normalizedLevel / 10) * 180}deg)`,
          transition: 'transform 1s var(--transition-spring)',
          boxSizing: 'border-box',
          pointerEvents: 'none'
        }} />

        {/* Level Number */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '120px',
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: '800',
          color: activeColor,
          fontFamily: 'var(--font-display)'
        }}>
          {normalizedLevel}/10
        </div>
      </div>

      <div>
        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: activeColor }}>
          {getLabel(normalizedLevel)}
        </div>
        {factors && factors.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            justifyContent: 'center',
            marginTop: '0.75rem'
          }}>
            {factors.map((factor, idx) => (
              <span key={idx} style={{
                fontSize: '0.7rem',
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)'
              }}>
                {factor}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
