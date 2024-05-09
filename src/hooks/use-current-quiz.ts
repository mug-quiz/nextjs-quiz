import { Answer } from '@/interfaces/quiz';
import { useCallback } from 'react';

import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import useAuth from './use-auth';
import useEncryptLocalStorage from './use-encrypt-local-store';
import useFinishQuiz from './use-finish-quiz';
import useGetQuizById from './use-get-quiz-by-id';

export default function useCurrentQuiz() {
  const [localQuestions, setLocalQuestions] = useEncryptLocalStorage<Answer[]>(
    'localQuestions',
    []
  );

  const { mutateAsync: finishQuiz } = useFinishQuiz();

  const { clearToken } = useAuth();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useQueryParam<number>(
    'question',
    withDefault(NumberParam, 1)
  );

  const [currentQuizCode] = useQueryParam<string>('quizCode');

  const { data, isLoading } = useGetQuizById(currentQuizCode);

  const currentQuestion = data && data?.questions?.[currentQuestionIndex - 1];
  const currentLocalQuestion = localQuestions[currentQuestionIndex - 1];
  const hasStartedQuiz = currentLocalQuestion?.startTimestamp > 0;

  const quizLength = data?.questions?.length;
  const isFirstQuestion = currentQuestionIndex === 1;
  const isLastQuestion = currentQuestionIndex === quizLength;

  const handleNextQuestion = async () => {
    if (!quizLength) return;

    setLocalQuestions((localQuestions) => {
      const cloned = [...localQuestions];

      cloned[currentQuestionIndex - 1] = {
        ...cloned[currentQuestionIndex - 1],
        endTimestamp: Date.now(),
      };

      if (!isLastQuestion) {
        cloned[currentQuestionIndex] = {
          ...cloned[currentQuestionIndex],
          value: '',
          startTimestamp:
            cloned[currentQuestionIndex]?.startTimestamp || Date.now(),
        };
      }

      return cloned;
    });

    if (!isLastQuestion) {
      setCurrentQuestionIndex((index) => index + 1);
    }
  };

  const handlePreviousQuestion = useCallback(() => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((index) => index - 1);
    }
  }, [isFirstQuestion, setCurrentQuestionIndex]);

  const handleStartQuiz = useCallback(() => {
    setLocalQuestions((localQuestions) => {
      const cloned = [...localQuestions];

      cloned[0] = {
        ...cloned[0],
        value: '',
        startTimestamp: Date.now(),
      };

      return cloned;
    });

    setCurrentQuestionIndex(1);
  }, [setCurrentQuestionIndex, setLocalQuestions]);

  const handleSelectAlternative = useCallback(
    (alternativeId: string, questionId: string) => {
      setLocalQuestions((localQuestions) => {
        const cloned = [...localQuestions];

        cloned[currentQuestionIndex - 1] = {
          ...cloned[currentQuestionIndex - 1],
          value: alternativeId,
          questionId,
        };

        return cloned;
      });
    },
    [currentQuestionIndex, setLocalQuestions]
  );

  const abortQuiz = useCallback(() => {
    setLocalQuestions([]);
    clearToken();
  }, [clearToken, setLocalQuestions]);

  const clearQuiz = useCallback(() => {
    setLocalQuestions([]);
  }, [setLocalQuestions]);

  return {
    currentQuestionIndex,
    handleNextQuestion,
    handlePreviousQuestion,
    questions: data?.questions,
    currentQuestion,
    isLoading,
    hasStartedQuiz,
    handleStartQuiz,
    currentLocalQuestion,
    handleSelectAlternative,
    handleFinishQuiz: finishQuiz,
    isFirstQuestion,
    isLastQuestion,
    localQuestions,
    setLocalQuestions,
    abortQuiz,
    currentQuizCode,
    clearQuiz,
    currentQuiz: data,
  };
}
