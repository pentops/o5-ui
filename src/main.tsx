import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { MutationNormalizationCache, NormalizationEntityCache, QueryNormalizationCache } from '@pentops/normalized-query-cache';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme-provider.tsx';
import { router } from '@/pages/routes.tsx';
import './translation';
import '../app/globals.css';

const defaultQueryClientOptions = { queries: { staleTime: 20000 } };

const ec = new NormalizationEntityCache();

export const queryClient = new QueryClient({
  defaultOptions: defaultQueryClientOptions,
  queryCache: new QueryNormalizationCache(ec),
  mutationCache: new MutationNormalizationCache(ec),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="o5-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
