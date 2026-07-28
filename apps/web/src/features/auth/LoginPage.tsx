import { useState } from 'react';
import { useAuth } from './useAuth';

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
  }

  return (
    <div style={{ maxWidth: 320, margin: '80px auto' }}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
        />
        <button type="submit" style={{ width: '100%', padding: 8 }}>
          Entrar
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}