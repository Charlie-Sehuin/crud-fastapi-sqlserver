import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/useAuth';
import { LoginPage } from './features/auth/LoginPage';
import { BoardsPage } from './features/boards/BoardsPage';
import { BoardDetailPage } from './features/boards/BoardDetailPage';

function App() {
  const { session, loading, signOut } = useAuth();

  if (loading) return <p>Cargando...</p>;
  if (!session) return <LoginPage />;

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 900, margin: '16px auto' }}>
        <span>{session.user.email}</span>
        <button onClick={() => signOut()}>Cerrar sesión</button>
      </div>

      <Routes>
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:id" element={<BoardDetailPage />} />
        <Route path="*" element={<Navigate to="/boards" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;