"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { useState } from "react";
import { Toaster } from "sonner";
import { store } from "@/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        {children}
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </Provider>
  );
}
