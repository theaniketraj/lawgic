import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for progressive loading with staggered animations
 * @param {Array} items - Array of items to load progressively
 * @param {Object} options - Configuration options
 * @returns {Object} - Loading state and controls
 */
export const useProgressiveLoading = (items = [], options = {}) => {
  const {
    batchSize = 5,
    delay = 100,
    initialDelay = 0,
    animationsEnabled = true,
  } = options;

  const [loadedItems, setLoadedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const loadNextBatch = useCallback(async () => {
    if (loadedItems.length >= items.length) {
      setIsLoading(false);
      return;
    }

    const nextBatch = items.slice(
      loadedItems.length,
      loadedItems.length + batchSize
    );

    if (animationsEnabled && delay > 0) {
      // Load items one by one with stagger effect
      for (let i = 0; i < nextBatch.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        setLoadedItems((prev) => [...prev, nextBatch[i]]);
        setLoadingProgress(((loadedItems.length + i + 1) / items.length) * 100);
      }
    } else {
      // Load batch immediately
      setLoadedItems((prev) => [...prev, ...nextBatch]);
      setLoadingProgress(
        ((loadedItems.length + nextBatch.length) / items.length) * 100
      );
    }
  }, [items, loadedItems, batchSize, delay, animationsEnabled]);

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
};

/**
 * Custom hook for optimistic updates with rollback capability
 * @param {Function} updateFunction - Function to perform the actual update
 * @param {Object} options - Configuration options
 * @returns {Object} - Optimistic update controls
 */
export const useOptimisticUpdate = (updateFunction, options = {}) => {
  const {
    timeout = 5000,
    retryCount = 3,
    onSuccess = () => {},
    onError = () => {},
  } = options;

  const [isOptimistic, setIsOptimistic] = useState(false);
  const [error, setError] = useState(null);

  const performUpdate = useCallback(
    async (optimisticData, actualUpdateData) => {
      setIsOptimistic(true);
      setError(null);

      // Show optimistic update immediately
      if (optimisticData) {
        onSuccess(optimisticData, true);
      }

      let attempts = 0;
      const attemptUpdate = async () => {
        try {
          const result = await Promise.race([
            updateFunction(actualUpdateData),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), timeout)
            ),
          ]);

          setIsOptimistic(false);
          onSuccess(result, false);
          return result;
        } catch (err) {
          attempts++;
          if (attempts < retryCount) {
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * attempts)
            );
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
};

/**
 * Custom hook for staggered animations
 * @param {number} count - Number of items to animate
 * @param {Object} options - Animation options
 * @returns {Object} - Animation utilities
 */
export const useStaggeredAnimation = (count, options = {}) => {
  const {
    delay = 50,
    duration = 300,
    startDelay = 0,
    animationsEnabled = true,
  } = options;

  const [animatedItems, setAnimatedItems] = useState(new Set());

  const getAnimationDelay = useCallback(
    (index) => {
      if (!animationsEnabled) return "0s";
      return `${startDelay + index * delay}ms`;
    },
    [animationsEnabled, startDelay, delay]
  );

  const getAnimationStyle = useCallback(
    (index, extraStyles = {}) => {
      return {
        animationDelay: getAnimationDelay(index),
        animationDuration: `${duration}ms`,
        animationFillMode: "forwards",
        ...extraStyles,
      };
    },
    [getAnimationDelay, duration]
  );

  const markAsAnimated = useCallback((index) => {
    setAnimatedItems((prev) => new Set([...prev, index]));
  }, []);

  const isAnimated = useCallback(
    (index) => {
      return animatedItems.has(index);
    },
    [animatedItems]
  );

  const reset = useCallback(() => {
    setAnimatedItems(new Set());
  }, []);

  useEffect(() => {
    // Auto-mark items as animated based on their delay
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
};

export default {
  useProgressiveLoading,
  useOptimisticUpdate,
  useStaggeredAnimation,
};
