import { useState, useRef, useEffect } from 'react';

function ComparisonSlider({ beforeImage, afterImage, className }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    
    // Clamp between 0 and 100
    const clampedPosition = Math.max(0, Math.min(100, position));
    setSliderPosition(clampedPosition);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const position = (x / rect.width) * 100;
    
    // Clamp between 0 and 100
    const clampedPosition = Math.max(0, Math.min(100, position));
    setSliderPosition(clampedPosition);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div 
      ref={containerRef} 
      className={`relative select-none overflow-hidden ${className || ''}`}
      style={{ height: '400px' }}
    >
      {/* Before image (full width) */}
      <div className="absolute inset-0">
        <img 
          src={`data:image/jpeg;base64,${beforeImage}`} 
          alt="Before" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* After image (clipped) */}
      <div 
        className="absolute inset-0"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` 
        }}
      >
        <img 
          src={`data:image/jpeg;base64,${afterImage}`} 
          alt="After" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slider control */}
      <div 
        className="absolute inset-y-0 z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Vertical line */}
        <div className="absolute inset-y-0 w-0.5 bg-white"></div>
        
        {/* Drag handle */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center cursor-grab"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Arrow icons */}
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-800 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-800 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-1 rounded">Before</div>
      <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded">After</div>
    </div>
  );
}

export default ComparisonSlider;