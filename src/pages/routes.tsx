import React, { useEffect } from 'react';
import { createBrowserRouter, Outlet, useNavigate } from 'react-router-dom';
import DeadLetterManagement from '@/pages/dead-letter-management/dead-letter-management.tsx';
import App from '@/app.tsx';
import { DeadLetter } from '@/pages/dead-letter/dead-letter.tsx';

function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dead-letter');
  }, []);

  return null;
}

export const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />,
    children: [
      {
        path: '',
        element: <RootRedirect />,
      },
      {
        path: 'dead-letter',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <DeadLetterManagement />,
          },
          {
            path: ':messageId',
            element: <DeadLetter />,
          },
        ],
      },
    ],
  },
]);
