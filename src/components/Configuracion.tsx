import React, { useEffect, useMemo, useState } from 'react';
import { Settings, Percent, Save, Loader2 } from 'lucide-react';
import { COLORS } from '../data/menu';
import dataService from '../lib/dataService';

export function Configuracion() {
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [savedPercent, setSavedPercent] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await dataService.fetchAppSettings();
        setDiscountPercent(settings.drinkComboDiscountPercent);
        setSavedPercent(settings.drinkComboDiscountPercent);
      } catch (error) {
        console.error('No se pudo cargar la configuración:', error);
        alert('No se pudo cargar la configuración.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const hasChanges = useMemo(() => Math.abs(discountPercent - savedPercent) > 0.0001, [discountPercent, savedPercent]);

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      const saved = await dataService.saveAppSettings({
        drinkComboDiscountPercent: discountPercent,
      });
      setSavedPercent(saved.drinkComboDiscountPercent);
      setDiscountPercent(saved.drinkComboDiscountPercent);
      alert('Configuración guardada correctamente.');
    } catch (error) {
      console.error('No se pudo guardar la configuración:', error);
      alert('No se pudo guardar la configuración.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
          Configuración
        </h2>
        <p className="text-sm lg:text-base text-gray-600">
          Parametriza descuentos y reglas globales del sistema.
        </p>
      </div>

      <div className="ui-card ui-card-pad max-w-3xl mx-auto space-y-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#f3f4f6' }}>
            <Settings size={18} style={{ color: COLORS.dark }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              Descuento de bebidas por combo
            </h3>
            <p className="text-sm text-gray-600">
              Se aplica cuando la comanda incluye un bowl o sandwich y una bebida elegible.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            Cargando configuración...
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Porcentaje de descuento
            </label>
            <div className="flex items-center gap-3">
              <div className="relative w-52 max-w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={discountPercent}
                  onChange={(event) => {
                    const raw = Number(event.target.value);
                    if (!Number.isFinite(raw)) {
                      setDiscountPercent(0);
                      return;
                    }
                    const clamped = Math.min(100, Math.max(0, raw));
                    setDiscountPercent(clamped);
                  }}
                  className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                />
                <Percent size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
              <span className="text-sm text-gray-500">Valor guardado: {savedPercent}%</span>
            </div>

            <div className="rounded-lg border border-gray-200 p-3 text-sm text-gray-600">
              Regla de redondeo actual: se aproxima por centenas según la lógica de caja (ej. 950→1000, 550→500).
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.dark }}
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
