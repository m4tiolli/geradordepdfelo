'use client';

import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  );
}