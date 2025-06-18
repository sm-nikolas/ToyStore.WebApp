import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  subContent?: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, subContent, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({ top: rect.bottom, left: rect.left + rect.width / 2, width: rect.width });
    }
    setIsVisible(true);
  };

  const hideTooltip = () => setIsVisible(false);

  return (
    <>
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      {createPortal(
        <div
          className={`
            z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg break-words
            transition-all duration-200
            ${isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}
          `}
          style={{
            position: 'fixed',
            top: coords.top + 8,
            left: coords.left,
            transform: 'translateX(-50%)',
            maxWidth: 320,
            width: 'max-content',
            minWidth: 120,
            wordBreak: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          <div className="font-medium mb-1">{content}</div>
          <div className="text-gray-300">{subContent}</div>
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              top: -6,
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: 12,
              height: 12,
              background: '#18181b',
              zIndex: 1,
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip; 