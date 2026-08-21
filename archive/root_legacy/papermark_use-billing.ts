import useSWR from "swr";

export function useBilling() {
  return {
    data: {
      plan: "business",
      isPro: true,
      isBusiness: true,
      limits: {
        maxLinks: 999999,
        maxDocuments: 999999,
        maxDatarooms: 999999,
        maxVisitors: 999999,
      },
    },
    isLoading: false,
    error: null,
  };
}

export function usePlan() {
  // Backwards-compat alias if used elsewhere
  return useBilling();
}
