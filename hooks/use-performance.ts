import { useCallback, useMemo, useRef, useState, useEffect } from 'react'

// Hook for optimizing expensive calculations
export function useExpensiveCalculation<T, Args extends any[]>(
  fn: (...args: Args) => T,
  deps: React.DependencyList
): (...args: Args) => T {
  return useCallback(fn, deps)
}

// Hook for memoizing component props
export function useMemoizedProps<T extends Record<string, any>>(props: T): T {
  return useMemo(() => props, Object.values(props))
}

// Hook for optimizing lists with stable references
export function useStableArray<T>(array: T[], compareFn?: (a: T, b: T) => boolean): T[] {
  const previousArrayRef = useRef<T[]>([])
  
  return useMemo(() => {
    if (compareFn) {
      if (array.length !== previousArrayRef.current.length) {
        previousArrayRef.current = array
        return array
      }
      
      const hasChanged = array.some((item, index) => 
        !compareFn(item, previousArrayRef.current[index])
      )
      
      if (hasChanged) {
        previousArrayRef.current = array
        return array
      }
      
      return previousArrayRef.current
    }
    
    // Default shallow comparison
    if (array.length !== previousArrayRef.current.length) {
      previousArrayRef.current = array
      return array
    }
    
    const hasChanged = array.some((item, index) => 
      item !== previousArrayRef.current[index]
    )
    
    if (hasChanged) {
      previousArrayRef.current = array
      return array
    }
    
    return previousArrayRef.current
  }, [array, compareFn])
}

// Hook for debouncing values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for throttling function calls
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now()
      
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now
        return fn(...args)
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now()
        fn(...args)
      }, delay - (now - lastCallRef.current))
    }) as T,
    [fn, delay]
  )
}

// Hook for optimizing event handlers
export function useEventCallback<T extends (...args: any[]) => any>(fn: T): T {
  const fnRef = useRef<T>(fn)
  
  useEffect(() => {
    fnRef.current = fn
  }, [fn])
  
  return useCallback(
    ((...args: Parameters<T>) => fnRef.current(...args)) as T,
    []
  )
}

// Hook for lazy initialization
export function useLazyState<T>(initializer: () => T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initializer)
  return [state, setState]
}

// Hook for previous value
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  
  useEffect(() => {
    ref.current = value
  }, [value])
  
  return ref.current
}

// Hook for comparing values
export function useDeepCompareMemo<T>(value: T): T {
  const ref = useRef<T>()
  
  if (!ref.current || JSON.stringify(ref.current) !== JSON.stringify(value)) {
    ref.current = value
  }
  
  return ref.current
}

// Hook for optimizing component updates
export function useOptimizedUpdate<T>(
  value: T,
  shouldUpdate: (prev: T, next: T) => boolean = (prev, next) => prev !== next
): T {
  const [optimizedValue, setOptimizedValue] = useState(value)
  const prevValueRef = useRef(value)
  
  useEffect(() => {
    if (shouldUpdate(prevValueRef.current, value)) {
      setOptimizedValue(value)
      prevValueRef.current = value
    }
  }, [value, shouldUpdate])
  
  return optimizedValue
}

// Hook for intersection observer (for lazy loading)
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)
  
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      options
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [elementRef, options])
  
  return isIntersecting
}

// Hook for virtual scrolling
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  buffer: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + buffer
    )
    
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex + 1),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    }
  }, [items, itemHeight, containerHeight, scrollTop, buffer])
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])
  
  return {
    visibleItems,
    handleScroll,
    scrollTop
  }
}

// Hook for memoizing computations based on dependencies
export function useMemoizedComputation<T, D extends readonly any[]>(
  computation: () => T,
  dependencies: D
): T {
  return useMemo(computation, dependencies)
}

// Hook for performance monitoring
export function usePerformanceMonitor(name: string, dependencies: any[] = []) {
  const startTimeRef = useRef<number>()
  
  useEffect(() => {
    startTimeRef.current = performance.now()
    
    return () => {
      if (startTimeRef.current) {
        const duration = performance.now() - startTimeRef.current
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      }
    }
  }, dependencies)
}

// Hook for render counting (development only)
export function useRenderCount(componentName: string) {
  const renderCountRef = useRef(0)
  
  useEffect(() => {
    renderCountRef.current++
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Render Count] ${componentName}: ${renderCountRef.current}`)
    }
  })
  
  return renderCountRef.current
}

// Hook for optimizing async operations
export function useAsyncMemo<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList,
  initialValue?: T
): { value: T | undefined; loading: boolean; error: Error | null } {
  const [state, setState] = useState<{
    value: T | undefined
    loading: boolean
    error: Error | null
  }>({
    value: initialValue,
    loading: false,
    error: null
  })
  
  useEffect(() => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    asyncFn()
      .then(value => setState({ value, loading: false, error: null }))
      .catch(error => setState(prev => ({ ...prev, loading: false, error })))
  }, deps)
  
  return state
}

// Hook for batch state updates
export function useBatchedState<T>(initialState: T): [T, (updates: Partial<T>) => void] {
  const [state, setState] = useState(initialState)
  
  const batchedSetState = useCallback((updates: Partial<T>) => {
    setState(prevState => ({ ...prevState, ...updates }))
  }, [])
  
  return [state, batchedSetState]
}

// Hook for optimizing re-renders with selective updates
export function useSelectiveUpdate<T extends Record<string, any>>(
  state: T,
  selector: (state: T) => any
): T {
  const selectedValueRef = useRef(selector(state))
  const [, forceUpdate] = useState({})
  
  useEffect(() => {
    const newSelectedValue = selector(state)
    if (selectedValueRef.current !== newSelectedValue) {
      selectedValueRef.current = newSelectedValue
      forceUpdate({})
    }
  }, [state, selector])
  
  return state
}