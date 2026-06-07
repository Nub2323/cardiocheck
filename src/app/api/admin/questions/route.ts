import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/admin/questions — List ALL questions (including inactive) for admin
 */
export async function GET() {
  try {
    const questions = await db.question.findMany({
      orderBy: { order: 'asc' },
    })

    const result = questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options),
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
 * POST /api/admin/questions — Create a new question
 * Body: { emoji, question, options: [{label, severity}], isCritical, category, order }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emoji, question, options, isCritical, category, order } = body

    if (!question || !options || options.length === 0) {
      return NextResponse.json(
        { error: 'Pregunta y opciones son requeridas' },
        { status: 400 }
      )
    }

    // Validate options format
    for (const opt of options) {
      if (!opt.label || !opt.severity) {
        return NextResponse.json(
          { error: 'Cada opción debe tener label y severity' },
          { status: 400 }
        )
      }
    }

    // Get max order if not provided
    let questionOrder = order
    if (questionOrder === undefined || questionOrder === null) {
      const maxOrder = await db.question.aggregate({ _max: { order: true } })
      questionOrder = (maxOrder._max.order ?? -1) + 1
    }

    const newQuestion = await db.question.create({
      data: {
        emoji: emoji || '❓',
        question,
        options: JSON.stringify(options),
        isCritical: isCritical || false,
        category: category || 'general',
        order: questionOrder,
      },
    })

    return NextResponse.json({ question: { ...newQuestion, options } }, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/questions — Update a question
 * Body: { id, emoji?, question?, options?, isCritical?, category?, order?, isActive? }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      )
    }

    const data: Record<string, unknown> = {}
    if (updates.emoji !== undefined) data.emoji = updates.emoji
    if (updates.question !== undefined) data.question = updates.question
    if (updates.isCritical !== undefined) data.isCritical = updates.isCritical
    if (updates.category !== undefined) data.category = updates.category
    if (updates.order !== undefined) data.order = updates.order
    if (updates.isActive !== undefined) data.isActive = updates.isActive
    if (updates.options !== undefined) {
      // Validate options
      for (const opt of updates.options) {
        if (!opt.label || !opt.severity) {
          return NextResponse.json(
            { error: 'Cada opción debe tener label y severity' },
            { status: 400 }
          )
        }
      }
      data.options = JSON.stringify(updates.options)
    }

    const question = await db.question.update({
      where: { id },
      data,
    })

    return NextResponse.json({ question: { ...question, options: updates.options ?? JSON.parse(question.options) } })
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/questions — Delete a question
 * Body: { id }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      )
    }

    await db.question.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
