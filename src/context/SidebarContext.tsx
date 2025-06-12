// context/SidebarContext.tsx
'use client'

import { useIsMobile } from '@/hooks/useIsMobile'
import { createContext, useContext, useEffect, useState } from 'react'

const SidebarContext = createContext({
  isOpen: false,
  toggle: () => {},
  close: () => {},
})

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()
  console.log(isMobile);
  

  const toggle = () => setIsOpen(prev => !prev)
  const close = () => setIsOpen(false)

  useEffect(() => {
    debugger
    setIsOpen(!isMobile)
  }, [isMobile])

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
