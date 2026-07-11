'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Configuration options for progressive loading
 */
interface ProgressiveLoadingOptions {
  batchSize?: number;
  delay?: number;
  initialDelay?: number;
  animationsEnabled?: boolean;
}

/**
 * Custom hook for progressive loading with staggered animations
 */
export function useProgressiveLoading<T>(items: T[] = [], options: ProgressiveLoadingOptions = {}) {
  const {
    batchSize = 5,
    delay = 100,
    initialDelay = 0,
    animationsEnabled = true,
  } = options;

  const [loadedItems, setLoadedItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const loadNextBatch = useCallback(async () => {
    if (loadedItems.length >= items.length) {
      setIsLoading(false);
      return;
    }

    const nextBatch = items.slice(loadedItems.length, loadedItems.length + batchSize);

    if (animationsEnabled && delay > 0) {
      // Load items one by one with stagger effect
      for (let i = 0; i < nextBatch.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        setLoadedItems((prev) => {
          // Prevent duplicates if already loaded
          const newItems = [...prev];
          if (!newItems.includes(nextBatch[i])) {
            newItems.push(nextBatch[i]);
          }
          return newItems;
        });
        setLoadingProgress(((loadedItems.length + i + 1) / items.length) * 100);
      }
    } else {
      // Load batch immediately
      setLoadedItems((prev) => [...prev, ...nextBatch]);
      setLoadingProgress(((loadedItems.length + nextBatch.length) / items.length) * 100);
    }
  }, [items, loadedItems.length, batchSize, delay, animationsEnabled]);

  const reset = useCallback(() => {
    setLoadedItems([]);
    setIsLoading(true);
    setLoadingProgress(0);
  }, []);

  const loadAll = useCallback(() => {
    setLoadedItems(items);
    setIsLoading(false);
    setLoadingProgress(100);
  }, [items]);

  useEffect(() => {
    if (items.length === 0) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      loadNextBatch();
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [items.length, initialDelay, loadNextBatch]);

  useEffect(() => {
    if (loadedItems.length > 0 && loadedItems.length < items.length) {
      const timer = setTimeout(loadNextBatch, delay);
      return () => clearTimeout(timer);
    }
  }, [loadedItems.length, items.length, loadNextBatch, delay]);

  return {
    loadedItems,
    isLoading,
    loadingProgress,
    totalItems: items.length,
    loadedCount: loadedItems.length,
    hasMore: loadedItems.length < items.length,
    reset,
    loadAll,
    loadNextBatch,
  };
}

/**
 * Configuration options for optimistic updates
 */
interface OptimisticUpdateOptions<T> {
  timeout?: number;
  retryCount?: number;
  onSuccess?: (data: T, isOptimistic: boolean) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for optimistic updates with rollback capability
 */
export function useOptimisticUpdate<T, P>(
  updateFunction: (payload: P) => Promise<T>,
  options: OptimisticUpdateOptions<T> = {}
) {
  const { timeout = 5000, retryCount = 3, onSuccess = () => {}, onError = () => {} } = options;

  const [isOptimistic, setIsOptimistic] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const performUpdate = useCallback(
    async (optimisticData: T, actualUpdateData: P) => {
      setIsOptimistic(true);
      setError(null);

      // Show optimistic update immediately
      if (optimisticData) {
        onSuccess(optimisticData, true);
      }

      let attempts = 0;
      const attemptUpdate = async (): Promise<T> => {
        try {
          const result = (await Promise.race([
            updateFunction(actualUpdateData),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
          ])) as T;

          setIsOptimistic(false);
          onSuccess(result, false);
          return result;
        } catch (err: any) {
          attempts++;
          if (attempts < retryCount) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
            return attemptUpdate();
          } else {
            setIsOptimistic(false);
            setError(err);
            onError(err);
            throw err;
          }
        }
      };

      return attemptUpdate();
    },
    [updateFunction, timeout, retryCount, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setIsOptimistic(false);
    setError(null);
  }, []);

  return {
    performUpdate,
    isOptimistic,
    error,
    reset,
  };
}

/**
 * Configuration options for staggered animations
 */
interface StaggeredAnimationOptions {
  delay?: number;
  duration?: number;
  startDelay?: number;
  animationsEnabled?: boolean;
}

/**
 * Custom hook for staggered animations
 */
export function useStaggeredAnimation(count: number, options: StaggeredAnimationOptions = {}) {
  const { delay = 50, duration = 300, startDelay = 0, animationsEnabled = true } = options;

  const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set());

  const getAnimationDelay = useCallback(
    (index: number) => {
      if (!animationsEnabled) return '0s';
      return `${startDelay + index * delay}ms`;
    },
    [animationsEnabled, startDelay, delay]
  );

  const getAnimationStyle = useCallback(
    (index: number, extraStyles: React.CSSProperties = {}) => {
      return {
        animationDelay: getAnimationDelay(index),
        animationDuration: `${duration}ms`,
        animationFillMode: 'forwards' as any,
        ...extraStyles,
      };
    },
    [getAnimationDelay, duration]
  );

  const markAsAnimated = useCallback((index: number) => {
    setAnimatedItems((prev) => new Set([...prev, index]));
  }, []);

  const isAnimated = useCallback(
    (index: number) => {
      return animatedItems.has(index);
    },
    [animatedItems]
  );

  const reset = useCallback(() => {
    setAnimatedItems(new Set());
  }, []);

  useEffect(() => {
    if (animationsEnabled && count > 0) {
      const timers = Array.from({ length: count }, (_, index) => {
        return setTimeout(() => {
          markAsAnimated(index);
        }, startDelay + index * delay + duration);
      });

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [count, animationsEnabled, startDelay, delay, duration, markAsAnimated]);

  return {
    getAnimationDelay,
    getAnimationStyle,
    markAsAnimated,
    isAnimated,
    reset,
    animatedItems,
  };
}
