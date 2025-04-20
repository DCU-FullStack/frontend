import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const getQueryFn = ({ on401 = "redirect" }: { on401?: "redirect" | "returnNull" } = {}) => {
  return async (url: string) => {
    const response = await fetch(`http://localhost:8080${url}`, {
      credentials: "include",
    });

    if (response.status === 401) {
      if (on401 === "redirect") {
        window.location.href = "/auth";
      }
      return null;
    }

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  };
};

export const apiRequest = async (
  method: string,
  url: string,
  data?: any,
  options: { on401?: "redirect" | "returnNull" } = {}
) => {
  const response = await fetch(`http://localhost:8080${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (response.status === 401) {
    if (options.on401 === "redirect") {
      window.location.href = "/auth";
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response;
};
