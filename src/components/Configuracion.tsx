import React, { useEffect, useMemo, useState } from 'react';
import { Check, Percent, Save, Settings, Loader2 } from 'lucide-react';
import { COLORS } from '../data/menu';
import dataService from '../lib/dataService';
import { AppSettings, MenuItem } from '../types';
import { DRINK_DISCOUNT_CATEGORY_OPTIONS, isManagedDrinkDiscountCategory, normalizeDrinkDiscountCategory } from '../constants/drinkDiscount';

const areSameCategories = (left: string[], right: string[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }
  const a = [...left].sort();
  const b = [...right].sort();
  return a.every((value, index) => value === b[index]);
};

const areSameProductIds = (left: string[], right: string[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }
  const a = [...left].sort();
  const b = [...right].sort();
  return a.every((value, index) => value === b[index]);
};

export function Configuracion() {
  const [settings, setSettings] = useState<AppSettings>({
    drinkComboDiscountEnabled: true,
    sandwichComboDiscountEnabled: true,
    followerOrderDiscountEnabled: false,
    studentProductDiscountEnabled: false,
    drinkComboDiscountPercent: 10,
    sandwichComboDiscountPercent: 10,
    followerOrderDiscountPercent: 5,
    studentProductDiscountPercent: 10,
    drinkComboDiscountCategories: DRINK_DISCOUNT_CATEGORY_OPTIONS.map((option) => option.key),
    drinkComboDiscountProductIds: [],
  });
  const [savedSettings, setSavedSettings] = useState<AppSettings>(settings);
  const [drinkProducts, setDrinkProducts] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const [fetchedSettings, menuItems] = await Promise.all([
          dataService.fetchAppSettings(),
          dataService.fetchMenuItems(),
        ]);
        const beverages = menuItems.filter((item) => isManagedDrinkDiscountCategory(item.categoria));
        const beverageIds = beverages.map((item) => item.id);
        const normalizedSelected = fetchedSettings.drinkComboDiscountProductIds.filter((id) => beverageIds.includes(id));
        const finalSelected = normalizedSelected.length > 0 ? normalizedSelected : beverageIds;
        const hydratedSettings: AppSettings = {
          ...fetchedSettings,
          drinkComboDiscountProductIds: finalSelected,
        };
        setDrinkProducts(beverages);
        setSettings(hydratedSettings);
        setSavedSettings(hydratedSettings);
      } catch (error) {
        console.error('No se pudo cargar la configuración:', error);
        alert('No se pudo cargar la configuración.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const hasChanges = useMemo(() => {
    return (
      settings.drinkComboDiscountEnabled !== savedSettings.drinkComboDiscountEnabled ||
      settings.sandwichComboDiscountEnabled !== savedSettings.sandwichComboDiscountEnabled ||
      settings.followerOrderDiscountEnabled !== savedSettings.followerOrderDiscountEnabled ||
      settings.studentProductDiscountEnabled !== savedSettings.studentProductDiscountEnabled ||
      Math.abs(settings.drinkComboDiscountPercent - savedSettings.drinkComboDiscountPercent) > 0.0001 ||
      Math.abs(settings.sandwichComboDiscountPercent - savedSettings.sandwichComboDiscountPercent) > 0.0001 ||
      Math.abs(settings.followerOrderDiscountPercent - savedSettings.followerOrderDiscountPercent) > 0.0001 ||
      Math.abs(settings.studentProductDiscountPercent - savedSettings.studentProductDiscountPercent) > 0.0001 ||
      !areSameCategories(settings.drinkComboDiscountCategories, savedSettings.drinkComboDiscountCategories) ||
      !areSameProductIds(settings.drinkComboDiscountProductIds, savedSettings.drinkComboDiscountProductIds)
    );
  }, [savedSettings, settings]);

  const toggleProduct = (productId: string) => {
    setSettings((prev) => {
      const exists = prev.drinkComboDiscountProductIds.includes(productId);
      const nextProductIds = exists
        ? prev.drinkComboDiscountProductIds.filter((entry) => entry !== productId)
        : [...prev.drinkComboDiscountProductIds, productId];

      return {
        ...prev,
        drinkComboDiscountProductIds: nextProductIds,
      };
    });
  };

  const groupedDrinkProducts = useMemo(() => {
    const grouped = new Map<string, MenuItem[]>();
    DRINK_DISCOUNT_CATEGORY_OPTIONS.forEach((option) => grouped.set(option.label, []));

    drinkProducts.forEach((item) => {
      const normalized = normalizeDrinkDiscountCategory(item.categoria);
      const found = DRINK_DISCOUNT_CATEGORY_OPTIONS.find((option) => option.key === normalized);
      const key = found?.label ?? item.categoria;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(item);
    });

    return Array.from(grouped.entries())
      .map(([label, items]) => ({
        label,
        items: items.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es-CO')),
      }))
      .filter((entry) => entry.items.length > 0);
  }, [drinkProducts]);

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    if (settings.drinkComboDiscountEnabled && settings.drinkComboDiscountProductIds.length === 0) {
      alert('Debes seleccionar al menos un producto de bebida para activar el descuento.');
      return;
    }

    try {
      setIsSaving(true);
      const saved = await dataService.saveAppSettings(settings);
      setSavedSettings(saved);
      setSettings(saved);
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

      <div className="ui-card ui-card-pad max-w-4xl mx-auto space-y-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#f3f4f6' }}>
            <Settings size={18} style={{ color: COLORS.dark }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              Descuentos de combo (bebidas y sandwiches)
            </h3>
            <p className="text-sm text-gray-600">
              Configura y controla por separado los descuentos de bebidas y sandwiches.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            Cargando configuración...
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                    Estado descuento bebidas
                  </p>
                  <p className="text-xs text-gray-500">
                    Habilita o deshabilita el descuento de bebidas en Caja.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, drinkComboDiscountEnabled: !prev.drinkComboDiscountEnabled }))}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    settings.drinkComboDiscountEnabled
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {settings.drinkComboDiscountEnabled ? 'Bebidas habilitado' : 'Bebidas deshabilitado'}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                    Estado descuento sandwiches
                  </p>
                  <p className="text-xs text-gray-500">
                    Habilita o deshabilita el descuento de sandwiches en Caja.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, sandwichComboDiscountEnabled: !prev.sandwichComboDiscountEnabled }))}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    settings.sandwichComboDiscountEnabled
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {settings.sandwichComboDiscountEnabled ? 'Sandwiches habilitado' : 'Sandwiches deshabilitado'}
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                    Descuento estudiantil por producto
                  </p>
                  <p className="text-xs text-gray-500">
                    Permite aplicar descuento a sandwiches y bowls en la sección de Caja.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, studentProductDiscountEnabled: !prev.studentProductDiscountEnabled }))}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    settings.studentProductDiscountEnabled
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {settings.studentProductDiscountEnabled ? 'Estudiantil habilitado' : 'Estudiantil deshabilitado'}
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Porcentaje fijo: <span className="font-semibold text-gray-800">{settings.studentProductDiscountPercent}%</span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                    Descuento seguidor (orden completa)
                  </p>
                  <p className="text-xs text-gray-500">
                    Habilita esta opción para permitir aplicar descuento del 5% al total de la orden desde el carrito.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, followerOrderDiscountEnabled: !prev.followerOrderDiscountEnabled }))}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    settings.followerOrderDiscountEnabled
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {settings.followerOrderDiscountEnabled ? 'Seguidor habilitado' : 'Seguidor deshabilitado'}
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Porcentaje fijo: <span className="font-semibold text-gray-800">{settings.followerOrderDiscountPercent}%</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Porcentaje de descuento en bebidas
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-52 max-w-full">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={settings.drinkComboDiscountPercent}
                    onChange={(event) => {
                      const raw = Number(event.target.value);
                      if (!Number.isFinite(raw)) {
                        setSettings((prev) => ({ ...prev, drinkComboDiscountPercent: 0 }));
                        return;
                      }
                      const clamped = Math.min(100, Math.max(0, raw));
                      setSettings((prev) => ({ ...prev, drinkComboDiscountPercent: clamped }));
                    }}
                    className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                    disabled={!settings.drinkComboDiscountEnabled}
                  />
                  <Percent size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
                <span className="text-sm text-gray-500">
                  Guardado: {savedSettings.drinkComboDiscountPercent}%
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Porcentaje de descuento en sandwiches
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-52 max-w-full">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={settings.sandwichComboDiscountPercent}
                    onChange={(event) => {
                      const raw = Number(event.target.value);
                      if (!Number.isFinite(raw)) {
                        setSettings((prev) => ({ ...prev, sandwichComboDiscountPercent: 0 }));
                        return;
                      }
                      const clamped = Math.min(100, Math.max(0, raw));
                      setSettings((prev) => ({ ...prev, sandwichComboDiscountPercent: clamped }));
                    }}
                    className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                    disabled={!settings.sandwichComboDiscountEnabled}
                  />
                  <Percent size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
                <span className="text-sm text-gray-500">
                  Guardado: {savedSettings.sandwichComboDiscountPercent}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Productos de bebida con descuento</p>
              <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-1">
                {groupedDrinkProducts.map((group) => (
                  <div key={group.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-800">{group.label}</h4>
                      <button
                        type="button"
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            drinkComboDiscountProductIds: Array.from(
                              new Set([
                                ...prev.drinkComboDiscountProductIds.filter((id) => !group.items.some((item) => item.id === id)),
                                ...group.items.map((item) => item.id),
                              ])
                            ),
                          }))
                        }
                        disabled={!settings.drinkComboDiscountEnabled}
                        className="text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        Seleccionar todos
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.items.map((item) => {
                        const selected = settings.drinkComboDiscountProductIds.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleProduct(item.id)}
                            disabled={!settings.drinkComboDiscountEnabled}
                            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                              selected
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                          >
                            <span className="text-left">{item.nombre}</span>
                            {selected && <Check size={16} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
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
