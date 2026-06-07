'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAppState } from '@/lib/app-state'
import { AppHeader } from '@/components/app-header'
import { BottomNav } from '@/components/bottom-nav'
import { MaterialIcon } from '@/components/icons'

interface SettingData {
  key: string
  value: string
  label: string
}

const SETTING_ICONS: Record<string, string> = {
  whatsapp_number: 'chat',
  doctor_phone: 'phone_in_talk',
  doctor_email: 'mail',
  hospital_name: 'local_hospital',
  alert_message: 'notifications',
}

const SETTING_COLORS: Record<string, { bg: string; color: string }> = {
  whatsapp_number: { bg: '#DCFCE7', color: '#166534' },
  doctor_phone: { bg: '#DBEAFE', color: '#1E3A8A' },
  doctor_email: { bg: '#EDE9FE', color: '#5B21B6' },
  hospital_name: { bg: '#FEF3C7', color: '#78350F' },
  alert_message: { bg: '#FFE4E6', color: '#9F1239' },
}

export function AdminSettingsScreen() {
  const { setScreen, setIsAdmin } = useAppState()
  const [settings, setSettings] = useState<SettingData[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null) // key being saved
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/admin/settings')
      if (!res.ok) {
        setErrorMsg('Error al cargar configuración')
        return
      }
      const data = await res.json()
      setSettings(data.settings)
      const vals: Record<string, string> = {}
      for (const s of data.settings) {
        vals[s.key] = s.value
      }
      setEditValues(vals)
    } catch {
      setErrorMsg('Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchSettings()
  }, [fetchSettings])

  const handleSave = async (key: string) => {
    const value = editValues[key]
    if (value === undefined) return

    setSaving(key)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      if (!res.ok) {
        setErrorMsg('Error al guardar')
        return
      }
      setSettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, value } : s))
      )
      setSuccessMsg('Configuración guardada')
      setTimeout(() => setSuccessMsg(null), 2500)
    } catch {
      setErrorMsg('Error de conexión')
    } finally {
      setSaving(null)
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setScreen('welcome')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        icon="settings"
        title="Configuración"
        subtitle="CardioCheck"
      />

      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
        {/* Title */}
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-[#0F172A]">Ajustes de la Aplicación</h2>
          <p className="text-[12px] text-[#475569]">
            Configure los datos de contacto y opciones del sistema
          </p>
        </div>

        {/* Info Banner */}
        <div
          className="mb-4 rounded-2xl border-2 p-4"
          style={{
            backgroundColor: '#EFF6FF',
            borderColor: '#BFDBFE',
          }}
        >
          <div className="flex items-start gap-2">
            <MaterialIcon name="info" size={18} className="mt-0.5 shrink-0 text-[#00288e]" />
            <div className="text-[11px] leading-relaxed text-[#1E3A8A]">
              <p className="mb-1 font-bold">Estos datos se usan en las alertas:</p>
              <p>Cuando un paciente reporta un problema, las alertas usan el WhatsApp, teléfono y email que configure aquí para que el equipo médico pueda contactarlo rápidamente.</p>
            </div>
          </div>
        </div>

        {/* Success */}
        {successMsg && (
          <div
            className="mb-4 rounded-xl border-2 p-3"
            style={{ backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }}
          >
            <div className="flex items-center gap-2">
              <MaterialIcon name="check_circle" size={16} className="text-[#166534]" />
              <p className="text-[12px] font-semibold text-[#166534]">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div
            className="mb-4 rounded-xl border-2 p-3"
            style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}
          >
            <p className="text-[12px] font-semibold text-[#DC2626]">{errorMsg}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="mb-3 h-8 w-8 animate-spin text-[#00288e]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-[13px] text-[#475569]">Cargando configuración...</p>
          </div>
        )}

        {/* Settings List */}
        {!loading && settings.length > 0 && (
          <div className="space-y-3">
            {settings.map((s) => {
              const icon = SETTING_ICONS[s.key] || 'tune'
              const colors = SETTING_COLORS[s.key] || { bg: '#F1F5F9', color: '#475569' }
              const isSaving = saving === s.key

              return (
                <div
                  key={s.key}
                  className="overflow-hidden rounded-[16px] border"
                  style={{
                    borderColor: '#E2E8F0',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 12px -2px rgba(15,40,100,0.08)',
                  }}
                >
                  <div className="p-4">
                    {/* Label row */}
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{ backgroundColor: colors.bg }}
                      >
                        <MaterialIcon name={icon} size={18} style={{ color: colors.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#0F172A]">{s.label}</p>
                        <p className="text-[10px] text-[#94A3B8]">Clave: {s.key}</p>
                      </div>
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                      <input
                        type={s.key === 'doctor_email' ? 'email' : 'text'}
                        value={editValues[s.key] ?? s.value}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, [s.key]: e.target.value }))
                        }
                        className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[14px] text-[#0F172A] focus:border-[#00288e] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20"
                        style={{ minHeight: 44 }}
                      />
                      <button
                        onClick={() => handleSave(s.key)}
                        disabled={isSaving || editValues[s.key] === s.value}
                        className="flex items-center justify-center gap-1 rounded-xl px-4 text-[12px] font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
                        style={{ backgroundColor: '#00288e', minHeight: 44 }}
                      >
                        {isSaving ? (
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <>
                            <MaterialIcon name="save" size={14} />
                            Guardar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* PIN Management Section */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-extrabold text-[#0F172A]">Seguridad</h3>
          <div
            className="overflow-hidden rounded-[16px] border"
            style={{
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 12px -2px rgba(15,40,100,0.08)',
            }}
          >
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEF3C7]">
                  <MaterialIcon name="lock" size={18} className="text-[#78350F]" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-[#0F172A]">PIN de acceso</p>
                  <p className="text-[10px] text-[#94A3B8]">El PIN actual es: 1234</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#FECACA] px-4 py-3.5 text-[13px] font-bold text-[#DC2626] transition-all active:scale-[0.97]"
          style={{ minHeight: 48 }}
        >
          <MaterialIcon name="logout" size={18} />
          Cerrar sesión de administrador
        </button>
      </main>

      <BottomNav
        items={[
          { label: 'Alertas', icon: 'notifications', active: false, onClick: () => setScreen('admin') },
          { label: 'Pacientes', icon: 'groups', active: false, onClick: () => setScreen('admin-patients') },
          { label: 'Preguntas', icon: 'quiz', active: false, onClick: () => setScreen('admin-questions') },
          { label: 'Inicio', icon: 'home', active: false, onClick: () => setScreen('welcome') },
          { label: 'Ajustes', icon: 'settings', active: true, onClick: () => setScreen('admin-settings') },
        ]}
      />
    </div>
  )
}
