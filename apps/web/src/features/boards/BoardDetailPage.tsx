import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBoard } from './useBoards';
import { useCreateList, useDeleteList } from '../lists/useLists';
import { useCreateTask, useToggleTask, useDeleteTask } from '../tasks/useTasks';

export function BoardDetailPage() {
  const { id: boardId } = useParams<{ id: string }>();
  const { data: board, isLoading } = useBoard(boardId!);

  const createList = useCreateList(boardId!);
  const deleteList = useDeleteList(boardId!);
  const createTask = useCreateTask(boardId!);
  const toggleTask = useToggleTask(boardId!);
  const deleteTask = useDeleteTask(boardId!);

  const [newListName, setNewListName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState<Record<string, string>>({});

  if (isLoading) return <p>Cargando tablero...</p>;
  if (!board) return <p>Tablero no encontrado.</p>;

  function handleCreateList(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim()) return;
    createList.mutate(newListName);
    setNewListName('');
  }

  function handleCreateTask(listId: string) {
    const title = newTaskTitle[listId];
    if (!title?.trim()) return;
    createTask.mutate({ listId, title });
    setNewTaskTitle((prev) => ({ ...prev, [listId]: '' }));
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto' }}>
      <Link to="/boards">← Volver a tableros</Link>
      <h1>{board.name}</h1>

      <form onSubmit={handleCreateList} style={{ marginBottom: 24 }}>
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Nueva lista"
          style={{ padding: 8, width: 200 }}
        />
        <button type="submit" style={{ padding: 8 }}>Agregar lista</button>
      </form>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {board.lists.map((list) => (
          <div key={list.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, width: 240 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>{list.name}</strong>
              <button onClick={() => deleteList.mutate(list.id)}>x</button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
              {list.tasks.map((task) => (
                <li key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={(e) =>
                      toggleTask.mutate({ id: task.id, listId: list.id, done: e.target.checked })
                    }
                  />
                  <span style={{ flex: 1, textDecoration: task.done ? 'line-through' : 'none' }}>
                    {task.title}
                  </span>
                  <button onClick={() => deleteTask.mutate({ id: task.id, listId: list.id })}>x</button>
                </li>
              ))}
            </ul>

            <input
              value={newTaskTitle[list.id] ?? ''}
              onChange={(e) => setNewTaskTitle((prev) => ({ ...prev, [list.id]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTask(list.id)}
              placeholder="+ Tarea"
              style={{ width: '100%', padding: 4, marginTop: 8 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}