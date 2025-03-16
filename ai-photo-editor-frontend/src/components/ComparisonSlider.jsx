import { useState, useEffect, useRef } from 'react';

function ComparisonSlider({ beforeImage, afterImage, className = '' }) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!dragging) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Get position for both mouse and touch events
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    if (clientX === null) return;
    
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = (x / rect.width) * 100;
    
    // Constrain to 1-99% to avoid complete overlay
    const constrainedPos = Math.max(1, Math.min(99, pos));
    setPosition(constrainedPos);
  };

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);
  
  // Add and remove event listeners
  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragging]);

  return (
    <div 
      ref={containerRef}
      className={`relative cursor-col-resize select-none overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* First (After) image */}
      <div className="w-full">
        <img 
          src={`data:image/jpeg;base64,${afterImage}`} 
          alt="After" 
          className="w-full h-auto select-none"
        />
      </div>
      
      {/* Second (Before) image as overlay */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img 
          src={`data:image/jpeg;base64,${beforeImage}`} 
          alt="Before" 
          className="w-auto h-full object-cover object-left"
          style={{ 
            width: `${100 / (position / 100)}%`, // Scale the image to maintain proportion
            maxWidth: 'none'
          }}
        />
      </div>
      
      {/* Slider handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize"
        style={{ left: `calc(${position}% - 0.5px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.5 15a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-1 0v14a.5.5 0 0 0 .5.5zm-3-14a.5.5 0 0 0-1 0v14a.5.5 0 0 0 1 0V1zm-5 14a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-1 0v14a.5.5 0 0 0 .5.5z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ComparisonSlider;