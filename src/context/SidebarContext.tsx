// context/SidebarContext.tsx
'use client'

import { useIsMobile } from '@/hooks/useIsMobile'
import { createContext, useContext, useEffect, useState } from 'react'

const SidebarContext = createContext({
  isOpen: false,
  isCollapse: false,
  toggle: () => { },
  collapse: () => { },
})

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapse, setIsCollapse] = useState(false)
  const isMobile = useIsMobile()
  // console.log(isMobile);
  // console.log(isCollapse);


  const toggle = () => setIsOpen(prev => !prev)
  const collapse = () => setIsCollapse(prev => !prev)

  useEffect(() => {
    // debugger
    setIsOpen(!isMobile)
    setIsCollapse(false)
  }, [isMobile])

  return (
    <SidebarContext.Provider value={{ isOpen, isCollapse, toggle, collapse }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
