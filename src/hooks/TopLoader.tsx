'use client'

import { usePathname } from 'next/navigation'
import { useEffect, createContext, useContext, useCallback } from 'react'

type TopLoaderContextType = {
  showLoader: () => void
  hideLoader: () => void
}

const TopLoaderContext = createContext<TopLoaderContextType | undefined>(undefined)

export const TopLoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const showLoader = useCallback(() => {
    const loader = document.getElementById('top-loader')
    const overlay = document.getElementById('page-overlay')
    if (loader && overlay) {
      loader.style.display = 'block'
      overlay.style.display = 'block'
    }
  }, [])

  const hideLoader = useCallback(() => {
    const loader = document.getElementById('top-loader')
    const overlay = document.getElementById('page-overlay')
    if (loader && overlay) {
      loader.style.display = 'none'
      overlay.style.display = 'none'
    }
  }, [])

  // Automatically show/hide loader on route change
  // useEffect(() => {
  //   showLoader()
  //   const timer = setTimeout(() => {
  //     hideLoader()
  //   }, 1000)
  //   return () => clearTimeout(timer)
  // }, [pathname, showLoader, hideLoader])

  return (
    <TopLoaderContext.Provider value={{ showLoader, hideLoader }}>
      <>
        <div id="top-loader" />
        <div id="page-overlay" />
        {children}
      </>
    </TopLoaderContext.Provider>
  )
}
export const useTopLoader = () => {
  const context = useContext(TopLoaderContext)
  if (!context) throw new Error('useTopLoader must be used within TopLoaderProvider')
  return context
}