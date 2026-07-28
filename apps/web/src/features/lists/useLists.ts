import { useMutation, useQueryClient } from '@tanstack/react-query';
import { listsApi } from './lists.api';

const BOARDS_KEY = 'boards';

export function useCreateList(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => listsApi.create(boardId, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [BOARDS_KEY, boardId] }),
  });
}

export function useDeleteList(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [BOARDS_KEY, boardId] }),
  });
}