import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LuChevronDown as ChevronDown } from 'react-icons/lu';

interface CustomSelectProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  icon?: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  value,
  onChange,
  options,
  className = '',
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom, // Viewport coordinates for position: fixed
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords, true);
    }
    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('close-floating', { detail: { ref: triggerRef.current } }));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleCloseFloating = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.ref !== triggerRef.current) {
        setIsOpen(false);
      }
    };
    window.addEventListener('close-floating', handleCloseFloating);
    return () => window.removeEventListener('close-floating', handleCloseFloating);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative w-full text-left select-text cursor-default" id={id}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-background border border-border rounded-xl px-3 h-9 text-xs text-foreground focus:outline-none cursor-pointer hover:bg-muted/40 transition-colors shadow-sm ${className}`}
      >
        <div className="flex w-full items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 truncate">
            {icon && <span className="shrink-0">{icon}</span>}
            <span className="truncate">{selectedOption?.label}</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ml-1.5" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
        </div>
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed border border-border rounded-xl shadow-2xl py-1.5 z-99999 max-h-60 overflow-y-auto scrollbar-thin select-text bg-popover"
          style={{ 
            top: `${coords.top + 6}px`, 
            left: `${coords.left}px`, 
            width: `${coords.width}px`,
            backdropFilter: 'blur(12px)', 
            WebkitBackdropFilter: 'blur(12px)', 
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-xs cursor-pointer transition-colors duration-150 hover:bg-muted ${
                opt.value === value ? 'text-primary font-bold bg-muted/50' : 'text-foreground'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomSelect;
