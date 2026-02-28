import React, { useState, useEffect, useMemo } from 'react';
import { Order, MenuItem, CartItem, PaymentAllocation, FocusDateRequest } from '../types';
import { Clock, Check, CheckCircle, User, CreditCard, Edit3, Plus, Minus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP, formatDateTime, formatDate } from '../utils/format';
import {
  calculateCartTotal,
  getCartItemBaseUnitPrice,
  getCartItemEffectiveUnitPrice,
  getCartItemSubtotal,
  normalizeCartTotal,
  isSandwichItem,
  STUDENT_DISCOUNT_NOTE,
} from '../utils/cart';
import dataService from '../lib/dataService';
import {
  BOWL_BASE_MIN,
  BOWL_BASE_LIMIT,
  BOWL_BASE_OPTIONS,
  BOWL_FRUTAL_BASE_LIMIT,
  BOWL_FRUTAL_BASE_MIN,
  BOWL_FRUTAL_BASE_OPTIONS,
  BOWL_FRUTAL_BASE_PRICES,
  BOWL_FRUTAL_TOPPING_EXTRA_COST,
  BOWL_FRUTAL_TOPPING_INCLUDED,
  BOWL_FRUTAL_TOPPING_MIN,
  BOWL_FRUTAL_TOPPING_OPTIONS,
  BOWL_FRUTAL_YOGURT_COST,
  BOWL_SALADO_EXTRA_PROTEIN_COST,
  BOWL_SALADO_TOPPING_EXTRA_COST,
  BOWL_PROTEIN_OPTIONS,
  BOWL_SALADO_COMBO_EXTRA_COST,
  BOWL_SALADO_TUNA_EXTRA_COST,
  BOWL_TOPPING_MIN,
  BOWL_TOPPING_LIMIT,
  BOWL_TOPPING_OPTIONS,
  getBowlSaladoComboExtraCost,
  getBowlSaladoAdditionalProteinsCost,
  getBowlSaladoProteinExtraCost,
  isBowlFrutal,
  isBowlSalado,
} from '../constants/bowl';
import { formatPaymentSummary, getOrderAllocations, isOrderPaid, isOrderPaymentHandled } from '../utils/payments';
import { PaymentModal } from './PaymentModal';

const ITEMS_PER_PAGE = 30;

const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKey = (key: string): Date => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
};

interface ComandasProps {
  orders: Order[];
  onUpdateOrderStatus: (order: Order, status: Order['estado']) => Promise<void> | void;
  onSaveOrderChanges: (orderId: string, updates: { items: CartItem[]; total: number }) => Promise<void>;
  onRecordOrderPayment: (order: Order, allocations: PaymentAllocation[]) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  isAdmin: boolean;
  onAssignOrderCredit: (order: Order, options: { employeeId: string; amount: number; employeeName?: string }) => Promise<void>;
  focusRequest?: FocusDateRequest | null;
  isLoading: boolean;
  isSyncing?: boolean;
}

interface EditingOrder {
  orderId: string;
  items: CartItem[];
  total: number;
}

