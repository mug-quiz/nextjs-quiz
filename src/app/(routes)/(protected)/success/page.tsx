'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import useAuth from '@/hooks/use-auth';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const { clearToken } = useAuth();

  const [seconds, setSeconds] = useState(7);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      clearToken();
    }
  }, [seconds, clearToken]);

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Card className='w-[350px]'>
        <CardHeader className='space-y-6'>
          <img src='assets/mongoLogo.svg' alt='MUG 2024' className='h-12' />
          <CardDescription>
            Você finalizou o questionário de brindes da primeira edição da MUG
            2024. Obrigado por participar!
          </CardDescription>
          <CardDescription className='text-center text-sm text-primary'>
            A MUG-SC agradece a sua participação e estamos ansiosos para te ver
            no próximo evento! 💚 🦆
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription className='text-center text-xs text-destructive'>
            Você será redirecionado para a página inicial em{' '}
            <strong>{seconds}</strong> segundos.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
