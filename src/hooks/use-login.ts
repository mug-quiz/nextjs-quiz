import { LoginCredentials } from '@/interfaces/auth';
import authService from '@/services/auth-service';
import { useMutation } from '@tanstack/react-query';

export default function useLogin() {
  return useMutation({
    mutationKey: ['auth'],
    mutationFn: async (data: LoginCredentials) => {
      const response = await authService.login(data);
      return response;
    },
  });
}
