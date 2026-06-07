import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/questions — Get active questions for patient check-in (public)
 */
export async function GET() {
  try {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error

    const result = (questions || []).map((q: Record<string, unknown>) => ({
      id: q.id,
      order: q.sort_order,
      emoji: q.emoji,
      question: q.question,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      isCritical: q.is_critical,
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
