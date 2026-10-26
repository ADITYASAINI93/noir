import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Check if device supports fine hover pointer
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    setIsTouchDevice(false);

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth lerp loop
    const loop = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      setPosition({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Outer soft ambient aura */}
      <div
        className={`pointer-events-none fixed z-50 rounded-full transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.7 : 1})`,
          width: isPointer ? '48px' : '36px',
          height: isPointer ? '48px' : '36px',
          border: '1px solid rgba(201, 166, 107, 0.45)',
          background: 'radial-gradient(circle, rgba(201, 166, 107, 0.12) 0%, rgba(201, 166, 107, 0) 70%)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), width 0.25s, height 0.25s, border-color 0.25s',
        }}
      />
      {/* Precision core dot */}
      <div
        className={`pointer-events-none fixed z-50 h-1.5 w-1.5 rounded-full bg-[#C9A66B] transition-opacity duration-200 ${
          isVisible ? 'opacity-90' : 'opacity-0'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px rgba(201, 166, 107, 0.8)',
        }}
      />
    </>
  );
};
