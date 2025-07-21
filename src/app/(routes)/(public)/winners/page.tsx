'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useWinners from '@/hooks/use-winners';

import { useQueryParam } from 'use-query-params';

export default function WinnersPage() {
  const [quizCode] = useQueryParam<string>('quizCode');
  const { data } = useWinners(quizCode);
  const sortedByPoints = data?.sort((a, b) => b?.totalPoints - a?.totalPoints);

  return (
    <div className='flex h-screen flex-col items-center overflow-scroll border bg-background px-4 pt-8'>
      <h1 className=' mb-8 text-3xl font-bold text-primary'>
        {' '}
        🎉🎊Top 20!🎊🎉{' '}
      </h1>
      {sortedByPoints &&
        sortedByPoints.map((winner, index) => (
          <div
            key={index}
            className='mb-4 flex w-full items-center gap-4 rounded-md border bg-card px-8 py-4 shadow-md'
          >
            <Avatar>
              <AvatarFallback>
                {winner.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className='text-lg font-bold text-primary'>
                {winner.name} - {winner.totalPoints}
              </h2>
              <p className='text-muted-foreground'>{winner.email}</p>
            </div>
          </div>
        ))}
    </div>
  );
}
