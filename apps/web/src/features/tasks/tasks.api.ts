import { api } from '../../lib/api';
import type { Task } from '../boards/boards.api';

export const tasksApi = {
  create: (listId: string, title: string) =>
    api.post<Task>('/tasks', { listId, title }).then(r => r.data),

  toggleDone: (id: string, listId: string, done: boolean) =>
    api.patch<Task>(`/tasks/${id}?listId=${listId}`, { done }).then(r => r.data),

  remove: (id: string, listId: string) =>
    api.delete(`/tasks/${id}?listId=${listId}`).then(r => r.data),
};