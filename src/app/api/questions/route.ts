import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/questions — Get active questions for patient check-in (public)
 */
export async function GET() {
  try {
    const questions = await db.question.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    const result = questions.map((q) => ({
      id: q.id,
      order: q.order,
      emoji: q.emoji,
      question: q.question,
      options: JSON.parse(q.options),
      isCritical: q.isCritical,
      category: q.category,
    }))

    return NextResponse.json({ questions: result })
  } catch (error) {
    console.error('Error listing questions:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/questions — Seed default questions if none exist (idempotent)
 */
export async function POST() {
  try {
    const existing = await db.question.count()
    if (existing > 0) {
      return NextResponse.json({ message: 'Las preguntas ya existen', count: existing })
    }

    const defaults = [
      {
        order: 0,
        emoji: '😊',
        question: '¿Cómo se siente hoy en comparación a su última consulta?',
        options: JSON.stringify([
          { label: 'Mejor que antes', severity: 'green' },
          { label: 'Igual que antes', severity: 'neutral' },
          { label: 'Peor que antes', severity: 'yellow' },
          { label: 'Mucho peor / me cuesta hablar', severity: 'red' },
        ]),
        isCritical: false,
        category: 'general',
      },
      {
        order: 1,
        emoji: '⚖️',
        question: '¿Subió de peso desde su última consulta?',
        options: JSON.stringify([
          { label: 'No subí', severity: 'green' },
          { label: 'Subí menos de 1 kg', severity: 'neutral' },
          { label: 'Subí entre 1 y 2 kg', severity: 'yellow' },
          { label: 'Subí más de 2 kg', severity: 'red' },
        ]),
        isCritical: false,
        category: 'cardiac',
      },
      {
        order: 2,
        emoji: '🫁',
        question: '¿Tiene dificultad para respirar?',
        options: JSON.stringify([
          { label: 'No, me siento bien', severity: 'green' },
          { label: 'Un poco al hacer esfuerzo', severity: 'yellow' },
          { label: 'Sí, incluso al estar quieto', severity: 'red' },
          { label: 'Me cuesta hablar por la falta de aire', severity: 'red' },
        ]),
        isCritical: true, // CRITICAL: any breathing problem → guardia
        category: 'respiratory',
      },
      {
        order: 3,
        emoji: '🦶',
        question: '¿Notó hinchazón en los tobillos o piernas?',
        options: JSON.stringify([
          { label: 'No', severity: 'green' },
          { label: 'Leve, solo de noche', severity: 'yellow-low' },
          { label: 'Sí, durante el día', severity: 'yellow-high' },
          { label: 'Muy hinchado', severity: 'red' },
        ]),
        isCritical: false,
        category: 'cardiac',
      },
      {
        order: 4,
        emoji: '🛏️',
        question: '¿Necesita más almohadas que antes para dormir sin ahogarse?',
        options: JSON.stringify([
          { label: 'No, igual que siempre', severity: 'neutral' },
          { label: 'Sí, una almohada más', severity: 'yellow' },
          { label: 'Varias más / no puedo acostarme', severity: 'red' },
        ]),
        isCritical: true, // CRITICAL: orthopnea → guardia
        category: 'respiratory',
      },
    ]

    for (const q of defaults) {
      await db.question.create({ data: q })
    }

    return NextResponse.json({ message: 'Preguntas creadas', count: defaults.length })
  } catch (error) {
    console.error('Error seeding questions:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
