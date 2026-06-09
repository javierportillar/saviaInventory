import React, { useState, useEffect } from 'react';
import { User } from '../types';
import dataService from '../lib/dataService';

interface EmpleadosProps {
  user: User;
}

export function Empleados({ user }: EmpleadosProps) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const data = await dataService.fetchEmpleados();
        if (!cancelled) {
          setCount(data.length);
          setStatus('ok');
        }
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
        }
      }
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Empleados</h1>
        {status === 'loading' && (
          <p className="text-gray-500">Cargando empleados...</p>
        )}
        {status === 'error' && (
          <p className="text-red-500">Error al cargar empleados</p>
        )}
        {status === 'ok' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-200">
            <p className="text-green-700 font-semibold mb-2">✅ Módulo de empleados funcionando</p>
            <p className="text-gray-700">Empleados registrados: <strong>{count}</strong></p>
          </div>
        )}
      </div>
    </section>
  );
}
