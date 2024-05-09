'use client';

import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import NextAdapterApp from 'next-query-params/app';
import { QueryParamProvider } from 'use-query-params';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <html lang='en'>
        <body
          className='flex min-h-dvh min-w-full justify-center bg-gray-50/40 bg-pattern'
          suppressHydrationWarning
        >
          <QueryParamProvider adapter={NextAdapterApp}>
            <AuthProvider>
              <div className='min-h-full w-full max-w-lg'>{children}</div>
              <Toaster />
            </AuthProvider>
          </QueryParamProvider>
        </body>
      </html>
    </QueryProvider>
  );
}
