'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { track } from './analytics';

type Ctx = { open: boolean; openMenu: () => void; closeMenu: () => void };

const MenuDrawerContext = createContext<Ctx | null>(null);

export function MenuDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openMenu = useCallback(() => {
    setOpen(true);
    track('menu_view', { surface: 'drawer' });
  }, []);

  const closeMenu = useCallback(() => setOpen(false), []);

  // Lock background scroll while the drawer is open, without the iOS jump.
  useEffect(() => {
    if (!open) return;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  // Escape always closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <MenuDrawerContext.Provider value={{ open, openMenu, closeMenu }}>
      {children}
    </MenuDrawerContext.Provider>
  );
}

export function useMenuDrawer(): Ctx {
  const ctx = useContext(MenuDrawerContext);
  if (!ctx) throw new Error('useMenuDrawer must be used inside <MenuDrawerProvider>');
  return ctx;
}
