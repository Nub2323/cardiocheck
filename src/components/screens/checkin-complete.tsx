'use client'

import React from 'react'
import { useAppState } from '@/lib/app-state'
import { AppHeader } from '@/components/app-header'
import { MaterialIcon } from '@/components/icons'
import { TipCard } from '@/components/tip-card'

export function CheckinCompleteScreen() {
  const { patientName, needsGuardia, setScreen, resetFlow } = useAppState()

  const handleGoHome = () => {
    resetFlow()
    setScreen('welcome')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        icon="monitor_heart"
        title="Unidad de Cuidados Cardiológicos"
        subtitle="CardioCheck"
      />

      <main className="flex flex-1 flex-col items-center px-6 pb-8 pt-4">
        {/* Guardia Warning - shows at top if critical */}
        {needsGuardia && (
          <div
            className="mb-5 w-full overflow-hidden rounded-2xl border-2"
            style={{
              borderColor: '#DC2626',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 10px 25px -5px rgba(220,38,38,0.25)',
            }}
          >
            <div
              className="flex items-center gap-2 border-b px-4 py-3"
              style={{
                backgroundColor: '#FEF2F2',
                borderColor: '#FECACA',
              }}
            >
              <MaterialIcon name="emergency" size={22} className="text-[#DC2626]" />
              <span className="text-[14px] font-extrabold text-[#991B1B]">
                CONCURRA A LA GUARDIA
              </span>
            </div>
            <div className="p-4">
              <p className="mb-3 text-[13px] font-semibold text-[#7F1D1D]">
                Se detectó un problema respiratorio o crítico en su registro que requiere atención médica inmediata.
              </p>
              <div className="space-y-2">
                <div
                  className="flex items-center gap-2 rounded-xl p-3"
                  style={{ backgroundColor: '#FEF2F2' }}
                >
                  <MaterialIcon name="local_hospital" size={18} className="text-[#DC2626]" />
                  <span className="text-[12px] font-bold text-[#7F1D1D]">
                    Diríjase a la guardia más cercana
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 rounded-xl p-3"
                  style={{ backgroundColor: '#FEF2F2' }}
                >
                  <MaterialIcon name="phone_in_talk" size={18} className="text-[#DC2626]" />
                  <span className="text-[12px] font-bold text-[#7F1D1D]">
                    Emergencias: llame al 107
                  </span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-[#991B1B]">
                No espere a la próxima consulta. Su seguridad es lo más importante.
              </p>
            </div>
          </div>
        )}

        {/* Success Icon */}
        <div
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: needsGuardia ? '#FEF2F2' : '#DCFCE7' }}
        >
          <MaterialIcon
            name={needsGuardia ? 'warning' : 'check_circle'}
            size={44}
            className={needsGuardia ? 'text-[#DC2626]' : 'text-[#16A34A]'}
          />
        </div>

        <h2 className="mb-2 text-center text-lg font-extrabold text-[#0F172A]">
          {needsGuardia ? 'Registro Completado — Acción Requerida' : '¡Registro Completado!'}
        </h2>

        <p className="mb-6 text-center text-[13px] leading-relaxed text-[#475569]">
          {patientName
            ? `${patientName}, su`
            : 'Su'}{' '}
          registro diario ha sido enviado exitosamente al equipo de seguimiento cardiológico.
          {needsGuardia
            ? ' Se ha generado una alerta urgente para el equipo médico.'
            : ' Se le notificará si se requiere alguna acción.'}
        </p>

        {/* Summary Card */}
        <div
          className="mb-6 w-full rounded-[24px] p-6"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow:
              '0 10px 25px -5px rgba(15,40,100,0.14), 0 8px 10px -6px rgba(15,40,100,0.07)',
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <MaterialIcon name="schedule" size={18} className="text-[#00288e]" />
            <span className="text-[13px] font-bold text-[#0F172A]">Próximo check-in</span>
          </div>
          <p className="text-[12px] text-[#475569]">
            Recuerde realizar su registro diario entre las <strong>8:00 y 11:00 hs</strong>.
            La constancia en el seguimiento es clave para su recuperación.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGoHome}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.97]"
          style={{
            backgroundColor: needsGuardia ? '#DC2626' : '#00288e',
            minHeight: 48,
          }}
        >
          <MaterialIcon name="home" size={18} />
          Volver al Inicio
        </button>

        {/* Tip Card */}
        <TipCard
          title="Consejo de Salud"
          text={needsGuardia
            ? 'No demore en buscar atención médica. Los síntomas respiratorios en pacientes cardiológicos pueden requerir tratamiento inmediato.'
            : 'Recuerde tomar su medicación según las indicaciones de su médico. Si nota algún cambio en sus síntomas, no espere al próximo check-in para contactar a su equipo.'
          }
          icon={needsGuardia ? 'emergency' : 'verified_user'}
        />
      </main>
    </div>
  )
}
