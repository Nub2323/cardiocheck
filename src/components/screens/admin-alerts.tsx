'use client'

import React, { useState } from 'react'
import { useAppState } from '@/lib/app-state'
import { AppHeader } from '@/components/app-header'
import { BottomNav } from '@/components/bottom-nav'
import { MaterialIcon } from '@/components/icons'

interface AlertData {
  id: number
  severity: 'urgent' | 'followup'
  badgeText: string
  badgeColor: { bg: string; border: string; text: string }
  patientName: string
  patientDni: string
  time: string
  symptoms: string[]
}

const DEMO_ALERTS: AlertData[] = [
  {
    id: 1,
    severity: 'urgent',
    badgeText: 'URGENTE',
    badgeColor: { bg: '#FEE2E2', border: '#DC2626', text: '#7F1D1D' },
    patientName: 'Marta Sánchez',
    patientDni: '10.992.102',
    time: 'Hace 5 min',
    symptoms: ['Mucho peor / me cuesta hablar'],
  },
  {
    id: 2,
    severity: 'followup',
    badgeText: 'SEGUIMIENTO',
    badgeColor: { bg: '#FEF3C7', border: '#D97706', text: '#78350F' },
    patientName: 'Ricardo Gomez',
    patientDni: '14.782.331',
    time: 'Hace 20 min',
    symptoms: ['Subí entre 1 y 2 kg', 'Necesita una almohada más'],
  },
]

export function AdminAlertsScreen() {
  const { setScreen, setIsAdmin } = useAppState()
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set())

  const handleDismiss = (id: number) => {
    setDismissedIds((prev) => new Set(prev).add(id))
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setScreen('welcome')
  }

  const activeAlerts = DEMO_ALERTS.filter((a) => !dismissedIds.has(a.id))

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        icon="favorite"
        title="Hosp. Dr. T. Álvarez"
        subtitle="Panel de Enfermería"
      />

      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
        {/* Title */}
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-[#0F172A]">Alertas Pendientes</h2>
          <p className="text-[12px] text-[#475569]">
            Casos críticos que requieren contacto inmediato
          </p>
        </div>

        {/* Alert Cards */}
        {activeAlerts.length === 0 ? (
          <div
            className="mb-4 rounded-[24px] p-8 text-center"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow:
                '0 10px 25px -5px rgba(15,40,100,0.14), 0 8px 10px -6px rgba(15,40,100,0.07)',
            }}
          >
            <MaterialIcon name="check_circle" size={48} className="mb-3 text-[#16A34A]" />
            <p className="text-sm font-bold text-[#0F172A]">Sin alertas pendientes</p>
            <p className="text-[12px] text-[#475569]">
              Todas las alertas han sido atendidas
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="overflow-hidden rounded-[20px] border-2"
                style={{
                  borderColor:
                    alert.severity === 'urgent' ? '#FECACA' : '#FDE68A',
                  backgroundColor: '#FFFFFF',
                  boxShadow:
                    '0 10px 25px -5px rgba(15,40,100,0.14), 0 8px 10px -6px rgba(15,40,100,0.07)',
                }}
              >
                {/* Alert Header */}
                <div
                  className="flex items-center justify-between border-b px-4 py-3"
                  style={{
                    backgroundColor:
                      alert.severity === 'urgent' ? '#FEF2F2' : '#FFFBEB',
                    borderColor:
                      alert.severity === 'urgent' ? '#FECACA' : '#FDE68A',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold"
                      style={{
                        backgroundColor: alert.badgeColor.bg,
                        borderColor: alert.badgeColor.border,
                        color: alert.badgeColor.text,
                      }}
                    >
                      {alert.badgeText}
                    </span>
                    <span className="text-[11px] text-[#475569]">{alert.time}</span>
                  </div>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="text-[11px] font-semibold text-[#94A3B8] transition-colors hover:text-[#475569]"
                  >
                    Descartar
                  </button>
                </div>

                {/* Alert Body */}
                <div className="p-4">
                  {/* Patient Info */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full"
                        style={{
                          backgroundColor:
                            alert.severity === 'urgent' ? '#FEE2E2' : '#FEF3C7',
                        }}
                      >
                        <MaterialIcon
                          name="groups"
                          size={18}
                          className=""
                          style={{
                            color:
                              alert.severity === 'urgent' ? '#DC2626' : '#D97706',
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">
                          {alert.patientName}
                        </p>
                        <p className="text-[11px] text-[#475569]">
                          DNI: {alert.patientDni}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="mb-4 space-y-1.5">
                    {alert.symptoms.map((symptom, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-lg px-3 py-2"
                        style={{
                          backgroundColor:
                            alert.severity === 'urgent' ? '#FEF2F2' : '#FFFBEB',
                        }}
                      >
                        <MaterialIcon
                          name="warning"
                          size={14}
                          className="mt-0.5 shrink-0"
                          style={{
                            color:
                              alert.severity === 'urgent' ? '#DC2626' : '#D97706',
                          }}
                        />
                        <p
                          className="text-[12px] italic"
                          style={{
                            color:
                              alert.severity === 'urgent' ? '#7F1D1D' : '#78350F',
                          }}
                        >
                          &ldquo;{symptom}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-bold transition-all active:scale-[0.97]"
                      style={{
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                        minHeight: 40,
                      }}
                    >
                      <MaterialIcon name="chat" size={14} className="text-[#166534]" />
                      WhatsApp
                    </button>
                    <button
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-bold transition-all active:scale-[0.97]"
                      style={{
                        backgroundColor: '#DBEAFE',
                        color: '#1E3A8A',
                        minHeight: 40,
                      }}
                    >
                      <MaterialIcon name="mail" size={14} className="text-[#1E3A8A]" />
                      Email
                    </button>
                    <button
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-bold transition-all active:scale-[0.97]"
                      style={{
                        backgroundColor: '#FEF3C7',
                        color: '#78350F',
                        minHeight: 40,
                      }}
                    >
                      <MaterialIcon name="medical_services" size={14} className="text-[#78350F]" />
                      Médico
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 w-full rounded-xl border-2 border-[#E2E8F0] px-4 py-3 text-[12px] font-semibold text-[#475569] transition-all active:scale-[0.97]"
          style={{ minHeight: 44 }}
        >
          Cerrar sesión de administrador
        </button>
      </main>

      <BottomNav
        items={[
          { label: 'Alertas', icon: 'notifications', active: true, onClick: () => setScreen('admin') },
          { label: 'Pacientes', icon: 'groups', active: false, onClick: () => setScreen('admin') },
          { label: 'Historial', icon: 'history', active: false, onClick: () => setScreen('admin') },
          { label: 'Consejos', icon: 'lightbulb', active: false, onClick: () => setScreen('admin') },
          { label: 'Ajustes', icon: 'settings', active: false, onClick: () => handleLogout() },
        ]}
      />
    </div>
  )
}
