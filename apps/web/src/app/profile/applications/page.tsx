'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToLamaran() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/lamaran');
  }, [router]);

  return null;
}
