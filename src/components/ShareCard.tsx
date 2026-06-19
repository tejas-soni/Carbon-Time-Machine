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
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', flex: 1, textAlign: 'center', textDecoration: 'none' }}>𝕏 Post</a>
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(appLink)}&title=${encodeURIComponent('Carbon Time Machine')}&summary=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', flex: 1, textAlign: 'center', textDecoration: 'none' }}>LinkedIn</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appLink)}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', flex: 1, textAlign: 'center', textDecoration: 'none' }}>Facebook</a>
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
