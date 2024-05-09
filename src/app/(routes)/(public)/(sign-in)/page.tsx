'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useAuth from '@/hooks/use-auth';
import useLogin from '@/hooks/use-login';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useQueryParam } from 'use-query-params';
import { z } from 'zod';
import { QuizCodeOTP } from './components/quiz-code-opt';

const formSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Insira um email válido'),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  name: '',
  email: '',
};

export default function SignInPage() {
  const [quizCode, setQuizCode] = useQueryParam<string | undefined>('quizCode');
  const { setToken, token, clearToken } = useAuth();
  const router = useRouter();
  const { mutateAsync, isPending } = useLogin();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const hasQuizCode = !!quizCode;

  const description = hasQuizCode
    ? 'Para participar do questionário, insira seu nome e email.'
    : 'Insira o código do quiz abaixo para participar.';

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      if (!quizCode) return;
      const token = await mutateAsync({ ...data, quizCode });
      setToken(token);
      const searchParams = new URLSearchParams();
      searchParams.set('quizCode', quizCode as string);
      router.push(`/quiz?${searchParams.toString()}`);
    } catch (error) {
      toast.error(`O Quiz com o código ${quizCode} não foi encontrado!`);
    }
  });

  const handleBack = () => setQuizCode(undefined);

  useEffect(() => {
    if (!hasQuizCode) {
      clearToken();
      return;
    }

    if (token) router.push('/quiz' + `?quizCode=${quizCode}`);
  }, [token, hasQuizCode, quizCode, router, clearToken]);

  return (
    <div className='flex min-h-screen min-w-full items-center justify-center bg-gray-50/40 bg-pattern'>
      <Form {...form}>
        <Card className='w-[350px]'>
          <CardHeader className='space-y-6'>
            <Image
              src='assets/mongoLogo.svg'
              alt='MUG 2024'
              className='h-12'
              width={350}
              height={48}
            />
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {hasQuizCode ? (
              <form
                className='flex min-h-full w-full max-w-lg flex-col justify-center gap-4'
                onSubmit={handleSubmit}
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder='Digite seu nome' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='Digite seu email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' className='w-full' disabled={isPending}>
                  Participar
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={handleBack}
                >
                  Voltar
                </Button>
              </form>
            ) : (
              <QuizCodeOTP />
            )}
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
