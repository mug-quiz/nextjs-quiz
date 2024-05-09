'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import useCurrentQuiz from '@/hooks/use-current-quiz';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { useQueryParam } from 'use-query-params';
import { NotStartedQuiz } from './components/not-started-quiz';

function formatMilliseconds(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${minutes}m ${remainingSeconds}s`;
  return formattedTime;
}

export default function QuizPage() {
  const router = useRouter();
  const [quizCode] = useQueryParam<string>('quizCode');

  const {
    currentQuestionIndex,
    handleNextQuestion,
    handlePreviousQuestion,
    currentQuestion,
    currentLocalQuestion,
    hasStartedQuiz,
    handleSelectAlternative,
    handleFinishQuiz,
    localQuestions,
    isLastQuestion,
    abortQuiz,
    currentQuizCode,
    clearQuiz,
  } = useCurrentQuiz();

  const [timeToNow, setTimeToNow] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentLocalQuestion?.startTimestamp) return;
      setTimeToNow(Date.now() - currentLocalQuestion?.startTimestamp);
    }, 1000);

    return () => clearInterval(interval);
  });

  const handleFinish = async () => {
    const cloned = [...localQuestions];

    cloned[currentQuestionIndex - 1] = {
      ...cloned[currentQuestionIndex - 1],
      endTimestamp: Date.now(),
    };

    const response = await handleFinishQuiz(cloned);
    if (!response) return;
    setTotalPoints(response.totalPoints);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    router.push('/success' + `?quizCode=${quizCode}`);
    clearQuiz();
  };

  const hasAlternativeSelected = currentLocalQuestion?.value !== '';

  useEffect(() => {
    if (!currentQuizCode) router.push('/');
  }, [currentQuizCode, router]);

  if (!hasStartedQuiz) return <NotStartedQuiz />;

  return (
    <div className='flex h-full w-full flex-col gap-8 border bg-background p-8'>
      <Drawer open={drawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Parece que você terminou!</DrawerTitle>
            <DrawerDescription>
              Você respondeu todas as questões. Sua pontuação foi de{' '}
              {totalPoints} pontos, se tiver alguma dúvida, entre em contato com
              o administrador do quiz.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button className='w-full' variant='outline' onClick={handleClose}>
              Fechar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className='flex h-fit w-full items-center'>
        <img src='assets/mongoLogo.svg' alt='MUG 2024' className='h-12' />
        <span className='ml-auto text-primary'>
          {formatMilliseconds(timeToNow)}
        </span>
        <Button
          size='icon'
          variant='destructive-outline'
          onClick={abortQuiz}
          className='ml-2 h-6 w-6'
        >
          <X />
        </Button>
      </div>
      <p className='text-pretty text-sm text-muted-foreground'>
        O tempo máximo para responder cada questão é de 1 minuto e 40 segundos.
        Caso ultrapasse esse tempo, a questão será desconsiderada.
      </p>
      <Separator />
      <Fragment>
        <div className='flex w-full items-center justify-between'>
          <span className='flex h-12 w-12 items-center justify-center rounded-full border border-primary bg-primary/90 p-3 text-lg font-bold text-white'>
            {currentQuestionIndex}
          </span>
        </div>

        <h3 className='text-pretty'>{currentQuestion?.question}</h3>
        <div className='space-y-4'>
          {currentQuestion?.alternatives.map((alternative) => (
            <Button
              key={alternative.id}
              className='w-full'
              variant={
                currentLocalQuestion?.value === alternative.id
                  ? 'default'
                  : 'secondary'
              }
              size='lg'
              onClick={() =>
                handleSelectAlternative(alternative.id, currentQuestion.id)
              }
            >
              {alternative.text}
            </Button>
          ))}
        </div>
      </Fragment>
      <Separator />
      <div className='flex w-full gap-4'>
        <Button
          className='w-full'
          variant='secondary'
          size='lg'
          onClick={handlePreviousQuestion}
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Voltar
        </Button>

        {isLastQuestion && (
          <Button
            className='w-full'
            size='lg'
            variant='outline'
            onClick={handleFinish}
          >
            Finalizar
            <Check className='ml-2 h-4 w-4' />
          </Button>
        )}

        {!isLastQuestion && (
          <Button
            className='w-full'
            variant='default'
            size='lg'
            onClick={handleNextQuestion}
            disabled={isLastQuestion || !hasAlternativeSelected}
          >
            Próxima
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}
