import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FileSpreadsheet,
  Wallet,
  CalendarRange,
  PiggyBank,
  PieChart,
  Loader2,
  AlertTriangle,
  Banknote,
  Trash2
} from 'lucide-react';
import {
  Empleado,
  Gasto,
  PaymentMethod,
  CajaPocket,
  ProvisionTransfer,
  WeeklySchedule,
  WeeklyHours
} from '../types';
import dataService from '../lib/dataService';
import { COLORS } from '../data/menu';
import {
  formatCOP,
  formatDateInputValue,
  getTodayDateInputValue,
  parseDateInputValue
} from '../utils/format';
import {
  buildDefaultSchedule,
  buildWeeklyHoursFromBase,
  calculateIsoWeekKey,
  formatHours,
  formatWeekRange,
  getCurrentWeekKey,
  getStartOfWeek,
  sumWeeklyHours
} from '../utils/employeeHours';
import { PAYMENT_METHOD_LABELS } from '../utils/payments';

const trackedMethods = ['efectivo', 'nequi', 'tarjeta', 'provision_caja'] as const;
type TrackedMethod = typeof trackedMethods[number];

const methodLabels: Record<TrackedMethod, string> = {
  efectivo: 'Efectivo',
  nequi: 'Nequi',
  tarjeta: 'Tarjeta',
  provision_caja: 'Provisión caja'
};

type PayrollSource = 'registro' | 'base' | 'estimado';

type PayrollRow = {
  empleado: Empleado;
  horas: number;
  salario: number;
  origen: PayrollSource;
};

type WeeklyHoursCache = Record<string, Record<string, WeeklyHours>>;

const compareTransfers = (a: ProvisionTransfer, b: ProvisionTransfer) => {
  const dateDiff = b.fecha.getTime() - a.fecha.getTime();
  if (dateDiff !== 0) {
    return dateDiff;
  }
  const createdDiff = (b.created_at?.getTime() ?? 0) - (a.created_at?.getTime() ?? 0);
  if (createdDiff !== 0) {
    return createdDiff;
  }
  return b.id.localeCompare(a.id);
};

const monthFormatter = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' });
const shortDateFormatter = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' });

const getMonthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const formatMonthLabel = (key: string) => {
  const [year, month] = key.split('-').map(Number);
  if (!year || !month) {
    return key;
  }
  return monthFormatter.format(new Date(year, month - 1, 1));
};

const createWeekOptions = (count: number) => {
  const options: { key: string; label: string }[] = [];
  const seen = new Set<string>();
  const currentWeekKey = getCurrentWeekKey();
  const currentStart = getStartOfWeek(currentWeekKey);

  for (let index = 0; index < count; index += 1) {
    const referenceDate = new Date(currentStart);
    referenceDate.setDate(currentStart.getDate() - index * 7);
    const key = calculateIsoWeekKey(referenceDate);
    if (seen.has(key)) {
      continue;
    }
    options.push({ key, label: formatWeekRange(key) });
    seen.add(key);
  }

  return options;
};

