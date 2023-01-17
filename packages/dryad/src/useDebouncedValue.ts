import { useEffect, useRef, useState } from 'react';

export const useDebouncedValue = <T>(value: T, delay?: number) => {
  const timeoutRef = useRef<number>();
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const debounce = (fn: Function) => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(fn, delay || 300);
      };
    };
    debounce(() => {
      setDebouncedValue(value);
    })();
  }, [value]);

  return debouncedValue;
};
