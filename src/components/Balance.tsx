import React, { useEffect, useMemo, useState } from 'react';
import { BalanceResumen } from '../types';
import * as dataService from '../lib/dataService';
import { COLORS } from '../data/menu';
import { formatCOP } from '../utils/format';
import { Wallet, TrendingUp, TrendingDown, CalendarDays, PiggyBank } from 'lucide-react';

const rangeOptions = [
  { label: 'Últimos 7 días', value: '7' },
  { label: 'Últimos 30 días', value: '30' },
  { label: 'Todo el histórico', value: 'all' },
] as const;

type RangeValue = (typeof rangeOptions)[number]['value'];

type MethodSummary = {
  id: 'efectivo' | 'nequi' | 'tarjeta';
  label: string;
  daily: number;
  total: number;
};

const valueColor = (value: number) => (value >= 0 ? 'text-green-600' : 'text-red-600');

const formatDateLabel = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('es-CO', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export function Balance() {
  const [balanceData, setBalanceData] = useState<BalanceResumen[]>([]);
  const [range, setRange] = useState<RangeValue>('7');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const resumen = await dataService.fetchBalanceResumen();
      setBalanceData(resumen);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredData = useMemo(() => {
    if (range === 'all') {
      return balanceData;
    }
    const days = parseInt(range, 10);
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - (days - 1));

    return balanceData.filter((entry) => {
      const entryDate = new Date(`${entry.fecha}T00:00:00`);
      return entryDate >= cutoff;
    });
  }, [balanceData, range]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, entry) => ({
        ventas: acc.ventas + entry.ingresosTotales,
        gastos: acc.gastos + entry.egresosTotales,
        balance: acc.balance + entry.balanceDiario
      }),
      { ventas: 0, gastos: 0, balance: 0 }
    );
  }, [filteredData]);

  const hasAnyData = balanceData.length > 0;
  const hasFilteredData = filteredData.length > 0;
  const latest = hasFilteredData ? filteredData[0] : balanceData[0];

  const methodBreakdown: MethodSummary[] = useMemo(() => {
    if (!latest) {
      return [];
    }

    return [
      {
        id: 'efectivo',
        label: 'Efectivo',
        daily: latest.saldoEfectivoDia,
        total: latest.saldoEfectivoAcumulado
      },
      {
        id: 'nequi',
        label: 'Nequi',
        daily: latest.saldoNequiDia,
        total: latest.saldoNequiAcumulado
      },
      {
        id: 'tarjeta',
        label: 'Tarjeta',
        daily: latest.saldoTarjetaDia,
        total: latest.saldoTarjetaAcumulado
      }
    ];
  }, [latest]);

  const dailyLabel = hasFilteredData ? 'Saldo del día' : 'Último movimiento';
  const cumulativeLabel = hasFilteredData ? 'Saldo acumulado' : 'Saldo acumulado total';
  const closingLabel = latest
    ? hasFilteredData
      ? `Cierre del ${formatDateLabel(latest.fecha)}`
      : `Último cierre registrado (${formatDateLabel(latest.fecha)})`
    : hasFilteredData
      ? 'Sin registros en el rango'
      : 'Sin registros disponibles';

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: COLORS.dark }}>
            Balance de Caja
          </h2>
          <p className="text-gray-600">
            Ventas, gastos y saldo final por método de pago
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="text-gray-500" size={18} />
          <select
            value={range}
            onChange={(event) => setRange(event.target.value as RangeValue)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
          >
            {rangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center text-gray-500">
          Cargando balance...
        </div>
      )}

      {!loading && !hasAnyData && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center text-gray-500">
          Aún no hay movimientos registrados en la caja.
        </div>
      )}

      {!loading && hasAnyData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Ventas en el período</p>
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <p className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                {formatCOP(totals.ventas)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Gastos en el período</p>
                <TrendingDown className="text-red-600" size={20} />
              </div>
              <p className="text-2xl font-bold text-red-600">
                {formatCOP(totals.gastos)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Balance neto</p>
                <Wallet className={valueColor(totals.balance)} size={20} />
              </div>
              <p className={`text-2xl font-bold ${valueColor(totals.balance)}`}>
                {formatCOP(totals.balance)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-600">Saldo acumulado</p>
                <PiggyBank className="text-indigo-600" size={20} />
              </div>
              <p className="text-xs text-gray-500 mb-1">{closingLabel}</p>
              <p className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                {formatCOP(latest?.saldoTotalAcumulado ?? 0)}
              </p>
            </div>
          </div>

          {latest && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {methodBreakdown.map((method) => (
                <div key={method.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-600 mb-1">{method.label}</p>
                  <p className="text-xs text-gray-500">{dailyLabel}</p>
                  <p className={`text-xl font-semibold ${valueColor(method.daily)}`}>
                    {formatCOP(method.daily)}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">{cumulativeLabel}</p>
                  <p className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                    {formatCOP(method.total)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ventas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gastos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance diario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efectivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nequi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarjeta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acumulado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {!hasFilteredData && (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                        No hay movimientos en el rango seleccionado.
                      </td>
                    </tr>
                  )}

                  {filteredData.map((entry) => (
                    <tr key={entry.fecha} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateLabel(entry.fecha)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: COLORS.dark }}>
                        {formatCOP(entry.ingresosTotales)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        {formatCOP(entry.egresosTotales)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${valueColor(entry.balanceDiario)}`}>
                        {formatCOP(entry.balanceDiario)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <span className={`font-medium ${valueColor(entry.saldoEfectivoDia)}`}>
                            {formatCOP(entry.saldoEfectivoDia)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Total: {formatCOP(entry.saldoEfectivoAcumulado)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <span className={`font-medium ${valueColor(entry.saldoNequiDia)}`}>
                            {formatCOP(entry.saldoNequiDia)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Total: {formatCOP(entry.saldoNequiAcumulado)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <span className={`font-medium ${valueColor(entry.saldoTarjetaDia)}`}>
                            {formatCOP(entry.saldoTarjetaDia)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Total: {formatCOP(entry.saldoTarjetaAcumulado)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: COLORS.dark }}>
                        {formatCOP(entry.saldoTotalAcumulado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
