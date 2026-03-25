import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Bot, TrendingUp, Target, Key, History } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatCOP, formatDateInputValue, parseDateInputValue } from '../utils/format';
import { MarketingStrategyRecord, Order } from '../types';
import { GoogleGenAI } from '@google/genai';
import { getOrderAllocations } from '../utils/payments';
import dataService from '../lib/dataService';

interface AIStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const GEMINI_MODEL = 'gemini-2.5-flash';

const getNormalizedRange = (startInput: string, endInput: string) => {
  const startDate = parseDateInputValue(startInput);
  const endDate = parseDateInputValue(endInput);
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const minMs = Math.min(startMs, endMs);
  const maxMs = Math.max(startMs, endMs);
  const normalizedStart = new Date(minMs);
  normalizedStart.setHours(0, 0, 0, 0);
  const normalizedEnd = new Date(maxMs);
  normalizedEnd.setHours(23, 59, 59, 999);
  return { start: normalizedStart, end: normalizedEnd };
};

const getOrdersInRange = (orders: Order[], start: Date, end: Date) =>
  orders.filter((order) => {
    const timestamp = order.timestamp.getTime();
    return timestamp >= start.getTime() && timestamp <= end.getTime();
  });

export function AIStrategyModal({ isOpen, onClose, orders }: AIStrategyModalProps) {
  const defaultEvaluatedStart = new Date();
  defaultEvaluatedStart.setDate(defaultEvaluatedStart.getDate() - 30);
  
  const defaultStrategyStart = new Date();
  defaultStrategyStart.setDate(defaultStrategyStart.getDate() + 1);
  const defaultStrategyEnd = new Date();
  defaultStrategyEnd.setDate(defaultStrategyEnd.getDate() + 8);

  const [evalStartDate, setEvalStartDate] = useState(formatDateInputValue(defaultEvaluatedStart));
  const [evalEndDate, setEvalEndDate] = useState(formatDateInputValue(new Date()));
  const [stratStartDate, setStratStartDate] = useState(formatDateInputValue(defaultStrategyStart));
  const [stratEndDate, setStratEndDate] = useState(formatDateInputValue(defaultStrategyEnd));
  
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<MarketingStrategyRecord[]>([]);
  const [isStrategyDetailOpen, setIsStrategyDetailOpen] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('savia_gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsApiKeySaved(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadHistory = async () => {
      const records = await dataService.fetchMarketingStrategies();
      setHistory(records);
    };

    void loadHistory();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('savia_gemini_api_key', apiKey.trim());
      setIsApiKeySaved(true);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('savia_gemini_api_key');
    setApiKey('');
    setIsApiKeySaved(false);
  };

  const summarizeOrders = (filteredOrders: Order[]) => {
    let totalSales = 0;
    const categories = new Map<string, number>();
    const items = new Map<string, { quantity: number; amount: number; unitPrice: number; category: string }>();
    const ordersByDay = new Map<string, { orders: number; total: number }>();

    filteredOrders.forEach((order) => {
      const allocations = getOrderAllocations(order);
      const realIncome = allocations.length > 0
        ? allocations.reduce((sum, entry) => (
            entry.metodo === 'credito_empleados' ? sum : sum + entry.monto
          ), 0)
        : order.metodoPago === 'credito_empleados'
          ? 0
          : order.total;

      totalSales += realIncome;

      const dayKey = formatDateInputValue(order.timestamp);
      const dayEntry = ordersByDay.get(dayKey) || { orders: 0, total: 0 };
      dayEntry.orders += 1;
      dayEntry.total += realIncome;
      ordersByDay.set(dayKey, dayEntry);
      
      order.items.forEach(({ item, cantidad, precioUnitario }) => {
        const cat = item.categoria || 'Sin categoría';
        const p = typeof precioUnitario === 'number' ? precioUnitario : item.precio;
        const amt = p * cantidad;
        
        categories.set(cat, (categories.get(cat) || 0) + amt);
        
        const itmRef = items.get(item.nombre) || { quantity: 0, amount: 0, unitPrice: p, category: cat };
        itmRef.quantity += cantidad;
        itmRef.amount += amt;
        itmRef.unitPrice = p;
        itmRef.category = cat;
        items.set(item.nombre, itmRef);
      });
    });

    const sortedCategories = Array.from(categories.entries())
      .map(([cat, amount]) => ({ cat, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    const sortedItems = Array.from(items.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 15);

    const orderHistory = Array.from(ordersByDay.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const detailedOrders = filteredOrders
      .slice()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 25)
      .map((order) => ({
        numero: order.numero,
        fecha: order.timestamp.toLocaleString('es-CO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        total: order.total,
        items: order.items.map(({ item, cantidad, precioUnitario }) => ({
          notas: item.notas,
          nombre: item.nombre,
          categoria: item.categoria || 'Sin categoría',
          cantidad,
          precioUnitario: typeof precioUnitario === 'number' ? precioUnitario : item.precio,
          bowlCustomization: item.bowlCustomization,
        })),
      }));

    return { totalSales, sortedCategories, sortedItems, orderHistory, detailedOrders, count: filteredOrders.length };
  };

  const buildPrompt = (summary: ReturnType<typeof summarizeOrders>) => {
    return `Eres un consultor experto en marketing para restaurantes. Tienes acceso a los datos reales de ventas de un local desde el ${evalStartDate} hasta el ${evalEndDate}.
La estrategia que generes se aplicará desde el ${stratStartDate} hasta el ${stratEndDate}.

**Datos de Análisis:**
- Total Ventas en el periodo (COP): ${formatCOP(summary.totalSales)}
- Cantidad de Pedidos: ${summary.count}
- Ticket Promedio: ${formatCOP(summary.count > 0 ? Math.round(summary.totalSales / summary.count) : 0)}

**Historial resumido de órdenes por día:**
${summary.orderHistory.map(day => `- ${day.date}: ${day.orders} pedidos · ${formatCOP(Math.round(day.total))}`).join('\n')}

**Las familias o categorías más fuertes (por valor de venta):**
${summary.sortedCategories.map(c => `- ${c.cat}: ${formatCOP(Math.round(c.amount))}`).join('\n')}

**Top 15 Productos más vendidos con valor unitario y tipo:**
${summary.sortedItems.map(i => `- ${i.name} | Tipo: ${i.category} | Valor unitario: ${formatCOP(Math.round(i.unitPrice))} | ${i.quantity} uds vendidas | Total: ${formatCOP(Math.round(i.amount))}`).join('\n')}

**Muestra del historial reciente de órdenes con ítems de caja:**
${summary.detailedOrders.map(order => `- Pedido #${order.numero} | ${order.fecha} | Total ${formatCOP(Math.round(order.total))} | Ítems: ${order.items.map(item => {
  const bowlDetail = item.bowlCustomization
    ? ` | Bowl: tipo=${item.bowlCustomization.kind ?? 'n/a'}; bases=${item.bowlCustomization.bases?.join('/') || 'n/a'}; toppings=${item.bowlCustomization.toppings?.join('/') || 'n/a'}; proteina=${item.bowlCustomization.proteina ?? item.bowlCustomization.proteinas?.join('/') ?? 'n/a'}; extraCost=${formatCOP(Math.round(item.bowlCustomization.extraCost ?? 0))}`
    : '';
  const notesDetail = item.notas ? ` | Notas: ${item.notas}` : '';
  return `${item.nombre} (${item.categoria}) x${item.cantidad} a ${formatCOP(Math.round(item.precioUnitario))}${bowlDetail}${notesDetail}`;
}).join(', ')}`).join('\n')}

**Instrucciones estrictas para la estrategia:**
Con base en estos datos reales:
1. NO hagas una lista de "hacer publicidad en redes" genérica. Propón acciones concretas, priorizadas y aterrizadas para el local.
2. Identifica la línea ganadora basándote en la data y construye la estrategia sobre los "productos ancla" (los más vendidos de la lista).
3. Propón rutas de upselling y combos específicos (ejemplo: Producto Ancla + Bebida/Postre por un precio adicional cerrado) para subir el ticket promedio sin depender de más tráfico. Evita proponer descuentos generales a todo el local.
4. Sugiere una táctica concreta para capturar datos de clientes en caja reales (ej: pedir WhatsApp a cambio de un beneficio menor).
5. Aprovecha el contexto: define llamados a la acción concretos ("almuerzo rico y rápido", "distinto para estudiar") según qué se vende más.
6. Propón ideas reales de contenido divididas en: Contenido de conversión, Prueba social y Urgencia, usando nombres de los Top Productos.
7. Al final, genera un plan de acción concreto (ej. Semana 1, Semana 2) para el periodo futuro (${stratStartDate} al ${stratEndDate}).
Formatea la respuesta en Markdown, siendo claro y profesional, enfocándote en subir ticket promedio y frecuencia de compra.`;
  };

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      setError("Por favor, ingresa tu API Key de Google Generative AI.");
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setError(null);

    const { start, end } = getNormalizedRange(evalStartDate, evalEndDate);
    const filteredOrders = getOrdersInRange(orders, start, end);

    if (filteredOrders.length === 0) {
      setIsGenerating(false);
      setError("No hay órdenes en el rango evaluado para analizar y construir la estrategia.");
      return;
    }

    const summary = summarizeOrders(filteredOrders);
    const promptText = buildPrompt(summary);

    try {
      const genAI = new GoogleGenAI({ apiKey: apiKey.trim() });
      const res = await genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: promptText,
      });
      const output = res.text;
      setResult(output);
      setIsStrategyDetailOpen(true);
      const saved = await dataService.saveMarketingStrategy({
        analysisStartDate: evalStartDate,
        analysisEndDate: evalEndDate,
        applyStartDate: stratStartDate,
        applyEndDate: stratEndDate,
        model: GEMINI_MODEL,
        orderCount: summary.count,
        totalSales: summary.totalSales,
        content: output,
      });
      setHistory((prev) => [saved, ...prev]);
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      const message = String(err?.message || '');
      if (message.includes('404') || message.includes('not found')) {
        setError(`El modelo configurado no está disponible para tu API Key actual. Revisa en Google AI Studio si tu clave tiene acceso a ${GEMINI_MODEL} o prueba otro modelo habilitado.`);
      } else if (message.includes('API key not valid') || message.includes('permission') || message.includes('PERMISSION_DENIED')) {
        setError('La API Key no es válida o no tiene permisos para usar Gemini Developer API. Genera una nueva clave en Google AI Studio e inténtalo otra vez.');
      } else {
        setError(err?.message || "Ocurrió un error al intentar conectarse con Gemini. Revisa la consola para más detalles, verifica la API Key y tu conexión a internet.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:items-center sm:justify-center">
      <div 
        className="fixed inset-0 bg-gray-900/60 transition-opacity" 
        onClick={onClose}
      />
      <div className="relative flex h-full w-full flex-col bg-white pb-safe shadow-2xl overflow-hidden animate-slide-up sm:h-[96vh] sm:max-h-[96vh] sm:w-[96vw] sm:max-w-7xl sm:rounded-2xl sm:pb-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Estrategia con IA (Gemini)</h2>
              <p className="text-xs text-gray-500">Analiza tus datos reales para generar estrategias</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {isStrategyDetailOpen && result && (
            <div className="h-full">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-indigo-600" />
                  <h4 className="font-semibold text-indigo-900 text-xl">Detalle de estrategia IA</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStrategyDetailOpen(false)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Volver
                </button>
              </div>
              <div className="h-[calc(100%-52px)] rounded-xl border border-indigo-200 bg-indigo-50/30 p-6">
                <div className="h-full overflow-y-auto pr-2">
                  <div className="prose prose-sm max-w-none text-gray-800 prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-li:text-gray-800 prose-ul:pl-5 prose-ol:pl-5">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!isStrategyDetailOpen && (
          <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-6">
            
            {/* API Key Connection */}
            <div className={`border rounded-xl p-4 transition-colors ${isApiKeySaved ? 'bg-emerald-50/50 border-emerald-200' : 'bg-gray-50/50 border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Key size={16} className={isApiKeySaved ? 'text-emerald-500' : 'text-gray-500'} />
                  <h3 className="text-sm font-semibold text-gray-800">Conexión Google Gemini API</h3>
                </div>
                {isApiKeySaved && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Conectado</span>
                )}
              </div>
              
              {!isApiKeySaved ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    placeholder="Ingresa tu API Key de Gemini..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-emerald-700 font-medium">Clave de API configurada localmente.</p>
                  <button
                    onClick={handleClearApiKey}
                    className="text-xs text-red-600 font-medium hover:text-red-700 transition-colors"
                  >
                    Desconectar
                  </button>
                </div>
              )}
              <p className="text-[11px] text-gray-500 mt-2">
                Tu clave no se envía a nuestros servidores, se envía directamente a Google para procesar tu solicitud y se almacena solo en tu navegador.
              </p>
            </div>

            {/* Fechas Evaluadas */}
            <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-blue-500" />
                <h3 className="text-sm font-semibold text-blue-900">1. Datos base para el análisis</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col text-sm">
                  <span className="mb-1.5 text-xs text-gray-500 font-medium">Desde</span>
                  <input
                    type="date"
                    value={evalStartDate}
                    onChange={(e) => setEvalStartDate(e.target.value)}
                    className="rounded-lg border border-blue-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="mb-1.5 text-xs text-gray-500 font-medium">Hasta</span>
                  <input
                    type="date"
                    value={evalEndDate}
                    onChange={(e) => setEvalEndDate(e.target.value)}
                    className="rounded-lg border border-blue-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </label>
              </div>
            </div>

            {/* Fechas Estrategia */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
               <div className="flex items-center gap-2 mb-3">
                <Target size={16} className="text-amber-600" />
                <h3 className="text-sm font-semibold text-amber-900">2. Rango de la Estrategia a aplicar</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col text-sm">
                  <span className="mb-1.5 text-xs text-gray-500 font-medium">Aplicar Desde</span>
                  <input
                    type="date"
                    value={stratStartDate}
                    onChange={(e) => setStratStartDate(e.target.value)}
                    className="rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="mb-1.5 text-xs text-gray-500 font-medium">Aplicar Hasta</span>
                  <input
                    type="date"
                    value={stratEndDate}
                    onChange={(e) => setStratEndDate(e.target.value)}
                    className="rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-fade-in">
                {error}
              </div>
            )}

            </div>

            <div className="space-y-6">
              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
                  <Loader2 size={36} className="text-indigo-500 animate-spin mb-4" />
                  <p className="text-sm font-medium text-indigo-900">Cruza la base de datos de órdenes...</p>
                  <p className="text-xs text-indigo-600 mt-1">Generando la estrategia con Gemini AI</p>
                </div>
              )}

              {result && !isGenerating && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-5 animate-fade-in">
                  <div className="flex items-center gap-2 mb-4 border-b border-indigo-100 pb-3">
                    <Bot size={20} className="text-indigo-600" />
                    <h4 className="font-semibold text-indigo-900 text-lg">Estrategia AI Recomendada</h4>
                  </div>
                  <div className="max-h-[42vh] overflow-y-auto pr-1">
                    <div className="prose prose-sm max-w-none text-gray-800 prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-li:text-gray-800 prose-ul:pl-5 prose-ol:pl-5">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                  <History size={18} className="text-gray-600" />
                  <h4 className="font-semibold text-gray-900 text-lg">Histórico de estrategias</h4>
                </div>
                {history.length > 0 ? (
                  <div className="max-h-[42vh] space-y-3 overflow-y-auto pr-1">
                    {history.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => {
                          setResult(entry.content);
                          setIsStrategyDetailOpen(true);
                        }}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {entry.analysisStartDate} a {entry.analysisEndDate}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Aplicar: {entry.applyStartDate} a {entry.applyEndDate}
                            </p>
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {new Date(entry.createdAt).toLocaleDateString('es-CO')}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
                          <span>{entry.orderCount} pedidos</span>
                          <span>{formatCOP(entry.totalSales)}</span>
                          <span>{entry.model}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Todavía no hay estrategias guardadas. Cada estrategia generada desde este botón quedará almacenada aquí.
                  </p>
                )}
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
          <button
            disabled={isGenerating || !isApiKeySaved}
            onClick={handleGenerate}
            className="w-full relative flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generando...
              </>
            ) : (
              <>
                Analizar datos y generar con IA
                <Sparkles size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
