'use client';

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { useState } from 'react';
import { useQueryParam } from 'use-query-params';

export const QuizCodeOTP: React.FC = () => {
  const [value, setValue] = useState('');
  const [, setQuizCode] = useQueryParam('quizCode');

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleSubmit = () => {
    if (value?.length !== 6) return;
    setQuizCode(value);
  };

  return (
    <div className='flex w-full flex-col justify-center'>
      <InputOTP
        value={value}
        maxLength={6}
        type='text'
        pattern='\d*'
        onChange={handleChange}
        inputMode='text'
        className='mx-auto'
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button onClick={handleSubmit} className='mt-4'>
        Entrar
      </Button>
    </div>
  );
};
