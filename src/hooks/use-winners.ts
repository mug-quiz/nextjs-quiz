import { quizService } from '@/services/quiz-service';
import { useQuery } from '@tanstack/react-query';

export default function useWinners(quizCode: string) {
  return useQuery({
    queryKey: ['winners', quizCode],
    queryFn: async () => {
      const response = await quizService.getWinners(quizCode);
      return response;
    },
    refetchInterval: 10000,
  });
}
