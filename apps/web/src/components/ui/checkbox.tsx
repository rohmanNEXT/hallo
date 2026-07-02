import React from 'react';
import { LuCheck as Check } from 'react-icons/lu';

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onCheckedChange,
  label,
  className = '',
}) => {
  return (
    <label className={`flex items-center gap-2 text-xs font-semibold cursor-pointer select-none ${className}`} id={id}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0 ${
          checked
            ? 'bg-primary border-primary text-primary-foreground shadow-sm'
            : 'border-border hover:border-muted-foreground bg-background'
        }`}
      >
        {checked && <Check className="w-3 h-3 stroke-3" />}
      </div>
      {label && <span className={checked ? 'text-primary font-bold' : 'text-muted-foreground'}>{label}</span>}
    </label>
  );
};

export default Checkbox;
