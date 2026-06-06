import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, dni } = body

    if (!name || !dni) {
      return NextResponse.json({ error: 'Nombre y DNI son requeridos' }, { status: 400 })
    }

    // Check if patient already exists by DNI
    const existing = await db.patient.findUnique({ where: { dni } })
    if (existing) {
      return NextResponse.json({ patient: existing, isNew: false })
    }

    // Create new patient
    const patient = await db.patient.create({
      data: { name, dni },
    })

    return NextResponse.json({ patient, isNew: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating/finding patient:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const patients = await db.patient.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        checkIns: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    const result = patients.map((p) => ({
      id: p.id,
      name: p.name,
      dni: p.dni,
      createdAt: p.createdAt,
      latestCheckIn: p.checkIns[0] ?? null,
    }))

    return NextResponse.json({ patients: result })
  } catch (error) {
    console.error('Error listing patients:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
