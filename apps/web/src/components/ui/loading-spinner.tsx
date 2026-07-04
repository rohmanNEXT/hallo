import React from 'react';
import { LuLoader } from 'react-icons/lu';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center py-10">
      <div className="flex flex-col items-center gap-2">
        <LuLoader className="h-8 w-8 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-semibold">Memuat data...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
