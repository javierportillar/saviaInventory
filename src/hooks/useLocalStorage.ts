import { useState, useEffect } from 'react';
import { getLocalData, setLocalData } from '../data/localData';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getLocalData(`savia-${key}`, initialValue);
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    setLocalData(`savia-${key}`, valueToStore);
  };

  return [storedValue, setValue] as const;
}
