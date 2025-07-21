import { quizService } from '@/services/quiz-service';
import { useQuery } from '@tanstack/react-query';

export default function useGetQuizById(quizCode: string) {
  return useQuery({
    queryKey: ['quiz', quizCode],
    queryFn: async () => {
      const response = await quizService.getQuizByCode(quizCode);
      return response;
    },
  });
}
