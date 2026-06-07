import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
  // Map to simplified overall severity
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
      criticalAlert?: boolean // true if any critical question had a non-green answer
    }

    if (!patientId || !answers || answers.length === 0) {
      return NextResponse.json({ error: 'patientId y answers son requeridos' }, { status: 400 })
    }

    // Verify patient exists
    const patient = await db.patient.findUnique({ where: { id: patientId } })
    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 })
    }

    // Check if any critical question had a non-green/non-neutral answer
    let needsGuardia = false
    if (criticalAlert) {
      needsGuardia = true
    } else {
      // Fallback: check against database critical questions
      const activeQuestions = await db.question.findMany({
        where: { isActive: true, isCritical: true },
      })
      const criticalQuestionIds = new Set(activeQuestions.map((q) => q.id))

      for (const answer of answers) {
        if (answer.questionId && criticalQuestionIds.has(answer.questionId)) {
          const severityOrder = SEVERITY_ORDER[answer.severity] ?? 0
          if (severityOrder >= 2) { // yellow-low or worse
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

    // Create check-in with answers
    const checkIn = await db.checkIn.create({
      data: {
        patientId,
        comment: comment || null,
        severity,
        answers: {
          create: answers.map((a) => ({
            questionIndex: a.questionIndex,
            question: a.question,
            answer: a.answer,
            severity: a.severity,
          })),
        },
      },
      include: { answers: true },
    })

    // Create alert if severity is yellow, yellow-high, or red
    if (['yellow', 'yellow-high', 'red'].includes(severity)) {
      await db.alert.create({
        data: {
          checkInId: checkIn.id,
          status: 'pending',
        },
      })
    }

    return NextResponse.json({
      checkIn,
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

    const where = patientId ? { patientId } : {}

    const checkIns = await db.checkIn.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        answers: true,
        patient: {
          select: { id: true, name: true, dni: true },
        },
      },
    })

    return NextResponse.json({ checkIns })
  } catch (error) {
    console.error('Error listing check-ins:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
