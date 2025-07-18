'use client';
import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const Provider = ({
  children,
}: {
  children: React.ReactElement | React.ReactNode;
}) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
