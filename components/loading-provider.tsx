'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Loader } from '@/components/loader'

interface LoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setIsLoading: () => {},
})

export const useLoading = () => useContext(LoadingContext)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const pathname = usePathname()

  // Chargement initial de l'app
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setIsLoading(false)
        setIsInitialLoad(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isInitialLoad])

  // Chargement lors du changement de route
  useEffect(() => {
    if (!isInitialLoad) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [pathname, isInitialLoad])

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <Loader />}
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
    </LoadingContext.Provider>
  )
}
