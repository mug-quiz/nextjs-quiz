'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import useCurrentQuiz from '@/hooks/use-current-quiz';

import { Play } from 'lucide-react';
import Image from 'next/image';

export const NotStartedQuiz: React.FC = () => {
  const { handleStartQuiz, isLoading, currentQuiz } = useCurrentQuiz();

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Card className='w-[350px]'>
        <CardHeader className='space-y-6'>
          <Image
            src='assets/mongoLogo.svg'
            alt='MUG 2024'
            className='h-12'
            height={48}
            width={350}
          />
          <CardDescription>
            Seja bem-vindo ao questionário {currentQuiz?.name}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription className='text-center text-sm text-primary'>
            Ao clicar em "Começar", o questionário será iniciado e você não
            poderá voltar atrás.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button
            className='w-full'
            onClick={handleStartQuiz}
            disabled={isLoading}
          >
            Começar <Play className='ml-2 h-4 w-4' />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
