'use client'

import React, { useState } from 'react'
import { useAppState, CHECKIN_QUESTIONS } from '@/lib/app-state'
import { AppHeader } from '@/components/app-header'
import { MaterialIcon } from '@/components/icons'
import { TipCard } from '@/components/tip-card'
import { getSeverityStyles } from '@/components/status-badge'
import type { AnswerSeverity } from '@/lib/app-state'

export function AdditionalCommentsScreen() {
  const { currentQuestion, answers, setAnswer, setAdditionalComment, setScreen } = useAppState()
  const [selectedOption, setSelectedOption] = useState<string | null>(answers[currentQuestion] ?? null)
  const [comment, setComment] = useState('')

  const question = CHECKIN_QUESTIONS[currentQuestion]
  const totalQuestions = CHECKIN_QUESTIONS.length
  const progress = 80

  const handleSelect = (optionLabel: string, severity: AnswerSeverity) => {
    setSelectedOption(optionLabel)
    setAnswer(currentQuestion, optionLabel)
    void severity
  }

  const handleFinish = () => {
    setAdditionalComment(comment)
    setScreen('complete')
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setScreen('checkin')
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        icon="favorite"
        title="Hosp. Dr. T. Álvarez"
        subtitle="Seguimiento Remoto Cardiológico"
      />

      <main className="flex-1 overflow-y-auto px-4 pb-8 pt-4">
        {/* Progress Bar */}
        <div className="mb-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#475569]">
              Pregunta {totalQuestions} de {totalQuestions}
            </span>
            <span className="text-[11px] font-bold text-[#00288e]">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: '#00288e',
              }}
            />
          </div>
        </div>

        {/* Last Question Card */}
        <div
          className="mb-5 rounded-[24px] p-6"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow:
              '0 10px 25px -5px rgba(15,40,100,0.14), 0 8px 10px -6px rgba(15,40,100,0.07)',
          }}
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="text-2xl">{question.emoji}</span>
            <h3 className="text-[15px] font-bold leading-snug text-[#0F172A]">
              {question.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-2.5">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.label
              const severityStyle = getSeverityStyles(option.severity)
              const isYellow =
                option.severity === 'yellow' ||
                option.severity === 'yellow-high' ||
                option.severity === 'yellow-low'

              return (
                <button
                  key={option.label}
                  onClick={() => handleSelect(option.label, option.severity)}
                  className="flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-[13px] font-medium transition-all active:scale-[0.98]"
                  style={{
                    minHeight: 48,
                    borderColor: isSelected
                      ? severityStyle.border
                      : isYellow
                        ? '#FEF3C7'
                        : '#E2E8F0',
                    backgroundColor: isSelected
                      ? severityStyle.bg
                      : isYellow
                        ? '#FFFBEB'
                        : '#F8FAFC',
                    color: isSelected ? severityStyle.text : '#0F172A',
                  }}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full border-2"
                    style={{
                      borderColor: isSelected ? severityStyle.border : '#CBD5E1',
                      backgroundColor: isSelected ? severityStyle.border : 'transparent',
                    }}
                  />
                  <span className="flex-1">{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Comments Textarea */}
        <div
          className="mb-5 rounded-[24px] p-6"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow:
              '0 10px 25px -5px rgba(15,40,100,0.14), 0 8px 10px -6px rgba(15,40,100,0.07)',
          }}
        >
          <label className="mb-2 block text-[13px] font-bold text-[#0F172A]">
            ¿Desea agregar algún comentario o síntoma adicional?
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escriba aquí cualquier síntoma o inquietud adicional..."
            rows={3}
            className="w-full resize-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#00288e] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20"
          />
        </div>

        {/* Navigation */}
        <div className="mb-4 flex gap-3">
          <button
            onClick={handleBack}
            className="flex flex-1 items-center justify-center gap-1 rounded-2xl border-2 border-[#E2E8F0] px-4 py-3 text-[13px] font-semibold text-[#475569] transition-all active:scale-[0.97]"
            style={{ minHeight: 48 }}
          >
            <MaterialIcon name="arrow_back" size={16} />
            Anterior
          </button>
          <button
            onClick={handleFinish}
            disabled={!selectedOption}
            className="flex flex-1 items-center justify-center gap-1 rounded-2xl px-4 py-3 text-[13px] font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
            style={{
              backgroundColor: '#00288e',
              minHeight: 48,
            }}
          >
            Finalizar
            <MaterialIcon name="check_circle" size={16} />
          </button>
        </div>

        {/* Tip Card */}
        <TipCard
          title="Consejo para su descanso"
          text="Si necesita más almohadas para dormir, intente elevar la cabecera de la cama. Consulte con su médico si la dificultad para dormir empeora."
          icon="bed"
        />
      </main>
    </div>
  )
}
