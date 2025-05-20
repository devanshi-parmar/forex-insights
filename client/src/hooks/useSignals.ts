import { useQuery } from "@tanstack/react-query";
import { ForexSignal } from "@/lib/types";

interface SignalsResponse {
  signals: ForexSignal[];
}

export function useSignals(limit = 10, offset = 0) {
  return useQuery<SignalsResponse>({
    queryKey: [`/api/signals?limit=${limit}&offset=${offset}`],
    refetchOnWindowFocus: false,
  });
}
