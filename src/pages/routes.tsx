import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DeadLetterManagement from '@/pages/dead-letter-management/dead-letter-management.tsx';
import App from '@/app.tsx';

export const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />,
    children: [
      {
        path: '',
        element: <DeadLetterManagement />,
      },
    ],
  },
]);
