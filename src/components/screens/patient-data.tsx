'use client'

import React, { useState } from 'react'
import { useAppState } from '@/lib/app-state'
import { AppHeader } from '@/components/app-header'
import { BottomNav } from '@/components/bottom-nav'
import { MaterialIcon } from '@/components/icons'
import { TipCard } from '@/components/tip-card'

export function PatientDataScreen() {
  const { patientName, patientDni, setPatientName, setPatientDni, setPatientId, setScreen } = useAppState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dniError, setDniError] = useState<string | null>(null)

  const validateDni = (dni: string): boolean => {
    const digits = dni.replace(/\D/g, '')
    if (digits.length < 7 || digits.length > 8) {
      setDniError('El DNI debe tener entre 7 y 8 dígitos')
      return false
    }
    setDniError(null)
    return true
  }

  const canContinue = patientName.trim().length > 0 && patientDni.trim().length >= 7 && patientDni.trim().length <= 8 && !dniError

  const handleContinue = async () => {
    if (!validateDni(patientDni)) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: patientName.trim(), dni: patientDni.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al registrar paciente')
        return
      }

      const data = await res.json()
      setPatientId(data.patient.id)
      setScreen('consent')
    } catch {
      setError('Error de conexión. Intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        icon="monitor_heart"
        title="Unidad de Cuidados Cardiológicos"
        subtitle="Hospital Dr. T. Álvarez"
      />

      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-5">
        {/* Title */}
        <div className="mb-5">
          <h2
            className="mb-1 text-lg font-extrabold"
            style={{ color: '#0F172A' }}
          >
            Sus datos personales
          </h2>
          <p className="text-[13px] leading-relaxed text-[#475569]">
            Necesitamos identificarlo para registrar su control diario
          </p>
        </div>

        {/* Form Card */}
        <div
          className="mb-4 rounded-[24px] p-6"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow:
              '0 10px 25px -5px rgba(15,40,100,0.14), 0 8px 10px -6px rgba(15,40,100,0.07)',
          }}
        >
          {/* Name Field */}
          <div className="mb-5">
            <label
              className="mb-2 block text-[11px] font-bold tracking-wide text-[#475569]"
              htmlFor="patient-name"
            >
              NOMBRE Y APELLIDO
            </label>
            <input
              id="patient-name"
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ej: María García"
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#00288e] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20"
              style={{ minHeight: 48 }}
              autoComplete="name"
            />
          </div>

          {/* DNI Field */}
          <div>
            <label
              className="mb-2 block text-[11px] font-bold tracking-wide text-[#475569]"
              htmlFor="patient-dni"
            >
              DNI
            </label>
            <input
              id="patient-dni"
              type="text"
              inputMode="numeric"
              value={patientDni}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                setPatientDni(val)
                if (val.length >= 7 && val.length <= 8) {
                  setDniError(null)
                } else if (val.length > 0 && val.length < 7) {
                  setDniError('El DNI debe tener entre 7 y 8 dígitos')
                } else if (val.length > 8) {
                  setDniError('El DNI no puede tener más de 8 dígitos')
                } else {
                  setDniError(null)
                }
              }}
              placeholder="Ej: 28456789"
              className="w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#00288e] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20"
              style={{
                minHeight: 48,
                borderColor: dniError ? '#DC2626' : '#E2E8F0',
              }}
              autoComplete="off"
              maxLength={8}
            />
            {dniError && (
              <p className="mt-1.5 text-[11px] font-semibold text-[#DC2626]">
                {dniError}
              </p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-4 rounded-xl border-2 p-3"
            style={{
              backgroundColor: '#FEF2F2',
              borderColor: '#FECACA',
            }}
          >
            <p className="text-[12px] font-semibold text-[#7F1D1D]">{error}</p>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue || loading}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100"
          style={{
            backgroundColor: '#00288e',
            minHeight: 48,
          }}
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Registrando...
            </>
          ) : (
            <>
              Continuar
              <MaterialIcon name="chevron_right" size={18} />
            </>
          )}
        </button>

        {/* Tip Card */}
        <TipCard
          title="Consejo de Identificación"
          text="Sus datos son confidenciales y se utilizan únicamente para el seguimiento de su salud cardíaca. Solo su equipo médico tiene acceso a esta información."
        />

        {/* Footer */}
        <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-white/60 p-4">
          <p className="text-center text-[10px] leading-relaxed text-[#94A3B8]">
            ⚕️ Sus datos están protegidos conforme a la Ley 25.326 de Protección de Datos Personales.
          </p>
        </div>
      </main>

      <BottomNav
        items={[
          { label: 'Alertas', icon: 'notifications', active: false, onClick: () => setScreen('pin') },
          { label: 'Pacientes', icon: 'groups', active: false, onClick: () => setScreen('pin') },
          { label: 'Inicio', icon: 'home', active: true, onClick: () => setScreen('welcome') },
          { label: 'Progreso', icon: 'trending_up', active: false, onClick: () => setScreen('patient-data') },
          { label: 'Equipo', icon: 'medical_services', active: false, onClick: () => setScreen('pin') },
        ]}
      />
    </div>
  )
}
