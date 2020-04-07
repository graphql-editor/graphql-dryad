import { useState, useEffect } from 'react';

export interface ThrottledState<T> {
  /**
   * Specify value to which assignement is delayed.
   */
  value?: T;
  delay?: number;
}

/**
 * Delay assignement of variable by throttle
 */
export function useThrottledState<T>(props: ThrottledState<T>) {
  const { value, delay = 3000 } = props;
  const [state, setState] = useState(value);
  const [t, setT] = useState<number>();
  const setThrottledState = (throttledState?: T) => {
    setT((timeout) => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
      return window.setTimeout(() => {
        setState(throttledState);
      }, delay);
    });
  };
  const forceSetState = (value?: T) => {
    if (t) {
      window.clearTimeout(t);
    }
    setState(value);
  };
  useEffect(() => {
    setThrottledState(value);
  }, [value]);
  return [state, forceSetState] as const;
}
