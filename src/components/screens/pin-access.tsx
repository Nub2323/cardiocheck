'use client'

import React, { useState, useCallback } from 'react'
import { useAppState } from '@/lib/app-state'
import { AppHeader } from '@/components/app-header'
import { MaterialIcon } from '@/components/icons'

const DEMO_PIN = '1234'

export function PinAccessScreen() {
  const { setScreen, setIsAdmin } = useAppState()
  const [pin, setPin] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleDigit = useCallback(
    (digit: string) => {
      setError(false)
      const nextEmpty = pin.findIndex((d) => d === '')
      if (nextEmpty === -1) return

      const newPin = [...pin]
      newPin[nextEmpty] = digit
      setPin(newPin)

      // Check if complete
      if (nextEmpty === 3) {
        const entered = newPin.join('')
        if (entered === DEMO_PIN) {
          setTimeout(() => {
            setIsAdmin(true)
            setScreen('admin')
          }, 300)
        } else {
          setTimeout(() => {
            setError(true)
            setShaking(true)
            setTimeout(() => {
              setShaking(false)
              setPin(['', '', '', ''])
            }, 600)
          }, 300)
        }
      }
    },
    [pin, setIsAdmin, setScreen]
  )

  const handleBackspace = useCallback(() => {
    setError(false)
    const lastFilled = [...pin].reverse().findIndex((d) => d !== '')
    if (lastFilled === -1) return
    const index = 3 - lastFilled
    const newPin = [...pin]
    newPin[index] = ''
    setPin(newPin)
  }, [pin])

  const handleBack = () => {
    setScreen('welcome')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        icon="monitor_heart"
        title="Unidad de Insuficiencia Cardíaca"
        subtitle="Hospital Universitario"
      />

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
        {/* Lock Icon */}
        <div
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: '#00288e10' }}
        >
          <MaterialIcon name="lock" size={32} className="text-[#00288e]" />
        </div>

        <h2 className="mb-2 text-lg font-extrabold text-[#0F172A]">Acceso al Equipo</h2>
        <p className="mb-6 text-[12px] text-[#475569]">
          Ingrese su PIN de 4 dígitos para acceder
        </p>

        {/* PIN Dots */}
        <div
          className={`mb-3 flex gap-4 ${shaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
          style={{
            animation: shaking ? 'shake 0.5s ease-in-out' : undefined,
          }}
        >
          {pin.map((digit, i) => (
            <div
              key={i}
              className="flex h-14 w-14 items-center justify-center rounded-xl border-2"
              style={{
                borderColor: error
                  ? '#DC2626'
                  : digit
                    ? '#00288e'
                    : '#CBD5E1',
                backgroundColor: digit
                  ? error
                    ? '#FEE2E2'
                    : '#00288e08'
                  : 'transparent',
              }}
            >
              {digit && (
                <div
                  className="h-4 w-4 rounded-full"
                  style={{
                    backgroundColor: error ? '#DC2626' : '#00288e',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        <p
          className="mb-6 text-[12px] font-semibold text-[#DC2626] transition-opacity"
          style={{ opacity: error ? 1 : 0 }}
        >
          PIN incorrecto. Inténtelo de nuevo
        </p>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="flex h-14 w-20 items-center justify-center rounded-xl text-lg font-bold text-[#0F172A] transition-all active:scale-95 active:bg-[#F1F5F9]"
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleBack}
            className="flex h-14 w-20 items-center justify-center rounded-xl text-[11px] font-semibold text-[#475569] transition-all active:scale-95"
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            Volver
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="flex h-14 w-20 items-center justify-center rounded-xl text-lg font-bold text-[#0F172A] transition-all active:scale-95 active:bg-[#F1F5F9]"
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="flex h-14 w-20 items-center justify-center rounded-xl transition-all active:scale-95 active:bg-[#F1F5F9]"
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            <MaterialIcon name="backspace" size={20} className="text-[#475569]" />
          </button>
        </div>
      </main>

      {/* Shake animation style */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
