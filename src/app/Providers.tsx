import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useMemo } from 'react';
import { routeTree } from '../routeTree.gen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The data is read-only and changes when publishers admit new
      // artifacts. 30s is a reasonable demo refresh.
      staleTime: 30_000,
      retry: 1,
    },
  },
});

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function Providers() {
  const theme = useMemo(() => createTheme({ palette: { mode: 'light' } }), []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
