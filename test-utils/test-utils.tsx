import {
  render as originalRender,
  type RenderOptions,
} from "@testing-library/react";
import type { ReactNode, ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { Toaster } from "sonner";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return (
    <NuqsTestingAdapter>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </NuqsTestingAdapter>
  );
};

const render = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => {
  const user = userEvent.setup();
  return {
    ...originalRender(ui, {
      wrapper: AllTheProviders,
      ...options,
    }),
    user,
  };
};

export * from "@testing-library/react";
export { render };
