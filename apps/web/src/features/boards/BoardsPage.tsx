import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoards, useCreateBoard, useDeleteBoard } from './useBoards';

export function BoardsPage() {
  const { data: boards, isLoading } = useBoards();
  const createBoard = useCreateBoard();
  const deleteBoard = useDeleteBoard();
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createBoard.mutate(name);
    setName('');
  }

  if (isLoading) return <p>Cargando tableros...</p>;

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <h1>Mis tableros</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nuevo tablero"
          style={{ padding: 8, width: '70%' }}
        />
        <button type="submit" style={{ padding: 8 }}>Crear</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {boards?.map((board) => (
          <li key={board.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Link to={`/boards/${board.id}`} style={{ flex: 1 }}>{board.name}</Link>
            <button onClick={() => deleteBoard.mutate(board.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}