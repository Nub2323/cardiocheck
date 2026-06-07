'use client'

import React, { useState, useRef } from 'react'

interface DatePickerProps {
  value: string // YYYY-MM-DD format
  onChange: (date: string) => void
  placeholder?: string
  error?: boolean
  disabled?: boolean
  maxDate?: Date
  label?: string
}

/**
 * Simple date input: user types DD/MM/AAAA and slashes are auto-inserted.
 * Internally stores YYYY-MM-DD for API compatibility.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'DD/MM/AAAA',
  error = false,
  disabled = false,
  maxDate,
  label,
}: DatePickerProps) {
  // Convert YYYY-MM-DD to DD/MM/AAAA for display
  const toDisplay = (iso: string): string => {
    if (!iso) return ''
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  const [displayValue, setDisplayValue] = useState(value ? toDisplay(value) : '')
  const [internalError, setInternalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndConvert = (display: string): { iso: string; error: string | null } => {
    const digits = display.replace(/\D/g, '')

    if (digits.length < 8) {
      return { iso: '', error: digits.length > 0 ? 'Fecha incompleta' : null }
    }

    const day = parseInt(digits.substring(0, 2), 10)
    const month = parseInt(digits.substring(2, 4), 10)
    const year = parseInt(digits.substring(4, 8), 10)

    // Validate month
    if (month < 1 || month > 12) {
      return { iso: '', error: 'Mes inválido (01-12)' }
    }

    // Validate day
    const daysInMonth = new Date(year, month, 0).getDate()
    if (day < 1 || day > daysInMonth) {
      return { iso: '', error: `Día inválido (01-${daysInMonth})` }
    }

    // Validate year
    if (year < 1900) {
      return { iso: '', error: 'Año inválido' }
    }

    // Check maxDate
    const date = new Date(year, month - 1, day)
    if (maxDate && date > maxDate) {
      return { iso: '', error: 'La fecha no puede ser futura' }
    }

    const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return { iso, error: null }
  }

  const formatWithSlashes = (digits: string): string => {
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.substring(0, 2)}/${digits.substring(2)}`
    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}/${digits.substring(4, 8)}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const digits = raw.replace(/\D/g, '')

    // Limit to 8 digits
    const limited = digits.substring(0, 8)
    const formatted = formatWithSlashes(limited)

    setDisplayValue(formatted)
    setInternalError(null)

    // Only validate and emit when we have 8 digits
    if (limited.length === 8) {
      const result = validateAndConvert(formatted)
      if (result.error) {
        setInternalError(result.error)
        onChange('')
      } else {
        onChange(result.iso)
      }
    } else {
      onChange('')
    }
  }

  const handleBlur = () => {
    if (displayValue && displayValue.replace(/\D/g, '').length === 8) {
      const result = validateAndConvert(displayValue)
      if (result.error) {
        setInternalError(result.error)
      }
    }
  }

  // Sync external value changes (e.g. form reset)
  React.useEffect(() => {
    if (!value) {
      setDisplayValue('')
      setInternalError(null)
    }
  }, [value])

  const hasError = error || !!internalError
  const showError = internalError

  return (
    <div>
      {label && (
        <label className="mb-2 block text-[11px] font-bold tracking-wide text-[#475569]">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#00288e] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20 disabled:opacity-50"
        style={{
          minHeight: 50,
          borderColor: hasError ? '#DC2626' : '#E2E8F0',
          letterSpacing: displayValue.length > 0 ? '1px' : undefined,
        }}
        maxLength={10}
        autoComplete="off"
      />
      {showError && (
        <p className="mt-1.5 text-[11px] font-semibold text-[#DC2626]">{internalError}</p>
      )}
      {value && !showError && (
        <p className="mt-1.5 text-[11px] text-[#00288e]">
          {(() => {
            const [y, m, d] = value.split('-')
            const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
            return `${parseInt(d)} de ${monthNames[parseInt(m) - 1]} de ${y}`
          })()}
        </p>
      )}
    </div>
  )
}
