'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PembuatKerjaPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pembuat-kerja/employer');
  }, [router]);

  return null;
}
