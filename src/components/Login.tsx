import React, { useState } from 'react';
import { authenticate } from '../data/users';
import { User } from '../types';
import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticate(username, password);
    if (user) {
      onLogin(user);
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-xl font-bold text-center text-gray-800">Controlador Roskuki</h1>
        <p className="text-center text-sm text-gray-600 mb-6">Sistema de Gestión de Inventario</p>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
            Usuario
          </label>
          <div className="relative mb-4">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              className="w-full pl-10 p-2 border rounded"
            />
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
            Contraseña
          </label>
          <div className="relative mb-4">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full pl-10 pr-10 p-2 border rounded"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-6">
          La sesión se mantendrá activa por 4 horas
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          © 2025 Controlador Roskuki - Sistema Seguro
        </p>
      </div>
    </div>
  );
}
