import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallbackUrl?: string;
  fallbackLabel?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  fallbackUrl = '/',
  fallbackLabel = 'Back',
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();

    const hasHistory = typeof window !== 'undefined' && window.history.state && window.history.state.idx > 0;
    const stateFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;

    if (stateFrom) {
      navigate(stateFrom);
    } else if (hasHistory) {
      navigate(-1);
    } else {
      navigate(fallbackUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`group inline-flex items-center gap-2 text-xs font-display tracking-[0.25em] uppercase text-[#7B8999] hover:text-[#C6CDD5] transition-colors focus:outline-none ${className}`}
      aria-label={`Go back to ${fallbackLabel}`}
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span>{fallbackLabel}</span>
    </button>
  );
};
