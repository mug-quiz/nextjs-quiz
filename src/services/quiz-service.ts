import { Answer, Quiz } from '@/interfaces/quiz';
import { Winner } from '@/interfaces/winner';
import { api } from './api';

class QuizService {
  public async getQuizByCode(quizCode: string): Promise<Quiz> {
    const response = await api.get(`/quizzes?code=${quizCode?.toUpperCase()}`);
    return response.data;
  }

  public async finishQuiz(answerId: string, questions: Answer[]) {
    const response = await api.post(`/answers/${answerId}`, questions);
    return response.data;
  }

  public async getWinners(quizCode: string): Promise<Winner[]> {
    const response = await api.get('/answers/top', {
      params: { code: quizCode?.toUpperCase() },
    });
    return response.data;
  }
}

export const quizService = new QuizService();
