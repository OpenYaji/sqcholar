'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  // You might need to import the ThemeProviderProps type if you use it explicitly
  // type ThemeProviderProps,
} from 'next-themes';

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}