'use client';

import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      router.push('/');
    }
  }, [token, router]);

  if (!token) return null;

  return <Fragment>{children}</Fragment>;
}
