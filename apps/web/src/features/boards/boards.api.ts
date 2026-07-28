import { api } from '../../lib/api';

export interface Task {
  id: string;
  title: string;
  done: boolean;
  list_id: string;
  created_at: string;
}

export interface List {
  id: string;
  name: string;
  position: number;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface BoardWithLists extends Board {
  lists: List[];
}

export const boardsApi = {
  getAll: () => api.get<Board[]>('/boards').then(r => r.data),
  getOne: (id: string) => api.get<BoardWithLists>(`/boards/${id}`).then(r => r.data),
  create: (name: string) => api.post<Board>('/boards', { name }).then(r => r.data),
  remove: (id: string) => api.delete(`/boards/${id}`).then(r => r.data),
};