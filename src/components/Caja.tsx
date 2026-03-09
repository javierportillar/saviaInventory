import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MenuItem, CartItem, Order, ModuleType, Customer, PaymentAllocation, BowlCustomization, Empleado } from '../types';
import { Plus, Minus, Trash2, Search, ShoppingCart, Edit2, Check } from 'lucide-react';
import { COLORS } from '../data/menu';
import { formatCOP, generateOrderNumber } from '../utils/format';
import {
  calculateCartTotal,
  getCartItemBaseUnitPrice,
  getCartItemEffectiveUnitPrice,
  getCartItemSubtotal,
  isSandwichItem,
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
  BOWL_SALADO_COMBO_EXTRA_COST,
  BOWL_SALADO_EXTRA_PROTEIN_COST,
  BOWL_SALADO_TOPPING_EXTRA_COST,
  BOWL_PROTEIN_OPTIONS,
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
import { formatPaymentSummary, getOrderAllocations, isOrderPaid } from '../utils/payments';
import { PaymentModal } from './PaymentModal';
import {
  DEFAULT_DRINK_DISCOUNT_PERCENT,
  DRINK_DISCOUNT_CATEGORY_KEYS,
  normalizeDrinkDiscountCategory,
} from '../constants/drinkDiscount';

const EMPLOYEE_BOWL_PRICE = 6000;
const EMPLOYEE_RESTRICTED_TOPPINGS = new Set(['Champiñones', 'Tocineta', 'Guacamole']);
const EMPLOYEE_ALLOWED_PROTEINS = new Set(['Pechuga de pollo', 'Carne desmechada']);
const SANDWICH_DRINK_EXTRA_COST = 1000;

const roundDrinkDiscountAmount = (discount: number): number => {
  const safeDiscount = Math.max(0, Math.round(discount));
  const remainder = safeDiscount % 100;
  const base = safeDiscount - remainder;

  if (remainder < 50) {
    return base;
  }
  if (remainder > 50) {
    return base + 100;
  }

  const lower = base;
  const upper = base + 100;
  if (lower > 0 && lower % 500 === 0) {
    return lower;
  }
  if (upper > 0 && upper % 500 === 0) {
    return upper;
  }
  return lower;
};

const isDiscountableDrinkCategory = (category?: string): boolean => {
  return DRINK_DISCOUNT_CATEGORY_KEYS.includes(normalizeDrinkDiscountCategory(category));
};

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createTimestampForDateKey = (dateKey: string): Date => {
  if (!dateKey) {
    return new Date();
  }

  const [yearStr, monthStr, dayStr] = dateKey.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if ([year, month, day].some(value => Number.isNaN(value) || value <= 0)) {
    return new Date();
  }

  const now = new Date();
  const timestamp = new Date(now);
  timestamp.setFullYear(year, month - 1, day);
  return timestamp;
};

const doesTimestampMatchDateKey = (timestamp: Date, dateKey: string): boolean => {
  if (!dateKey) {
    return false;
  }

  return formatDateForInput(timestamp) === dateKey;
};

const formatDateKeyForDisplay = (dateKey: string): string => {
  const [yearStr, monthStr, dayStr] = dateKey.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if ([year, month, day].some(value => Number.isNaN(value) || value <= 0)) {
    return dateKey;
  }

  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

interface CajaProps {
  orders: Order[];
  onModuleChange: (module: ModuleType) => void;
  onCreateOrder: (order: Order) => Promise<void>;
  onRecordOrderPayment: (order: Order, allocations: PaymentAllocation[]) => Promise<void>;
  onAssignOrderCredit: (order: Order, options: { employeeId: string; amount: number; employeeName?: string }) => Promise<void>;
}

export function Caja({ orders, onModuleChange, onCreateOrder, onRecordOrderPayment, onAssignOrderCredit }: CajaProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isEmployeeCajaMode, setIsEmployeeCajaMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateForInput(new Date()));
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentModalOrder, setPaymentModalOrder] = useState<Order | null>(null);
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [employeeName, setEmployeeName] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Empleado | null>(null);
  const [sandwichPreviewItem, setSandwichPreviewItem] = useState<MenuItem | null>(null);
  const [includeSandwichDrink, setIncludeSandwichDrink] = useState(false);
  const [bowlModalItem, setBowlModalItem] = useState<MenuItem | null>(null);
  const [selectedBowlBases, setSelectedBowlBases] = useState<string[]>([]);
  const [selectedBowlToppings, setSelectedBowlToppings] = useState<string[]>([]);
  const [selectedBowlProteins, setSelectedBowlProteins] = useState<string[]>([]);
  const [includeSaladoCombo, setIncludeSaladoCombo] = useState(false);
  const [includeGreekYogurt, setIncludeGreekYogurt] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [drinkDiscountEnabled, setDrinkDiscountEnabled] = useState<boolean>(true);
  const [sandwichDiscountEnabled, setSandwichDiscountEnabled] = useState<boolean>(true);
  const [followerOrderDiscountEnabled, setFollowerOrderDiscountEnabled] = useState<boolean>(false);
  const [followerOrderDiscountPercent, setFollowerOrderDiscountPercent] = useState<number>(5);
  const [applyFollowerOrderDiscount, setApplyFollowerOrderDiscount] = useState<boolean>(false);
  const [studentProductDiscountEnabled, setStudentProductDiscountEnabled] = useState<boolean>(false);
  const [studentProductDiscountPercent, setStudentProductDiscountPercent] = useState<number>(10);
  const [drinkDiscountPercent, setDrinkDiscountPercent] = useState<number>(DEFAULT_DRINK_DISCOUNT_PERCENT);
  const [sandwichDiscountPercent, setSandwichDiscountPercent] = useState<number>(DEFAULT_DRINK_DISCOUNT_PERCENT);
  const [drinkDiscountCategories, setDrinkDiscountCategories] = useState<string[]>([...DRINK_DISCOUNT_CATEGORY_KEYS]);
  const [drinkDiscountProductIds, setDrinkDiscountProductIds] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const drinkDiscountRate = drinkDiscountPercent / 100;
  const sandwichDiscountRate = sandwichDiscountPercent / 100;
  const drinkDiscountLabel = Number.isInteger(drinkDiscountPercent)
    ? String(drinkDiscountPercent)
    : drinkDiscountPercent.toFixed(2).replace(/\.?0+$/, '');
  const sandwichDiscountLabel = Number.isInteger(sandwichDiscountPercent)
    ? String(sandwichDiscountPercent)
    : sandwichDiscountPercent.toFixed(2).replace(/\.?0+$/, '');

  const resetBowlSelections = () => {
    setSelectedBowlBases([]);
    setSelectedBowlToppings([]);
    setSelectedBowlProteins([]);
    setIncludeSaladoCombo(false);
    setIncludeGreekYogurt(false);
  };

  const handleAddToCart = (item: MenuItem) => {
    if (isEmployeeCajaMode && !isBowlSalado(item)) {
      return;
    }
    const normalizedItemName = item.nombre.toLowerCase();
    const isStandaloneSandwichDrink = normalizedItemName.includes('hatsu') && normalizedItemName.includes('adicional');
    if (!isEmployeeCajaMode && isSandwichItem(item) && !isStandaloneSandwichDrink) {
      setSandwichPreviewItem(item);
      setIncludeSandwichDrink(false);
      return;
    }
    if (isBowlSalado(item)) {
      resetBowlSelections();
      setBowlModalItem(item);
      return;
    }
    if (isBowlFrutal(item)) {
      resetBowlSelections();
      setBowlModalItem(item);
      return;
    }
    addToCart(item);
  };

  const closeSandwichPreview = () => {
    setSandwichPreviewItem(null);
    setIncludeSandwichDrink(false);
  };

  const confirmSandwichPreview = () => {
    if (!sandwichPreviewItem) {
      return;
    }

    const customKey = [sandwichPreviewItem.id, includeSandwichDrink ? 'con-bebida' : 'sin-bebida'].join('|');
    const notas = includeSandwichDrink ? `Adición bebida: +${formatCOP(SANDWICH_DRINK_EXTRA_COST)}` : undefined;

    addToCart(sandwichPreviewItem, {
      customKey,
      notas,
      precioUnitario: sandwichPreviewItem.precio + (includeSandwichDrink ? SANDWICH_DRINK_EXTRA_COST : 0),
    });

    closeSandwichPreview();
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

  const toggleEmployeeSaladoTopping = (topping: string) => {
    setSelectedBowlToppings((prev) => {
      if (prev.includes(topping)) {
        return prev.filter((entry) => entry !== topping);
      }
      if (prev.length >= 2) {
        return prev;
      }
      if (EMPLOYEE_RESTRICTED_TOPPINGS.has(topping)) {
        const hasAnotherRestricted = prev.some((entry) => EMPLOYEE_RESTRICTED_TOPPINGS.has(entry));
        if (hasAnotherRestricted) {
          return prev;
        }
      }
      return [...prev, topping];
    });
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

      addToCart(bowlModalItem, {
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
      selectedBowlBases.length < (isEmployeeCajaMode ? 1 : BOWL_BASE_MIN) ||
      selectedBowlBases.length > (isEmployeeCajaMode ? 1 : BOWL_BASE_LIMIT) ||
      selectedBowlToppings.length < (isEmployeeCajaMode ? 2 : BOWL_TOPPING_MIN) ||
      (isEmployeeCajaMode && selectedBowlToppings.length > 2) ||
      (isEmployeeCajaMode && selectedBowlProteins.length !== 1)
    ) {
      return;
    }

    if (isEmployeeCajaMode) {
      const notas = [
        'Caja/Empleados',
        `Base: ${selectedBowlBases[0]}`,
        `Toppings: ${selectedBowlToppings.join(', ')}`,
        `Proteína: ${selectedBowlProteins[0]}`,
      ].join('\n');

      const customKey = [
        bowlModalItem.id,
        'empleados',
        selectedBowlBases[0],
        [...selectedBowlToppings].sort().join('-'),
        selectedBowlProteins[0],
      ].join('|');

      addToCart(bowlModalItem, {
        notas,
        customKey,
        bowlCustomization: {
          kind: 'salado',
          bases: [selectedBowlBases[0]],
          toppings: selectedBowlToppings,
          proteina: selectedBowlProteins[0],
          proteinas: [selectedBowlProteins[0]],
        },
        precioUnitario: EMPLOYEE_BOWL_PRICE,
      });

      setBowlModalItem(null);
      resetBowlSelections();
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

    addToCart(bowlModalItem, {
      notas,
      customKey,
      bowlCustomization: {
        kind: 'salado',
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

  const handleSelectedDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedDate(value || formatDateForInput(new Date()));
  };

  const handleProteinSelection = (protein: string) => {
    if (isEmployeeCajaMode) {
      setSelectedBowlProteins((prev) => (prev.includes(protein) ? [] : [protein]));
      return;
    }
    setSelectedBowlProteins((prev) => (prev.includes(protein) ? prev.filter((entry) => entry !== protein) : [...prev, protein]));
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCustomers();
    fetchEmpleados();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await dataService.fetchAppSettings();
        setDrinkDiscountEnabled(settings.drinkComboDiscountEnabled);
        setSandwichDiscountEnabled(settings.sandwichComboDiscountEnabled);
        setFollowerOrderDiscountEnabled(settings.followerOrderDiscountEnabled);
        setFollowerOrderDiscountPercent(settings.followerOrderDiscountPercent);
        setStudentProductDiscountEnabled(settings.studentProductDiscountEnabled);
        setStudentProductDiscountPercent(settings.studentProductDiscountPercent);
        setDrinkDiscountPercent(settings.drinkComboDiscountPercent);
        setSandwichDiscountPercent(settings.sandwichComboDiscountPercent);
        setDrinkDiscountCategories(settings.drinkComboDiscountCategories);
        setDrinkDiscountProductIds(settings.drinkComboDiscountProductIds);
      } catch (error) {
        console.error('No se pudo cargar la configuración de descuentos:', error);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (!followerOrderDiscountEnabled || cart.length === 0) {
      setApplyFollowerOrderDiscount(false);
    }
  }, [followerOrderDiscountEnabled, cart.length]);

  useEffect(() => {
    if (!studentProductDiscountEnabled) {
      setCart((prev) =>
        prev.map((entry) =>
          entry.studentDiscount ? { ...entry, studentDiscount: false } : entry
        )
      );
    }
  }, [studentProductDiscountEnabled]);

  const fetchMenuItems = async () => {
    const data = await dataService.fetchMenuItems();
    setMenuItems(data);
  };

  const fetchCustomers = async () => {
    const data = await dataService.fetchCustomers();
    setCustomers(data);
  };

  const fetchEmpleados = async () => {
    const data = await dataService.fetchEmpleados();
    setEmpleados(data);
  };

  const toggleCajaMode = () => {
    if (cart.length > 0) {
      const confirmed = window.confirm('Cambiar de modo vaciará el carrito actual. ¿Deseas continuar?');
      if (!confirmed) {
        return;
      }
    }
    const nextMode = !isEmployeeCajaMode;
    setIsEmployeeCajaMode(nextMode);
    setCart([]);
    setShowCheckout(false);
    setSearchQuery('');
    setSelectedCategory('');
    setCustomerName('');
    setSelectedCustomer(null);
    setEmployeeName('');
    setSelectedEmployee(null);
    setSandwichPreviewItem(null);
    setIncludeSandwichDrink(false);
    setBowlModalItem(null);
    setApplyFollowerOrderDiscount(false);
    resetBowlSelections();
  };

  const nonInventariableCategories = menuItems
    .filter(item => item.inventarioCategoria !== 'Inventariables')
    .map(item => item.categoria);
  const categories = Array.from(new Set(nonInventariableCategories));
  
  const filteredItems = menuItems.filter(item => {
    if (isEmployeeCajaMode && !isBowlSalado(item)) {
      return false;
    }
    const matchesSearch = !searchQuery ||
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.keywords && item.keywords.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = isEmployeeCajaMode ? true : (!selectedCategory || item.categoria === selectedCategory);
    const isNonInventariable = item.inventarioCategoria !== 'Inventariables';
    return matchesSearch && matchesCategory && isNonInventariable;
  });

  const getCartQuantity = (itemId: string) => {
    return cart
      .filter(({ item }) => item.id === itemId)
      .reduce((sum, cartItem) => sum + cartItem.cantidad, 0);
  };

  const hasBowlOrSandwichInCart = useMemo(
    () => cart.some((entry) => isBowlSalado(entry.item) || isBowlFrutal(entry.item) || isSandwichItem(entry.item)),
    [cart]
  );

  const shouldApplyDrinkDiscount = (category?: string): boolean => {
    if (!drinkDiscountEnabled) {
      return false;
    }
    const normalizedCategory = normalizeDrinkDiscountCategory(category);
    if (!isDiscountableDrinkCategory(normalizedCategory)) {
      return false;
    }
    return drinkDiscountCategories.includes(normalizedCategory);
  };

  const shouldApplyDrinkDiscountToItem = (item: MenuItem): boolean => {
    if (!shouldApplyDrinkDiscount(item.categoria)) {
      return false;
    }

    if (drinkDiscountProductIds.length === 0) {
      return true;
    }

    return drinkDiscountProductIds.includes(item.id);
  };

  const getSandwichBaseUnitPrice = (entry: CartItem): number => {
    const hasSandwichDrink = entry.customKey?.includes('con-bebida') ?? false;
    const basePrice = entry.item.precio + (hasSandwichDrink ? SANDWICH_DRINK_EXTRA_COST : 0);
    return Math.max(0, Math.round(basePrice));
  };

  const applyMealDrinkDiscount = (items: CartItem[]): CartItem[] => {
    const hasBowlOrSandwich = items.some((entry) => isBowlSalado(entry.item) || isBowlFrutal(entry.item) || isSandwichItem(entry.item));
    return items.map((entry) => {
      const isManagedDrink = isDiscountableDrinkCategory(entry.item.categoria);
      const isDiscountableDrink = shouldApplyDrinkDiscountToItem(entry.item);
      const isSandwich = isSandwichItem(entry.item);

      if (!isManagedDrink) {
        if (!isSandwich) {
          return entry;
        }

        const sandwichBasePrice = getSandwichBaseUnitPrice(entry);
        const shouldDiscountSandwich =
          sandwichDiscountEnabled &&
          sandwichDiscountRate > 0 &&
          isSandwich;

        if (!shouldDiscountSandwich) {
          return {
            ...entry,
            precioUnitario: sandwichBasePrice,
          };
        }

        const rawSandwichDiscount = sandwichBasePrice * sandwichDiscountRate;
        const roundedSandwichDiscount = roundDrinkDiscountAmount(rawSandwichDiscount);
        const discountedSandwichPrice = Math.max(0, sandwichBasePrice - roundedSandwichDiscount);

        return {
          ...entry,
          precioUnitario: discountedSandwichPrice,
        };
      }

      if (!hasBowlOrSandwich || !isDiscountableDrink) {
        return {
          ...entry,
          precioUnitario: entry.item.precio,
        };
      }

      const basePrice = Math.max(0, Math.round(entry.item.precio));
      const rawDiscount = basePrice * drinkDiscountRate;
      const roundedDiscount = roundDrinkDiscountAmount(rawDiscount);
      const discountedPrice = Math.max(0, basePrice - roundedDiscount);

      return {
        ...entry,
        precioUnitario: discountedPrice,
      };
    });
  };

  useEffect(() => {
    setCart((prev) => applyMealDrinkDiscount(prev));
  }, [drinkDiscountEnabled, sandwichDiscountEnabled, drinkDiscountPercent, sandwichDiscountPercent, drinkDiscountCategories, drinkDiscountProductIds]);

  const addToCart = (
    item: MenuItem,
    options?: {
      notas?: string;
      customKey?: string;
      bowlCustomization?: BowlCustomization;
      precioUnitario?: number;
    }
  ) => {
    setCart(prev => {
      const existing = prev.find(
        cartItem =>
          cartItem.item.id === item.id &&
          cartItem.customKey === options?.customKey
      );

      if (existing) {
        const updated = prev.map(cartItem =>
          cartItem.item.id === item.id && cartItem.customKey === options?.customKey
            ? { ...cartItem, cantidad: cartItem.cantidad + 1 }
            : cartItem
        );
        return applyMealDrinkDiscount(updated);
      }

      const updated = [
        ...prev,
        {
          item,
          cantidad: 1,
          notas: options?.notas,
          customKey: options?.customKey,
          bowlCustomization: options?.bowlCustomization,
          precioUnitario: typeof options?.precioUnitario === 'number' ? options.precioUnitario : item.precio,
          studentDiscount: false,
        },
      ];
      return applyMealDrinkDiscount(updated);
    });
    setSearchQuery('');
    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const updateQuantity = (
    itemId: string,
    customKey: string | undefined,
    cantidad: number
  ) => {
    if (cantidad <= 0) {
      setCart(prev =>
        applyMealDrinkDiscount(prev.filter(
          cartItem =>
            !(cartItem.item.id === itemId && cartItem.customKey === customKey)
        ))
      );
    } else {
      setCart(prev =>
        applyMealDrinkDiscount(prev.map(cartItem =>
          cartItem.item.id === itemId && cartItem.customKey === customKey
            ? { ...cartItem, cantidad }
            : cartItem
        ))
      );
    }
  };

  const removeFromCart = (itemId: string, customKey: string | undefined) => {
    setCart(prev =>
      applyMealDrinkDiscount(prev.filter(
        cartItem =>
          !(cartItem.item.id === itemId && cartItem.customKey === customKey)
      ))
    );
  };

  const isStudentDiscountEligible = (cartItem: CartItem): boolean => {
    return isSandwichItem(cartItem.item);
  };

  const toggleStudentDiscount = (itemId: string, customKey: string | undefined) => {
    if (!studentProductDiscountEnabled) {
      return;
    }

    setCart((prev) =>
      applyMealDrinkDiscount(
        prev.map((cartItem) => {
          if (cartItem.item.id !== itemId || cartItem.customKey !== customKey) {
            return cartItem;
          }
          if (!isStudentDiscountEligible(cartItem)) {
            return cartItem;
          }
          return {
            ...cartItem,
            studentDiscount: !cartItem.studentDiscount,
          };
        })
      )
    );
  };

  const isFrutalModal = bowlModalItem ? isBowlFrutal(bowlModalItem) : false;
  const baseLimitReached = selectedBowlBases.length >= (isFrutalModal ? BOWL_FRUTAL_BASE_LIMIT : (isEmployeeCajaMode ? 1 : BOWL_BASE_LIMIT));
  const toppingLimitReached = false;
  const selectedFrutalBase = selectedBowlBases[0] as keyof typeof BOWL_FRUTAL_BASE_PRICES | undefined;
  const hasFrutalBase = Boolean(selectedFrutalBase);
  const frutalBasePrice = selectedFrutalBase ? BOWL_FRUTAL_BASE_PRICES[selectedFrutalBase] ?? 0 : 0;
  const frutalExtraToppings = hasFrutalBase
    ? Math.max(0, selectedBowlToppings.length - BOWL_FRUTAL_TOPPING_INCLUDED)
    : selectedBowlToppings.length;
  const frutalExtrasCost = frutalExtraToppings * BOWL_FRUTAL_TOPPING_EXTRA_COST + (includeGreekYogurt ? BOWL_FRUTAL_YOGURT_COST : 0);
  const frutalPreviewPrice = frutalBasePrice + frutalExtrasCost;
  const saladoExtraToppings = Math.max(0, selectedBowlToppings.length - BOWL_TOPPING_LIMIT);
  const saladoExtraToppingsCost = saladoExtraToppings * BOWL_SALADO_TOPPING_EXTRA_COST;
  const employeeRestrictedToppingsCount = selectedBowlToppings.filter((topping) => EMPLOYEE_RESTRICTED_TOPPINGS.has(topping)).length;
  const isEmployeeBowlValid =
    selectedBowlBases.length === 1 &&
    selectedBowlToppings.length === 2 &&
    selectedBowlProteins.length === 1 &&
    employeeRestrictedToppingsCount <= 1;
  const saladoPreviewPrice = bowlModalItem
    ? isEmployeeCajaMode
      ? EMPLOYEE_BOWL_PRICE
      : bowlModalItem.precio +
      saladoExtraToppingsCost +
      getBowlSaladoProteinExtraCost(selectedBowlProteins.includes('Atún') ? 'Atún' : null) +
      getBowlSaladoAdditionalProteinsCost(selectedBowlProteins) +
      getBowlSaladoComboExtraCost(includeSaladoCombo)
    : 0;
  const isBowlSelectionValid = isFrutalModal
    ? selectedBowlBases.length >= BOWL_FRUTAL_BASE_MIN &&
      selectedBowlBases.length <= BOWL_FRUTAL_BASE_LIMIT &&
      selectedBowlToppings.length >= BOWL_FRUTAL_TOPPING_MIN
    : isEmployeeCajaMode
      ? isEmployeeBowlValid
      : selectedBowlBases.length >= BOWL_BASE_MIN &&
          selectedBowlBases.length <= BOWL_BASE_LIMIT &&
          selectedBowlToppings.length >= BOWL_TOPPING_MIN;

  const subtotal = calculateCartTotal(cart);
  const followerDiscountRate = followerOrderDiscountPercent / 100;
  const followerDiscountAmount = followerOrderDiscountEnabled && applyFollowerOrderDiscount
    ? Math.max(0, Math.round(subtotal * followerDiscountRate))
    : 0;
  const total = Math.max(0, subtotal - followerDiscountAmount);

  const ordersForSelectedDate = useMemo(
    () => orders.filter(order => doesTimestampMatchDateKey(order.timestamp, selectedDate)),
    [orders, selectedDate]
  );

  const selectedDateLabel = useMemo(
    () => formatDateKeyForDisplay(selectedDate),
    [selectedDate]
  );

  const pendingPaymentOrders = [...ordersForSelectedDate]
    .filter(order =>
      order.estado === 'entregado' &&
      !isOrderPaid(order) &&
      order.metodoPago !== 'credito_empleados'
    )
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const pendingPaymentCount = pendingPaymentOrders.length;

  const submitOrder = async () => {
    if (cart.length === 0 || isSubmittingOrder) return;

    let customer = selectedCustomer;
    let customerId: string | undefined;
    const trimmedCustomerName = customerName.trim();
    const trimmedEmployeeName = employeeName.trim();

    setIsSubmittingOrder(true);

    try {
      if (isEmployeeCajaMode) {
        if (!selectedEmployee || selectedEmployee.nombre !== trimmedEmployeeName) {
          alert('Debes seleccionar un empleado de la lista para continuar.');
          return;
        }
      } else if (!customer && trimmedCustomerName) {
        const existing = customers.find(
          c => c.nombre.toLowerCase() === trimmedCustomerName.toLowerCase()
        );
        if (existing) {
          customer = existing;
          customerId = existing.id;
        } else {
          const telefono = window.prompt('Ingrese teléfono del cliente');
          if (!telefono) {
            alert('Debe ingresar un teléfono para continuar');
            return;
          }

          const newCustomer: Customer = {
            id: crypto.randomUUID(),
            nombre: trimmedCustomerName,
            telefono: telefono.trim(),
          };

          const newCustomerData = await dataService.createCustomer(newCustomer);
          customer = newCustomerData;
          customerId = newCustomerData.id;
          setCustomers(prevCustomers => [...prevCustomers, newCustomerData]);
        }
      } else if (customer) {
        customerId = customer.id;
      }

      const orderCustomerName = customer?.nombre ?? (trimmedCustomerName || undefined);
      const orderEmployeeName = selectedEmployee?.nombre ?? trimmedEmployeeName;
      const employeeCreditAssignedAt = new Date();

      const order: Order = {
        id: crypto.randomUUID(),
        numero: generateOrderNumber(orders.map((entry) => entry.numero)),
        items: cart,
        total,
        estado: 'pendiente',
        timestamp: createTimestampForDateKey(selectedDate),
        cliente_id: isEmployeeCajaMode ? undefined : customerId,
        cliente: isEmployeeCajaMode ? `Empleado: ${orderEmployeeName}` : orderCustomerName,
        metodoPago: isEmployeeCajaMode ? 'credito_empleados' : undefined,
        paymentStatus: 'pendiente',
        paymentAllocations: [],
        creditInfo: isEmployeeCajaMode
          ? {
              type: 'empleados',
              amount: Math.max(0, Math.round(total)),
              assignedAt: employeeCreditAssignedAt,
              employeeId: selectedEmployee?.id,
              employeeName: orderEmployeeName,
            }
          : undefined,
      };

      await onCreateOrder(order);

      setCart([]);
      setShowCheckout(false);
      setApplyFollowerOrderDiscount(false);
      setCustomerName('');
      setSelectedCustomer(null);
      setEmployeeName('');
      setSelectedEmployee(null);
      onModuleChange('comandas');
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      alert('No se pudo crear el pedido. Inténtalo nuevamente.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleOpenPaymentModal = (order: Order) => {
    if (isOrderPaid(order)) {
      return;
    }
    setPaymentModalOrder(order);
  };

  const handlePaymentModalClose = () => {
    if (!isRecordingPayment) {
      setPaymentModalOrder(null);
    }
  };

  const handleSubmitPayment = async (allocations: PaymentAllocation[]) => {
    if (!paymentModalOrder) {
      return;
    }

    try {
      setIsRecordingPayment(true);
      await onRecordOrderPayment(paymentModalOrder, allocations);
      setPaymentModalOrder(null);
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      alert('No se pudo registrar el pago. Inténtalo nuevamente.');
    } finally {
      setIsRecordingPayment(false);
    }
  };

  const handleAssignCredit = async (options: { employeeId: string; amount: number; employeeName?: string }) => {
    if (!paymentModalOrder) {
      return;
    }

    try {
      setIsRecordingPayment(true);
      await onAssignOrderCredit(paymentModalOrder, options);
      setPaymentModalOrder(null);
    } catch (error) {
      console.error('Error al asignar el pedido a crédito de empleados:', error);
      alert('No se pudo asignar el crédito. Inténtalo nuevamente.');
    } finally {
      setIsRecordingPayment(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4">
        {/* Panel de productos */}
        <div className="order-2 space-y-4 min-w-0">
          <div className="rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm p-3 sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
              <h2 className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.dark }}>
                {isEmployeeCajaMode ? 'Caja/Empleados' : 'Punto de Venta'}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={toggleCajaMode}
                  className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
                >
                  {isEmployeeCajaMode ? 'Volver a Caja' : 'Ir a Caja/Empleados'}
                </button>
                <label htmlFor="caja-date" className="text-sm font-medium text-gray-600">
                  Fecha del registro
                </label>
                <input
                  id="caja-date"
                  type="date"
                  value={selectedDate}
                  onChange={handleSelectedDateChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-base sm:text-sm"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Búsqueda y filtros */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-base sm:text-sm"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                />
              </div>
              {!isEmployeeCajaMode && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-base sm:text-sm w-full lg:w-auto"
                  style={{ '--tw-ring-color': COLORS.accent } as React.CSSProperties}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
              <span>
                {filteredItems.length} productos visibles
              </span>
              {!isEmployeeCajaMode && selectedCategory && (
                <span>Categoría: {selectedCategory}</span>
              )}
            </div>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {filteredItems.map((item) => {
              const quantity = getCartQuantity(item.id);
              const isSelected = quantity > 0;
              const shouldHighlightDrinkDiscount = hasBowlOrSandwichInCart && shouldApplyDrinkDiscountToItem(item);
              const shouldHighlightSandwichDiscount =
                sandwichDiscountEnabled &&
                sandwichDiscountRate > 0 &&
                isSandwichItem(item);
              const shouldHighlightDiscount = shouldHighlightDrinkDiscount || shouldHighlightSandwichDiscount;
              const discountRate = shouldHighlightSandwichDiscount ? sandwichDiscountRate : drinkDiscountRate;
              const discountPercentLabel = shouldHighlightSandwichDiscount
                ? sandwichDiscountLabel
                : drinkDiscountLabel;
              const effectiveDiscountAmount = shouldHighlightDiscount
                ? roundDrinkDiscountAmount(item.precio * discountRate)
                : 0;
              const productDiscountedPrice = Math.max(0, item.precio - effectiveDiscountAmount);

              return (
                <div
                  key={item.id}
                  className={`relative bg-white rounded-xl p-3 lg:p-4 shadow-sm hover:shadow-md transition-all duration-200 border ${
                    shouldHighlightDiscount
                      ? 'bg-emerald-50 border-emerald-300'
                      : isSelected
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm lg:text-base" style={{ color: COLORS.dark }}>
                      {item.nombre}
                    </h3>
                    <div className="text-right">
                      {shouldHighlightDiscount ? (
                        <>
                          <p className="text-xs text-gray-500 line-through">{formatCOP(item.precio)}</p>
                          <p className="font-bold text-sm lg:text-base" style={{ color: COLORS.accent }}>
                            {formatCOP(productDiscountedPrice)}
                          </p>
                          <p className="text-[11px] font-semibold text-red-600">
                            -{formatCOP(effectiveDiscountAmount)}
                          </p>
                        </>
                      ) : (
                        <span className="font-bold text-sm lg:text-base" style={{ color: COLORS.accent }}>
                          {formatCOP(item.precio)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{item.categoria}</p>
                  {shouldHighlightDiscount && (
                    <p className="text-xs font-medium text-red-600 mb-1">
                      {shouldHighlightSandwichDiscount
                        ? `Descuento sandwich aplicado (${discountPercentLabel}%)`
                        : `Descuento combo bowl/sandwich aplicado (${discountPercentLabel}%)`}
                    </p>
                  )}
                  {item.descripcion && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.descripcion}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Stock: {item.stock}</span>
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span
                          className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-semibold text-white shadow-sm"
                          style={{ backgroundColor: COLORS.accent }}
                        >
                          {quantity}
                        </span>
                      )}
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={item.inventarioCategoria === 'Inventariables' && item.stock === 0}
                        className="px-3 lg:px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ backgroundColor: COLORS.dark }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel del carrito */}
        <div className="order-1 space-y-4">
          <div className="ui-card ui-card-pad">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart size={24} style={{ color: COLORS.dark }} />
              <h3 className="text-lg lg:text-xl font-bold" style={{ color: COLORS.dark }}>
                Carrito
              </h3>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-6 lg:py-8 text-sm">Carrito vacío</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mb-4 lg:mb-6">
                  {cart.map((cartItem) => (
                    <div
                      key={`${cartItem.item.id}-${cartItem.customKey ?? 'default'}`}
                      className={`rounded-lg p-3 space-y-2 h-full ${
                        (hasBowlOrSandwichInCart && shouldApplyDrinkDiscountToItem(cartItem.item)) ||
                        (sandwichDiscountEnabled && sandwichDiscountRate > 0 && isSandwichItem(cartItem.item))
                          ? 'bg-emerald-50 border border-emerald-200'
                          : 'bg-gray-50'
                      }`}
                    >
                      {(() => {
                        const isDiscountedDrink = hasBowlOrSandwichInCart && shouldApplyDrinkDiscountToItem(cartItem.item);
                        const isDiscountedSandwich =
                          sandwichDiscountEnabled &&
                          sandwichDiscountRate > 0 &&
                          isSandwichItem(cartItem.item);
                        const originalUnitPrice = isDiscountedSandwich
                          ? getSandwichBaseUnitPrice(cartItem)
                          : cartItem.item.precio;
                        const effectiveUnitPrice = getCartItemEffectiveUnitPrice(cartItem);
                        const effectiveSubtotal = getCartItemSubtotal(cartItem);
                        const originalSubtotal = originalUnitPrice * cartItem.cantidad;
                        const subtotalDiscount = Math.max(0, originalSubtotal - effectiveSubtotal);

                        return (
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm">{cartItem.item.nombre}</h4>
                            <div className="text-right">
                              <span className="text-xs font-semibold text-gray-700">
                                Subtotal: {formatCOP(effectiveSubtotal)}
                              </span>
                              {isDiscountedDrink && subtotalDiscount > 0 && (
                                <>
                                  <p className="text-[11px] text-gray-500">Real: {formatCOP(originalSubtotal)}</p>
                                  <p className="text-[11px] font-semibold text-red-600">Descuento: -{formatCOP(subtotalDiscount)}</p>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600">
                            Precio unidad:{' '}
                            {isDiscountedDrink || isDiscountedSandwich ? (
                              <>
                                <span className="line-through text-gray-400 mr-2">
                                  {formatCOP(originalUnitPrice)}
                                </span>
                                <span className="font-semibold text-green-700">
                                  {formatCOP(effectiveUnitPrice)}
                                </span>
                              </>
                            ) : cartItem.studentDiscount ? (
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
                          {cartItem.studentDiscount && (
                            <span className="inline-flex items-center text-[11px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                              {`Descuento estudiante ${studentProductDiscountPercent}%`}
                            </span>
                          )}
                          {isDiscountedDrink && subtotalDiscount > 0 && (
                            <span className="inline-flex items-center text-[11px] font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                              {`Descuento bebida ${drinkDiscountLabel}%`}
                            </span>
                          )}
                          {isDiscountedSandwich && subtotalDiscount > 0 && (
                            <span className="inline-flex items-center text-[11px] font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                              {`Descuento sandwich ${sandwichDiscountLabel}%`}
                            </span>
                          )}
                          {cartItem.notas && (
                            <p className="text-xs text-gray-500 whitespace-pre-line">
                              {cartItem.notas}
                            </p>
                          )}
                          {studentProductDiscountEnabled && isStudentDiscountEligible(cartItem) && (
                            <button
                              onClick={() => toggleStudentDiscount(cartItem.item.id, cartItem.customKey)}
                              className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                                cartItem.studentDiscount
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }`}
                            >
                              {cartItem.studentDiscount ? 'Quitar descuento' : 'Aplicar descuento estudiante'}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 self-start">
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.customKey, cartItem.cantidad - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-medium">{cartItem.cantidad}</span>
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.customKey, cartItem.cantidad + 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white hover:opacity-90"
                            style={{ backgroundColor: COLORS.dark }}
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => removeFromCart(cartItem.item.id, cartItem.customKey)}
                            className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  {followerOrderDiscountEnabled && (
                    <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 mb-3 cursor-pointer">
                      <span className="text-sm font-medium text-gray-700">
                        Aplicar descuento seguidor ({followerOrderDiscountPercent}%)
                      </span>
                      <input
                        type="checkbox"
                        checked={applyFollowerOrderDiscount}
                        onChange={(event) => setApplyFollowerOrderDiscount(event.target.checked)}
                      />
                    </label>
                  )}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-medium">{formatCOP(subtotal)}</span>
                    </div>
                    {followerDiscountAmount > 0 && (
                      <div className="flex justify-between items-center text-sm text-red-600">
                        <span>Descuento seguidor:</span>
                        <span className="font-semibold">-{formatCOP(followerDiscountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.accent }}>
                        {formatCOP(total)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 text-base"
                    style={{ backgroundColor: COLORS.dark }}
                  >
                    Enviar a comanda
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {pendingPaymentOrders.length > 0 && (
          <div className="ui-card ui-card-pad space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg lg:text-xl font-bold" style={{ color: COLORS.dark }}>
                  Pagos de pedidos entregados
                </h3>
                <p className="text-sm text-gray-500">
                  {pendingPaymentCount === 1
                    ? '1 pago pendiente por registrar'
                    : `${pendingPaymentCount} pagos pendientes por registrar`}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Fecha seleccionada: {selectedDateLabel}
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {pendingPaymentOrders.map((order) => {
                const allocations = getOrderAllocations(order);
                const paymentSummary = formatPaymentSummary(allocations, formatCOP);

                return (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                          Pedido #{order.numero}
                        </p>
                        {order.cliente && (
                          <p className="text-xs text-gray-500">Cliente: {order.cliente}</p>
                        )}
                      </div>
                      <span className="text-sm font-bold" style={{ color: COLORS.accent }}>
                        {formatCOP(order.total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-800">
                        Pago pendiente
                      </span>
                      <span className="text-gray-500 text-right flex-1 ml-3 line-clamp-2">
                        {paymentSummary}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenPaymentModal(order)}
                      className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                      Registrar pago
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {sandwichPreviewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-md">
            <h3 className="text-lg lg:text-xl font-bold mb-2" style={{ color: COLORS.dark }}>
              Preview Sandwich
            </h3>
            <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
              {sandwichPreviewItem.nombre}
            </p>
            <p className="text-xs text-gray-500 mb-3">{sandwichPreviewItem.categoria}</p>
            {sandwichPreviewItem.descripcion && (
              <p className="text-sm text-gray-600 mb-4">{sandwichPreviewItem.descripcion}</p>
            )}

            <div className="rounded-lg border border-gray-200 p-3 space-y-2">
              <p className="text-sm text-gray-700">
                Precio base: <span className="font-semibold">{formatCOP(sandwichPreviewItem.precio)}</span>
              </p>
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                  Agregar bebida
                </span>
                <input
                  type="checkbox"
                  checked={includeSandwichDrink}
                  onChange={(e) => setIncludeSandwichDrink(e.target.checked)}
                />
              </label>
              <p className="text-xs text-gray-500">
                Bebida adicional: {includeSandwichDrink ? formatCOP(SANDWICH_DRINK_EXTRA_COST) : formatCOP(0)}
              </p>
              <p className="text-sm font-semibold" style={{ color: COLORS.accent }}>
                Precio final: {formatCOP(sandwichPreviewItem.precio + (includeSandwichDrink ? SANDWICH_DRINK_EXTRA_COST : 0))}
              </p>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={closeSandwichPreview}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSandwichPreview}
                className="flex-1 py-2 rounded-lg text-white font-semibold text-sm"
                style={{ backgroundColor: COLORS.dark }}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal personalización Bowls */}
      {bowlModalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg lg:text-xl font-bold" style={{ color: COLORS.dark }}>
                  {isFrutalModal ? 'Personaliza tu Bowl Frutal' : 'Personaliza tu Bowl Salado'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isFrutalModal
                    ? `Base opcional. Sin base: cada topping suma +${formatCOP(BOWL_FRUTAL_TOPPING_EXTRA_COST)}. Con base: incluye ${BOWL_FRUTAL_TOPPING_INCLUDED} toppings y desde el 5to suma +${formatCOP(BOWL_FRUTAL_TOPPING_EXTRA_COST)}. Yogurt griego +${formatCOP(BOWL_FRUTAL_YOGURT_COST)}.`
                    : isEmployeeCajaMode
                      ? `Regla Caja/Empleados: selecciona 1 base, 2 toppings y 1 proteína. Entre Champiñones, Tocineta y Guacamole solo se permite 1. Precio fijo: ${formatCOP(EMPLOYEE_BOWL_PRICE)}.`
                      : `Selecciona entre ${BOWL_BASE_MIN} y ${BOWL_BASE_LIMIT} bases, mínimo ${BOWL_TOPPING_MIN} toppings. Desde el topping 5: +${formatCOP(BOWL_SALADO_TOPPING_EXTRA_COST)} c/u. La proteína es opcional.`}
                </p>
              </div>
              <button
                onClick={closeBowlModal}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                    Elige tu base
                  </h4>
                  <span className="text-xs text-gray-500">
                    {selectedBowlBases.length}/{isFrutalModal ? BOWL_FRUTAL_BASE_LIMIT : (isEmployeeCajaMode ? 1 : BOWL_BASE_LIMIT)}
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
                            isFrutalModal ? BOWL_FRUTAL_BASE_LIMIT : (isEmployeeCajaMode ? 1 : BOWL_BASE_LIMIT)
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
                    {isFrutalModal ? '' : (isEmployeeCajaMode ? '/2' : ` (incluye ${BOWL_TOPPING_LIMIT})`)}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(isFrutalModal ? BOWL_FRUTAL_TOPPING_OPTIONS : BOWL_TOPPING_OPTIONS).map((topping) => {
                    const selected = selectedBowlToppings.includes(topping);
                    const hasRestrictedSelected = selectedBowlToppings.some((entry) => EMPLOYEE_RESTRICTED_TOPPINGS.has(entry));
                    const disabledByEmployeeRule =
                      !isFrutalModal &&
                      isEmployeeCajaMode &&
                      !selected &&
                      (
                        selectedBowlToppings.length >= 2 ||
                        (EMPLOYEE_RESTRICTED_TOPPINGS.has(topping) && hasRestrictedSelected)
                      );
                    const disabled = !selected && (toppingLimitReached || disabledByEmployeeRule);
                    return (
                      <button
                        key={topping}
                        type="button"
                        onClick={() => {
                          if (!isFrutalModal && isEmployeeCajaMode) {
                            toggleEmployeeSaladoTopping(topping);
                            return;
                          }
                          toggleBowlOption(
                            topping,
                            selectedBowlToppings,
                            setSelectedBowlToppings,
                            isFrutalModal ? 99 : BOWL_TOPPING_OPTIONS.length
                          );
                        }}
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
                        Elige tu proteína {isEmployeeCajaMode ? '' : '(opcional)'}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {BOWL_PROTEIN_OPTIONS.filter((protein) => !isEmployeeCajaMode || EMPLOYEE_ALLOWED_PROTEINS.has(protein)).map((protein) => {
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
                    {!isEmployeeCajaMode && (
                      <>
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
                      </>
                    )}
                    {isEmployeeCajaMode && (
                      <p className="text-xs text-gray-500">
                        Entre Champiñones, Tocineta y Guacamole solo puedes elegir uno.
                      </p>
                    )}
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
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de pago */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg lg:text-xl font-bold mb-4" style={{ color: COLORS.dark }}>
              Confirmar pedido
            </h3>

            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-2">
                  {isEmployeeCajaMode ? 'Empleado' : 'Cliente (opcional)'}
                </label>
                <input
                  type="text"
                  value={isEmployeeCajaMode ? employeeName : customerName}
                  onChange={(e) => {
                    if (isEmployeeCajaMode) {
                      setEmployeeName(e.target.value);
                      setSelectedEmployee(null);
                    } else {
                      setCustomerName(e.target.value);
                      setSelectedCustomer(null);
                    }
                  }}
                  placeholder={isEmployeeCajaMode ? 'Nombre del empleado' : 'Nombre del cliente'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent pr-10 text-sm"
                  readOnly={isEmployeeCajaMode ? !!selectedEmployee : !!selectedCustomer}
                />
                {(isEmployeeCajaMode ? selectedEmployee : selectedCustomer) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isEmployeeCajaMode) {
                        setSelectedEmployee(null);
                      } else {
                        setSelectedCustomer(null);
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                {(isEmployeeCajaMode ? employeeName : customerName) && !(isEmployeeCajaMode ? selectedEmployee : selectedCustomer) && (
                  <div
                    className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-32 sm:max-h-40 overflow-y-auto"
                  >
                    {(isEmployeeCajaMode ? empleados : customers)
                      .filter((entry) =>
                        entry.nombre.toLowerCase().includes((isEmployeeCajaMode ? employeeName : customerName).toLowerCase())
                      )
                      .map((entry) => (
                        <button
                          key={entry.id}
                          onClick={() => {
                            if (isEmployeeCajaMode) {
                              setEmployeeName(entry.nombre);
                              setSelectedEmployee(entry as Empleado);
                            } else {
                              setCustomerName(entry.nombre);
                              setSelectedCustomer(entry as Customer);
                            }
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                          {entry.nombre}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Fecha del pedido:</span>{' '}
                {selectedDateLabel}
              </div>

              <div className="pt-4 border-t">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCOP(subtotal)}</span>
                  </div>
                  {followerDiscountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-red-600">
                      <span>Descuento seguidor ({followerOrderDiscountPercent}%):</span>
                      <span className="font-semibold">-{formatCOP(followerDiscountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total a pagar:</span>
                    <span className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.accent }}>
                      {formatCOP(total)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCheckout(false)}
                    disabled={isSubmittingOrder}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={submitOrder}
                    disabled={isSubmittingOrder}
                    className="flex-1 py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: COLORS.dark }}
                  >
                    {isSubmittingOrder ? 'Procesando...' : 'Confirmar pedido'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentModalOrder && (
        <PaymentModal
          order={paymentModalOrder}
          onClose={handlePaymentModalClose}
          onSubmit={handleSubmitPayment}
          isSubmitting={isRecordingPayment}
          title="Gestionar pago"
          onAssignCredit={handleAssignCredit}
        />
      )}
    </section>
  );
}
