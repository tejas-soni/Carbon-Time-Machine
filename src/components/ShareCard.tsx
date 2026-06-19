import React, { useState } from 'react';
import { ResultData } from '../types';

interface ShareCardProps {
  result: ResultData;
}

export const ShareCard: React.FC<ShareCardProps> = ({ result }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { archetype, futureMood, shiftedFutureMood, recommendedShift } = result;

  const appLink = window.location.origin;

  const shareText = `I visited my Carbon Time Machine! ⏳🌲

My pattern: ${archetype}
My future risk: ${futureMood} City
My one shift: ${recommendedShift}
Shifted future: ${shiftedFutureMood} City

The future bends when the pattern changes.
Try yours: ${appLink}
#CarbonTimeMachine #ClimateAwareness`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        triggerToast('Copy card copied to clipboard!');
      } else {
        // Fallback for older browsers
        const el = document.createElement('textarea');
        el.value = shareText;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        triggerToast('Copy card copied to clipboard!');
      }
    } catch (err) {
      triggerToast('Failed to copy. Please copy manually.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Carbon Time Machine Result',
          text: shareText,
          url: appLink
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share failed or cancelled', err);
      }
    } else {
      handleCopy();
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const canShare = !!navigator.share;

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h3 style={{ marginBottom: '12px' }}>Share Your Bended Timeline</h3>
      <p style={{ marginBottom: '16px' }}>
        Invite friends to discover how changing a single habit bends the future.
      </p>

      {/* Share Card Mockup */}
      <div className="share-card-mockup" style={{ marginBottom: '20px' }}>
        <div className="share-card-header">
          <span className="share-card-tag">⏳ Carbon Time Machine Card</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            2050 Timeline
          </span>
        </div>

        <div className="share-card-body">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              Pattern: {archetype}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              Risk: {futureMood} City
            </span>
          </div>

          <div className="share-card-quote">
            "I'm shifting one repeating habit: {recommendedShift} to shift the future mood from{' '}
            {futureMood} to {shiftedFutureMood}."
          </div>

          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              borderTop: '1px dashed rgba(16, 185, 129, 0.2)',
              paddingTop: '10px',
              marginTop: '4px',
              textAlign: 'right'
            }}
          >
            The future bends when the pattern changes.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={canShare ? handleShare : handleCopy}>
          {canShare ? 'Share Future' : 'Copy Share Card'}
        </button>
        {canShare && (
          <button className="btn btn-outline" onClick={handleCopy}>
            Copy Text
          </button>
        )}
      </div>

      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + "\\n" + appLink)}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Post
        </a>
        <a href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText + "\\n" + appLink)}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          Share
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appLink)}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Share
        </a>
      </div>

      {showToast && (
        <div className="copy-toast" role="status" aria-live="polite">
          <span>✓</span> {toastMessage}
        </div>
      )}
    </div>
  );
};
export default ShareCard;