export function Comandas({
  orders,
  onUpdateOrderStatus,
  onSaveOrderChanges,
  onRecordOrderPayment,
  onDeleteOrder,
  isAdmin,
  onAssignOrderCredit,
  focusRequest,
  isLoading,
  isSyncing = false,
}: ComandasProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingOrder, setEditingOrder] = useState<EditingOrder | null>(null);
  const [expandedActionsOrderId, setExpandedActionsOrderId] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderNumberQuery, setOrderNumberQuery] = useState('');
  const [creditEmployeeQuery, setCreditEmployeeQuery] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<'all' | 'efectivo' | 'nequi' | 'tarjeta'>('all');
  const [bowlModalItem, setBowlModalItem] = useState<MenuItem | null>(null);
  const [selectedBowlBases, setSelectedBowlBases] = useState<string[]>([]);
  const [selectedBowlToppings, setSelectedBowlToppings] = useState<string[]>([]);
  const [selectedBowlProteins, setSelectedBowlProteins] = useState<string[]>([]);
  const [includeSaladoCombo, setIncludeSaladoCombo] = useState(false);
  const [includeGreekYogurt, setIncludeGreekYogurt] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => getDateKey(new Date()));
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [isSavingOrderChanges, setIsSavingOrderChanges] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [statusUpdatingOrderIds, setStatusUpdatingOrderIds] = useState<Record<string, boolean>>({});

  const handleOrderStatusChange = async (order: Order, nextStatus: Order['estado']) => {
    if (statusUpdatingOrderIds[order.id]) {
      return;
    }

    setStatusUpdatingOrderIds((prev) => ({ ...prev, [order.id]: true }));

    try {
      await onUpdateOrderStatus(order, nextStatus);
    } finally {
      setStatusUpdatingOrderIds((prev) => {
        const { [order.id]: _ignored, ...rest } = prev;
        return rest;
      });
    }
  };

  useEffect(() => {
    if (!focusRequest) {
      return;
    }

    const { dateKey, orderId } = focusRequest;

    if (orderId) {
      const targetOrder = orders.find(order => order.id === orderId);
      if (targetOrder) {
        const targetDateKey = getDateKey(targetOrder.timestamp);
        setSelectedDateKey(targetDateKey);

        const dateOrders = orders
          .filter(order => getDateKey(order.timestamp) === targetDateKey)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        const orderIndex = dateOrders.findIndex(order => order.id === orderId);
        if (orderIndex >= 0) {
          const page = Math.floor(orderIndex / ITEMS_PER_PAGE) + 1;
          setCurrentPage(page);
        } else {
          setCurrentPage(1);
        }
        setExpandedActionsOrderId(orderId);
        setEditingOrder(null);
        setShowAddProduct(false);
        return;
      }
    }

    if (dateKey) {
      setSelectedDateKey(dateKey);
      setCurrentPage(1);
      if (orderId) {
        setExpandedActionsOrderId(orderId);
      }
    }
  }, [focusRequest, orders]);

  useEffect(() => {
    if (!focusRequest) {
      setSelectedDateKey(getDateKey(new Date()));
      setCurrentPage(1);
      setExpandedActionsOrderId(null);
      return;
    }
  }, [focusRequest?.requestId]);

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [orders]
  );

  const ordersByDate = useMemo(() => {
    return sortedOrders.reduce((acc, order) => {
      const dateKey = getDateKey(order.timestamp);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(order);
      return acc;
    }, {} as Record<string, Order[]>);
  }, [sortedOrders]);

  const selectedDate = useMemo(() => {
    if (!selectedDateKey) {
      return null;
    }

    const parsedDate = parseDateKey(selectedDateKey);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }, [selectedDateKey]);

  const selectedDateOrders = selectedDate
    ? ordersByDate[selectedDateKey] ?? []
    : sortedOrders;

  const hasGlobalHistorySearch = orderNumberQuery.trim().length > 0 || creditEmployeeQuery.trim().length > 0;
  const baseOrdersForFilters = hasGlobalHistorySearch ? sortedOrders : selectedDateOrders;

  const filteredDateOrders = useMemo(() => {
    const normalizedOrderQuery = orderNumberQuery.trim().toLowerCase();
    const normalizedEmployeeQuery = creditEmployeeQuery.trim().toLowerCase();

    return baseOrdersForFilters.filter((order) => {
      if (normalizedOrderQuery && !String(order.numero).includes(normalizedOrderQuery)) {
        return false;
      }

      if (normalizedEmployeeQuery) {
        const allocations = getOrderAllocations(order);
        const employeeNameFromCredit = order.creditInfo?.employeeName?.toLowerCase() ?? '';
        const employeeIdFromCredit = order.creditInfo?.employeeId?.toLowerCase() ?? '';
        const allocationMatches = allocations.some((allocation) => {
          if (allocation.metodo !== 'credito_empleados') {
            return false;
          }
          const allocationName = allocation.empleadoNombre?.toLowerCase() ?? '';
          const allocationId = allocation.empleadoId?.toLowerCase() ?? '';
          return allocationName.includes(normalizedEmployeeQuery) || allocationId.includes(normalizedEmployeeQuery);
        });

        if (
          !employeeNameFromCredit.includes(normalizedEmployeeQuery) &&
          !employeeIdFromCredit.includes(normalizedEmployeeQuery) &&
          !allocationMatches
        ) {
          return false;
        }
      }

      if (paymentMethodFilter !== 'all') {
        const allocations = getOrderAllocations(order);
        const hasMethodInAllocations = allocations.some((allocation) => allocation.metodo === paymentMethodFilter);
        const matchesPrimaryMethod = order.metodoPago === paymentMethodFilter;
        if (!hasMethodInAllocations && !matchesPrimaryMethod) {
          return false;
        }
      }

      return true;
    });
  }, [baseOrdersForFilters, orderNumberQuery, creditEmployeeQuery, paymentMethodFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDateOrders.length / ITEMS_PER_PAGE));

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDateOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDateOrders, currentPage]);
  
  const pageStart = filteredDateOrders.length === 0
    ? 0
    : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const pageEnd = Math.min(currentPage * ITEMS_PER_PAGE, filteredDateOrders.length);

  const hasPagination = filteredDateOrders.length > ITEMS_PER_PAGE;
  const dateHeading = selectedDate
    ? formatDate(selectedDate)
    : 'Todas las comandas';

  const resetBowlSelections = () => {
    setSelectedBowlBases([]);
    setSelectedBowlToppings([]);
    setSelectedBowlProteins([]);
    setIncludeSaladoCombo(false);
    setIncludeGreekYogurt(false);
  };

  const toggleBowlOption = (
    option: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    limit: number
  ) => {
    setSelected(prev => {
      if (prev.includes(option)) {
        return prev.filter(value => value !== option);
      }
      if (prev.length >= limit) {
        return prev;
      }
      return [...prev, option];
    });
  };

  const handleProteinSelection = (protein: string) => {
    setSelectedBowlProteins((prev) =>
      prev.includes(protein)
        ? prev.filter((entry) => entry !== protein)
        : [...prev, protein]
    );
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [orderNumberQuery, creditEmployeeQuery, paymentMethodFilter, selectedDateKey]);

  const fetchMenuItems = async () => {
    const data = await dataService.fetchMenuItems();
    setMenuItems(data);
  };

  const addMenuItemToEditingOrder = (
    menuItem: MenuItem,
    options?: {
      notas?: string;
      customKey?: string;
      bowlCustomization?: CartItem['bowlCustomization'];
      precioUnitario?: number;
    }
  ) => {
    setEditingOrder(prev => {
      if (!prev) {
        return prev;
      }

      const existingIndex = prev.items.findIndex(
        item => item.item.id === menuItem.id && item.customKey === options?.customKey
      );

      let updatedItems: CartItem[];
      if (existingIndex >= 0) {
        updatedItems = prev.items.map((cartItem, index) =>
          index === existingIndex
            ? {
                ...cartItem,
                cantidad: cartItem.cantidad + 1,
            precioUnitario: typeof cartItem.precioUnitario === 'number'
              ? cartItem.precioUnitario
              : typeof options?.precioUnitario === 'number'
                ? options.precioUnitario
                : menuItem.precio,
          }
            : cartItem
        );
      } else {
        updatedItems = [
          ...prev.items,
          {
            item: menuItem,
            cantidad: 1,
            notas: options?.notas,
            customKey: options?.customKey,
            bowlCustomization: options?.bowlCustomization,
            precioUnitario: typeof options?.precioUnitario === 'number' ? options.precioUnitario : menuItem.precio,
            studentDiscount: false,
          },
        ];
      }

      const newTotal = calculateCartTotal(updatedItems);

      return {
        ...prev,
        items: updatedItems,
        total: newTotal,
      };
    });

    setShowAddProduct(false);
    setSearchQuery('');
  };

  const getStatusColor = (status: Order['estado']) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparando': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'listo': return 'bg-green-100 text-green-800 border-green-200';
      case 'entregado': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['estado']) => {
    switch (status) {
      case 'pendiente': return <Clock size={16} />;
      case 'preparando': return <Clock size={16} className="animate-pulse" />;
      case 'listo': return <CheckCircle size={16} />;
      case 'entregado': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const startEditingOrder = (order: Order) => {
    setExpandedActionsOrderId(null);
    setEditingOrder({
      orderId: order.id,
      items: order.items.map((cartItem) => ({
        ...cartItem,
        precioUnitario: typeof cartItem.precioUnitario === 'number'
          ? cartItem.precioUnitario
          : cartItem.item.precio,
        studentDiscount: !!cartItem.studentDiscount,
      })),
      total: calculateCartTotal(order.items)
    });
  };

  const updateItemPrice = (itemIndex: number, newPrice: number) => {
    if (!editingOrder) return;

    const updatedItems = [...editingOrder.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      item: {
        ...updatedItems[itemIndex].item,
        precio: newPrice
      },
      precioUnitario: newPrice,
    };

    const newTotal = calculateCartTotal(updatedItems);
    
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  const updateItemQuantity = (itemIndex: number, newQuantity: number) => {
    if (!editingOrder) return;
    
    if (newQuantity <= 0) {
      removeItem(itemIndex);
      return;
    }
    
    const updatedItems = [...editingOrder.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      cantidad: newQuantity
    };

    const newTotal = calculateCartTotal(updatedItems);
    
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  const removeItem = (itemIndex: number) => {
    if (!editingOrder) return;

    const updatedItems = editingOrder.items.filter((_, index) => index !== itemIndex);
    const newTotal = calculateCartTotal(updatedItems);

    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      total: newTotal
    });
  };

  const toggleEditingItemDiscount = (itemIndex: number) => {
    if (!editingOrder) return;

    const updatedItems = [...editingOrder.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      studentDiscount: !updatedItems[itemIndex].studentDiscount,
    };

    const newTotal = calculateCartTotal(updatedItems);

    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      total: newTotal,
    });
  };

  const addProductToOrder = (menuItem: MenuItem) => {
    if (!editingOrder) return;

    if (isBowlSalado(menuItem) || isBowlFrutal(menuItem)) {
      resetBowlSelections();
      setBowlModalItem(menuItem);
      setShowAddProduct(false);
      setSearchQuery('');
      return;
    }

    addMenuItemToEditingOrder(menuItem);
  };

  const confirmBowlSelection = () => {
    if (!bowlModalItem) return;

    const isFrutal = isBowlFrutal(bowlModalItem);
    if (isFrutal) {
      if (
        selectedBowlBases.length < BOWL_FRUTAL_BASE_MIN ||
        selectedBowlBases.length > BOWL_FRUTAL_BASE_LIMIT ||
        selectedBowlToppings.length < BOWL_FRUTAL_TOPPING_MIN
      ) {
        return;
      }

      const selectedBase = selectedBowlBases[0] as keyof typeof BOWL_FRUTAL_BASE_PRICES | undefined;
      const hasFrutalBase = Boolean(selectedBase);
      const basePrice = selectedBase ? BOWL_FRUTAL_BASE_PRICES[selectedBase] ?? bowlModalItem.precio : 0;
      const toppingExtraCount = hasFrutalBase
        ? Math.max(0, selectedBowlToppings.length - BOWL_FRUTAL_TOPPING_INCLUDED)
        : selectedBowlToppings.length;
      const extraCost = toppingExtraCount * BOWL_FRUTAL_TOPPING_EXTRA_COST + (includeGreekYogurt ? BOWL_FRUTAL_YOGURT_COST : 0);
      const finalPrice = basePrice + extraCost;

      const notas = [
        selectedBase ? `Base: ${selectedBase}` : 'Sin base',
        `Toppings: ${selectedBowlToppings.join(', ')}`,
        `Toppings cobrados (${toppingExtraCount}): +${formatCOP(toppingExtraCount * BOWL_FRUTAL_TOPPING_EXTRA_COST)}`,
        includeGreekYogurt ? 'Adición: Yogurt Griego' : undefined,
      ]
        .filter(Boolean)
        .join('\n');

      const customKey = [
        bowlModalItem.id,
        selectedBase ?? 'sin-base',
        [...selectedBowlToppings].sort().join('-'),
        includeGreekYogurt ? 'yogurt' : 'sin-yogurt',
      ].join('|');

      addMenuItemToEditingOrder(bowlModalItem, {
        notas,
        customKey,
        bowlCustomization: {
          kind: 'frutal',
          bases: selectedBase ? [selectedBase] : [],
          toppings: selectedBowlToppings,
          yogurtGriego: includeGreekYogurt,
          toppingExtraCount,
          extraCost,
        },
        precioUnitario: finalPrice,
      });

      setBowlModalItem(null);
      resetBowlSelections();
      return;
    }

    if (
      selectedBowlBases.length < BOWL_BASE_MIN ||
      selectedBowlBases.length > BOWL_BASE_LIMIT ||
      selectedBowlToppings.length < BOWL_TOPPING_MIN
    ) {
      return;
    }

    const saladoExtraToppings = Math.max(0, selectedBowlToppings.length - BOWL_TOPPING_LIMIT);
    const saladoExtraToppingsCost = saladoExtraToppings * BOWL_SALADO_TOPPING_EXTRA_COST;

    const notas = [
      `Bases: ${selectedBowlBases.join(', ')}`,
      `Toppings: ${selectedBowlToppings.join(', ')}`,
      saladoExtraToppings > 0
        ? `Toppings adicionales: ${saladoExtraToppings} (+${formatCOP(saladoExtraToppingsCost)})`
        : undefined,
      selectedBowlProteins.length > 0 ? `Proteínas: ${selectedBowlProteins.join(', ')}` : 'Sin proteína',
      getBowlSaladoProteinExtraCost(selectedBowlProteins.includes('Atún') ? 'Atún' : null) > 0
        ? `Adición proteína (Atún): +${formatCOP(BOWL_SALADO_TUNA_EXTRA_COST)}`
        : undefined,
      getBowlSaladoAdditionalProteinsCost(selectedBowlProteins) > 0
        ? `Proteínas adicionales: +${formatCOP(getBowlSaladoAdditionalProteinsCost(selectedBowlProteins))}`
        : undefined,
      includeSaladoCombo
        ? `Combo bowl (+${formatCOP(BOWL_SALADO_COMBO_EXTRA_COST)}): incluye bebida`
        : undefined,
    ]
      .filter(Boolean)
      .join('\n');

    const customKey = [
      bowlModalItem.id,
      [...selectedBowlBases].sort().join('-'),
      [...selectedBowlToppings].sort().join('-'),
      [...selectedBowlProteins].sort().join('-') || 'sin-proteina',
      includeSaladoCombo ? 'combo' : 'sin-combo',
    ].join('|');

    addMenuItemToEditingOrder(bowlModalItem, {
      notas,
      customKey,
      bowlCustomization: {
        bases: selectedBowlBases,
        toppings: selectedBowlToppings,
        proteina: selectedBowlProteins[0],
        proteinas: selectedBowlProteins,
        esCombo: includeSaladoCombo,
        toppingExtraCount: saladoExtraToppings,
        extraCost: saladoExtraToppingsCost,
      },
      precioUnitario:
        bowlModalItem.precio +
        saladoExtraToppingsCost +
        getBowlSaladoProteinExtraCost(selectedBowlProteins.includes('Atún') ? 'Atún' : null) +
        getBowlSaladoAdditionalProteinsCost(selectedBowlProteins) +
        getBowlSaladoComboExtraCost(includeSaladoCombo),
    });

    setBowlModalItem(null);
    resetBowlSelections();
  };

  const closeBowlModal = () => {
    setBowlModalItem(null);
    resetBowlSelections();
  };

  const isFrutalModal = bowlModalItem ? isBowlFrutal(bowlModalItem) : false;
  const baseLimitReached = selectedBowlBases.length >= (isFrutalModal ? BOWL_FRUTAL_BASE_LIMIT : BOWL_BASE_LIMIT);
  const toppingLimitReached = false;
  const selectedFrutalBase = selectedBowlBases[0] as keyof typeof BOWL_FRUTAL_BASE_PRICES | undefined;
  const hasFrutalBase = Boolean(selectedFrutalBase);
  const frutalBasePrice = selectedFrutalBase ? BOWL_FRUTAL_BASE_PRICES[selectedFrutalBase] ?? 0 : 0;
  const frutalExtraToppings = hasFrutalBase
    ? Math.max(0, selectedBowlToppings.length - BOWL_FRUTAL_TOPPING_INCLUDED)
    : selectedBowlToppings.length;
  const frutalExtrasCost = frutalExtraToppings * BOWL_FRUTAL_TOPPING_EXTRA_COST + (includeGreekYogurt ? BOWL_FRUTAL_YOGURT_COST : 0);
  const frutalPreviewPrice = frutalBasePrice + frutalExtrasCost;
  const isBowlSelectionValid = isFrutalModal
    ? selectedBowlBases.length >= BOWL_FRUTAL_BASE_MIN &&
      selectedBowlBases.length <= BOWL_FRUTAL_BASE_LIMIT &&
      selectedBowlToppings.length >= BOWL_FRUTAL_TOPPING_MIN
    : selectedBowlBases.length >= BOWL_BASE_MIN &&
        selectedBowlBases.length <= BOWL_BASE_LIMIT &&
        selectedBowlToppings.length >= BOWL_TOPPING_MIN;
  const saladoExtraToppings = Math.max(0, selectedBowlToppings.length - BOWL_TOPPING_LIMIT);
  const saladoExtraToppingsCost = saladoExtraToppings * BOWL_SALADO_TOPPING_EXTRA_COST;
  const saladoPreviewPrice = bowlModalItem
    ? bowlModalItem.precio +
      saladoExtraToppingsCost +
      getBowlSaladoProteinExtraCost(selectedBowlProteins.includes('Atún') ? 'Atún' : null) +
      getBowlSaladoAdditionalProteinsCost(selectedBowlProteins) +
      getBowlSaladoComboExtraCost(includeSaladoCombo)
    : 0;

  const saveOrderChanges = async () => {
    if (!editingOrder || isSavingOrderChanges) return;

    try {
      setIsSavingOrderChanges(true);
      await onSaveOrderChanges(editingOrder.orderId, {
        items: editingOrder.items,
        total: editingOrder.total
      });

      setEditingOrder(null);
      setShowAddProduct(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al actualizar la orden');
    } finally {
      setIsSavingOrderChanges(false);
    }
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setShowAddProduct(false);
    setSearchQuery('');
    setIsSavingOrderChanges(false);
  };

  const handleDeleteOrder = async (order: Order) => {
    if (deletingOrderId === order.id) {
      return;
    }

    const confirmed = window.confirm(`¿Eliminar la comanda #${order.numero}? Esta acción no se puede deshacer.`);
    if (!confirmed) {
      return;
    }

    try {
      setDeletingOrderId(order.id);
      await onDeleteOrder(order.id);
      if (editingOrder?.orderId === order.id) {
        cancelEditing();
      }
    } catch (error) {
      console.error('Error al eliminar la comanda:', error);
      alert('No se pudo eliminar la comanda. Inténtalo nuevamente.');
    } finally {
      setDeletingOrderId(null);
    }
  };

  const openPaymentModal = (
    order: Order,
    options?: {
      force?: boolean;
      overrideItems?: CartItem[];
      overrideTotal?: number;
    }
  ) => {
    const latestOrder = orders.find((entry) => entry.id === order.id) ?? order;
    const shouldForce = options?.force ?? false;

    if (!shouldForce && isOrderPaid(latestOrder)) {
      return;
    }

    const orderForPayment = options?.overrideItems
      ? {
          ...latestOrder,
          items: options.overrideItems,
          total: options.overrideTotal ?? calculateCartTotal(options.overrideItems),
        }
      : latestOrder;

    setExpandedActionsOrderId(null);
    setPaymentOrder(orderForPayment);
  };

  const handlePaymentModalClose = () => {
    if (!isRecordingPayment) {
      setPaymentOrder(null);
    }
  };

  const handleSubmitPayment = async (allocations: PaymentAllocation[]) => {
    if (!paymentOrder) {
      return;
    }

    try {
      setIsRecordingPayment(true);
      await onRecordOrderPayment(paymentOrder, allocations);
      setPaymentOrder(null);
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      alert('No se pudo registrar el pago. Inténtalo nuevamente.');
    } finally {
      setIsRecordingPayment(false);
    }
  };

  const handleAssignCredit = async (options: { employeeId: string; amount: number; employeeName?: string }) => {
    if (!paymentOrder) {
      return;
    }

    try {
      setIsRecordingPayment(true);
      await onAssignOrderCredit(paymentOrder, options);
      setPaymentOrder(null);
    } catch (error) {
      console.error('Error al asignar la comanda a crédito de empleados:', error);
      alert('No se pudo asignar el crédito. Inténtalo nuevamente.');
    } finally {
      setIsRecordingPayment(false);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedDateKey(value || getDateKey(new Date()));
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleOrderActions = (orderId: string) => {
    setExpandedActionsOrderId(prev => (prev === orderId ? null : orderId));
  };

  const filteredMenuItems = menuItems.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      item.nombre.toLowerCase().includes(query) ||
      (item.keywords && item.keywords.toLowerCase().includes(query));
    const isNonInventariable = item.inventarioCategoria !== 'Inventariables';
    return matchesSearch && isNonInventariable;
  });

  const renderOrderCard = (order: Order) => {
    const allocations = getOrderAllocations(order);
    const isEmployeeCredit = order.creditInfo?.type === 'empleados';
    let employeeCreditLabel = '';
    if (isEmployeeCredit) {
      const employeeName = order.creditInfo?.employeeName?.trim();
      if (employeeName) {
        employeeCreditLabel = ` · ${employeeName}`;
      } else if (order.creditInfo?.employeeId) {
        employeeCreditLabel = ` · Empleado ${order.creditInfo.employeeId}`;
      }
    }
    const creditAmount = isEmployeeCredit
      ? Math.max(0, Math.round(order.creditInfo?.amount ?? order.total))
      : 0;
    const paymentSummary = isEmployeeCredit
      ? `Crédito empleados${employeeCreditLabel} · ${formatCOP(creditAmount || order.total)}`
      : formatPaymentSummary(allocations, formatCOP);
    const paid = isOrderPaid(order);
    const paymentHandled = isOrderPaymentHandled(order);
    const paymentStatusLabel = paymentHandled
      ? (paid ? 'Pago registrado' : 'Pago gestionado')
      : 'Pago pendiente';
    const hasStartedPreparation = order.estado !== 'pendiente';
    const canEditOrder = isAdmin && hasStartedPreparation && (paid || !isEmployeeCredit);
    const canManagePaymentActions = hasStartedPreparation && (paid || !isEmployeeCredit || isAdmin);
    const showEditActionsToggle = isAdmin && order.estado === 'entregado' && (paid || isEmployeeCredit);
    const showPaymentResetNotice = paid && isAdmin;
    const isDeleting = deletingOrderId === order.id;
    const isActionsExpanded = expandedActionsOrderId === order.id;
    const isStatusUpdating = Boolean(statusUpdatingOrderIds[order.id]);

    return (
      <div
        key={order.id}
        className="ui-card ui-card-pad hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-2 lg:space-y-0">
          <div className="flex-1">
            <h3 className="text-lg lg:text-xl font-bold mb-1" style={{ color: COLORS.dark }}>
              #{order.numero}
            </h3>
            <p className="text-xs lg:text-sm text-gray-500">{formatDateTime(order.timestamp)}</p>
          </div>
          <div className="flex items-center gap-2 self-start">
            <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium border flex items-center gap-1 ${getStatusColor(order.estado)}`}>
              {getStatusIcon(order.estado)}
              <span className="hidden lg:inline">{order.estado}</span>
            </span>
            {order.estado === 'entregado' && showEditActionsToggle && editingOrder?.orderId !== order.id && (
              <button
                type="button"
                onClick={() => toggleOrderActions(order.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs lg:text-sm font-medium border transition-colors shadow-sm ${
                  isActionsExpanded
                    ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                    : 'text-blue-600 border-blue-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
                title={isActionsExpanded ? 'Ocultar acciones' : 'Editar comanda'}
                aria-pressed={isActionsExpanded}
              >
                <Edit3 size={14} />
                <span className="hidden sm:inline">Editar</span>
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleDeleteOrder(order)}
                disabled={isDeleting}
                className="p-1.5 rounded-full border border-transparent text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Eliminar comanda"
                aria-label="Eliminar comanda"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin text-red-600" /> : <Trash2 size={16} />}
              </button>
            )}
          </div>
        </div>

        {order.cliente && (
          <div className="flex items-center gap-2 mb-3 text-xs lg:text-sm text-gray-600">
            <User size={14} />
            <span>{order.cliente}</span>
          </div>
        )}

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between text-xs lg:text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard size={14} />
              <span className="text-left">{paymentSummary}</span>
            </div>
            <span className={`px-2 py-1 rounded-full font-medium ${paymentHandled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
              {paymentStatusLabel}
            </span>
          </div>
        </div>

        {editingOrder?.orderId === order.id ? (
          <div className="space-y-3 mb-4">
            <h4 className="font-semibold text-sm">Editando pedido:</h4>
            {editingOrder.items.map((cartItem, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">{cartItem.item.nombre}</span>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {cartItem.studentDiscount && (
                    <span className="inline-flex items-center text-[11px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full w-fit">
                      {STUDENT_DISCOUNT_NOTE}
                    </span>
                  )}

                  <div className="text-xs text-gray-600">
                    Precio unidad:{' '}
                    {cartItem.studentDiscount ? (
                      <>
                        <span className="line-through text-gray-400 mr-2">
                          {formatCOP(getCartItemBaseUnitPrice(cartItem))}
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatCOP(getCartItemEffectiveUnitPrice(cartItem))}
                        </span>
                      </>
                    ) : (
                      <span>{formatCOP(getCartItemBaseUnitPrice(cartItem))}</span>
                    )}
                  </div>

                  {cartItem.notas && (
                    <p className="text-xs text-gray-500 whitespace-pre-line">
                      {cartItem.notas}
                    </p>
                  )}

                  <div className="flex flex-col lg:flex-row gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs text-gray-600">Cant:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateItemQuantity(index, cartItem.cantidad - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">{cartItem.cantidad}</span>
                        <button
                          onClick={() => updateItemQuantity(index, cartItem.cantidad + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs text-gray-600">Precio:</span>
                      <input
                        type="number"
                        value={getCartItemBaseUnitPrice(cartItem)}
                        onChange={(e) => updateItemPrice(index, Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  {isSandwichItem(cartItem.item) && (
                    <button
                      onClick={() => toggleEditingItemDiscount(index)}
                      className={`self-start inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                        cartItem.studentDiscount
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      {cartItem.studentDiscount ? 'Quitar descuento' : 'Aplicar descuento estudiante'}
                    </button>
                  )}

                  <div className="text-right">
                    <span className="text-sm font-medium">
                      Subtotal: {formatCOP(getCartItemSubtotal(cartItem))}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col lg:flex-row gap-2">
              <button
                onClick={() => setShowAddProduct(true)}
                disabled={isSavingOrderChanges}
                className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
                Agregar producto
              </button>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold">Nuevo Total:</span>
                <span className="font-bold text-lg" style={{ color: COLORS.accent }}>
                  {formatCOP(editingOrder.total)}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {canManagePaymentActions && (
                  <button
                    onClick={() => openPaymentModal(order, {
                      force: paid,
                      overrideItems: editingOrder.items,
                      overrideTotal: editingOrder.total,
                    })}
                    disabled={isSavingOrderChanges || (paid && !isAdmin)}
                    className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard size={14} />
                    {paid ? 'Modificar pago' : 'Registrar pago'}
                  </button>
                )}
                {canManagePaymentActions && showPaymentResetNotice && (
                  <p className="text-[11px] text-gray-500 text-center">
                    Al guardar se restablecerá el estado del pago actual.
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={saveOrderChanges}
                    disabled={isSavingOrderChanges}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingOrderChanges ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Guardar
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={isSavingOrderChanges}
                    className="flex-1 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium hover:bg-gray-500 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={14} />
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {order.items.map((cartItem, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-xs lg:text-sm">
                  <span>{cartItem.cantidad}x {cartItem.item.nombre}</span>
                  <span className="font-medium">{formatCOP(getCartItemSubtotal(cartItem))}</span>
                </div>
                <div className="text-[11px] lg:text-xs text-gray-600">
                  Precio unidad:{' '}
                  {cartItem.studentDiscount ? (
                    <>
                      <span className="line-through text-gray-400 mr-1">
                        {formatCOP(getCartItemBaseUnitPrice(cartItem))}
                      </span>
                      <span className="font-semibold text-green-600">
                        {formatCOP(getCartItemEffectiveUnitPrice(cartItem))}
                      </span>
                    </>
                  ) : (
                    <span>{formatCOP(getCartItemBaseUnitPrice(cartItem))}</span>
                  )}
                </div>
                {cartItem.studentDiscount && (
                  <span className="inline-flex items-center text-[11px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {STUDENT_DISCOUNT_NOTE}
                  </span>
                )}
                {cartItem.notas && (
                  <p className="text-xs text-gray-500 whitespace-pre-line">
                    {cartItem.notas}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {editingOrder?.orderId !== order.id && (
          <React.Fragment>
            <div className="border-t pt-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg" style={{ color: COLORS.accent }}>
                  {formatCOP(order.total)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {order.estado === 'entregado' ? (
                <div className="space-y-2">
                  {paid ? (
                    isActionsExpanded && (
                      <div className="space-y-2">
                        <button
                          onClick={() => startEditingOrder(order)}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm"
                        >
                          Modificar pedido
                        </button>
                        <button
                          onClick={() => openPaymentModal(order, { force: paid })}
                          disabled={!isAdmin}
                          className="w-full py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                        >
                          <CreditCard size={14} />
                          Modificar pago
                        </button>
                        {showPaymentResetNotice && (
                          <p className="text-[11px] text-gray-500 text-center">
                            Al guardar los cambios se restablecerá el estado del pago.
                          </p>
                        )}
                      </div>
                    )
                  ) : isEmployeeCredit ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                        <p className="font-semibold">
                          Crédito de empleados en seguimiento{employeeCreditLabel}
                        </p>
                        <p className="mt-1 text-[11px] text-yellow-700">
                          Gestiona el cobro desde el módulo Crédito empleados cuando el colaborador realice el pago.
                        </p>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => openPaymentModal(order)}
                          className="w-full py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-sm flex items-center justify-center gap-1"
                        >
                          <CreditCard size={14} />
                          Gestionar crédito
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {canEditOrder && (
                        <button
                          onClick={() => startEditingOrder(order)}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm"
                        >
                          Modificar pedido
                        </button>
                      )}
                      <button
                        onClick={() => openPaymentModal(order)}
                        className="w-full py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-sm flex items-center justify-center gap-1"
                      >
                        <CreditCard size={14} />
                        Registrar pago
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <React.Fragment>
              {order.estado === 'pendiente' && (
                <button
                  onClick={() => handleOrderStatusChange(order, 'preparando')}
                  disabled={isStatusUpdating}
                  className="w-full py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: COLORS.dark }}
                >
                  {isStatusUpdating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Iniciar preparación'
                  )}
                </button>
              )}
              {order.estado === 'preparando' && (
                <button
                  onClick={() => handleOrderStatusChange(order, 'listo')}
                  disabled={isStatusUpdating}
                  className="w-full py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
                >
                  {isStatusUpdating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Marcar como listo'
                  )}
                </button>
              )}
              {order.estado === 'listo' && (
                <button
                  onClick={() => handleOrderStatusChange(order, 'entregado')}
                  disabled={isStatusUpdating}
                  className="w-full py-2 bg-green-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isStatusUpdating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Entregar pedido'
                  )}
                </button>
              )}
              {hasStartedPreparation && (
                <div className="space-y-2 mt-2">
                  {canEditOrder && (
                    <button
                      onClick={() => startEditingOrder(order)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm"
                    >
                      Modificar pedido
                    </button>
                  )}
                  {isEmployeeCredit ? (
                    <>
                      <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                        <p className="font-semibold">
                          Crédito de empleados en seguimiento{employeeCreditLabel}
                        </p>
                        <p className="mt-1 text-[11px] text-yellow-700">
                          Gestiona el cobro desde el módulo Crédito empleados cuando el colaborador realice el pago.
                        </p>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => openPaymentModal(order)}
                          className="w-full py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-sm flex items-center justify-center gap-1"
                        >
                          <CreditCard size={14} />
                          Gestionar crédito
                        </button>
                      )}
                    </>
                  ) : (
                    canManagePaymentActions && (
                      <button
                        onClick={() => openPaymentModal(order, paid ? { force: true } : undefined)}
                        disabled={paid && !isAdmin}
                        className="w-full py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CreditCard size={14} />
                        {paid ? 'Modificar pago' : 'Registrar pago'}
                      </button>
                    )
                  )}
                </div>
              )}
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
          Gestión de Comandas
        </h2>
        <p className="text-sm lg:text-base text-gray-600">
          Control de pedidos y estado de preparación
        </p>
      </div>

      {isSyncing && !isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" />
          <span>Sincronizando cambios…</span>
        </div>
      )}

      {isLoading ? (
        <div className="ui-card ui-card-pad text-center">
          <Loader2 size={40} className="mx-auto text-gray-400 mb-4 animate-spin" />
          <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">Cargando comandas</h3>
          <p className="text-sm lg:text-base text-gray-500">Estamos obteniendo la información más reciente.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="ui-card ui-card-pad text-center">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">No hay comandas</h3>
          <p className="text-sm lg:text-base text-gray-500">Los pedidos aparecerán aquí cuando se procesen desde caja</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: COLORS.dark }}>
                {selectedDate ? `Comandas del ${dateHeading}` : dateHeading}
              </h3>
              <p className="text-sm text-gray-500">
                {filteredDateOrders.length === 1
                  ? '1 comanda registrada'
                  : `${filteredDateOrders.length} comandas registradas`}
                {hasGlobalHistorySearch && (
                  <span> · búsqueda en todo el historial</span>
                )}
                {filteredDateOrders.length > 0 && hasPagination && (
                  <span>{` · Mostrando ${pageStart}-${pageEnd}`}</span>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
              <input
                type="text"
                value={orderNumberQuery}
                onChange={(event) => setOrderNumberQuery(event.target.value)}
                placeholder="Buscar # orden"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400"
              />
              <input
                type="text"
                value={creditEmployeeQuery}
                onChange={(event) => setCreditEmployeeQuery(event.target.value)}
                placeholder="Buscar empleado (crédito)"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400"
              />
              <select
                value={paymentMethodFilter}
                onChange={(event) => setPaymentMethodFilter(event.target.value as 'all' | 'efectivo' | 'nequi' | 'tarjeta')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400"
              >
                <option value="all">Todos los métodos</option>
                <option value="efectivo">Efectivo</option>
                <option value="nequi">Nequi</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
              <input
                id="comandas-date-picker"
                type="date"
                value={selectedDateKey}
                onChange={handleDateChange}
                max={getDateKey(new Date())}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400"
              />
            </div>
          </div>

          {filteredDateOrders.length === 0 ? (
            <div className="ui-card ui-card-pad text-center text-gray-500">
              No hay comandas que coincidan con los filtros seleccionados.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {paginatedOrders.map(renderOrderCard)}

              </div>

              {hasPagination && (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    className="px-3 py-1.5 rounded-full border text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => {
                      const isActive = pageNumber === currentPage;
                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-9 h-9 rounded-full border text-sm font-medium transition-colors ${
                            isActive
                              ? 'shadow-sm'
                              : 'hover:border-gray-300'
                          }`}
                          style={isActive ? { backgroundColor: COLORS.accent, color: COLORS.dark, borderColor: COLORS.accent } : undefined}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={goToNextPage}
                    className="px-3 py-1.5 rounded-full border text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {paymentOrder && (
        <PaymentModal
          order={paymentOrder}
          onClose={handlePaymentModalClose}
          onSubmit={handleSubmitPayment}
          isSubmitting={isRecordingPayment}
          title="Gestionar pago"
          onAssignCredit={handleAssignCredit}
        />
      )}

      {/* Modal para agregar productos */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <h3 className="text-lg lg:text-xl font-bold mb-4" style={{ color: COLORS.dark }}>
              Agregar Producto
            </h3>
            
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent mb-4 text-sm"
              style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
            />
            
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {filteredMenuItems.slice(0, 10).map((item) => (
                <button
                  key={item.id}
                  onClick={() => addProductToOrder(item)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.nombre}</h4>
                      <p className="text-xs text-gray-600">{item.categoria}</p>
                    </div>
                    <span className="font-bold text-sm" style={{ color: COLORS.accent }}>
                      {formatCOP(item.precio)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => {
                setShowAddProduct(false);
                setSearchQuery('');
              }}
              className="w-full py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {bowlModalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg lg:text-xl font-bold" style={{ color: COLORS.dark }}>
                {isFrutalModal ? 'Personaliza tu Bowl Frutal' : 'Personaliza tu Bowl Salado'}
              </h3>
              <p className="text-sm text-gray-600">
                {isFrutalModal
                  ? `Base opcional. Sin base: cada topping suma +${formatCOP(BOWL_FRUTAL_TOPPING_EXTRA_COST)}. Con base: incluye ${BOWL_FRUTAL_TOPPING_INCLUDED} toppings y desde el 5to suma +${formatCOP(BOWL_FRUTAL_TOPPING_EXTRA_COST)}. Yogurt griego +${formatCOP(BOWL_FRUTAL_YOGURT_COST)}.`
                  : `Selecciona entre ${BOWL_BASE_MIN} y ${BOWL_BASE_LIMIT} bases, mínimo ${BOWL_TOPPING_MIN} toppings. Desde el topping 5: +${formatCOP(BOWL_SALADO_TOPPING_EXTRA_COST)} c/u. La proteína es opcional.`}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                    Elige tu base
                  </h4>
                  <span className="text-xs text-gray-500">
                    {selectedBowlBases.length}/{isFrutalModal ? BOWL_FRUTAL_BASE_LIMIT : BOWL_BASE_LIMIT}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(isFrutalModal ? BOWL_FRUTAL_BASE_OPTIONS : BOWL_BASE_OPTIONS).map((base) => {
                    const selected = selectedBowlBases.includes(base);
                    const disabled = !selected && baseLimitReached;
                    return (
                      <button
                        key={base}
                        type="button"
                        onClick={() =>
                          toggleBowlOption(
                            base,
                            selectedBowlBases,
                            setSelectedBowlBases,
                            isFrutalModal ? BOWL_FRUTAL_BASE_LIMIT : BOWL_BASE_LIMIT
                          )
                        }
                        disabled={disabled}
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                          selected
                            ? 'border-transparent shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={selected ? { backgroundColor: COLORS.beige, color: COLORS.dark, borderColor: COLORS.accent } : undefined}
                      >
                        <span>{base}</span>
                        {selected && (
                          <span
                            className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-white"
                            style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
                          >
                            <Check size={16} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                    Elige tus toppings
                  </h4>
                  <span className="text-xs text-gray-500">
                    {selectedBowlToppings.length}
                    {isFrutalModal ? '' : ` (incluye ${BOWL_TOPPING_LIMIT})`}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(isFrutalModal ? BOWL_FRUTAL_TOPPING_OPTIONS : BOWL_TOPPING_OPTIONS).map((topping) => {
                    const selected = selectedBowlToppings.includes(topping);
                    const disabled = !selected && toppingLimitReached;
                    return (
                      <button
                        key={topping}
                        type="button"
                        onClick={() =>
                          toggleBowlOption(
                            topping,
                            selectedBowlToppings,
                            setSelectedBowlToppings,
                            isFrutalModal ? 99 : BOWL_TOPPING_OPTIONS.length
                          )
                        }
                        disabled={disabled}
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                          selected
                            ? 'border-transparent shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={selected ? { backgroundColor: COLORS.beige, color: COLORS.dark, borderColor: COLORS.accent } : undefined}
                      >
                        <span>{topping}</span>
                        {selected && (
                          <span
                            className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-white"
                            style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
                          >
                            <Check size={16} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {isFrutalModal ? (
                <div className="rounded-lg border border-gray-200 p-4 space-y-2">
                  <label className="flex items-center justify-between gap-3 cursor-pointer">
                    <span className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                      Adición Yogurt Griego
                    </span>
                    <input
                      type="checkbox"
                      checked={includeGreekYogurt}
                      onChange={(e) => setIncludeGreekYogurt(e.target.checked)}
                    />
                  </label>
                  <p className="text-xs text-gray-500">
                    Toppings cobrados: {frutalExtraToppings} x {formatCOP(BOWL_FRUTAL_TOPPING_EXTRA_COST)} = {formatCOP(frutalExtraToppings * BOWL_FRUTAL_TOPPING_EXTRA_COST)}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: COLORS.accent }}>
                    Precio final: {formatCOP(frutalPreviewPrice)}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                        Elige tus proteínas (opcional)
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {BOWL_PROTEIN_OPTIONS.map((protein) => {
                        const selected = selectedBowlProteins.includes(protein);
                        return (
                          <button
                            key={protein}
                            type="button"
                            onClick={() => handleProteinSelection(protein)}
                            className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                              selected
                                ? 'border-transparent shadow-sm'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={selected ? { backgroundColor: COLORS.beige, color: COLORS.dark, borderColor: COLORS.accent } : undefined}
                          >
                            <span>
                              {protein}
                              {getBowlSaladoProteinExtraCost(protein) > 0 ? ` (+${formatCOP(BOWL_SALADO_TUNA_EXTRA_COST)})` : ''}
                            </span>
                            {selected && (
                              <span
                                className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-white"
                                style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
                              >
                                <Check size={16} />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 space-y-2">
                    <label className="flex items-center justify-between gap-3 cursor-pointer">
                      <span className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                        Pedir en combo (incluye bebida)
                      </span>
                      <input
                        type="checkbox"
                        checked={includeSaladoCombo}
                        onChange={(e) => setIncludeSaladoCombo(e.target.checked)}
                      />
                    </label>
                    <p className="text-xs text-gray-500">
                      Combo bowl: +{formatCOP(BOWL_SALADO_COMBO_EXTRA_COST)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Proteína adicional: +{formatCOP(BOWL_SALADO_EXTRA_PROTEIN_COST)} c/u (desde la 2da)
                    </p>
                    <p className="text-xs text-gray-500">
                      Topping adicional: {saladoExtraToppings} x {formatCOP(BOWL_SALADO_TOPPING_EXTRA_COST)} = {formatCOP(saladoExtraToppingsCost)}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: COLORS.accent }}>
                      Precio final: {formatCOP(saladoPreviewPrice)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end border-t pt-4">
              <button
                onClick={closeBowlModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBowlSelection}
                disabled={!isBowlSelectionValid}
                className="px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.dark }}
              >
                Agregar al pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
