import React, { useEffect } from 'react';
import { createBrowserRouter, Outlet, useNavigate } from 'react-router-dom';
import DeadLetterManagement from '@/pages/dead-letter-management/dead-letter-management.tsx';
import App from '@/app.tsx';
import { DeadLetter } from '@/pages/dead-letter/dead-letter.tsx';
import DeploymentManagement from '@/pages/deployment-management/deployment-management.tsx';
import { StackManagement } from '@/pages/stack-management/stack-management.tsx';
import { Stack } from '@/pages/stack/stack.tsx';
import { Deployment } from '@/pages/deployment/deployment.tsx';

function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/stack');
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
        path: 'deployment',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <DeploymentManagement />,
          },
          {
            path: ':deploymentId',
            element: <Deployment />,
          },
        ],
      },
      {
        path: 'stack',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <StackManagement />,
          },
          {
            path: ':stackId',
            element: <Stack />,
          },
        ],
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
