import { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
    setVisible(true);
  };

  return (
    <div ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && createPortal(
        <div
          className="fixed z-50 -translate-x-1/2 w-44 pointer-events-none"
          style={{ top: coords.top, left: coords.left }}
        >
          <div className="rounded-lg bg-foreground px-2.5 py-1.5 text-xs text-background text-center leading-snug shadow-lg">
            {text}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-foreground" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}