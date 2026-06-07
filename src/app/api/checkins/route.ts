import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Severity ordering for deriving overall severity
const SEVERITY_ORDER: Record<string, number> = {
  green: 0,
  neutral: 1,
  'yellow-low': 2,
  yellow: 3,
  'yellow-high': 4,
  red: 5,
}

function deriveOverallSeverity(severities: string[]): string {
  if (severities.length === 0) return 'green'
  let maxSeverity = 'green'
  let maxOrder = 0
  for (const s of severities) {
    const order = SEVERITY_ORDER[s] ?? 0
    if (order > maxOrder) {
      maxOrder = order
      maxSeverity = s
    }
  }
  if (maxOrder >= 5) return 'red'
  if (maxOrder >= 4) return 'yellow-high'
  if (maxOrder >= 3) return 'yellow'
  if (maxOrder >= 2) return 'yellow'
  if (maxOrder >= 1) return 'neutral'
  return 'green'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, answers, comment, overallSeverity, criticalAlert } = body as {
      patientId: string
      answers: { questionIndex: number; question: string; answer: string; severity: string; questionId?: string }[]
      comment?: string
      overallSeverity?: string
      criticalAlert?: boolean
    }

    if (!patientId || !answers || answers.length === 0) {
      return NextResponse.json({ error: 'patientId y answers son requeridos' }, { status: 400 })
    }

    // Verify patient exists
    const { data: patient } = await supabaseAdmin
      .from('patients')
      .select('id')
      .eq('id', patientId)
      .single()

    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 })
    }

    // Check if any critical question had a non-green/non-neutral answer
    let needsGuardia = false
    if (criticalAlert) {
      needsGuardia = true
    } else {
      const { data: activeQuestions } = await supabaseAdmin
        .from('questions')
        .select('id')
        .eq('is_active', true)
        .eq('is_critical', true)

      const criticalQuestionIds = new Set((activeQuestions || []).map((q: { id: string }) => q.id))

      for (const answer of answers) {
        if (answer.questionId && criticalQuestionIds.has(answer.questionId)) {
          const severityOrder = SEVERITY_ORDER[answer.severity] ?? 0
          if (severityOrder >= 2) {
            needsGuardia = true
            break
          }
        }
      }
    }

    // Derive overall severity if not provided
    const severities = answers.map((a) => a.severity)
    let severity = overallSeverity || deriveOverallSeverity(severities)

    // If needsGuardia, override severity to at least red
    if (needsGuardia) {
      severity = 'red'
    }

    // Create check-in
    const { data: checkIn, error: ciError } = await supabaseAdmin
      .from('check_ins')
      .insert({
        patient_id: patientId,
        comment: comment || null,
        severity,
      })
      .select()
      .single()

    if (ciError) throw ciError

    // Create answers
    const answersData = answers.map((a) => ({
      check_in_id: checkIn.id,
      question_index: a.questionIndex,
      question: a.question,
      answer: a.answer,
      severity: a.severity,
    }))

    const { error: ansError } = await supabaseAdmin
      .from('check_in_answers')
      .insert(answersData)

    if (ansError) throw ansError

    // Create alert if severity is yellow, yellow-high, or red
    if (['yellow', 'yellow-high', 'red'].includes(severity)) {
      await supabaseAdmin
        .from('alerts')
        .insert({
          check_in_id: checkIn.id,
          status: 'pending',
        })
    }

    return NextResponse.json({
      checkIn: {
        id: checkIn.id,
        patientId: checkIn.patient_id,
        comment: checkIn.comment,
        severity: checkIn.severity,
        createdAt: checkIn.created_at,
        answers: answersData.map((a, i) => ({
          id: `${checkIn.id}-${i}`,
          checkInId: checkIn.id,
          ...a,
        })),
      },
      needsGuardia,
      severity,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating check-in:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')

    // Limit to last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const sevenDaysAgoISO = sevenDaysAgo.toISOString()

    let query = supabaseAdmin
      .from('check_ins')
      .select(`
        *,
        check_in_answers (*),
        patients!inner (id, name, dni)
      `)
      .gte('created_at', sevenDaysAgoISO)
      .order('created_at', { ascending: false })

    if (patientId) {
      query = query.eq('patient_id', patientId)
    }

    const { data: checkIns, error } = await query

    if (error) throw error

    // Transform to match the old API format
    const result = (checkIns || []).map((ci: Record<string, unknown>) => ({
      id: ci.id,
      patientId: ci.patient_id,
      comment: ci.comment,
      severity: ci.severity,
      createdAt: ci.created_at,
      answers: (ci.check_in_answers || []).map((a: Record<string, unknown>) => ({
        id: a.id,
        checkInId: a.check_in_id,
        questionIndex: a.question_index,
        question: a.question,
        answer: a.answer,
        severity: a.severity,
      })),
      patient: {
        id: (ci.patients as Record<string, unknown>)?.id,
        name: (ci.patients as Record<string, unknown>)?.name,
        dni: (ci.patients as Record<string, unknown>)?.dni,
      },
    }))

    return NextResponse.json({ checkIns: result })
  } catch (error) {
    console.error('Error listing check-ins:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
