import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  LuChevronDown as ChevronDown,
  LuSearch as Search,
  LuX as X,
  LuFilter as Filter,
} from 'react-icons/lu';
import Checkbox from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface MultiSelectJobProps {
  id?: string;
  selectedJobIds: string[];
  onChange: (ids: string[]) => void;
  jobs: { id: string; title: string }[];
  isIconTrigger?: boolean;
  className?: string;
}

const MultiSelectJob: React.FC<MultiSelectJobProps> = ({
  id,
  selectedJobIds,
  onChange,
  jobs,
  isIconTrigger = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 250 });

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: rect.left,
        width: Math.max(rect.width, 220),
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

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (jobId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedJobIds, jobId]);
    } else {
      onChange(selectedJobIds.filter((id) => id !== jobId));
    }
  };

  const getLabel = () => {
    if (selectedJobIds.length === 0) return 'Semua Lowongan';
    if (selectedJobIds.length === 1) {
      const foundIdx = jobs.findIndex((j) => j.id === selectedJobIds[0]);
      if (foundIdx !== -1) {
        return `${foundIdx + 1}. ${jobs[foundIdx].title}`;
      }
      return '1 Lowongan';
    }
    return `${selectedJobIds.length} Lowongan`;
  };

  return (
    <div className="relative text-left select-text cursor-default shrink-0" id={id}>
      {isIconTrigger ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center bg-background border border-border rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all cursor-pointer shadow-sm relative ${className}`}
          title="Filter Lowongan"
        >
          <Filter className="w-4 h-4" />
          {selectedJobIds.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {selectedJobIds.length}
            </span>
          )}
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between bg-background border border-border rounded-xl px-3 h-11 text-xs text-foreground focus:outline-none cursor-pointer hover:bg-muted/40 transition-colors shadow-sm min-w-[150px] max-w-[200px] ${className}`}
        >
          <span className="truncate mr-2 font-bold">{getLabel()}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 shrink-0" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
        </button>
      )}

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="fixed border border-border rounded-xl shadow-2xl p-3 z-99999 max-h-80 flex flex-col bg-popover text-popover-foreground w-64 md:w-72"
          style={{
            top: `${coords.top + 6}px`,
            left: isIconTrigger ? `${coords.left - 256 + coords.width}px` : `${coords.left}px`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="relative flex items-center mb-2 shrink-0">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari lowongan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-background"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none p-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-52 pr-1 space-y-1.5 scrollbar-thin">
            {filteredJobs.length === 0 ? (
              <p className="text-[12px] text-muted-foreground text-center py-4">Tidak ada lowongan</p>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="flex items-center hover:bg-muted/40 p-1.5 rounded-lg transition-colors">
                  <Checkbox
                    checked={selectedJobIds.includes(job.id)}
                    onCheckedChange={(checked: boolean) => handleToggle(job.id, checked)}
                    label={`${jobs.findIndex(j => j.id === job.id) + 1}. ${job.title}`}
                    className="w-full"
                  />
                </div>
              ))
            )}
          </div>

          {selectedJobIds.length > 0 && (
            <div className="border-t border-border mt-2 pt-2 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-[10px] text-destructive hover:underline font-bold cursor-pointer bg-transparent border-none p-0"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default MultiSelectJob;
