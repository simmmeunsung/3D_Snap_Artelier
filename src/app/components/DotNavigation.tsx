'use client';

interface DotNavigationProps {
  totalPages: number;
  currentPage: number;
  handleDotClick: (pageIndex: number) => void;
}

export default function DotNavigation({
  totalPages,
  currentPage,
  handleDotClick
}: DotNavigationProps) {
  return (
    <div 
      style={{ 
        position: 'fixed',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: 'transparent',
        padding: '10px'
      }}
    >
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => handleDotClick(index)}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: currentPage === index ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
            border: `2px solid ${currentPage === index ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'}`,
            transition: 'all 0.3s ease',
            transform: currentPage === index ? 'scale(1.2)' : 'scale(1)',
            cursor: 'pointer'
          }}
          aria-label={`Move to page ${index + 1}`}
        />
      ))}
    </div>
  );
}