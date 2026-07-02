'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PencariKerjaPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pencari-kerja/jobs');
  }, [router]);

  return null;
}
