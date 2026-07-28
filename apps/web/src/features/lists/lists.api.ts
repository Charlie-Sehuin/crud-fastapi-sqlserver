import { api } from '../../lib/api';

export const listsApi = {
  create: (boardId: string, name: string) =>
    api.post('/lists', { boardId, name }).then(r => r.data),

  remove: (id: string) =>
    api.delete(`/lists/${id}`).then(r => r.data),
};