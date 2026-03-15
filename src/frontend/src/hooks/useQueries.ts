import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Festival } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllFestivals() {
  const { actor, isFetching } = useActor();
  return useQuery<Festival[]>({
    queryKey: ["festivals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFestivals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFestivalsByMonth(month: number) {
  const { actor, isFetching } = useActor();
  return useQuery<Festival[]>({
    queryKey: ["festivals", month],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFestivalsByMonth(BigInt(month));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFestival() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      nameOdia: string;
      nameEnglish: string;
      description: string;
      month: number;
      day: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addFestival(
        params.nameOdia,
        params.nameEnglish,
        params.description,
        BigInt(params.month),
        BigInt(params.day),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
    },
  });
}
