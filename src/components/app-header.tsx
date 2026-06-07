'use client'

import React from 'react'
import Image from 'next/image'
import { MaterialIcon } from './icons'

interface AppHeaderProps {
  icon: string
  title: string
  subtitle: string
  tall?: boolean
}

export function AppHeader({ icon, title, subtitle, tall = false }: AppHeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 flex items-center gap-3 px-4 text-white"
      style={{
        height: tall ? 120 : 64,
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
      }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl">
        <Image
          src="/logo-cardiocheck.png"
          alt="CardioCheck"
          width={40}
          height={40}
          className="rounded-xl object-cover"
          priority
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold leading-tight">{title}</p>
        <p className="truncate text-[11px] leading-tight text-white/70">{subtitle}</p>
      </div>
    </header>
  )
}
