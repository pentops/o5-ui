import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme-provider.tsx';
import { router } from '@/pages/routes.tsx';
import '../app/globals.css';

const defaultQueryClientOptions = { queries: { staleTime: 20000 } };

export const queryClient = new QueryClient({ defaultOptions: defaultQueryClientOptions });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="dante-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