export function Contabilidad() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [baseSchedules, setBaseSchedules] = useState<Record<string, WeeklySchedule>>({});
  const [pockets, setPockets] = useState<CajaPocket[]>([]);
  const weekOptions = useMemo(() => createWeekOptions(16), []);
  const defaultWeek = weekOptions[0]?.key ?? getCurrentWeekKey();
  const [selectedWeek, setSelectedWeek] = useState<string>(defaultWeek);
  const [weeklyHoursCache, setWeeklyHoursCache] = useState<WeeklyHoursCache>({});
  const [weekLoading, setWeekLoading] = useState(false);
  const [transfers, setTransfers] = useState<ProvisionTransfer[]>([]);
  const [transferFormOpen, setTransferFormOpen] = useState(false);
  const [transferSubmitting, setTransferSubmitting] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferForm, setTransferForm] = useState({
    monto: '',
    fecha: getTodayDateInputValue(),
    descripcion: '',
    origen: 'caja_principal',
    destino: 'provision_caja'
  });

  const pocketMap = useMemo(() => {
    const map = new Map<string, CajaPocket>();
    pockets.forEach(pocket => {
      map.set(pocket.codigo, pocket);
    });
    return map;
  }, [pockets]);

  const pocketOptions = useMemo(() => {
    if (pockets.length > 0) {
      return pockets;
    }
    return [
      { codigo: 'caja_principal', nombre: 'Caja principal', metodoPago: 'efectivo', esPrincipal: true } as CajaPocket,
      { codigo: 'provision_caja', nombre: 'Provisión de caja', metodoPago: 'efectivo', esPrincipal: false } as CajaPocket
    ];
  }, [pockets]);

  const getPocketName = useCallback(
    (codigo?: string | null) => {
      if (!codigo) {
        return '—';
      }
      const fromMap = pocketMap.get(codigo);
      if (fromMap) {
        return fromMap.nombre;
      }
      if (codigo === 'caja_principal') {
        return 'Caja principal';
      }
      if (codigo === 'provision_caja') {
        return 'Provisión de caja';
      }
      return codigo;
    },
    [pocketMap]
  );

  useEffect(() => {
    setSelectedWeek(weekOptions[0]?.key ?? getCurrentWeekKey());
  }, [weekOptions]);

  useEffect(() => {
    let isMounted = true;

    const loadCoreData = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [gastosData, empleadosData, schedules, transfersData, pocketsData] = await Promise.all([
          dataService.fetchGastos(),
          dataService.fetchEmpleados(),
          dataService.fetchEmployeeBaseSchedules(),
          dataService.fetchProvisionTransfers(),
          dataService.fetchCajaBolsillos()
        ]);

        if (!isMounted) {
          return;
        }

        setGastos(gastosData);
        setEmpleados(empleadosData);
        setBaseSchedules(schedules);
        setTransfers(transfersData);
        setPockets(pocketsData);
      } catch (error) {
        console.error('Error cargando la información de contabilidad:', error);
        if (isMounted) {
          setLoadError('No se pudo cargar la información. Intenta nuevamente.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCoreData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedWeek) {
      return;
    }

    if (weeklyHoursCache[selectedWeek]) {
      return;
    }

    let cancelled = false;
    setWeekLoading(true);

    const loadWeek = async () => {
      try {
        const data = await dataService.fetchEmployeeWeeklyHoursForWeek(selectedWeek);
        if (cancelled) {
          return;
        }
        setWeeklyHoursCache(prev => ({ ...prev, [selectedWeek]: data }));
      } catch (error) {
        console.error('Error cargando horas semanales de empleados:', error);
      } finally {
        if (!cancelled) {
          setWeekLoading(false);
        }
      }
    };

    loadWeek();

    return () => {
      cancelled = true;
      setWeekLoading(false);
    };
  }, [selectedWeek, weeklyHoursCache]);

  const gastosPorMetodo = useMemo(() => {
    const totals: Record<TrackedMethod, number> = {
      efectivo: 0,
      nequi: 0,
      tarjeta: 0,
      provision_caja: 0
    };

    gastos.forEach((gasto) => {
      const metodo = (gasto.metodoPago ?? 'efectivo') as PaymentMethod;
      if (!trackedMethods.includes(metodo as typeof trackedMethods[number])) {
        return;
      }
      const methodKey = metodo as TrackedMethod;
      totals[methodKey] += gasto.monto;
    });

    return totals;
  }, [gastos]);

  const totalHistoricoGastos = useMemo(
    () => trackedMethods.reduce((acc, metodo) => acc + (gastosPorMetodo[metodo] ?? 0), 0),
    [gastosPorMetodo]
  );

  const historicoMensual = useMemo(() => {
    const buckets = new Map<string, { efectivo: number; nequi: number; tarjeta: number; provision_caja: number; total: number }>();

    gastos.forEach((gasto) => {
      const fecha = gasto.fecha instanceof Date ? gasto.fecha : new Date(gasto.fecha);
      const metodo = (gasto.metodoPago ?? 'efectivo') as PaymentMethod;

      if (!trackedMethods.includes(metodo as typeof trackedMethods[number])) {
        return;
      }

      const key = getMonthKey(fecha);
      const current = buckets.get(key) ?? { efectivo: 0, nequi: 0, tarjeta: 0, provision_caja: 0, total: 0 };
      const methodKey = metodo as TrackedMethod;
      current[methodKey] += gasto.monto;
      current.total += gasto.monto;
      buckets.set(key, current);
    });

    return Array.from(buckets.entries())
      .map(([key, value]) => ({ key, label: formatMonthLabel(key), ...value }))
      .sort((a, b) => (a.key > b.key ? -1 : 1));
  }, [gastos]);

  const gastosPorCategoria = useMemo(() => {
    const totals = new Map<string, number>();

    gastos.forEach((gasto) => {
      const categoria = gasto.categoria?.trim() || 'Sin categoría';
      totals.set(categoria, (totals.get(categoria) ?? 0) + gasto.monto);
    });

    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  }, [gastos]);

  const sortedTransfers = useMemo(
    () => transfers.slice().sort(compareTransfers),
    [transfers]
  );

  const totalProvisionDeposits = useMemo(
    () => transfers
      .filter((transfer) => transfer.bolsilloDestino === 'provision_caja')
      .reduce((acc, transfer) => acc + transfer.monto, 0),
    [transfers]
  );

  const totalProvisionWithdrawals = useMemo(
    () => transfers
      .filter((transfer) => transfer.bolsilloOrigen === 'provision_caja')
      .reduce((acc, transfer) => acc + transfer.monto, 0),
    [transfers]
  );

  const currentProvisionBalance = totalProvisionDeposits - totalProvisionWithdrawals;

  const weekHours = weeklyHoursCache[selectedWeek] || {};

  const nominaSemanal = useMemo(() => {
    if (!empleados.length) {
      return [] as PayrollRow[];
    }

    return empleados.map((empleado) => {
      const registro = weekHours[empleado.id];
      let horasSemana: WeeklyHours | null = registro ?? null;
      let origen: PayrollSource = 'registro';

      if (!horasSemana) {
        const baseSchedule = baseSchedules[empleado.id];
        if (baseSchedule) {
          horasSemana = buildWeeklyHoursFromBase(baseSchedule);
          origen = 'base';
        } else {
          horasSemana = buildWeeklyHoursFromBase(buildDefaultSchedule(empleado));
          origen = 'estimado';
        }
      }

      const horasTotales = sumWeeklyHours(horasSemana);
      const salario = horasTotales * (Number(empleado.salario_hora) || 0);

      return {
        empleado,
        horas: horasTotales,
        salario,
        origen
      };
    }).sort((a, b) => b.salario - a.salario);
  }, [empleados, weekHours, baseSchedules]);

  const totalNomina = useMemo(
    () => nominaSemanal.reduce((acc, row) => acc + row.salario, 0),
    [nominaSemanal]
  );

  const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeek(event.target.value);
  };

  const handleTransferFieldChange = (
    field: 'monto' | 'fecha' | 'descripcion'
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTransferForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTransferPocketChange = (
    field: 'origen' | 'destino'
  ) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTransferForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateTransfer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTransferError(null);
    const amount = Math.max(0, Math.round(Number(transferForm.monto) || 0));
    if (amount <= 0) {
      setTransferError('Ingresa un monto mayor a cero.');
      return;
    }

    if (!transferForm.fecha) {
      setTransferError('Selecciona la fecha del movimiento.');
      return;
    }

    const fecha = parseDateInputValue(transferForm.fecha);
    if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) {
      setTransferError('La fecha no es válida.');
      return;
    }

    if (!transferForm.origen || !transferForm.destino) {
      setTransferError('Selecciona los bolsillos de origen y destino.');
      return;
    }

    if (transferForm.origen === transferForm.destino) {
      setTransferError('Elige bolsillos diferentes para origen y destino.');
      return;
    }

    const originPocket = pocketMap.get(transferForm.origen);
    const destinationPocket = pocketMap.get(transferForm.destino);
    const originMethodCandidate = originPocket?.metodoPago;
    const originMethod: ProvisionTransfer['origen'] = originMethodCandidate === 'nequi' || originMethodCandidate === 'tarjeta'
      ? originMethodCandidate
      : 'efectivo';

    setTransferSubmitting(true);
    try {
      const newTransfer = await dataService.createProvisionTransfer({
        monto: amount,
        fecha,
        descripcion: transferForm.descripcion,
        origenMetodo: originMethod,
        destinoMetodo: destinationPocket?.metodoPago,
        bolsilloOrigen: transferForm.origen,
        bolsilloDestino: transferForm.destino,
        origenNombre: originPocket?.nombre,
        destinoNombre: destinationPocket?.nombre,
      });
      setTransfers(prev => [newTransfer, ...prev].sort(compareTransfers));
      setTransferForm({
        monto: '',
        fecha: getTodayDateInputValue(),
        descripcion: '',
        origen: transferForm.origen,
        destino: transferForm.destino,
      });
      setTransferFormOpen(false);
    } catch (error) {
      console.error('Error registrando movimiento de provisión:', error);
      setTransferError(
        error instanceof Error
          ? error.message || 'No se pudo registrar el movimiento.'
          : 'No se pudo registrar el movimiento.'
      );
    } finally {
      setTransferSubmitting(false);
    }
  };

  const handleDeleteTransfer = async (id: string) => {
    if (!id) {
      return;
    }
    if (!window.confirm('¿Eliminar este movimiento de provisión?')) {
      return;
    }

    try {
      await dataService.deleteProvisionTransfer(id);
      setTransfers(prev => prev.filter((transfer) => transfer.id !== id));
    } catch (error) {
      console.error('Error eliminando movimiento de provisión:', error);
      setTransferError(
        error instanceof Error
          ? error.message || 'No se pudo eliminar el movimiento.'
          : 'No se pudo eliminar el movimiento.'
      );
    }
  };

  const provisionBalanceClass = currentProvisionBalance >= 0 ? 'text-green-600' : 'text-red-600';

  if (loading) {
    return (
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2">
          <FileSpreadsheet size={24} style={{ color: COLORS.dark }} />
          <h2 className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.dark }}>
            Contabilidad
          </h2>
        </div>
        <div className="ui-card ui-card-pad flex items-center gap-3 text-gray-600">
          <Loader2 className="animate-spin" size={18} />
          <span>Cargando información…</span>
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2">
          <FileSpreadsheet size={24} style={{ color: COLORS.dark }} />
          <h2 className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.dark }}>
            Contabilidad
          </h2>
        </div>
        <div className="ui-card ui-card-pad flex items-center gap-3 text-red-600">
          <AlertTriangle size={18} />
          <span>{loadError}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet size={24} style={{ color: COLORS.dark }} />
          <h2 className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.dark }}>
            Contabilidad
          </h2>
        </div>
      </div>

      <div className="ui-card ui-card-pad space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Banknote size={18} style={{ color: COLORS.dark }} />
            <div>
              <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                Provisión de caja
              </h3>
              <p className="text-sm text-gray-500">
                Registra lo que mueves desde la caja y controla el saldo disponible para gastos futuros.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setTransferFormOpen(prev => !prev);
              setTransferError(null);
            }}
            className="px-3 py-2 text-sm font-medium text-white rounded-lg"
            style={{ backgroundColor: COLORS.accent }}
          >
            {transferFormOpen ? 'Cancelar registro' : 'Registrar movimiento'}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="bg-gray-50 rounded-lg px-3 py-3">
            <p className="text-xs font-medium uppercase text-gray-500">Transferido a provisión</p>
            <p className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              {formatCOP(totalProvisionDeposits)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 py-3">
            <p className="text-xs font-medium uppercase text-gray-500">Retirado de provisión</p>
            <p className="text-lg font-semibold text-red-600">
              {formatCOP(totalProvisionWithdrawals)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 py-3">
            <p className="text-xs font-medium uppercase text-gray-500">Saldo disponible</p>
            <p className={`text-lg font-semibold ${provisionBalanceClass}`}>
              {formatCOP(currentProvisionBalance)}
            </p>
          </div>
        </div>

        {transferFormOpen && (
          <form className="grid gap-3 sm:grid-cols-6" onSubmit={handleCreateTransfer}>
            <label className="flex flex-col gap-1 text-xs font-medium text-gray-600 sm:col-span-2">
              Monto
              <input
                type="number"
                min="1"
                step="1"
                value={transferForm.monto}
                onChange={handleTransferFieldChange('monto')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                placeholder="0"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-gray-600 sm:col-span-2">
              Fecha
              <input
                type="date"
                value={transferForm.fecha}
                onChange={handleTransferFieldChange('fecha')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-gray-600 sm:col-span-2">
              Desde
              <select
                value={transferForm.origen}
                onChange={handleTransferPocketChange('origen')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
              >
                {pocketOptions.map((pocket) => {
                  const methodLabel = PAYMENT_METHOD_LABELS[pocket.metodoPago] ?? pocket.metodoPago;
                  return (
                    <option key={pocket.codigo} value={pocket.codigo} disabled={pocket.codigo === transferForm.destino}>
                      {`${pocket.nombre} · ${methodLabel}`}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-gray-600 sm:col-span-2">
              Hacia
              <select
                value={transferForm.destino}
                onChange={handleTransferPocketChange('destino')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
              >
                {pocketOptions.map((pocket) => {
                  const methodLabel = PAYMENT_METHOD_LABELS[pocket.metodoPago] ?? pocket.metodoPago;
                  return (
                    <option key={pocket.codigo} value={pocket.codigo} disabled={pocket.codigo === transferForm.origen}>
                      {`${pocket.nombre} · ${methodLabel}`}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="flex flex-col gap-1 sm:col-span-6 text-xs font-medium text-gray-600">
              Descripción (opcional)
              <input
                type="text"
                value={transferForm.descripcion}
                onChange={handleTransferFieldChange('descripcion')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                placeholder="Ej. Arqueo semanal"
              />
            </label>
            <div className="sm:col-span-6 flex justify-end gap-2">
              <button
                type="submit"
                disabled={transferSubmitting}
                className="px-3 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-60"
                style={{ backgroundColor: COLORS.dark }}
              >
                {transferSubmitting ? 'Guardando…' : 'Guardar movimiento'}
              </button>
            </div>
          </form>
        )}

        {transferError && (
          <p className="text-sm text-red-600">{transferError}</p>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-gray-500">
              <tr className="text-left">
                <th className="py-2 pr-4 font-medium">Fecha</th>
                <th className="py-2 pr-4 font-medium">Descripción</th>
                <th className="py-2 pr-4 font-medium">Desde</th>
                <th className="py-2 pr-4 font-medium">Hacia</th>
                <th className="py-2 pr-4 font-medium">Monto</th>
                <th className="py-2 pr-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransfers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 pr-4 text-center text-gray-500">
                    Aún no registras movimientos de provisión.
                  </td>
                </tr>
              ) : (
                sortedTransfers.map((transfer) => (
                  <tr key={transfer.id} className="border-t border-gray-100">
                    <td className="py-2 pr-4 text-gray-700 font-medium whitespace-nowrap">
                      {shortDateFormatter.format(transfer.fecha)}
                    </td>
                    <td className="py-2 pr-4 text-gray-600">
                      {transfer.descripcion ?? '—'}
                    </td>
                    <td className="py-2 pr-4 text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium" style={{ color: COLORS.dark }}>
                          {getPocketName(transfer.bolsilloOrigen)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {PAYMENT_METHOD_LABELS[transfer.origen] ?? transfer.origen}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 pr-4 text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium" style={{ color: COLORS.dark }}>
                          {getPocketName(transfer.bolsilloDestino)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {transfer.destinoMetodo ? (PAYMENT_METHOD_LABELS[transfer.destinoMetodo] ?? transfer.destinoMetodo) : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 pr-4 text-green-600 font-semibold">
                      {formatCOP(transfer.monto)}
                    </td>
                    <td className="py-2 pr-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteTransfer(transfer.id)}
                        className="inline-flex items-center justify-center rounded-md border border-transparent px-2 py-1 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {trackedMethods.map((metodo) => {
          const total = gastosPorMetodo[metodo] ?? 0;
          const porcentaje = totalHistoricoGastos > 0 ? (total / totalHistoricoGastos) * 100 : 0;

          return (
            <div key={metodo} className="ui-card ui-card-pad space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Wallet size={18} style={{ color: COLORS.dark }} />
                  <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                    {methodLabels[metodo]}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-500">Histórico</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                {formatCOP(total)}
              </p>
              <p className="text-sm text-gray-500">
                {porcentaje.toFixed(1)}% de los gastos registrados
              </p>
            </div>
          );
        })}
      </div>

      <div className="ui-card ui-card-pad space-y-4">
        <div className="flex items-center gap-3">
          <PieChart size={18} style={{ color: COLORS.dark }} />
          <div>
            <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              Histórico por método de pago
            </h3>
            <p className="text-sm text-gray-500">
              Gastos mensuales separados por método en los últimos registros
            </p>
          </div>
        </div>

        {historicoMensual.length === 0 ? (
          <p className="text-sm text-gray-500">No hay gastos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-gray-500">
                <tr className="text-left">
                  <th className="py-2 pr-4 font-medium">Mes</th>
                  {trackedMethods.map((metodo) => (
                    <th key={metodo} className="py-2 pr-4 font-medium">
                      {methodLabels[metodo]}
                    </th>
                  ))}
                  <th className="py-2 pr-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {historicoMensual.map((row) => (
                  <tr key={row.key} className="border-t border-gray-100">
                    <td className="py-2 pr-4 text-gray-700 font-medium whitespace-nowrap">
                      {row.label}
                    </td>
                    {trackedMethods.map((metodo) => (
                      <td key={metodo} className="py-2 pr-4 text-gray-600">
                        {formatCOP(row[metodo])}
                      </td>
                    ))}
                    <td className="py-2 pr-4 text-gray-900 font-semibold">
                      {formatCOP(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="ui-card ui-card-pad space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CalendarRange size={18} style={{ color: COLORS.dark }} />
            <div>
              <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                Nómina semanal estimada
              </h3>
              <p className="text-sm text-gray-500">
                Calculada según las horas registradas o la programación base
              </p>
            </div>
          </div>
          <select
            value={selectedWeek}
            onChange={handleWeekChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
          >
            {weekOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {empleados.length === 0 ? (
          <p className="text-sm text-gray-500">No hay empleados registrados.</p>
        ) : (
          <div className="space-y-3">
            {weekLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                <span>Cargando horas de la semana seleccionada…</span>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-gray-500">
                  <tr className="text-left">
                    <th className="py-2 pr-4 font-medium">Empleado</th>
                    <th className="py-2 pr-4 font-medium">Horas</th>
                    <th className="py-2 pr-4 font-medium">Valor hora</th>
                    <th className="py-2 pr-4 font-medium">A pagar</th>
                    <th className="py-2 pr-4 font-medium">Fuente</th>
                  </tr>
                </thead>
                <tbody>
                  {nominaSemanal.map((row) => (
                    <tr key={row.empleado.id} className="border-t border-gray-100">
                      <td className="py-2 pr-4 text-gray-700 font-medium whitespace-nowrap">
                        {row.empleado.nombre}
                      </td>
                      <td className="py-2 pr-4 text-gray-600">
                        {formatHours(row.horas)} h
                      </td>
                      <td className="py-2 pr-4 text-gray-600">
                        {formatCOP(row.empleado.salario_hora)}
                      </td>
                      <td className="py-2 pr-4 text-gray-900 font-semibold">
                        {formatCOP(row.salario)}
                      </td>
                      <td className="py-2 pr-4 text-gray-500 capitalize">
                        {row.origen === 'registro' && 'Registro'}
                        {row.origen === 'base' && 'Horario base'}
                        {row.origen === 'estimado' && 'Estimado'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td className="py-2 pr-4 text-sm font-semibold text-gray-600" colSpan={3}>
                      Total semanal
                    </td>
                    <td className="py-2 pr-4 text-gray-900 font-bold">
                      {formatCOP(totalNomina)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="ui-card ui-card-pad space-y-4">
        <div className="flex items-center gap-3">
          <PiggyBank size={18} style={{ color: COLORS.dark }} />
          <div>
            <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              Gastos por categoría
            </h3>
            <p className="text-sm text-gray-500">
              Distribución acumulada según las categorías registradas
            </p>
          </div>
        </div>

        {gastosPorCategoria.length === 0 ? (
          <p className="text-sm text-gray-500">No hay gastos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-gray-500">
                <tr className="text-left">
                  <th className="py-2 pr-4 font-medium">Categoría</th>
                  <th className="py-2 pr-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {gastosPorCategoria.map(([categoria, total]) => (
                  <tr key={categoria} className="border-t border-gray-100">
                    <td className="py-2 pr-4 text-gray-700 font-medium whitespace-nowrap">
                      {categoria}
                    </td>
                    <td className="py-2 pr-4 text-gray-600">
                      {formatCOP(total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
