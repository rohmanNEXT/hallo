'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PembuatKerjaPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pembuat-kerja/lowongan');
  }, [router]);

  const content = null;

  return content;
};

export default PembuatKerjaPage;
