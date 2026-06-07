import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * POST /api/patients — VERIFY a patient (NOT create).
 * Only pre-registered patients can access the app.
 * Requires: dni, birthDate (YYYY-MM-DD)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dni, birthDate } = body

    if (!dni) {
      return NextResponse.json(
        { error: 'DNI es requerido' },
        { status: 400 }
      )
    }

    // Look up patient by DNI
    const patient = await db.patient.findUnique({ where: { dni } })

    if (!patient) {
      return NextResponse.json(
        { error: 'No se encontró un paciente registrado con ese DNI. Si es paciente del sistema, solicite al equipo médico que lo registre.' },
        { status: 404 }
      )
    }

    // Verify birth date if the patient has one registered
    if (patient.birthDate) {
      if (!birthDate) {
        return NextResponse.json(
          { error: 'Se requiere fecha de nacimiento para verificar su identidad.' },
          { status: 400 }
        )
      }

      // Compare dates as YYYY-MM-DD strings to avoid timezone issues
      // patient.birthDate is a Date object from Prisma, convert carefully
      const pb = patient.birthDate instanceof Date ? patient.birthDate : new Date(patient.birthDate)
      const registeredDate = `${pb.getUTCFullYear()}-${String(pb.getUTCMonth() + 1).padStart(2, '0')}-${String(pb.getUTCDate()).padStart(2, '0')}`
      // birthDate from client is already YYYY-MM-DD format
      const providedDate = String(birthDate).trim()

      if (registeredDate !== providedDate) {
        console.log('Date mismatch:', { registeredDate, providedDate, raw: patient.birthDate })
        return NextResponse.json(
          { error: 'La fecha de nacimiento no coincide con nuestros registros. Verifique los datos o contacte al equipo médico.' },
          { status: 403 }
        )
      }
    }

    // Patient verified successfully
    return NextResponse.json({
      patient: {
        id: patient.id,
        name: patient.name,
        dni: patient.dni,
        birthDate: patient.birthDate,
      },
      verified: true,
    })
  } catch (error) {
    console.error('Error verifying patient:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/patients — List all patients (for admin panel)
 */
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
      birthDate: p.birthDate,
      createdAt: p.createdAt,
      latestCheckIn: p.checkIns[0] ?? null,
    }))

    return NextResponse.json({ patients: result })
  } catch (error) {
    console.error('Error listing patients:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
