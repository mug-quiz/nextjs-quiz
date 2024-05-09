import { Answer } from '@/interfaces/quiz';
import { quizService } from '@/services/quiz-service';
import { useMutation } from '@tanstack/react-query';
import useAuth from './use-auth';

export default function useFinishQuiz() {
  const { token } = useAuth();

  const { _id } = JSON.parse(token as string);

  return useMutation({
    mutationKey: ['finish-quiz', token],
    mutationFn: async (data: Answer[]) => {
      const response = await quizService.finishQuiz(_id, data);
      return response;
    },
  });
}
