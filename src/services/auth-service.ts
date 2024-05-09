import { LoginCredentials } from '@/interfaces/auth';
import { api } from './api';

class AuthService {
  public async login(credentials: LoginCredentials): Promise<string> {
    const response = await api.post('/answers', {
      ...credentials,
      questionCode: credentials.quizCode?.toUpperCase(),
    });
    return response.data;
  }
}

const authService = new AuthService();

export default authService;
