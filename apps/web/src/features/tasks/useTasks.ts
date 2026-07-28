import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from './tasks.api';

const BOARDS_KEY = 'boards';

export function useCreateTask(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, title }: { listId: string; title: string }) =>
      tasksApi.create(listId, title),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [BOARDS_KEY, boardId] }),
  });
}

export function useToggleTask(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, listId, done }: { id: string; listId: string; done: boolean }) =>
      tasksApi.toggleDone(id, listId, done),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [BOARDS_KEY, boardId] }),
  });
}

export function useDeleteTask(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, listId }: { id: string; listId: string }) =>
      tasksApi.remove(id, listId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [BOARDS_KEY, boardId] }),
  });
}