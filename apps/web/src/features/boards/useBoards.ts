import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardsApi } from './boards.api';

const BOARDS_KEY = 'boards';

export function useBoards() {
  return useQuery({ queryKey: [BOARDS_KEY], queryFn: boardsApi.getAll });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: [BOARDS_KEY, id],
    queryFn: () => boardsApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => boardsApi.create(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [BOARDS_KEY] }),
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => boardsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [BOARDS_KEY] }),
  });
}