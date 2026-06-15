// shared/utils/useSwipe.ts

'use client';

import { useRef, useCallback, RefObject } from 'react';

/**
 * ==========================================
 * TYPES
 * ==========================================
 */
interface UseSwipeOptions {
  /** Kecepatan scroll, semakin tinggi semakin cepat (default: 1) */
  speed?: number;
}

interface UseSwipeReturn<T extends HTMLElement> {
  containerRef: RefObject<T | null>;
  handlers: {
    onPointerDown: (e: React.PointerEvent<T>) => void;
    onPointerMove: (e: React.PointerEvent<T>) => void;
    onPointerUp: () => void;
    onPointerLeave: () => void;
    onTouchStart: (e: React.TouchEvent<T>) => void;
    onTouchMove: (e: React.TouchEvent<T>) => void;
    onTouchEnd: () => void;
  };
}

/**
 * ==========================================
 * HOOK: useSwipe
 * Logic utama untuk menggeser (drag/scroll)
 * Mendukung Desktop (Mouse) & Mobile (Touch)
 * ==========================================
 */
export function useSwipe<T extends HTMLElement>(options?: UseSwipeOptions): UseSwipeReturn<T> {
  const { speed = 1 } = options || {};

  // REFS
  const containerRef = useRef<T>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // DESKTOP: Pointer Events
  const onPointerDown = useCallback((e: React.PointerEvent<T>) => {
    isDown.current = true;
    startX.current = e.clientX;
    // Simpan posisi scroll awal saat tombol ditekan
    if (containerRef.current) {
      scrollLeft.current = containerRef.current.scrollLeft;
    }
    
    // Optional: styling cursor saat drag
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    if (!isDown.current || !containerRef.current) return;
    
    const dx = (e.clientX - startX.current) * speed;
    containerRef.current.scrollLeft = scrollLeft.current - dx;
  }, [speed]);

  const onPointerUp = useCallback(() => {
    isDown.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  }, []);

  const onPointerLeave = useCallback(() => {
    isDown.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  }, []);

  // MOBILE: Touch Events
  const onTouchStart = useCallback((e: React.TouchEvent<T>) => {
    isDown.current = true;
    startX.current = e.touches[0].clientX;
    if (containerRef.current) {
      scrollLeft.current = containerRef.current.scrollLeft;
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent<T>) => {
    if (!isDown.current || !containerRef.current) return;
    
    const dx = (e.touches[0].clientX - startX.current) * speed;
    containerRef.current.scrollLeft = scrollLeft.current - dx;
  }, [speed]);

  const onTouchEnd = useCallback(() => {
    isDown.current = false;
  }, []);

  return {
    containerRef,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}